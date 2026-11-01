// Calendar feed import: upcoming events from a calendar's public .ics feed
// (Luma, Google Calendar, GDG pages...) become draft listings. Only for
// calendars we run or whose owner said yes; a curator checks every draft.

import { createHash } from "node:crypto";
import type { CsvRow } from "./csv-import";
import { todayInManila } from "./dates";

export type IcsEvent = {
  uid: string;
  summary: string;
  start: Date | null;
  url: string | null;
  location: string | null;
  description: string | null;
};

const unescape = (v: string) => v.replace(/\\n/gi, "\n").replace(/\\([,;\\])/g, "$1");

// 20261105T100000Z (UTC), 20261105T100000 (local: we assume Manila), 20261105.
function parseIcsDate(value: string): Date | null {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h = "00", mi = "00", s = "00", z] = m;
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}${z ? "Z" : "+08:00"}`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseIcs(text: string): IcsEvent[] {
  // Long lines are folded: a line starting with a space continues the last one.
  const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r?\n/);
  const events: IcsEvent[] = [];
  let current: Record<string, string> | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") current = {};
    else if (line === "END:VEVENT" && current) {
      events.push({
        uid: current.UID ?? "",
        summary: unescape(current.SUMMARY ?? "").trim(),
        start: current.DTSTART ? parseIcsDate(current.DTSTART) : null,
        url: current.URL?.trim() || null,
        location: current.LOCATION ? unescape(current.LOCATION).trim() : null,
        description: current.DESCRIPTION ? unescape(current.DESCRIPTION) : null,
      });
      current = null;
    } else if (current) {
      const colon = line.indexOf(":");
      if (colon < 0) continue;
      const name = line.slice(0, colon).split(";")[0].toUpperCase();
      if (!(name in current)) current[name] = line.slice(colon + 1);
    }
  }
  return events;
}

function httpsUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol === "http:") url.protocol = "https:";
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

const firstUrl = (text: string | null) => httpsUrl(text?.match(/https?:\/\/[^\s<>"]+/)?.[0]?.replace(/[).,]+$/, ""));
const ONLINE = /online|zoom|google meet|meet\.google|teams|discord|youtube|livestream|virtual|https?:\/\//i;

// The server fetches this, so only public https hosts (no localhost or
// private network addresses).
export function feedUrl(raw: string): string | null {
  const url = httpsUrl(raw.trim().replace(/^webcal:\/\//i, "https://"));
  if (!url) return null;
  const host = new URL(url).hostname;
  const privateHost =
    !host.includes(".") ||
    /^(localhost|.*\.local|.*\.internal)$/i.test(host) ||
    /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.)/.test(host) ||
    host.startsWith("[");
  return privateHost ? null : url;
}

// Upcoming events (from tomorrow, next `days` days) with an https page,
// mapped to spreadsheet rows for planImport.
export function icsToRows(
  events: IcsEvent[],
  opts: { now: Date; organization: string; category: string; feedHost: string; days?: number },
): CsvRow[] {
  const today = todayInManila(opts.now);
  const until = todayInManila(new Date(opts.now.getTime() + (opts.days ?? 120) * 86_400_000));
  const rows: CsvRow[] = [];
  for (const e of events) {
    if (!e.start || !e.summary) continue;
    const date = todayInManila(e.start);
    if (date <= today || date > until) continue;
    const page = httpsUrl(e.url) ?? firstUrl(e.location) ?? firstUrl(e.description);
    if (!page) continue;
    const when = new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(e.start);
    const location = e.location && !/^https?:\/\//i.test(e.location) ? e.location.slice(0, 200) : "See the event page";
    const id = createHash("sha1").update(`${opts.feedHost}\n${e.uid || e.summary + date}`).digest("hex").slice(0, 12);
    rows.push({
      id: `ICS-${id}`,
      status: "needs-check",
      title: e.summary.slice(0, 200),
      organization: opts.organization,
      category: opts.category,
      summary: "Event from the organizer's calendar. Details and sign-up on the event page.",
      location,
      delivery_mode: ONLINE.test(e.location ?? "") ? "Online" : "In-person",
      application_opens: "open",
      deadline: date,
      source_url: page,
      confidence: "medium",
      last_checked: today,
      notes:
        `Imported from the ${opts.feedHost} calendar feed on ${today}. Starts ${when} (PH time). ` +
        `Deadline = event date: confirm the sign-up cutoff and write the summary, then publish.`,
    });
  }
  return rows;
}
