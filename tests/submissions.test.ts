import { describe, expect, it } from "vitest";
import { OJT_CHECKLIST } from "../src/lib/ojt-checklist";
import { parseSubmission } from "../src/lib/submissions";

const TODAY = "2026-10-25";

function form(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

describe("parseSubmission", () => {
  it("accepts a link with optional details", () => {
    const result = parseSubmission(
      form({ url: "https://www.facebook.com/somepage/posts/123", title: "  IT Internship  ", deadline: "2026-11-30", submitter_role: "organizer" }),
      TODAY,
    );
    expect(result).toEqual({
      ok: true,
      fields: {
        url: "https://www.facebook.com/somepage/posts/123",
        title: "IT Internship",
        organization: null,
        deadline: "2026-11-30",
        note: null,
        submitter_role: "organizer",
      },
    });
  });

  it("adds https:// and upgrades http://", () => {
    const bare = parseSubmission(form({ url: "dost.gov.ph/scholarship" }), TODAY);
    expect(bare.ok && bare.fields.url).toBe("https://dost.gov.ph/scholarship");
    const http = parseSubmission(form({ url: "http://example.edu.ph/ojt" }), TODAY);
    expect(http.ok && http.fields.url).toBe("https://example.edu.ph/ojt");
  });

  it("rejects missing links, past deadlines, and unknown roles", () => {
    const result = parseSubmission(form({ url: "not a link", deadline: "2026-10-01", submitter_role: "hacker" }), TODAY);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(["deadline", "submitter_role", "url"]);
  });

  it("trims long notes", () => {
    const result = parseSubmission(form({ url: "https://a.ph/x", note: "x".repeat(2000) }), TODAY);
    expect(result.ok && result.fields.note).toHaveLength(1000);
  });
});

describe("OJT checklist", () => {
  it("has unique item ids within each stage", () => {
    for (const stage of OJT_CHECKLIST) {
      const ids = stage.items.map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("includes every CMO 104 §16.1 student requirement", () => {
    const cmo = OJT_CHECKLIST.flatMap((s) => s.items).filter((i) => i.source === "cmo104").map((i) => i.id);
    expect(cmo).toEqual(["enrolled", "subject", "age", "pre-internship", "medical", "consent"]);
  });
});
