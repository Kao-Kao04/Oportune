// ?ref= tags on shared links (e.g. /?ref=gdg-pup) tell us which campus org
// brought a visitor (docs/validation/06-30-day-validation-sprint.md, H2).
// Anonymous: just a short slug, never a person.

const REF = /^[a-z0-9-]{2,40}$/;

// Reminder links use ?ref=reminder for their own event; it isn't a source.
const RESERVED = new Set(["reminder"]);

export function normalizeRef(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ref = value.trim().toLowerCase();
  return REF.test(ref) && !RESERVED.has(ref) ? ref : null;
}
