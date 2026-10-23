// Imports data/opportunities.csv into Supabase as draft listings.
// Dry run by default; pass --apply to write.
//   npm run import:opportunities            (preview)
//   npm run import:opportunities -- --apply (write)
//
// Same rules as the admin panel's Import page: new rows → drafts; changed
// drafts → updated (slug kept); published listings → never changed here.
// Use the admin panel to review and apply changes to published listings.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { parseCsv } from "../src/lib/opportunities/csv-import";
import { planImport, type ExistingOpportunity } from "../src/lib/opportunities/import-plan";

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
  const { data: existing, error: oppError } = await supabase.from("opportunities").select("*");
  if (oppError) throw oppError;

  const plan = planImport(parseCsv(readFileSync(csvPath, "utf8")), categories, existing as ExistingOpportunity[]);

  console.log(`Import plan for ${csvPath}`);
  console.log(`  new drafts:              ${plan.inserts.length}`);
  console.log(`  updated drafts:          ${plan.draftUpdates.length}`);
  console.log(`  unchanged:               ${plan.unchanged.length}`);
  console.log(`  published with changes:  ${plan.publishedChanges.length} (review in the admin panel)`);
  console.log(`  skipped (closed):        ${plan.skipped.length}`);
  console.log(`  rejected:                ${plan.rejected.length}`);
  for (const r of plan.rejected) console.log(`    - ${r.externalId}: ${r.reasons.join("; ")}`);
  for (const p of plan.publishedChanges) {
    console.log(`    - ${p.externalId}: ${p.changes.map((c) => c.field).join(", ")}`);
  }

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write.");
    return;
  }

  if (plan.inserts.length > 0) {
    const { error } = await supabase.from("opportunities").insert(plan.inserts);
    if (error) throw error;
  }
  for (const { id, fields } of plan.draftUpdates) {
    const { error } = await supabase.from("opportunities").update(fields).eq("id", id);
    if (error) throw error;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    action: "opportunities.csv_import",
    target_type: "opportunities",
    metadata: {
      file: csvPath,
      via: "script",
      inserted: plan.inserts.length,
      updated: plan.draftUpdates.length,
      published_changes_pending: plan.publishedChanges.length,
      rejected: plan.rejected.length,
    },
  });
  if (auditError) throw auditError;

  console.log("\nImport written.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
