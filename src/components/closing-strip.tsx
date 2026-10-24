import Link from "next/link";
import { categoryLabel } from "@/lib/opportunities/categories";
import { deadlineInfo, formatShortDate } from "@/lib/opportunities/dates";
import type { Listing } from "@/lib/opportunities/listing";

// "Closing this week": deadlines in the next 7 days as big swipeable
// countdown cards at the top of Browse, so the most urgent ones are seen first.
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
    <section aria-labelledby="closing-this-week" className="pb-2 pt-2">
      <div className="flex items-center justify-between px-4">
        <h2 id="closing-this-week" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
          <span aria-hidden="true" className="inline-block h-3 w-3 rounded-full border-2 border-ink bg-tomato" />
          Closing this week
        </h2>
        <Link href={seeAllHref} scroll={false} className="inline-flex min-h-11 items-center text-sm font-bold text-ink underline underline-offset-4">
          See all {listings.length}
        </Link>
      </div>
      <ul className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 pt-1 [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible">
        {listings.map((listing) => {
          const deadline = deadlineInfo(listing, today);
          const urgent = deadline.tone === "urgent";
          return (
            <li key={listing.id} className="w-64 shrink-0 snap-start md:w-auto">
              <Link
                href={`/opportunities/${listing.slug}`}
                className={`sticker press flex h-full flex-col p-4 ${urgent ? "bg-tomato" : "bg-sun"}`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="tabular font-display text-2xl font-extrabold leading-none">
                    {deadline.daysLeft === 0 ? "Today!" : deadline.daysLeft === 1 ? "Bukas na!" : `${deadline.daysLeft} days`}
                  </span>
                  <span className="tabular text-xs font-bold">{formatShortDate(listing.deadline!, today)}</span>
                </span>
                <span className="mt-3 line-clamp-2 font-display text-[17px] font-extrabold leading-snug">{listing.title}</span>
                <span className="mt-1 line-clamp-1 text-sm">{listing.organization}</span>
                <span className="mt-auto pt-3">
                  <span className="tag bg-card">{categoryLabel(listing.categorySlug, listing.categoryName)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
