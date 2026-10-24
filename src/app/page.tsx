import { cookies } from "next/headers";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { Suspense } from "react";
import { ClosingStrip } from "@/components/closing-strip";
import { FeedPost } from "@/components/feed-post";
import { WelcomeNote } from "@/components/welcome-note";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { WELCOME_COOKIE } from "@/lib/welcome";
import { categoryBg, categoryChipLabel } from "@/lib/opportunities/categories";
import { groupByDeadline, isClosingSoon, isOpen, type Listing } from "@/lib/opportunities/listing";
import {
  getActiveCategories,
  getPublishedListings,
  getToday,
  searchListings,
  type Category,
} from "@/lib/opportunities/queries";

type View = "all" | "closing-soon";

type Filters = { view: View; category: string | null; q: string };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function readFilters(params: Record<string, string | string[] | undefined>): Filters {
  const q = (first(params.q) ?? "").trim().slice(0, 100);
  return {
    view: first(params.view) === "closing-soon" ? "closing-soon" : "all",
    category: first(params.category) || null,
    q,
  };
}

// Builds a Browse URL, keeping the other filters.
function browseHref(filters: Filters, change: Partial<Filters>): string {
  const next = { ...filters, ...change };
  const params = new URLSearchParams();
  if (next.view !== "all") params.set("view", next.view);
  if (next.category) params.set("category", next.category);
  if (next.q) params.set("q", next.q);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

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
  const [today, categories, listings, cookieStore, savedIds] = await Promise.all([
    getToday(),
    getActiveCategories(),
    filters.q ? searchListings(filters.q) : getPublishedListings(),
    cookies(),
    getSavedIds(),
  ]);
  const isHome = !filters.q && !filters.category && filters.view === "all";
  const showWelcome = isHome && !cookieStore.has(WELCOME_COOKIE);

  const visible = listings.filter(
    (l) =>
      isOpen(l, today) &&
      (!filters.category || l.categorySlug === filters.category) &&
      (filters.view !== "closing-soon" || isClosingSoon(l, today)),
  );

  const openCount = listings.filter((l) => isOpen(l, today)).length;

  return (
    <>
      {isHome ? <Hero openCount={openCount} /> : <h1 className="sr-only">Browse opportunities</h1>}
      {showWelcome && <WelcomeNote />}
      <SearchForm filters={filters} />
      {!filters.q && <SearchSuggestions filters={filters} />}
      <Tabs filters={filters} />
      <CategoryChips filters={filters} categories={categories} />
      <Results filters={filters} listings={visible} today={today} savedIds={savedIds} />
    </>
  );
}

// Big friendly headline on the home screen only.
function Hero({ openCount }: { openCount: number }) {
  return (
    <section className="px-4 pt-6">
      <p className="tag bg-lime">
        <span className="tabular">{openCount}</span> open now · free for students
      </p>
      <h1 className="mt-3 font-display text-[34px] font-extrabold leading-[1.05] tracking-tight text-ink">
        Huwag ma-late sa next{" "}
        <span className="relative inline-block">
          <span aria-hidden="true" className="absolute inset-x-0 bottom-1 h-3 -rotate-1 rounded-sm bg-sun" />
          <span className="relative">opportunity</span>
        </span>{" "}
        mo.
      </h1>
      <p className="mt-2 text-muted">Scholarships, internships, hackathons, and free courses, sorted by deadline.</p>
    </section>
  );
}

function SearchForm({ filters }: { filters: Filters }) {
  return (
    <form action="/" className="px-4 pt-4" role="search">
      {filters.view !== "all" && <input type="hidden" name="view" value={filters.view} />}
      {filters.category && <input type="hidden" name="category" value={filters.category} />}
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
          placeholder="Search DOST, OJT, hackathon…"
          className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
          style={{ border: 0 }}
          enterKeyHint="search"
        />
        <button type="submit" className="m-1 h-10 rounded-[8px] bg-ink px-4 text-sm font-bold text-white">
          Go
        </button>
      </div>
    </form>
  );
}

// Common searches, so students don't have to type on a small keyboard.
const SUGGESTIONS = ["DOST", "CHED", "OJT", "CTF", "TESDA"];

