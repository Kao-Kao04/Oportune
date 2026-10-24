import Link from "next/link";
import { categoryBg, categoryLabel } from "@/lib/opportunities/categories";
import { deadlineInfo, formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { deliveryModeLabel, type Listing } from "@/lib/opportunities/listing";
import { shareMessage } from "@/lib/opportunities/share";
import { CategoryIcon } from "./category-icon";
import { OfficialBadge } from "./official-badge";
import { SaveButton } from "./save-button";
import { ShareButton } from "./share-button";

// Cover patterns, picked per listing so a long feed doesn't look repetitive.
// Pure CSS, so there are no images to download on prepaid data.
const PATTERNS = [
  "radial-gradient(#111 1.2px, transparent 1.3px) 0 0 / 14px 14px",
  "repeating-linear-gradient(135deg, rgba(17,17,17,.12) 0 2px, transparent 2px 12px)",
  "linear-gradient(rgba(17,17,17,.1) 1.5px, transparent 1.5px) 0 0 / 22px 22px, linear-gradient(90deg, rgba(17,17,17,.1) 1.5px, transparent 1.5px) 0 0 / 22px 22px",
  "repeating-radial-gradient(circle at 100% 0, transparent 0 18px, rgba(17,17,17,.1) 18px 20px)",
];

function pick(id: string, n: number): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % n;
}

function initials(name: string): string {
  const words = name.replace(/\(.*?\)/g, "").split(/[\s-]+/).filter((w) => /^[A-Za-z]/.test(w));
  const acronym = words.find((w) => w.length <= 6 && w === w.toUpperCase());
  if (acronym) return acronym.slice(0, 4);
  return (words[0]?.[0] ?? "?") + (words[1]?.[0] ?? "");
}

// A listing shown like a social post: who posted it, what it is, a cover
// "picture" with the deadline, and Save / Share / Apply actions.
export function FeedPost({ listing, today, saved }: { listing: Listing; today: string; saved: boolean }) {
  const deadline = deadlineInfo(listing, today);
  const delivery = deliveryModeLabel(listing.delivery_mode);
  const bg = categoryBg(listing.categorySlug);
  const href = `/opportunities/${listing.slug}`;
  const checked = listing.last_checked_at ? formatLongDate(todayInManila(new Date(listing.last_checked_at))) : null;
  const pattern = PATTERNS[pick(listing.id, PATTERNS.length)];
  const iconRight = pick(listing.id + "x", 2) === 0;

  const deadlineText =
    deadline.daysLeft === null
      ? deadline.detail
      : deadline.daysLeft === 0
        ? "Today na!"
        : deadline.daysLeft === 1
          ? "Bukas na!"
          : deadline.tone === "closed"
            ? "Closed"
            : `${deadline.daysLeft} days left`;
  const deadlineBg = deadline.tone === "urgent" ? "bg-tomato" : deadline.tone === "soon" ? "bg-sun" : "bg-card";
  const [month, rawDay] = deadline.label.split(" ");
  const day = rawDay?.replace(",", "");
  const isDate = listing.deadline_type === "date" && Boolean(day);
  // "Online · Online (final in Hong Kong)" reads badly; skip the repeat.
  const where =
    listing.location && delivery && listing.location.toLowerCase().startsWith(delivery.toLowerCase())
      ? listing.location
      : [delivery, listing.location].filter(Boolean).join(" · ");

  return (
    <article className="sticker overflow-hidden" aria-labelledby={`post-${listing.id}`}>
      {/* Header: who posted it */}
      <header className="flex items-center gap-3 px-4 pb-3 pt-4">
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink text-xs font-extrabold tracking-tight ${bg}`}
        >
          {initials(listing.organization)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight text-ink">{listing.organization}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
            <span>{categoryLabel(listing.categorySlug, listing.categoryName)}</span>
            {checked && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular">Checked {checked}</span>
              </>
            )}
          </p>
        </div>
        <OfficialBadge trust={listing.source_trust} />
      </header>

      {/* Body text */}
      <Link href={href} className="block px-4 pb-3">
        <h3 id={`post-${listing.id}`} className="font-display text-xl font-extrabold leading-snug text-ink">
          {listing.title}
        </h3>
        {listing.summary && <p className="mt-1.5 line-clamp-3 leading-relaxed text-ink">{listing.summary}</p>}
        <span className="mt-1 inline-block text-sm font-bold text-muted underline underline-offset-2">See details</span>
      </Link>

      {/* Cover "picture" */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block border-y-2 border-ink ${bg}`}
      >
        <div className="absolute inset-0 opacity-60" style={{ background: pattern }} />
        {/* A poster: the deadline is the picture. */}
        <div className={`relative flex min-h-40 items-center gap-4 p-5 ${iconRight ? "flex-row-reverse" : ""}`}>
          <div className="flex h-28 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-ink bg-card text-center shadow-[3px_3px_0_0_#111]">
            {isDate ? (
              <>
                <span className="text-xs font-extrabold uppercase tracking-widest">{month}</span>
                <span className="font-display text-5xl font-extrabold leading-none">{day}</span>
              </>
            ) : (
              <span className="px-1 font-display text-lg font-extrabold uppercase leading-tight">{deadline.label}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide">
              <CategoryIcon slug={listing.categorySlug} size={16} strokeWidth={2.5} />
              {categoryLabel(listing.categorySlug, listing.categoryName)}
            </p>
            <p className={`tabular mt-2 inline-block rounded-pill border-2 border-ink px-3 py-1 font-display text-lg font-extrabold leading-tight ${deadlineBg}`}>
              {deadlineText}
            </p>
            {where && <p className="mt-2 line-clamp-2 text-sm font-semibold">{where}</p>}
          </div>
        </div>
      </Link>

      {/* Actions */}
      <footer className="flex items-center gap-2 px-3 py-3">
        <SaveButton opportunityId={listing.id} initialSaved={saved} back={href} />
        <ShareButton
          title={listing.title}
          path={href}
          message={shareMessage(listing, deadline.tone === "closed")}
          opportunityId={listing.id}
        />
        <Link href={href} className="btn-pop press ml-auto h-12 text-sm">
          View
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </footer>
    </article>
  );
}
