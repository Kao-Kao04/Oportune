// Publishes draft listings that are ready: needs_check is off and the
// required fields are filled. A draft whose deadline already passed
// (Philippine time) becomes "expired" instead, so its page shows "Closed".
// Dry run by default; pass --apply to write.
//   npm run publish:drafts
//   npm run publish:drafts -- --apply
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local");
  process.exit(1);
}
const apply = process.argv.includes("--apply");
const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

// YYYY-MM-DD in Asia/Manila.
const todayPh = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());

async function main() {
  const { data: drafts, error } = await supabase
    .from("opportunities")
    .select("id, external_id, title, deadline, deadline_type, last_checked_at, needs_check")
    .eq("status", "draft");
  if (error) throw error;

  const publish: string[] = [];
  const expire: string[] = [];
  const held: string[] = [];

  for (const d of drafts) {
    if (d.needs_check) {
      held.push(`${d.external_id}: needs check`);
    } else if (!d.last_checked_at) {
      held.push(`${d.external_id}: no last-checked date`);
    } else if (d.deadline_type === "date" && d.deadline < todayPh) {
      expire.push(d.id);
    } else {
      publish.push(d.id);
    }
  }

  console.log(`Today (PH): ${todayPh}. ${drafts.length} drafts.`);
  console.log(`  publish: ${publish.length}`);
  console.log(`  expire (deadline passed): ${expire.length}`);
  console.log(`  held back: ${held.length}`);

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to write.");
    return;
  }

  for (const [ids, status] of [
    [publish, "published"],
    [expire, "expired"],
  ] as const) {
    if (ids.length === 0) continue;
    const { error: updateError } = await supabase.from("opportunities").update({ status }).in("id", ids);
    if (updateError) throw updateError;
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    action: "opportunities.bulk_publish",
    target_type: "opportunities",
    metadata: { published: publish.length, expired: expire.length, held: held.length, today_ph: todayPh },
  });
  if (auditError) throw auditError;

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
