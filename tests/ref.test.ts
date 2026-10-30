import { describe, expect, it } from "vitest";
import { normalizeRef } from "../src/lib/ref";

describe("normalizeRef", () => {
  it("keeps short lowercase slugs", () => {
    expect(normalizeRef("gdg-pup")).toBe("gdg-pup");
    expect(normalizeRef(" JPCS-Gordon ")).toBe("jpcs-gordon");
  });

  it("drops anything that isn't a short slug", () => {
    expect(normalizeRef("a")).toBeNull();
    expect(normalizeRef("x".repeat(41))).toBeNull();
    expect(normalizeRef("gdg pup")).toBeNull();
    expect(normalizeRef("<script>")).toBeNull();
    expect(normalizeRef(null)).toBeNull();
    expect(normalizeRef(42)).toBeNull();
  });

  it("ignores the reminder tag, which isn't a source", () => {
    expect(normalizeRef("reminder")).toBeNull();
  });
});
