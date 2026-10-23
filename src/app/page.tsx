import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { Suspense } from "react";
import { ClosingStrip } from "@/components/closing-strip";
import { ListingRow } from "@/components/listing-row";
import { categoryChipLabel } from "@/lib/opportunities/categories";
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
      <h1 className="sr-only">Browse opportunities</h1>
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
  const [today, categories, listings] = await Promise.all([
    getToday(),
    getActiveCategories(),
    filters.q ? searchListings(filters.q) : getPublishedListings(),
  ]);

  const visible = listings.filter(
    (l) =>
      isOpen(l, today) &&
      (!filters.category || l.categorySlug === filters.category) &&
      (filters.view !== "closing-soon" || isClosingSoon(l, today)),
  );

  return (
    <>
      <SearchForm filters={filters} />
      <Tabs filters={filters} />
      <CategoryChips filters={filters} categories={categories} />
      <Results filters={filters} listings={visible} today={today} />
    </>
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
      <input
        id="search"
        name="q"
        type="search"
        defaultValue={filters.q}
        placeholder="Search scholarships, internships, contests…"
        className="h-11 w-full rounded-ui border border-line bg-white px-3 text-base text-ink placeholder:text-muted"
        enterKeyHint="search"
      />
    </form>
  );
}

function Tabs({ filters }: { filters: Filters }) {
  const tabs: { view: View; label: string }[] = [
    { view: "all", label: "All" },
    { view: "closing-soon", label: "Closing soon" },
  ];
  return (
    <nav aria-label="Views" className="mt-3 flex gap-6 border-b border-line px-4">
      {tabs.map((tab) => {
        const active = filters.view === tab.view;
        return (
          <Link
            key={tab.view}
            href={browseHref(filters, { view: tab.view })}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 py-3 text-sm font-semibold ${
              active ? "border-teal text-ink" : "border-transparent text-muted hover:text-ink"
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
    <nav aria-label="Categories" className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
      {chips.map((chip) => {
        const active = filters.category === chip.slug;
        return (
          <Link
            key={chip.slug ?? "all"}
            href={browseHref(filters, { category: chip.slug })}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-ui border px-3 py-1.5 text-sm ${
              active ? "border-teal bg-teal text-white" : "border-line bg-white text-ink hover:border-muted"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Results({ filters, listings, today }: { filters: Filters; listings: Listing[]; today: string }) {
  if (listings.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="font-semibold text-ink">
          {filters.q ? `Nothing matches "${filters.q}" yet.` : "Nothing here right now."}
        </p>
        <p className="mt-1 text-sm text-muted">
          {filters.view === "closing-soon" ? "No deadlines in the next 7 days. " : ""}
          <Link href={browseHref(filters, { view: "all", category: null, q: "" })} className="text-teal underline">
            See all opportunities
          </Link>
        </p>
      </div>
    );
  }

  const count = (
    <p className="tabular px-4 pb-2 text-xs text-muted">
      {listings.length} {listings.length === 1 ? "opportunity" : "opportunities"}
      {filters.q ? ` for "${filters.q}"` : ""}
    </p>
  );

  // Search results keep their relevance order; everything else is grouped by deadline.
  if (filters.q || filters.view === "closing-soon") {
    return (
      <>
        {count}
        <ul className="border-t border-line">
          {listings.map((l) => (
            <ListingRow key={l.id} listing={l} today={today} />
          ))}
        </ul>
      </>
    );
  }

  // This week's deadlines go in the swipeable strip; the list starts after them.
  const groups = groupByDeadline(listings, today);
  const thisWeek = groups.find((g) => g.label === "This week")?.listings ?? [];

  return (
    <>
      {count}
      <ClosingStrip
        listings={thisWeek}
        today={today}
        seeAllHref={browseHref(filters, { view: "closing-soon" })}
      />
      {groups.filter((g) => g.label !== "This week").map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h2 className="border-t border-line bg-paper px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted">
            {group.label}
          </h2>
          <ul>
            {group.listings.map((l) => (
              <ListingRow key={l.id} listing={l} today={today} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function BrowseSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse px-4 pt-4">
      <div className="h-11 rounded-ui bg-line/60" />
      <div className="mt-4 h-6 w-40 rounded-ui bg-line/60" />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="mt-6 flex gap-4">
          <div className="h-10 w-20 rounded-ui bg-line/60" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded-ui bg-line/60" />
            <div className="h-3 w-2/3 rounded-ui bg-line/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
