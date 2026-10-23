import { describe, expect, it } from "vitest";
import { mapCsvRow, parseCsv } from "../src/lib/opportunities/csv-import";
import { slugify, uniqueSlug } from "../src/lib/opportunities/slug";
import { sourceTrust } from "../src/lib/opportunities/source-trust";

describe("sourceTrust", () => {
  it.each([
    ["https://www.pchrd.dost.gov.ph/calls", "official_gov"],
    ["https://gov.ph/", "official_gov"],
    ["https://science.upd.edu.ph/dost-asthrdp/", "official_edu"],
    ["https://WWW.TESDA.GOV.PH/", "official_gov"],
    ["https://ieeextreme.org/", "other"],
  ])("%s → %s", (url, expected) => {
    expect(sourceTrust(url)).toBe(expected);
  });

  it.each([
    "https://gov.ph.example.com/",
    "https://example.com/gov.ph",
    "https://example.com/?next=https://dost.gov.ph",
    "https://notgov.ph/",
    "http://www.dost.gov.ph/",
    "not a url",
  ])("rejects lookalike or unsafe %s", (url) => {
    expect(sourceTrust(url)).toBe("other");
  });
});

describe("slugify", () => {
  it("removes accents and punctuation", () => {
    expect(slugify("Señorita Scholarship: Türkiye 2027!")).toBe("senorita-scholarship-turkiye-2027");
  });

  it("keeps slugs at 80 characters without a trailing dash", () => {
    const slug = slugify("A".repeat(79) + " B");
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("adds a number when the slug is taken", () => {
    const taken = new Set(["ieeextreme-20-0", "ieeextreme-20-0-2"]);
    expect(uniqueSlug("IEEEXtreme 20.0", taken)).toBe("ieeextreme-20-0-3");
  });
});

describe("mapCsvRow", () => {
  const categories = new Set(["Cybersecurity CTFs"]);
  const base = {
    id: "OPP-900",
    status: "ready",
    title: "Example CTF",
    organization: "Example Org",
    category: "Cybersecurity CTFs",
    summary: " A test listing. ",
    eligibility: "",
    location: "Online",
    delivery_mode: "Online",
    application_opens: "TBA",
    deadline: "2026-11-08",
    source_url: "https://ctf.example.org/",
    source_trust: "official_gov",
    confidence: "high",
    last_checked: "2026-10-23",
    notes: "",
  };

  it("maps a ready row to draft fields", () => {
    const result = mapCsvRow(base, categories);
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.fields).toMatchObject({
      external_id: "OPP-900",
      summary: "A test listing.",
      eligibility: null,
      delivery_mode: "online",
      application_opens: null,
      application_opens_type: "tba",
      deadline: "2026-11-08",
      deadline_type: "date",
      needs_check: false,
      last_checked_at: "2026-10-23T00:00:00+08:00",
    });
  });

  it("recomputes source_trust instead of trusting the CSV", () => {
    const result = mapCsvRow(base, categories);
    expect(result.kind === "ok" && result.fields.source_trust).toBe("other");
  });

  it("flags needs-check rows and maps rolling/open values", () => {
    const result = mapCsvRow(
      { ...base, status: "needs-check", deadline: "rolling", application_opens: "open" },
      categories,
    );
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.fields).toMatchObject({
      needs_check: true,
      deadline: null,
      deadline_type: "rolling",
      application_opens_type: "open",
    });
  });

  it("skips closed rows", () => {
    expect(mapCsvRow({ ...base, status: "closed" }, categories).kind).toBe("skipped");
  });

  it("rejects bad values with reasons", () => {
    const result = mapCsvRow(
      {
        ...base,
        category: "Sports",
        delivery_mode: "Onsite",
        deadline: "2026-02-30",
        source_url: "http://ctf.example.org/",
      },
      categories,
    );
    expect(result.kind).toBe("rejected");
    if (result.kind !== "rejected") return;
    expect(result.reasons).toHaveLength(4);
  });
});

describe("parseCsv", () => {
  it("handles BOM, quotes, commas and newlines inside fields, and CRLF", () => {
    const rows = parseCsv('﻿"id","notes"\r\n"OPP-1","a, ""b""\nc"\r\n');
    expect(rows).toEqual([{ id: "OPP-1", notes: 'a, "b"\nc' }]);
  });
});
