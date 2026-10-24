// Browse filters live in the URL (?view=&category=&q=) so they survive
// refresh, sharing, and the back button.

export type View = "all" | "closing-soon";

export type Filters = { view: View; category: string | null; q: string };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function readFilters(params: Record<string, string | string[] | undefined>): Filters {
  const q = (first(params.q) ?? "").trim().slice(0, 100);
  return {
    view: first(params.view) === "closing-soon" ? "closing-soon" : "all",
    category: first(params.category) || null,
    q,
  };
}

// Builds a Browse URL, keeping the other filters.
export function browseHref(filters: Filters, change: Partial<Filters>): string {
  const next = { ...filters, ...change };
  const params = new URLSearchParams();
  if (next.view !== "all") params.set("view", next.view);
  if (next.category) params.set("category", next.category);
  if (next.q) params.set("q", next.q);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
