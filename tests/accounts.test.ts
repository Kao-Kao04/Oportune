import { describe, expect, it } from "vitest";
import { isProfileComplete, parseProfileForm, yearLevelLabel } from "../src/lib/profile";
import { safeNextPath } from "../src/lib/safe-next";

describe("safeNextPath", () => {
  it.each([
    ["/saved", "/saved"],
    ["/welcome?next=%2Fme", "/welcome?next=%2Fme"],
    ["//evil.example", "/"],
    ["/\\evil.example", "/"],
    ["https://evil.example", "/"],
    [undefined, "/"],
  ])("%s → %s", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });
});

describe("profile", () => {
  const form = (values: Record<string, string | string[]>) => {
    const f = new FormData();
    for (const [k, v] of Object.entries(values)) for (const item of [v].flat()) f.append(k, item);
    return f;
  };

  it("parses the quick profile and drops unknown interests", () => {
    const result = parseProfileForm(
      form({ school: " Gordon College ", course_group: "it_cs", year_level: "3", interests: ["ctfs", "hacking"], is_18_or_over: "on" }),
      new Set(["ctfs"]),
    );
    expect(result).toEqual({
      ok: true,
      fields: { school: "Gordon College", course_group: "it_cs", course: null, year_level: "3", interests: ["ctfs"], is_18_or_over: true },
    });
  });

  it("records under-18 as false, not missing", () => {
    const result = parseProfileForm(form({ school: "X", course_group: "other", year_level: "1" }), new Set());
    expect(result.ok && result.fields.is_18_or_over).toBe(false);
  });

  it("requires school, field of study, and year level", () => {
    const result = parseProfileForm(form({}), new Set());
    expect(result.ok ? [] : Object.keys(result.errors).sort()).toEqual(["course_group", "school", "year_level"]);
  });

  it("is complete only when every question is answered", () => {
    expect(isProfileComplete({ school: "X", course_group: "it_cs", year_level: "2", is_18_or_over: false })).toBe(true);
    expect(isProfileComplete({ school: "X", course_group: "it_cs", year_level: "2", is_18_or_over: null })).toBe(false);
  });

  it("labels year levels", () => {
    expect(yearLevelLabel("3")).toBe("3rd year");
    expect(yearLevelLabel("graduating")).toBe("Graduating");
  });
});
