import { describe, expect, it } from "vitest";
import { browseHref, readFilters } from "../src/lib/browse-filters";

describe("readFilters", () => {
  it("defaults to all listings", () => {
    expect(readFilters({})).toEqual({ view: "all", category: null, q: "" });
  });

  it("ignores unknown views and trims long searches", () => {
    const f = readFilters({ view: "weird", q: `  ${"x".repeat(150)}  ` });
    expect(f.view).toBe("all");
    expect(f.q).toHaveLength(100);
  });

  it("takes the first value when a param repeats", () => {
    expect(readFilters({ category: ["ctfs", "courses"] }).category).toBe("ctfs");
  });
});

describe("browseHref keeps the other filters", () => {
  const filters = { view: "closing-soon" as const, category: "ctfs", q: "dost" };

  it("changing the category keeps the search and view", () => {
    expect(browseHref(filters, { category: "courses" })).toBe("/?view=closing-soon&category=courses&q=dost");
  });

  it("searching keeps the category and view", () => {
    expect(browseHref(filters, { q: "ojt" })).toBe("/?view=closing-soon&category=ctfs&q=ojt");
  });

  it("switching to All keeps the category and search", () => {
    expect(browseHref(filters, { view: "all" })).toBe("/?category=ctfs&q=dost");
  });

  it("clearing everything returns to the plain list", () => {
    expect(browseHref(filters, { view: "all", category: null, q: "" })).toBe("/");
  });

  it("round-trips through readFilters", () => {
    const href = browseHref(filters, {});
    const params = Object.fromEntries(new URLSearchParams(href.slice(2)));
    expect(readFilters(params)).toEqual(filters);
  });
});
