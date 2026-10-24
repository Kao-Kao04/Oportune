import Link from "next/link";
import { categoryBg, categoryLabel } from "@/lib/opportunities/categories";
import { deadlineInfo, type DeadlineTone } from "@/lib/opportunities/dates";
import { deliveryModeLabel, type Listing } from "@/lib/opportunities/listing";
import { OfficialBadge } from "./official-badge";

export const TONE_TEXT: Record<DeadlineTone, string> = {
  urgent: "text-urgent",
  soon: "text-soon",
  normal: "text-ink",
  none: "text-muted",
  closed: "text-closed",
};

// Urgency as a small sticker on the date stub.
const TONE_BADGE: Partial<Record<DeadlineTone, string>> = {
  urgent: "bg-tomato",
  soon: "bg-sun",
};

// Listing card: a "ticket stub" with the deadline on the left (colored by
// category), details on the right. `trailing` (e.g. an unsave button) sits in
// the top-right corner, outside the link.
export function ListingRow({
  listing,
  today,
  trailing,
}: {
  listing: Listing;
  today: string;
  trailing?: React.ReactNode;
}) {
  const deadline = deadlineInfo(listing, today);
  const delivery = deliveryModeLabel(listing.delivery_mode);
  const [month, day] = deadline.label.split(" ");
  const isDate = listing.deadline_type === "date" && Boolean(day);

  return (
    <li className="relative">
      <Link href={`/opportunities/${listing.slug}`} className="sticker press flex overflow-hidden">
        <div
          className={`flex w-20 shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-ink px-1 py-3 text-center ${
            deadline.tone === "closed" ? "bg-line" : categoryBg(listing.categorySlug)
          }`}
        >
          {isDate ? (
            <>
              <span className="text-xs font-bold uppercase tracking-wide">{month}</span>
              <span className="font-display text-3xl font-extrabold leading-none">{day.replace(",", "")}</span>
            </>
          ) : (
            <span className="font-display text-base font-extrabold leading-tight">{deadline.label}</span>
          )}
          {TONE_BADGE[deadline.tone] ? (
            <span
              className={`mt-1.5 rounded-pill border-[1.5px] border-ink px-1.5 text-[11px] font-bold leading-4 ${TONE_BADGE[deadline.tone]}`}
            >
              {deadline.detail.replace("Closes ", "")}
            </span>
          ) : (
            <span className="mt-1 text-[11px] font-semibold leading-tight">
              {deadline.daysLeft === null ? (deadline.label === "Rolling" ? "Open" : "") : deadline.detail}
            </span>
          )}
        </div>
        <div className={`min-w-0 flex-1 p-3 ${trailing ? "pr-14" : ""}`}>
          <h3 className="line-clamp-3 font-display text-[17px] font-extrabold leading-snug text-ink">{listing.title}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted">{listing.organization}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="tag bg-card">{categoryLabel(listing.categorySlug, listing.categoryName)}</span>
            {delivery && <span className="tag bg-card">{delivery}</span>}
            <OfficialBadge trust={listing.source_trust} />
          </div>
        </div>
      </Link>
      {trailing && <div className="absolute right-2 top-2">{trailing}</div>}
    </li>
  );
}
