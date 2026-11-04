import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { nextInQueue } = await import("../src/app/admin/queue");

describe("nextInQueue (Publish & next, Skip)", () => {
  it("goes to the item after the current one, wrapping to the start", () => {
    expect(nextInQueue(["a", "b", "c"], "a")).toBe("b");
    expect(nextInQueue(["a", "b", "c"], "c")).toBe("a");
  });
  it("starts at the top when the current item already left the queue", () => {
    expect(nextInQueue(["b", "c"], "a")).toBe("b");
  });
  it("is null when nothing else is left", () => {
    expect(nextInQueue(["a"], "a")).toBeNull();
    expect(nextInQueue([], "a")).toBeNull();
  });
});
