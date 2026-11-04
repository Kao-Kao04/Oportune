import { cookies } from "next/headers";
import Form from "next/form";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { Suspense } from "react";
import { ClosingStrip } from "@/components/closing-strip";
import { RememberBrowse } from "@/components/back-link";
import { AudienceForm } from "@/components/audience-form";
import { ChipRow } from "@/components/chip-row";
import { FilterLink } from "@/components/filter-link";
import { ListingRow } from "@/components/listing-row";
import { SaveButton } from "@/components/save-button";
import { SearchFocus } from "@/components/search-focus";
import { WelcomeNote } from "@/components/welcome-note";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { WELCOME_COOKIE } from "@/lib/welcome";
import { audienceFilterCount, browseHref, readFilters, type Filters } from "@/lib/browse-filters";
import { fitsAudience, REGIONS, regionLabel } from "@/lib/opportunities/audience";
import { COURSE_GROUPS, courseGroupLabel, YEAR_LEVELS, yearLevelLabel } from "@/lib/profile";
import { categoryBg, categoryChipLabel } from "@/lib/opportunities/categories";
import { groupByDeadline, isClosingSoon, isOpen, type Listing } from "@/lib/opportunities/listing";
import {
  getActiveCategories,
  getPublishedListings,
  getToday,
  searchListings,
  type Category,
} from "@/lib/opportunities/queries";

export default function BrowsePage({ searchParams }: PageProps<"/">) {
  return (
    <main className="flex flex-col">
      <Suspense fallback={<BrowseSkeleton />}>
        {searchParams.then((params) => (
          <Browse filters={readFilters(params)} />
        ))}
      </Suspense>
      <BottomNav active="/" />
    </main>
  );
}

async function Browse({ filters }: { filters: Filters }) {
  const [today, categories, all, found, cookieStore, viewer] = await Promise.all([
    getToday(),
    getActiveCategories(),
    getPublishedListings(),
    filters.q ? searchListings(filters.q) : null,
    cookies(),
    getViewer(),
  ]);
  const listings = found ?? all;
  const savedIds = viewer.savedIds;
  // The hero and welcome note stay put when filters change, so the content
  // below them doesn't jump.
  const showWelcome = !cookieStore.has(WELCOME_COOKIE);

  const visible = listings.filter(
    (l) =>
      isOpen(l, today) &&
      (!filters.category || l.categorySlug === filters.category) &&
      fitsAudience(l, filters) &&
      (filters.view !== "closing-soon" || isClosingSoon(l, today)),
  );

  // The hero counts everything open, not just what a search found.
  const openCount = all.filter((l) => isOpen(l, today)).length;

  return (
    <>
      <Hero openCount={openCount} />
      {showWelcome && <WelcomeNote />}
      <RememberBrowse />
      <SearchFocus />
      <SearchForm filters={filters} />
      <CategoryChips filters={filters} categories={categories} />
      <AudienceFilters filters={filters} profile={viewer.profile} />
      <Results filters={filters} listings={visible} today={today} savedIds={savedIds} />
      <SubmitCta />
    </>
  );
}

// Short headline, so the first listings fit on a phone's first screen.
function Hero({ openCount }: { openCount: number }) {
  return (
    <section className="px-4 pt-4">
      <h1 className="font-display text-[28px] font-extrabold leading-[1.1] tracking-tight text-ink">
        Huwag ma-late sa next{" "}
        <span className="relative inline-block">
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0.5 h-2.5 -rotate-1 rounded-sm bg-sun" />
          <span className="relative">opportunity</span>
        </span>{" "}
        mo.
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        <span className="tabular font-bold text-ink">{openCount} open now</span>, sorted by deadline. Each one checked by a
        person.
      </p>
    </section>
  );
}

function SearchForm({ filters }: { filters: Filters }) {
  return (
    <Form action="/" scroll={false} className="px-4 pt-4" role="search">
      {filters.view !== "all" && <input type="hidden" name="view" value={filters.view} />}
      {filters.category && <input type="hidden" name="category" value={filters.category} />}
      {filters.region && <input type="hidden" name="region" value={filters.region} />}
      {filters.course && <input type="hidden" name="course" value={filters.course} />}
      {filters.year && <input type="hidden" name="year" value={filters.year} />}
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="sticker flex items-center gap-2 pl-3 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-teal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          id="search"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Search DOST, OJT, CTF…"
          className="h-12 min-w-0 flex-1 scroll-mt-24 bg-transparent text-base text-ink outline-none placeholder:text-muted"
          style={{ border: 0 }}
          enterKeyHint="search"
        />
        <button type="submit" className="m-1 h-10 rounded-[8px] bg-ink px-4 text-sm font-bold text-white">
          Go
        </button>
      </div>
    </Form>
  );
}

