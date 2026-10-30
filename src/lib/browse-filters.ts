import { isCourseGroup, isRegion, isYearLevel, type AudienceFilter } from "./opportunities/audience";

// Browse filters live in the URL (?view=&category=&q=&region=&course=&year=)
// so they survive refresh, sharing, and the back button.

export type View = "all" | "closing-soon";

export type Filters = AudienceFilter & { view: View; category: string | null; q: string };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function readFilters(params: Record<string, string | string[] | undefined>): Filters {
  const q = (first(params.q) ?? "").trim().slice(0, 100);
  const region = first(params.region);
  const course = first(params.course);
  const year = first(params.year);
  return {
    view: first(params.view) === "closing-soon" ? "closing-soon" : "all",
    category: first(params.category) || null,
    q,
    region: isRegion(region) ? region : null,
    course: isCourseGroup(course) ? course : null,
    year: isYearLevel(year) ? year : null,
  };
}

// Builds a Browse URL, keeping the other filters.
export function browseHref(filters: Filters, change: Partial<Filters>): string {
  const next = { ...filters, ...change };
  const params = new URLSearchParams();
  if (next.view !== "all") params.set("view", next.view);
  if (next.category) params.set("category", next.category);
  if (next.q) params.set("q", next.q);
  if (next.region) params.set("region", next.region);
  if (next.course) params.set("course", next.course);
  if (next.year) params.set("year", next.year);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

// How many "who is it for" filters are on.
export function audienceFilterCount(filters: Filters): number {
  return [filters.region, filters.course, filters.year].filter(Boolean).length;
}