function SearchSuggestions({ filters }: { filters: Filters }) {
  return (
    <nav aria-label="Popular searches" className="flex items-center gap-2 overflow-x-auto px-4 pb-1 pt-3 [scrollbar-width:none]">
      <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-muted">Try</span>
      {SUGGESTIONS.map((q) => (
        <Link
          key={q}
          href={browseHref(filters, { q })}
          className="inline-flex min-h-11 shrink-0 items-center rounded-pill border-2 border-dashed border-ink bg-card px-3 text-sm font-bold text-ink hover:bg-sun"
        >
          #{q}
        </Link>
      ))}
    </nav>
  );
}

function Tabs({ filters }: { filters: Filters }) {
  const tabs: { view: View; label: string }[] = [
    { view: "all", label: "All" },
    { view: "closing-soon", label: "Closing soon" },
  ];
  return (
    <nav aria-label="Views" className="mx-4 mt-4 grid grid-cols-2 rounded-ui border-2 border-ink bg-card p-1">
      {tabs.map((tab) => {
        const active = filters.view === tab.view;
        return (
          <Link
            key={tab.view}
            href={browseHref(filters, { view: tab.view })}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center justify-center rounded-[8px] text-sm font-bold ${
              active ? "bg-ink text-white" : "text-ink hover:bg-paper"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

function CategoryChips({ filters, categories }: { filters: Filters; categories: Category[] }) {
  const chips = [{ slug: null as string | null, label: "All" }].concat(
    categories.map((c) => ({ slug: c.slug, label: categoryChipLabel(c.slug, c.name) })),
  );
  return (
    <nav aria-label="Categories" className="flex gap-2 overflow-x-auto px-4 pb-4 pt-3 [scrollbar-width:none]">
      {chips.map((chip) => {
        const active = filters.category === chip.slug;
        return (
          <Link
            key={chip.slug ?? "all"}
            href={browseHref(filters, { category: chip.slug })}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-pill border-2 border-ink px-4 text-sm font-bold text-ink ${
              active ? `${chip.slug ? categoryBg(chip.slug) : "bg-sun"} shadow-[2px_2px_0_0_#111]` : "bg-card hover:bg-paper"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </nav>
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
      <div className="sticker mx-4 px-4 py-10 text-center">
        <p className="font-display text-xl font-extrabold text-ink">
          {filters.q ? `Walang "${filters.q}" pa.` : "Wala pa dito ngayon."}
        </p>
        <p className="mt-1 text-sm text-muted">
          {filters.view === "closing-soon" ? "No deadlines in the next 7 days." : "Try another word or category."}
        </p>
        <Link href={browseHref(filters, { view: "all", category: null, q: "" })} className="btn-plain press mt-4">
          See all opportunities
        </Link>
      </div>
    );
  }

  const count = (
    <p className="tabular px-4 pb-2 text-sm font-semibold text-muted">
      {listings.length} {listings.length === 1 ? "opportunity" : "opportunities"}
      {filters.q ? ` for "${filters.q}"` : ""}
    </p>
  );

  // Search results keep their relevance order; everything else is grouped by deadline.
  if (filters.q || filters.view === "closing-soon") {
    return (
      <>
        {count}
        <div className="flex flex-col gap-5 px-4">
          {listings.map((l) => (
            <FeedPost key={l.id} listing={l} today={today} saved={savedIds.has(l.id)} />
          ))}
        </div>
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
            <div className="flex flex-col gap-5 px-4">
              {group.listings.map((l) => (
                <FeedPost key={l.id} listing={l} today={today} saved={savedIds.has(l.id)} />
              ))}
            </div>
          </section>
        ))}
    </>
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

// Which listings the signed-in student already saved (empty when signed out).
async function getSavedIds(): Promise<Set<string>> {
  const user = await getCurrentUser();
  if (!user) return new Set();
  const supabase = await createClient();
  const { data } = await supabase.from("saved_opportunities").select("opportunity_id").eq("user_id", user.id);
  return new Set((data ?? []).map((r) => r.opportunity_id));
}
