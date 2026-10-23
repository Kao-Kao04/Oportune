// Imports data/opportunities.csv into Supabase as draft listings.
// Dry run by default; pass --apply to write.
//   npm run import:opportunities            (preview)
//   npm run import:opportunities -- --apply (write)
//
// New rows → drafts. Existing drafts (matched by external_id) → updated, slug kept.
// Published/expired/archived rows → never changed; listed for the curator instead.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { mapCsvRow, parseCsv, type OpportunityFields } from "../src/lib/opportunities/csv-import";
import { uniqueSlug } from "../src/lib/opportunities/slug";

process.loadEnvFile(".env.local");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local");
  process.exit(1);
}
const apply = process.argv.includes("--apply");
const csvPath = process.argv.find((a) => a.endsWith(".csv")) ?? "data/opportunities.csv";

const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

async function main() {
  const { data: categories, error: catError } = await supabase.from("categories").select("id, name");
  if (catError) throw catError;
  const categoryIds = new Map(categories.map((c) => [c.name, c.id as string]));

  const { data: existing, error: oppError } = await supabase
    .from("opportunities")
    .select("id, external_id, slug, status");
  if (oppError) throw oppError;
  const byExternalId = new Map(existing.filter((o) => o.external_id).map((o) => [o.external_id, o]));
  const takenSlugs = new Set(existing.map((o) => o.slug as string));

  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  const inserts: Record<string, unknown>[] = [];
  const updates: { id: string; fields: Record<string, unknown> }[] = [];
  const untouched: string[] = [];
  const skipped: string[] = [];
  const rejected: string[] = [];

  for (const row of rows) {
    const mapped = mapCsvRow(row, new Set(categoryIds.keys()));
    if (mapped.kind === "skipped") {
      skipped.push(`${mapped.externalId}: ${mapped.reason}`);
      continue;
    }
    if (mapped.kind === "rejected") {
      rejected.push(`${mapped.externalId}: ${mapped.reasons.join("; ")}`);
      continue;
    }

    const { category_name, ...rest }: OpportunityFields = mapped.fields;
    const fields = { ...rest, category_id: categoryIds.get(category_name) };
    const current = byExternalId.get(fields.external_id);

    if (!current) {
      const slug = uniqueSlug(fields.title, takenSlugs);
      takenSlugs.add(slug);
      inserts.push({ ...fields, slug, status: "draft" });
    } else if (current.status === "draft") {
      updates.push({ id: current.id, fields });
    } else {
      untouched.push(`${fields.external_id} (${current.status}): review changes in the admin panel`);
    }
  }

  console.log(`${rows.length} rows in ${csvPath}`);
  console.log(`  new drafts:        ${inserts.length}`);
  console.log(`  updated drafts:    ${updates.length}`);
  console.log(`  published, left:   ${untouched.length}`);
  console.log(`  skipped (closed):  ${skipped.length}`);
  console.log(`  rejected:          ${rejected.length}`);
  for (const line of [...rejected, ...untouched]) console.log(`    - ${line}`);

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write.");
    return;
  }

  if (inserts.length > 0) {
    const { error } = await supabase.from("opportunities").insert(inserts);
    if (error) throw error;
  }
  for (const { id, fields } of updates) {
    const { error } = await supabase.from("opportunities").update(fields).eq("id", id);
    if (error) throw error;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    action: "opportunities.csv_import",
    target_type: "opportunities",
    metadata: {
      file: csvPath,
      inserted: inserts.length,
      updated: updates.length,
      untouched: untouched.length,
      skipped: skipped.length,
      rejected: rejected.length,
    },
  });
  if (auditError) throw auditError;

  console.log("\nImport written.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
