// Date helpers. Deadlines are calendar dates (YYYY-MM-DD) in Philippine time.

const MS_PER_DAY = 86_400_000;
export const CLOSING_SOON_DAYS = 7;

// Today's date in Asia/Manila as YYYY-MM-DD.
export function todayInManila(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(now);
}

// Whole days from `from` to `to` (both YYYY-MM-DD). Negative if `to` is earlier.
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / MS_PER_DAY);
}

// "Oct 31", or "Oct 31, 2027" when the year differs from `today`'s.
export function formatShortDate(date: string, today?: string): string {
  const sameYear = today && date.slice(0, 4) === today.slice(0, 4);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

// "Oct 31, 2026"
export function formatLongDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export type DeadlineTone = "urgent" | "soon" | "normal" | "none" | "closed";

export type DeadlineInfo = {
  // Short label for list rows: "Oct 31", "Rolling", "TBA"
  label: string;
  // Second line: "8 days left", "Today", "Open, no deadline posted"
  detail: string;
  tone: DeadlineTone;
  daysLeft: number | null;
};

type DeadlineFields = {
  deadline: string | null;
  deadline_type: string;
  status: string;
};

// Red only for 3 days or less, amber for this week (docs/design/stitch-prompts.md).
export function deadlineInfo(listing: DeadlineFields, today: string): DeadlineInfo {
  if (listing.deadline_type === "rolling") {
    return { label: "Rolling", detail: "Open, no deadline posted", tone: "none", daysLeft: null };
  }
  if (listing.deadline_type !== "date" || !listing.deadline) {
    return { label: "TBA", detail: "Deadline not announced yet", tone: "none", daysLeft: null };
  }

  const daysLeft = daysBetween(today, listing.deadline);
  const label = formatShortDate(listing.deadline, today);

  if (listing.status === "expired" || daysLeft < 0) {
    return { label, detail: "Closed", tone: "closed", daysLeft };
  }
  const detail = daysLeft === 0 ? "Closes today" : daysLeft === 1 ? "1 day left" : `${daysLeft} days left`;
  const tone = daysLeft <= 3 ? "urgent" : daysLeft <= CLOSING_SOON_DAYS ? "soon" : "normal";
  return { label, detail, tone, daysLeft };
}
