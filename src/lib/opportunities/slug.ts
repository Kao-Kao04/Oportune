const MAX_LENGTH = 80;

// URL slug for a listing. Made once and never changed after publishing,
// so shared links keep working (docs/system-design/03-data-model.md).
export function slugify(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // ñ → n, ü → u
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_LENGTH)
    .replace(/-+$/, "");
  return slug || "listing";
}

// Appends -2, -3, … until the slug isn't in `taken`.
export function uniqueSlug(title: string, taken: Set<string>): string {
  const base = slugify(title);
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base.slice(0, MAX_LENGTH - String(n).length - 1)}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
