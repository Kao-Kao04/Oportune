// "Submit an opportunity": a signed-in student or organizer sends a link.
// Curators check the official source before anything is published.

export const SUBMITTER_ROLES = [
  { value: "student", label: "I'm a student who saw this" },
  { value: "organizer", label: "I'm from the organizing group or company" },
  { value: "school", label: "I'm from a school office" },
  { value: "other", label: "Other" },
] as const;

export const SUBMISSION_STATUSES = ["new", "added", "duplicate", "rejected"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: "Waiting for review",
  added: "Added",
  duplicate: "Already listed",
  rejected: "Not added",
};

export type SubmissionFields = {
  url: string;
  title: string | null;
  organization: string | null;
  deadline: string | null;
  note: string | null;
  submitter_role: (typeof SUBMITTER_ROLES)[number]["value"];
};

export type SubmissionResult = { ok: true; fields: SubmissionFields } | { ok: false; errors: Record<string, string> };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function text(form: FormData, name: string, max: number): string | null {
  const value = form.get(name);
  if (typeof value !== "string") return null;
  return value.trim().slice(0, max) || null;
}

// Links to posts on social media are fine: curators trace them to the
// official source.
export function parseSubmission(form: FormData, today: string): SubmissionResult {
  const errors: Record<string, string> = {};
  const rawUrl = text(form, "url", 2000) ?? "";
  let url = "";
  try {
    const parsed = new URL(/^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
    if (parsed.protocol === "http:") parsed.protocol = "https:";
    if (!parsed.hostname.includes(".")) throw new Error("no host");
    url = parsed.toString();
  } catch {
    errors.url = "Paste the link to the opportunity (e.g. the official page or the post).";
  }

  const deadline = text(form, "deadline", 10);
  if (deadline && (!DATE.test(deadline) || deadline < today)) errors.deadline = "Pick a deadline that hasn't passed, or leave it empty.";

  const role = text(form, "submitter_role", 20) ?? "student";
  if (!SUBMITTER_ROLES.some((r) => r.value === role)) errors.submitter_role = "Pick one.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    fields: {
      url,
      title: text(form, "title", 200),
      organization: text(form, "organization", 200),
      deadline,
      note: text(form, "note", 1000),
      submitter_role: role as SubmissionFields["submitter_role"],
    },
  };
}
