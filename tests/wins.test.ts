import { describe, expect, it } from "vitest";
import { parseWin, suggestHeadline } from "../src/lib/wins";

const form = (values: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(values)) f.append(k, v);
  return f;
};

describe("parseWin", () => {
  it("parses a win and normalizes the announcement link", () => {
    const result = parseWin(
      form({ result: "placed", team: " JPCS Gordon College ", detail: "2nd place, regionals", proof_url: "facebook.com/gc/posts/1", consent: "on" }),
    );
    expect(result).toEqual({
      ok: true,
      fields: {
        result: "placed",
        team: "JPCS Gordon College",
        detail: "2nd place, regionals",
        proof_url: "https://facebook.com/gc/posts/1",
        consent: true,
      },
    });
  });

  it("requires a result, a team name, and consent", () => {
    const result = parseWin(form({ result: "bragging", team: "x" }));
    expect(result.ok ? [] : Object.keys(result.errors).sort()).toEqual(["consent", "result", "team"]);
  });

  it("rejects a link it can't read, but the link is optional", () => {
    expect(parseWin(form({ result: "won", team: "Team A", proof_url: "not a link", consent: "on" })).ok).toBe(false);
    expect(parseWin(form({ result: "joined", team: "Team A", consent: "on" })).ok).toBe(true);
  });
});

describe("suggestHeadline", () => {
  it("writes a starting headline the curator can edit", () => {
    expect(suggestHeadline({ result: "finalist", team: "Team A", detail: null })).toBe("Team A made the finals");
    expect(suggestHeadline({ result: "won", team: "Team A", detail: "1st place" })).toBe("Team A won: 1st place");
  });

  it("keeps headlines within 140 characters", () => {
    expect(suggestHeadline({ result: "won", team: "T", detail: "x".repeat(300) }).length).toBe(140);
  });
});
