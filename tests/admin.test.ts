import { describe, expect, it } from "vitest";
import { deadlineInfo } from "../src/lib/opportunities/dates";
import { parseOpportunityForm } from "../src/lib/opportunities/form";
import { planImport, selectedUpdate, type ExistingOpportunity } from "../src/lib/opportunities/import-plan";

const CATEGORY = { id: "cat-1", name: "Cybersecurity CTFs" };

const csvRow = (overrides: Record<string, string> = {}) => ({
  id: "OPP-1",
  status: "ready",
  title: "Example CTF",
  organization: "Org",
  category: "Cybersecurity CTFs",
  summary: "Summary",
  eligibility: "",
  location: "Online",
  delivery_mode: "Online",
  application_opens: "TBA",
  deadline: "2026-11-04",
  source_url: "https://ctf.example.org/",
  source_trust: "other",
  confidence: "high",
  last_checked: "2026-10-23",
  notes: "",
  ...overrides,
});

function existing(overrides: Partial<ExistingOpportunity> = {}): ExistingOpportunity {
  return {
    id: "id-1",
    slug: "example-ctf",
    status: "published",
    external_id: "OPP-1",
    title: "Example CTF",
    organization: "Org",
    category_id: "cat-1",
    summary: "Summary",
    eligibility: null,
    requirements: null,
    location: "Online",
    delivery_mode: "online",
    application_opens: null,
    application_opens_type: "tba",
    deadline: "2026-11-04",
    deadline_type: "date",
    source_url: "https://ctf.example.org/",
    source_trust: "other",
    confidence: "high",
    needs_check: false,
    notes: null,
    // Stored in UTC; midnight Oct 23 in Manila.
    last_checked_at: "2026-10-22T16:00:00+00:00",
    ...overrides,
  };
}

describe("planImport", () => {
  it("treats an identical row as unchanged (timestamps compared by PH date)", () => {
    const plan = planImport([csvRow()], [CATEGORY], [existing()]);
    expect(plan.unchanged).toEqual(["OPP-1"]);
  });

  it("never updates a published listing directly; shows a diff instead", () => {
    const plan = planImport([csvRow({ deadline: "2026-11-08" })], [CATEGORY], [existing()]);
    expect(plan.draftUpdates).toHaveLength(0);
    expect(plan.publishedChanges).toHaveLength(1);
    expect(plan.publishedChanges[0].changes).toEqual([{ field: "deadline", from: "2026-11-04", to: "2026-11-08" }]);
  });

  it("updates drafts and keeps their slug", () => {
    const plan = planImport([csvRow({ title: "Renamed CTF" })], [CATEGORY], [existing({ status: "draft" })]);
    expect(plan.draftUpdates).toHaveLength(1);
    expect(plan.draftUpdates[0].fields).not.toHaveProperty("slug");
  });

  it("inserts new rows as drafts with unique slugs", () => {
    const plan = planImport(
      [csvRow({ id: "OPP-2", source_url: "https://other.example.org/" })],
      [CATEGORY],
      [existing()],
    );
    expect(plan.inserts).toHaveLength(1);
    expect(plan.inserts[0]).toMatchObject({ status: "draft", slug: "example-ctf-2" });
  });

  it("rejects duplicate ids in the same file", () => {
    const plan = planImport([csvRow({ id: "OPP-9" }), csvRow({ id: "OPP-9", title: "Other" })], [CATEGORY], []);
    expect(plan.rejected).toEqual([{ externalId: "OPP-9", reasons: ["duplicate id in this file"] }]);
  });

  it("ignores needs-check for published listings (the database forbids it)", () => {
    const plan = planImport([csvRow({ status: "needs-check" })], [CATEGORY], [existing()]);
    expect(plan.unchanged).toEqual(["OPP-1"]);
  });
});

describe("selectedUpdate", () => {
  it("applies linked fields together", () => {
    const plan = planImport([csvRow({ deadline: "rolling" })], [CATEGORY], [existing()]);
    const change = plan.publishedChanges[0];
    expect(selectedUpdate(change.fields, ["deadline"])).toEqual({ deadline: null, deadline_type: "rolling" });
  });

  it("recomputes the badge with the source URL", () => {
    const plan = planImport([csvRow({ source_url: "https://www.dict.gov.ph/x" })], [CATEGORY], [existing()]);
    expect(selectedUpdate(plan.publishedChanges[0].fields, ["source_url"])).toEqual({
      source_url: "https://www.dict.gov.ph/x",
      source_trust: "official_gov",
    });
  });
});

describe("parseOpportunityForm", () => {
  function form(values: Record<string, string>) {
    const f = new FormData();
    for (const [k, v] of Object.entries(values)) f.set(k, v);
    return f;
  }
  const valid = {
    title: "T",
    organization: "O",
    category_id: "cat-1",
    source_url: "https://www.dost.gov.ph/",
    delivery_mode: "online",
    deadline_type: "date",
    deadline: "2026-11-01",
    application_opens_type: "tba",
    confidence: "high",
    last_checked: "2026-10-23",
  };

  it("accepts a valid form and computes the badge", () => {
    const result = parseOpportunityForm(form(valid), new Set(["cat-1"]));
    expect(result.ok && result.fields.source_trust).toBe("official_gov");
  });

  it("drops the date for rolling deadlines", () => {
    const result = parseOpportunityForm(form({ ...valid, deadline_type: "rolling" }), new Set(["cat-1"]));
    expect(result.ok && result.fields.deadline).toBeNull();
  });

  it("rejects http links, unknown categories, and missing dates", () => {
    const result = parseOpportunityForm(
      form({ ...valid, source_url: "http://x.org", category_id: "nope", deadline: "" }),
      new Set(["cat-1"]),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(Object.keys(result.errors).sort()).toEqual(["category_id", "deadline", "source_url"]);
  });
});

describe("closed early", () => {
  it("shows rolling listings a curator expired as closed", () => {
    const info = deadlineInfo({ deadline: null, deadline_type: "rolling", status: "expired" }, "2026-10-23");
    expect(info.tone).toBe("closed");
  });
});