// One row: "Closing soon" (a toggle that works with any category), then the
// categories. Replaces separate tabs and suggestion chips to save height.
function CategoryChips({ filters, categories }: { filters: Filters; categories: Category[] }) {
  const chips = [{ slug: null as string | null, label: "All" }].concat(
    categories.map((c) => ({ slug: c.slug, label: categoryChipLabel(c.slug, c.name) })),
  );
  const soon = filters.view === "closing-soon";
  return (
    // Sticks under the header, so switching category never needs scrolling back up.
    <ChipRow label="Categories" className="sticky top-[66px] z-10 bg-paper px-4 pb-2 pt-3">
      <FilterLink
        href={browseHref(filters, { view: soon ? "all" : "closing-soon" })}
        current={soon}
        className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-pill border-2 border-ink px-4 text-sm font-bold text-ink ${
          soon ? "bg-tomato shadow-[2px_2px_0_0_#111]" : "bg-card hover:bg-paper"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M9 2h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Closing soon
      </FilterLink>
      <span aria-hidden="true" className="my-2 w-0.5 shrink-0 rounded-full bg-line" />
      {chips.map((chip) => {
        const active = filters.category === chip.slug;
        return (
          <FilterLink
            key={chip.slug ?? "all"}
            href={browseHref(filters, { category: chip.slug })}
            current={active}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-pill border-2 border-ink px-4 text-sm font-bold text-ink ${
              active ? `${chip.slug ? categoryBg(chip.slug) : "bg-sun"} shadow-[2px_2px_0_0_#111]` : "bg-card hover:bg-paper"
            }`}
          >
            {chip.label}
          </FilterLink>
        );
      })}
    </ChipRow>
  );
}

function Results({
  filters,
  listings,
  today,
  savedIds,
}: {
  filters: Filters;
  listings: Listing[];
  today: string;
  savedIds: Set<string>;
}) {
  if (listings.length === 0) {
    return (
      <div className="sticker mx-4 mt-4 px-4 py-10 text-center">
        <p className="font-display text-xl font-extrabold text-ink">
          {filters.q ? `Walang "${filters.q}" pa.` : "Wala pa dito ngayon."}
        </p>
        <p className="mt-1 text-sm text-muted">
          {audienceFilterCount(filters) > 0
            ? "Try removing a filter: region, course, or year."
            : filters.view === "closing-soon"
              ? "No deadlines in the next 7 days."
              : "Try another word or category."}
        </p>
        <Link
          href={browseHref(filters, { view: "all", category: null, q: "", region: null, course: null, year: null })}
          className="btn-plain press mt-4"
        >
          See all opportunities
        </Link>
      </div>
    );
  }

  // Unfiltered, the hero already says how many are open.
  const filtered = Boolean(filters.q || filters.category || filters.view !== "all" || audienceFilterCount(filters) > 0);
  const count = filtered ? (
    <p className="tabular px-4 pb-2 pt-4 text-sm font-semibold text-muted">
      {listings.length} {listings.length === 1 ? "opportunity" : "opportunities"}
      {filters.view === "closing-soon" ? " closing soon" : ""}
      {filters.q ? ` for "${filters.q}"` : ""}
    </p>
  ) : (
    <div className="pt-3" />
  );

  // Search results keep their relevance order; everything else is grouped by deadline.
  if (filters.q || filters.view === "closing-soon") {
    return (
      <>
        {count}
        <Rows listings={listings} today={today} savedIds={savedIds} />
      </>
    );
  }

  // This week's deadlines go in the swipeable strip; the list starts after them.
  const groups = groupByDeadline(listings, today);
  const thisWeek = groups.find((g) => g.label === "This week")?.listings ?? [];

  return (
    <>
      {count}
      <ClosingStrip listings={thisWeek} today={today} seeAllHref={browseHref(filters, { view: "closing-soon" })} />
      {groups
        .filter((g) => g.label !== "This week")
        .map((group) => (
          <section key={group.label} aria-labelledby={`group-${group.label}`} className="pt-4">
            <h2 id={`group-${group.label}`} className="px-4 pb-2 font-display text-lg font-extrabold text-ink">
              {group.label}
            </h2>
            <Rows listings={group.listings} today={today} savedIds={savedIds} />
          </section>
        ))}
    </>
  );
}

// Compact cards (4–5 per phone screen) with a Save button on each.
function Rows({ listings, today, savedIds }: { listings: Listing[]; today: string; savedIds: Set<string> }) {
  return (
    <ul className="flex flex-col gap-3 px-4">
      {listings.map((l) => (
        <ListingRow
          key={l.id}
          listing={l}
          today={today}
          trailing={
            <SaveButton opportunityId={l.id} initialSaved={savedIds.has(l.id)} back={`/opportunities/${l.slug}`} compact />
          }
        />
      ))}
    </ul>
  );
}

function BrowseSkeleton() {
  return (
    <div aria-hidden="true" className="px-4 pt-6 motion-safe:animate-pulse">
      <div className="h-6 w-40 rounded-pill bg-line" />
      <div className="mt-3 h-9 w-11/12 rounded-ui bg-line" />
      <div className="mt-2 h-9 w-2/3 rounded-ui bg-line" />
      <div className="mt-5 h-14 rounded-ui bg-line" />
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="mt-4 h-28 rounded-ui bg-line" />
      ))}
    </div>
  );
}

// Students who saw something elsewhere send it to the curators.
function SubmitCta() {
  return (
    <section className="sticker mx-4 mt-8 flex flex-col gap-3 bg-lilac p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-lg font-extrabold text-ink">May nakita kang opportunity?</h2>
        <p className="text-sm text-ink">Send us the link. We check it, then everyone sees it.</p>
      </div>
      <Link href="/submit" className="btn-pop press shrink-0 text-sm">
        Submit a link
      </Link>
    </section>
  );
}

type ViewerProfile ={ course: string | null; year: string | null } | null;

// What the signed-in student already saved, and their course and year for
// "Use my profile" (empty when signed out).
async function getViewer(): Promise<{ savedIds: Set<string>; profile: ViewerProfile }> {
  const user = await getCurrentUser();
  if (!user) return { savedIds: new Set(), profile: null };
  const supabase = await createClient();
  const [{ data: saved }, { data: profile }] = await Promise.all([
    supabase.from("saved_opportunities").select("opportunity_id").eq("user_id", user.id),
    supabase.from("profiles").select("course_group, year_level").eq("user_id", user.id).maybeSingle(),
  ]);
  return {
    savedIds: new Set((saved ?? []).map((r) => r.opportunity_id)),
    profile: profile ? { course: profile.course_group, year: profile.year_level } : null,
  };
}

const select =
  "mt-1 h-11 w-full rounded-[8px] border-2 border-ink bg-card px-2 text-base font-normal text-ink";

// "Para sa'yo ba?": region, course, and year filters. Untagged listings are
// open to everyone, so they always stay in the results.
function AudienceFilters({ filters, profile }: { filters: Filters; profile: ViewerProfile }) {
  const count = audienceFilterCount(filters);
  const active: { key: string; label: string; clear: Partial<Filters> }[] = [];
  if (filters.region) active.push({ key: "region", label: regionLabel(filters.region), clear: { region: null } });
  if (filters.course) active.push({ key: "course", label: courseGroupLabel(filters.course) ?? "", clear: { course: null } });
  if (filters.year) active.push({ key: "year", label: yearLevelLabel(filters.year) ?? "", clear: { year: null } });
  const profileHref =
    profile?.course && profile.year && (filters.course !== profile.course || filters.year !== profile.year)
      ? browseHref(filters, { course: profile.course, year: profile.year })
      : null;

  return (
    <div className="px-4 pt-3">
      <details className="sticker group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-3 font-bold text-ink [&::-webkit-details-marker]:hidden">
          <span className="flex min-w-0 items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="shrink-0">
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
            <span className="whitespace-nowrap">Para sa&apos;yo ba?</span>
            <span className="truncate text-xs font-semibold text-muted">Region, course, year</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {count > 0 && <span className="tag tabular whitespace-nowrap bg-sun">{count} on</span>}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className="transition-transform group-open:rotate-180">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </summary>
        <AudienceForm className="border-t-2 border-dashed border-line px-3 pb-3 pt-3">
          {filters.view !== "all" && <input type="hidden" name="view" value={filters.view} />}
          {filters.category && <input type="hidden" name="category" value={filters.category} />}
          {filters.q && <input type="hidden" name="q" value={filters.q} />}
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm font-bold text-ink">
              Region
              <select name="region" defaultValue={filters.region ?? ""} className={select}>
                <option value="">Anywhere</option>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold text-ink">
              Course
              <select name="course" defaultValue={filters.course ?? ""} className={select}>
                <option value="">Any course</option>
                {COURSE_GROUPS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold text-ink">
              Year level
              <select name="year" defaultValue={filters.year ?? ""} className={select}>
                <option value="">Any year</option>
                {YEAR_LEVELS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {yearLevelLabel(y.value)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs text-muted">Listings open to everyone always show up.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="submit" className="btn-pop press h-11 text-sm">
              Show results
            </button>
            {profileHref && (
              <FilterLink href={profileHref} className="btn-plain press h-11 text-sm">
                Use my course and year
              </FilterLink>
            )}
          </div>
        </AudienceForm>
      </details>
      {active.length > 0 && (
        <ChipRow label="Active filters" className="pt-2">
          {active.map((a) => (
            <FilterLink
              key={a.key}
              href={browseHref(filters, a.clear)}
              className="relative inline-flex min-h-11 shrink-0 items-center gap-1 rounded-pill border-2 border-ink bg-sun px-3 text-sm font-bold text-ink"
            >
              {a.label}
              <span aria-hidden="true">×</span>
              <span className="sr-only">(remove filter)</span>
            </FilterLink>
          ))}
        </ChipRow>
      )}
    </div>
  );
}
