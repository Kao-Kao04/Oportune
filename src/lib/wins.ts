// "Wins on listings" (docs/research/final-decisions.md §1e): a team, org, or
// school tells us they joined or won something we listed. A curator checks it
// and writes the one-line headline the public sees. Not a social feed.

export const WIN_RESULTS = [
  { value: "won", label: "We won", emoji: "🏆" },
  { value: "placed", label: "We placed (2nd, 3rd, special award)", emoji: "🥈" },
  { value: "finalist", label: "We made the finals", emoji: "⭐" },
  { value: "joined", label: "We joined", emoji: "🙌" },
] as const;

export type WinResult = (typeof WIN_RESULTS)[number]["value"];

export const WIN_STATUSES = ["new", "published", "rejected"] as const;
export type WinStatus = (typeof WIN_STATUSES)[number];

export const WIN_STATUS_LABELS: Record<WinStatus, string> = {
  new: "Waiting for review",
  published: "On the listing",
  rejected: "Not added",
};

export function winEmoji(result: string): string {
  return WIN_RESULTS.find((r) => r.value === result)?.emoji ?? "🏆";
}

export type WinFields = {
  result: WinResult;
  team: string;
  detail: string | null;
  proof_url: string | null;
  consent: true;
};

export type WinFormResult = { ok: true; fields: WinFields } | { ok: false; errors: Record<string, string> };

function text(form: FormData, name: string, max: number): string | null {
  const value = form.get(name);
  if (typeof value !== "string") return null;
  return value.trim().slice(0, max) || null;
}

export function parseWin(form: FormData): WinFormResult {
  const errors: Record<string, string> = {};

  const result = text(form, "result", 20) ?? "";
  if (!WIN_RESULTS.some((r) => r.value === result)) errors.result = "Pick what happened.";

  const team = text(form, "team", 120) ?? "";
  if (team.length < 2) errors.team = "Type your team, org, or school name.";

  let proofUrl: string | null = null;
  const rawProof = text(form, "proof_url", 2000);
  if (rawProof) {
    try {
      const parsed = new URL(/^https?:\/\//i.test(rawProof) ? rawProof : `https://${rawProof}`);
      if (parsed.protocol === "http:") parsed.protocol = "https:";
      if (!parsed.hostname.includes(".")) throw new Error("no host");
      proofUrl = parsed.toString();
    } catch {
      errors.proof_url = "Paste a working link, or leave it empty.";
    }
  }

  if (form.get("consent") !== "on") {
    errors.consent = "We can only post it if everyone named agreed (and a parent, for anyone under 18).";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    fields: {
      result: result as WinResult,
      team,
      detail: text(form, "detail", 300),
      proof_url: proofUrl,
      consent: true,
    },
  };
}

// A starting point for the curator's headline; they edit it before publishing.
export function suggestHeadline(win: { result: string; team: string; detail: string | null }): string {
  const verb: Record<string, string> = {
    won: "won",
    placed: "placed",
    finalist: "made the finals",
    joined: "joined",
  };
  const base = `${win.team} ${verb[win.result] ?? "joined"}`;
  const withDetail = win.detail ? `${base}: ${win.detail}` : base;
  return withDetail.slice(0, 140);
}
