// Upcoming CTFs from CTFtime's public API (https://ctftime.org/api/), turned
// into spreadsheet-style rows so they go through the same import rules as
// data/opportunities.csv: new ones become drafts flagged "needs check", and
// published listings are never changed. A curator confirms each one.

import type { CsvRow } from "./csv-import";
import { todayInManila } from "./dates";

export const CTFTIME_API = "https://ctftime.org/api/v1/events/";
// CTFtime blocks requests without a real User-Agent.
export const CTFTIME_USER_AGENT = "Oportune/0.1 (student opportunity listings; https://github.com/Kao-Kao04/Oportune)";

export type CtftimeEvent = {
  id: number;
  title: string;
  url: string;
  ctftime_url: string;
  start: string;
  finish: string;
  format: string;
  onsite: boolean;
  restrictions: string;
  organizers: { id: number; name: string }[];
  duration?: { hours: number; days: number };
};

// Who can usually join: open CTFs, and student-only (academic) ones.
const RESTRICTIONS = new Set(["Open", "Academic"]);

export function ctftimeRange(now: Date, days = 90): { start: number; finish: number } {
  const start = Math.floor(now.getTime() / 1000);
  return { start, finish: start + days * 86_400 };
}

function manilaDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function durationText(e: CtftimeEvent): string {
  const hours = (e.duration?.days ?? 0) * 24 + (e.duration?.hours ?? 0);
  if (hours <= 0) return "";
  return hours % 24 === 0 ? ` lasting ${hours / 24} day${hours === 24 ? "" : "s"}` : ` lasting ${hours} hours`;
}

// Fetches upcoming CTFs (next 90 days). Throws on a network or API error.
export async function fetchCtftimeEvents(now: Date): Promise<CtftimeEvent[]> {
  const { start, finish } = ctftimeRange(now);
  const res = await fetch(`${CTFTIME_API}?limit=200&start=${start}&finish=${finish}`, {
    headers: { "User-Agent": CTFTIME_USER_AGENT, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`CTFtime API returned ${res.status}`);
  return (await res.json()) as CtftimeEvent[];
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Online, open or academic CTFs that start after today, mapped to CSV rows.
// Anything we already list (same CTFtime page, same official site, or same
// title) is left out so a curator never sees it twice.
export function ctftimeToRows(
  events: CtftimeEvent[],
  now: Date,
  known: { titles: string[]; urls: string[] } = { titles: [], urls: [] },
): CsvRow[] {
  const today = todayInManila(now);
  const knownTitles = new Set(known.titles.map(normalize));
  const knownUrls = new Set(known.urls.map((u) => u.replace(/\/+$/, "")));

  return events
    .filter((e) => !e.onsite && RESTRICTIONS.has(e.restrictions))
    .filter((e) => e.ctftime_url?.startsWith("https://"))
    .filter((e) => todayInManila(new Date(e.start)) > today)
    .filter(
      (e) =>
        !knownTitles.has(normalize(e.title)) &&
        !knownUrls.has(e.ctftime_url.replace(/\/+$/, "")) &&
        !(e.url && knownUrls.has(e.url.replace(/\/+$/, ""))),
    )
    .map((e) => {
      const organizers = e.organizers.map((o) => o.name).filter(Boolean).join(", ") || "CTFtime organizer";
      const format = e.format?.trim() || "Jeopardy";
      return {
        id: `CTFTIME-${e.id}`,
        status: "needs-check",
        title: e.title.trim(),
        organization: organizers,
        category: "Cybersecurity CTFs",
        summary: `Online ${format} capture-the-flag competition${durationText(e)}. Teams sign up on the CTF's own site.`,
        eligibility:
          e.restrictions === "Academic"
            ? "Student teams only (academic CTF); check the rules for who counts."
            : "Open to everyone; teams or solo players, per the rules.",
        location: "Online (global)",
        delivery_mode: "Online",
        application_opens: "open",
        deadline: todayInManila(new Date(e.start)),
        source_url: e.ctftime_url,
        confidence: "medium",
        last_checked: today,
        notes:
          `Imported from the CTFtime API on ${today}. Starts ${manilaDateTime(e.start)}, ends ${manilaDateTime(e.finish)} (PH time). ` +
          `Official site: ${e.url || "see CTFtime"}. Deadline = start date: confirm the registration cutoff on the official site, ` +
          `then publish.`,
      };
    });
}
