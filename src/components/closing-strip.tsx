import Link from "next/link";
import { deadlineInfo, formatShortDate } from "@/lib/opportunities/dates";
import type { Listing } from "@/lib/opportunities/listing";
import { OfficialBadge } from "./official-badge";
import { TONE_TEXT } from "./listing-row";

const TONE_BORDER = { urgent: "border-t-urgent", soon: "border-t-soon" } as const;

// "Closing this week": deadlines in the next 7 days as compact, swipeable
// cards at the top of Browse, so the most urgent ones are seen first.
export function ClosingStrip({
  listings,
  today,
  seeAllHref,
}: {
  listings: Listing[];
  today: string;
  seeAllHref: string;
}) {
  if (listings.length === 0) return null;

  return (
    <section aria-labelledby="closing-this-week" className="border-t border-line pb-4 pt-4">
      <div className="flex items-baseline justify-between px-4">
        <h2 id="closing-this-week" className="text-sm font-bold text-ink">
          Closing this week
        </h2>
        <Link href={seeAllHref} className="text-sm font-semibold text-teal">
          See all {listings.length}
        </Link>
      </div>
      <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none]">
        {listings.map((listing) => {
          const deadline = deadlineInfo(listing, today);
          const tone = deadline.tone === "urgent" ? "urgent" : "soon";
          return (
            <li key={listing.id} className="w-60 shrink-0 snap-start">
              <Link
                href={`/opportunities/${listing.slug}`}
                className={`flex h-full flex-col rounded-ui border border-line border-t-4 bg-white p-3 hover:border-muted ${TONE_BORDER[tone]}`}
              >
                <span className={`tabular text-lg font-bold leading-tight ${TONE_TEXT[tone]}`}>{deadline.detail}</span>
                <span className="tabular text-xs text-muted">{formatShortDate(listing.deadline!, today)}</span>
                <span className="mt-2 line-clamp-2 font-semibold leading-snug text-ink">{listing.title}</span>
                <span className="mt-0.5 line-clamp-1 text-sm text-muted">{listing.organization}</span>
                <span className="mt-auto pt-2">
                  <OfficialBadge trust={listing.source_trust} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
