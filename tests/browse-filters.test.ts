import { describe, expect, it } from "vitest";
import { audienceFilterCount, browseHref, readFilters, type Filters } from "../src/lib/browse-filters";
import { fitsAudience } from "../src/lib/opportunities/audience";

const NONE = { region: null, course: null, year: null };

describe("readFilters", () => {
  it("defaults to all listings", () => {
    expect(readFilters({})).toEqual({ view: "all", category: null, q: "", ...NONE });
  });

  it("ignores unknown views and trims long searches", () => {
    const f = readFilters({ view: "weird", q: `  ${"x".repeat(150)}  ` });
    expect(f.view).toBe("all");
    expect(f.q).toHaveLength(100);
  });

  it("takes the first value when a param repeats", () => {
    expect(readFilters({ category: ["ctfs", "courses"] }).category).toBe("ctfs");
  });

  it("keeps known region, course, and year values only", () => {
    expect(readFilters({ region: "nir", course: "it_cs", year: "3" })).toMatchObject({
      region: "nir",
      course: "it_cs",
      year: "3",
    });
    expect(readFilters({ region: "mars", course: "magic", year: "9" })).toMatchObject(NONE);
  });
});

describe("browseHref keeps the other filters", () => {
  const filters: Filters = { view: "closing-soon", category: "ctfs", q: "dost", ...NONE };

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

  it("keeps who-it's-for filters", () => {
    const withAudience = { ...filters, region: "davao", year: "4" };
    expect(browseHref(withAudience, { category: null })).toBe("/?view=closing-soon&q=dost&region=davao&year=4");
    expect(audienceFilterCount(withAudience)).toBe(2);
  });

  it("round-trips through readFilters", () => {
    const all = { ...filters, region: "ncr", course: "health", year: "graduating" };
    const href = browseHref(all, {});
    const params = Object.fromEntries(new URLSearchParams(href.slice(2)));
    expect(readFilters(params)).toEqual(all);
  });
});

describe("fitsAudience", () => {
  const tagged = { regions: ["ncr", "calabarzon"], course_groups: ["it_cs"], year_levels: ["3", "4"] };
  const open = { regions: [], course_groups: [], year_levels: [] };

  it("untagged listings are open to everyone", () => {
    expect(fitsAudience(open, { region: "barmm", course: "health", year: "1" })).toBe(true);
  });

  it("matches only the tagged values", () => {
    expect(fitsAudience(tagged, { region: "ncr", course: "it_cs", year: "4" })).toBe(true);
    expect(fitsAudience(tagged, { region: "davao", course: null, year: null })).toBe(false);
    expect(fitsAudience(tagged, { region: null, course: "health", year: null })).toBe(false);
    expect(fitsAudience(tagged, { region: null, course: null, year: "1" })).toBe(false);
  });

  it("no filters shows everything", () => {
    expect(fitsAudience(tagged, NONE)).toBe(true);
  });
});
