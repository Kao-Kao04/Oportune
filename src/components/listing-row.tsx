import Link from "next/link";
import { categoryLabel } from "@/lib/opportunities/categories";
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

// `trailing` (e.g. an unsave button) sits in the top-right corner, outside the link.
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

  return (
    <li className="relative border-b border-line last:border-b-0">
      <Link
        href={`/opportunities/${listing.slug}`}
        className={`flex gap-4 px-4 py-4 hover:bg-ink/[0.03] ${trailing ? "pr-16" : ""}`}
      >
        <div className={`tabular w-20 shrink-0 ${TONE_TEXT[deadline.tone]}`}>
          <div className="font-semibold">{deadline.label}</div>
          <div className="text-xs leading-snug">
            {deadline.daysLeft === null ? (deadline.label === "Rolling" ? "Open" : "") : deadline.detail}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-3 font-semibold leading-snug text-ink">{listing.title}</div>
          <div className="mt-0.5 text-sm text-muted">{listing.organization}</div>
          {/* Quick facts students scan for: what it is and whether they must travel. */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="rounded-ui border border-line px-1.5 py-0.5 text-muted">
              {categoryLabel(listing.categorySlug, listing.categoryName)}
            </span>
            {delivery && <span className="rounded-ui border border-line px-1.5 py-0.5 text-muted">{delivery}</span>}
            <OfficialBadge trust={listing.source_trust} />
          </div>
        </div>
      </Link>
      {trailing && <div className="absolute right-3 top-3">{trailing}</div>}
    </li>
  );
}
