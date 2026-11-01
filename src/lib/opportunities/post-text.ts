// Paste-to-draft and "Share to Oportune": pull the likely title, links, and
// deadline out of a social media post's text (Facebook, Instagram, X,
// LinkedIn, group chats). No AI and no fetching: the curator still opens the
// source, checks every detail, and writes the summary in our own words.

import { todayInManila } from "./dates";

export type ParsedPost = {
  title: string | null;
  links: string[];
  applicationUrl: string | null;
  postUrl: string | null;
  deadline: string | null; // YYYY-MM-DD, only when the text says it's a deadline
  dates: string[]; // every date found, soonest first
};

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, ene: 1, enero: 1,
  feb: 2, february: 2, peb: 2, pebrero: 2,
  mar: 3, march: 3, marso: 3,
  apr: 4, april: 4, abr: 4, abril: 4,
  may: 5, mayo: 5,
  jun: 6, june: 6, hunyo: 6,
  jul: 7, july: 7, hulyo: 7,
  aug: 8, august: 8, ago: 8, agosto: 8,
  sep: 9, sept: 9, september: 9, set: 9, setyembre: 9,
  oct: 10, october: 10, okt: 10, oktubre: 10,
  nov: 11, november: 11, nobyembre: 11,
  dec: 12, december: 12, dis: 12, disyembre: 12,
};

const MONTH = `(${Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|")})\\.?`;
const DAY = "(\\d{1,2})(?:st|nd|rd|th)?";
const YEAR = "(\\d{4})";

// "Deadline", "until", "on or before", "hanggang", "closes"... followed by a
// date within the next few words.
const CUE = /(deadline|due|until|till|on or before|no later than|closes?|closing|last day|ends?|submit by|register by|hanggang|bago mag)/i;

const SOCIAL = /^(?:[a-z0-9-]+\.)?(facebook\.com|fb\.com|fb\.me|instagram\.com|x\.com|twitter\.com|linkedin\.com|lnkd\.in|threads\.net|tiktok\.com)$/i;
const APPLY = /^(?:[a-z0-9-]+\.)?(forms\.gle|docs\.google\.com|forms\.office\.com|forms\.microsoft\.com|lu\.ma|luma\.com|devpost\.com|eventbrite\.com|typeform\.com|tally\.so|airtable\.com|jotform\.com|bit\.ly|tinyurl\.com)$/i;

function iso(y: number, m: number, d: number): string | null {
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return date.toISOString().slice(0, 10);
}

// A date with no year means the next time that day comes around.
function withYear(m: number, d: number, year: number | null, today: string): string | null {
  if (year) return iso(year, m, d);
  const thisYear = Number(today.slice(0, 4));
  const candidate = iso(thisYear, m, d);
  if (!candidate) return null;
  return candidate >= today ? candidate : iso(thisYear + 1, m, d);
}

type Found = { date: string; index: number };

function findDates(text: string, today: string): Found[] {
  const found: Found[] = [];
  const add = (date: string | null, index: number) => date && found.push({ date, index });

  for (const m of text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) add(iso(+m[1], +m[2], +m[3]), m.index);
  // Lowercase "may" is Filipino for "there is" ("may 5 slots"), not the month.
  const isMonth = (token: string) => token !== "may";
  for (const m of text.matchAll(new RegExp(`\\b${MONTH}\\s+${DAY}(?:,?\\s*${YEAR})?\\b`, "gi"))) {
    if (!isMonth(m[1])) continue;
    add(withYear(MONTHS[m[1].toLowerCase()], +m[2], m[3] ? +m[3] : null, today), m.index);
  }
  for (const m of text.matchAll(new RegExp(`\\b${DAY}\\s+${MONTH}(?:,?\\s*${YEAR})?\\b`, "gi"))) {
    if (!isMonth(m[2])) continue;
    add(withYear(MONTHS[m[2].toLowerCase()], +m[1], m[3] ? +m[3] : null, today), m.index);
  }
  // Philippine posts write numeric dates month first: 11/05/2026.
  for (const m of text.matchAll(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g)) add(iso(+m[3], +m[1], +m[2]), m.index);
  return found;
}

function cleanUrl(raw: string): string | null {
  const trimmed = raw.replace(/[)\].,!?;:'"’”]+$/, "");
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:") url.protocol = "https:";
    return url.protocol === "https:" && url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

export function parsePost(text: string, now: Date = new Date(), sharedUrl?: string | null): ParsedPost {
  const today = todayInManila(now);
  const body = text.slice(0, 20_000);

  const links = [
    ...new Set(
      [sharedUrl ?? "", ...(body.match(/https?:\/\/[^\s<>"]+/gi) ?? [])]
        .map((u) => (u ? cleanUrl(u) : null))
        .filter((u): u is string => Boolean(u)),
    ),
  ];
  const host = (u: string) => new URL(u).hostname;
  const postUrl = links.find((u) => SOCIAL.test(host(u))) ?? null;
  const applicationUrl =
    links.find((u) => APPLY.test(host(u))) ?? links.find((u) => !SOCIAL.test(host(u))) ?? null;

  const found = findDates(body, today).filter((f) => f.date >= today);
  const dates = [...new Set(found.map((f) => f.date))].sort();

  // A deadline is a date that comes shortly after a cue word.
  let deadline: string | null = null;
  for (const cue of body.matchAll(new RegExp(CUE.source, "gi"))) {
    const after = found
      .filter((f) => f.index >= cue.index && f.index - cue.index <= 60)
      .sort((a, b) => a.index - b.index)[0];
    if (after) {
      deadline = after.date;
      break;
    }
  }

  const firstLine = body
    .split(/\r?\n/)
    .map((l) => l.replace(/https?:\/\/\S+/g, "").replace(/#\w+/g, "").replace(/[^\p{L}\p{N}\s&:'()!?.,-]/gu, "").trim())
    .find((l) => l.length >= 4);

  return {
    title: firstLine ? firstLine.slice(0, 120) : null,
    links,
    applicationUrl,
    postUrl,
    deadline,
    dates,
  };
}
