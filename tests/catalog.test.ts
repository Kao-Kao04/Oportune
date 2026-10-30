import { describe, expect, it } from "vitest";
import { daysBetween, deadlineInfo, formatShortDate, todayInManila } from "../src/lib/opportunities/dates";
import {
  compareByDeadline,
  groupByDeadline,
  isClosingSoon,
  isOpen,
  type Listing,
} from "../src/lib/opportunities/listing";

const TODAY = "2026-10-23";

function listing(overrides: Partial<Listing>): Listing {
  return {
    id: overrides.slug ?? "x",
    slug: "x",
    title: "X",
    organization: "Org",
    categoryName: "Cybersecurity CTFs",
    categorySlug: "ctfs",
    summary: null,
    eligibility: null,
    requirements: null,
    location: null,
    delivery_mode: "online",
    application_opens: null,
    application_opens_type: "tba",
    deadline: null,
    deadline_type: "tba",
    source_url: "https://example.org/",
    application_url: "https://example.org/",
    source_trust: "other",
    status: "published",
    last_checked_at: null,
    regions: [],
    course_groups: [],
    year_levels: [],
    ...overrides,
  };
}

describe("todayInManila", () => {
  it("uses Philippine time, not UTC", () => {
    // 16:30 UTC on Oct 23 is 00:30 on Oct 24 in Manila.
    expect(todayInManila(new Date("2026-10-23T16:30:00Z"))).toBe("2026-10-24");
    expect(todayInManila(new Date("2026-10-23T15:59:00Z"))).toBe("2026-10-23");
  });
});

describe("dates", () => {
  it("counts whole days across months", () => {
    expect(daysBetween("2026-10-23", "2026-11-04")).toBe(12);
    expect(daysBetween("2026-10-23", "2026-10-22")).toBe(-1);
  });

  it("shows the year only when it differs", () => {
    expect(formatShortDate("2026-10-31", TODAY)).toBe("Oct 31");
    expect(formatShortDate("2027-01-15", TODAY)).toBe("Jan 15, 2027");
  });
});

describe("deadlineInfo", () => {
  it.each([
    ["2026-10-23", "Closes today", "urgent"],
    ["2026-10-24", "1 day left", "urgent"],
    ["2026-10-26", "3 days left", "urgent"],
    ["2026-10-27", "4 days left", "soon"],
    ["2026-10-30", "7 days left", "soon"],
    ["2026-10-31", "8 days left", "normal"],
    ["2026-10-22", "Closed", "closed"],
  ])("deadline %s → %s (%s)", (deadline, detail, tone) => {
    const info = deadlineInfo(listing({ deadline, deadline_type: "date" }), TODAY);
    expect(info.detail).toBe(detail);
    expect(info.tone).toBe(tone);
  });

  it("treats expired listings as closed even before the job runs", () => {
    const info = deadlineInfo(listing({ deadline: "2026-11-30", deadline_type: "date", status: "expired" }), TODAY);
    expect(info.tone).toBe("closed");
  });

  it("labels rolling and TBA deadlines", () => {
    expect(deadlineInfo(listing({ deadline_type: "rolling" }), TODAY).label).toBe("Rolling");
    expect(deadlineInfo(listing({ deadline_type: "tba" }), TODAY).label).toBe("TBA");
  });
});

describe("closing soon and open", () => {
  it("includes today through today + 7 only", () => {
    expect(isClosingSoon(listing({ deadline: "2026-10-23", deadline_type: "date" }), TODAY)).toBe(true);
    expect(isClosingSoon(listing({ deadline: "2026-10-30", deadline_type: "date" }), TODAY)).toBe(true);
    expect(isClosingSoon(listing({ deadline: "2026-10-31", deadline_type: "date" }), TODAY)).toBe(false);
    expect(isClosingSoon(listing({ deadline_type: "rolling" }), TODAY)).toBe(false);
  });

  it("hides past deadlines and expired listings from lists", () => {
    expect(isOpen(listing({ deadline: "2026-10-22", deadline_type: "date" }), TODAY)).toBe(false);
    expect(isOpen(listing({ status: "expired", deadline_type: "rolling" }), TODAY)).toBe(false);
    expect(isOpen(listing({ deadline_type: "tba" }), TODAY)).toBe(true);
  });
});

describe("sorting and grouping", () => {
  const items = [
    listing({ slug: "tba", deadline_type: "tba" }),
    listing({ slug: "rolling", deadline_type: "rolling" }),
    listing({ slug: "later", deadline: "2026-12-01", deadline_type: "date" }),
    listing({ slug: "soon", deadline: "2026-10-25", deadline_type: "date" }),
  ];

  it("puts dated deadlines first (soonest first), then rolling, then TBA", () => {
    expect([...items].sort(compareByDeadline).map((l) => l.slug)).toEqual(["soon", "later", "rolling", "tba"]);
  });

  it("groups into This week / Later / No fixed deadline", () => {
    const groups = groupByDeadline(items, TODAY);
    expect(groups.map((g) => [g.label, g.listings.map((l) => l.slug)])).toEqual([
      ["This week", ["soon"]],
      ["Later", ["later"]],
      ["No fixed deadline", ["rolling", "tba"]],
    ]);
  });
});
