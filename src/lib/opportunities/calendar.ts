import type { Listing } from "./listing";

// "Add to calendar" for a listing's deadline: an all-day event on the
// deadline date with alerts 7 days and 1 day before (same as our reminders).

type CalendarListing = Pick<Listing, "id" | "slug" | "title" | "organization" | "deadline" | "deadline_type" | "source_url">;

function compact(date: string): string {
  return date.replaceAll("-", "");
}

function nextDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// RFC 5545 text: escape \ ; , and newlines.
function escapeText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

// Lines longer than 75 octets continue on the next line after a space.
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const charSize = new TextEncoder().encode(char).length;
    if (size + charSize > (parts.length === 0 ? 75 : 74)) {
      parts.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += charSize;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function hasCalendarDate(listing: Pick<Listing, "deadline" | "deadline_type">): boolean {
  return listing.deadline_type === "date" && listing.deadline !== null;
}

export function calendarDescription(listing: CalendarListing, pageUrl: string): string {
  return `${listing.organization}\nDetails: ${pageUrl}\nOfficial source: ${listing.source_url}\nAlways confirm the deadline on the official site.`;
}

export function buildIcs(listing: CalendarListing, pageUrl: string, now: Date = new Date()): string {
  if (!hasCalendarDate(listing)) throw new Error("Listing has no deadline date");
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const summary = `Deadline: ${listing.title}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Oportune//Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${listing.id}-deadline@oportune`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(listing.deadline!)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(listing.deadline!))}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(calendarDescription(listing, pageUrl))}`,
    `URL:${pageUrl}`,
    "TRANSP:TRANSPARENT",
    ...[7, 1].flatMap((days) => [
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(`${days === 1 ? "Tomorrow" : `In ${days} days`}: ${summary}`)}`,
      `TRIGGER;RELATED=START:-P${days}D`,
      "END:VALARM",
    ]),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(listing: CalendarListing, pageUrl: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Deadline: ${listing.title}`,
    dates: `${compact(listing.deadline!)}/${compact(nextDay(listing.deadline!))}`,
    details: calendarDescription(listing, pageUrl),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
