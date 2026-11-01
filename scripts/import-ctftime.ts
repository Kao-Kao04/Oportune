// Imports upcoming online CTFs from CTFtime's public API as draft listings
// marked "needs check" (same rules as the spreadsheet import).
// Dry run by default; pass --apply to write.
//   npm run import:ctftime            (preview)
//   npm run import:ctftime -- --apply (write)
// Curators can do the same from Admin → Import → "Fetch upcoming CTFs".
import { createClient } from "@supabase/supabase-js";
import { ctftimeToRows, fetchCtftimeEvents } from "../src/lib/opportunities/ctftime";
import { planImport, type ExistingOpportunity } from "../src/lib/opportunities/import-plan";

process.loadEnvFile(".env.local");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local");
  process.exit(1);
}
const apply = process.argv.includes("--apply");
const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

async function main() {
  const [{ data: categories, error: catError }, { data: existing, error: oppError }] = await Promise.all([
    supabase.from("categories").select("id, name"),
    supabase.from("opportunities").select("*"),
  ]);
  if (catError) throw catError;
  if (oppError) throw oppError;

  const now = new Date();
  const events = await fetchCtftimeEvents(now);
  const others = existing.filter((o) => !o.external_id?.startsWith("CTFTIME-"));
  const rows = ctftimeToRows(events, now, {
    titles: others.map((o) => o.title),
    urls: others.flatMap((o) => [o.source_url, o.application_url].filter((u): u is string => Boolean(u))),
  });
  const plan = planImport(rows, categories, existing as ExistingOpportunity[]);

  console.log(`CTFtime: ${events.length} events in the next 90 days, ${rows.length} online open/academic and new to us`);
  console.log(`  new drafts:     ${plan.inserts.length}`);
  console.log(`  updated drafts: ${plan.draftUpdates.length}`);
  console.log(`  unchanged:      ${plan.unchanged.length}`);
  console.log(`  published (not touched): ${plan.publishedChanges.length}`);
  console.log(`  rejected:       ${plan.rejected.length}`);
  for (const r of plan.rejected) console.log(`    - ${r.externalId}: ${r.reasons.join("; ")}`);
  for (const r of plan.inserts) console.log(`    + ${r.deadline} ${r.title}`);

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
    action: "opportunities.ctftime_import",
    target_type: "opportunities",
    metadata: { via: "script", fetched: events.length, inserted: plan.inserts.length, updated: plan.draftUpdates.length },
  });
  if (auditError) throw auditError;
  console.log("\nImport written.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
