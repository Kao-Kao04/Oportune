import { formatLongDate } from "./dates";
import type { Listing } from "./listing";

// A line students can send as-is to a group chat.
export function shareMessage(listing: Listing, closed: boolean): string {
  const when = closed
    ? "Closed na, pero baka may next round."
    : listing.deadline_type === "date" && listing.deadline
      ? `Deadline: ${formatLongDate(listing.deadline)}.`
      : listing.deadline_type === "rolling"
        ? "Open pa, walang fixed deadline."
        : "Deadline: TBA.";
  return `Uy, baka interested ka: ${listing.title} (${listing.organization}). ${when}`;
}
