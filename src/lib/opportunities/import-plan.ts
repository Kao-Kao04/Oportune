import { mapCsvRow, type CsvRow, type OpportunityFields } from "./csv-import";
import { uniqueSlug } from "./slug";

// Decides what a CSV import does (docs/system-design/04-api-and-logic.md §7.5):
// new rows → drafts; matching drafts → updated (slug kept); matching
// published/expired rows → never changed silently, shown as a diff instead.

export type DbFields = Omit<OpportunityFields, "category_name"> & { category_id: string };

export type ExistingOpportunity = DbFields & { id: string; slug: string; status: string };

export type FieldChange = { field: keyof DbFields; from: string; to: string };

export type ImportPlan = {
  inserts: (DbFields & { slug: string; status: "draft" })[];
  draftUpdates: { id: string; externalId: string; title: string; fields: DbFields }[];
  publishedChanges: {
    id: string;
    externalId: string;
    title: string;
    status: string;
    changes: FieldChange[];
    fields: DbFields;
  }[];
  unchanged: string[];
  skipped: string[];
  rejected: { externalId: string; reasons: string[] }[];
};

// Fields compared for published listings, in the order curators see them.
export const DIFF_FIELDS: (keyof DbFields)[] = [
  "title",
  "organization",
  "category_id",
  "summary",
  "eligibility",
  "requirements",
  "location",
  "delivery_mode",
  "application_opens",
  "application_opens_type",
  "deadline",
  "deadline_type",
  "source_url",
  "source_trust",
  "confidence",
  "needs_check",
  "notes",
  "last_checked_at",
];

function comparable(field: keyof DbFields, value: unknown): string {
  if (value === null || value === undefined) return "";
  // Timestamps compare by Philippine calendar date (the CSV only has dates).
  if (field === "last_checked_at") {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date(String(value)));
  }
  return String(value);
}

export function planImport(
  rows: CsvRow[],
  categories: { id: string; name: string }[],
  existing: ExistingOpportunity[],
): ImportPlan {
  const categoryIds = new Map(categories.map((c) => [c.name, c.id]));
  const byExternalId = new Map(existing.filter((o) => o.external_id).map((o) => [o.external_id, o]));
  const byUrlAndTitle = new Map(existing.map((o) => [`${o.source_url}\n${o.title}`, o]));
  const takenSlugs = new Set(existing.map((o) => o.slug));
  const seen = new Set<string>();

  const plan: ImportPlan = {
    inserts: [],
    draftUpdates: [],
    publishedChanges: [],
    unchanged: [],
    skipped: [],
    rejected: [],
  };

  for (const row of rows) {
    const mapped = mapCsvRow(row, new Set(categoryIds.keys()));
    if (mapped.kind === "skipped") {
      plan.skipped.push(`${mapped.externalId}: ${mapped.reason}`);
      continue;
    }
    if (mapped.kind === "rejected") {
      plan.rejected.push({ externalId: mapped.externalId, reasons: mapped.reasons });
      continue;
    }

    const { category_name, ...rest } = mapped.fields;
    const fields: DbFields = { ...rest, category_id: categoryIds.get(category_name)! };
    if (seen.has(fields.external_id)) {
      plan.rejected.push({ externalId: fields.external_id, reasons: ["duplicate id in this file"] });
      continue;
    }
    seen.add(fields.external_id);

    const current = byExternalId.get(fields.external_id) ?? byUrlAndTitle.get(`${fields.source_url}\n${fields.title}`);
    if (!current) {
      const slug = uniqueSlug(fields.title, takenSlugs);
      takenSlugs.add(slug);
      plan.inserts.push({ ...fields, slug, status: "draft" });
      continue;
    }

    const changes = DIFF_FIELDS.filter((f) => comparable(f, current[f]) !== comparable(f, fields[f])).map((f) => ({
      field: f,
      from: comparable(f, current[f]),
      to: comparable(f, fields[f]),
    }));

    if (current.status === "draft") {
      if (changes.length === 0) plan.unchanged.push(fields.external_id);
      else plan.draftUpdates.push({ id: current.id, externalId: fields.external_id, title: fields.title, fields });
      continue;
    }

    // A published listing can't be flagged needs-check (the database blocks
    // it); curators unpublish it in the admin panel instead.
    const publishedChanges = changes.filter((c) => c.field !== "needs_check");
    if (publishedChanges.length === 0) plan.unchanged.push(fields.external_id);
    else {
      plan.publishedChanges.push({
        id: current.id,
        externalId: fields.external_id,
        title: current.title,
        status: current.status,
        changes: publishedChanges,
        fields,
      });
    }
  }

  return plan;
}

// Fields that must change together (database checks tie them), so picking
// either one applies both.
const LINKED: Partial<Record<keyof DbFields, (keyof DbFields)[]>> = {
  deadline: ["deadline", "deadline_type"],
  deadline_type: ["deadline", "deadline_type"],
  application_opens: ["application_opens", "application_opens_type"],
  application_opens_type: ["application_opens", "application_opens_type"],
  source_url: ["source_url", "source_trust"],
};

// The update for a published listing from the fields a curator ticked.
export function selectedUpdate(fields: DbFields, picked: (keyof DbFields)[]): Partial<DbFields> {
  const update: Partial<DbFields> = {};
  for (const field of picked) {
    for (const f of LINKED[field] ?? [field]) (update as Record<string, unknown>)[f] = fields[f];
  }
  return update;
}
