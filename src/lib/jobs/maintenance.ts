import "server-only";
import { revalidateTag } from "next/cache";
import { todayInManila } from "../opportunities/dates";
import { OPPORTUNITIES_TAG } from "../opportunities/queries";
import { createAdminClient } from "../supabase/admin";
import type { JobOutcome } from "./run";

const RECHECK_AFTER_DAYS = 30;

// Daily, just after midnight PH time (§7.2): close listings whose deadline
// passed, and flag rolling/TBA listings nobody has checked for 30 days.
export async function autoExpire(): Promise<JobOutcome> {
  const admin = createAdminClient();
  const today = todayInManila();

  const { data: expired, error } = await admin
    .from("opportunities")
    .update({ status: "expired" })
    .eq("status", "published")
    .eq("deadline_type", "date")
    .lt("deadline", today)
    .select("id");
  if (error) throw error;

  const staleBefore = new Date(Date.now() - RECHECK_AFTER_DAYS * 86_400_000).toISOString();
  const { data: flagged, error: flagError } = await admin
    .from("opportunities")
    .update({ recheck_due: true })
    .eq("status", "published")
    .in("deadline_type", ["rolling", "tba"])
    .eq("recheck_due", false)
    .lt("last_checked_at", staleBefore)
    .select("id");
  if (flagError) throw flagError;

  if (expired.length > 0) revalidateTag(OPPORTUNITIES_TAG, "max");
  return { ok: true, sent: expired.length, details: { expired: expired.length, flaggedForRecheck: flagged.length } };
}

// Daily: drop old rate-limit windows and job history.
export async function cleanup(): Promise<JobOutcome> {
  const admin = createAdminClient();
  const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString();
  const halfYearAgo = new Date(Date.now() - 180 * 86_400_000).toISOString();

  const { error } = await admin.from("rate_limits").delete().lt("window_start", twoDaysAgo);
  if (error) throw error;
  const { error: runsError } = await admin.from("job_runs").delete().lt("started_at", halfYearAgo);
  if (runsError) throw runsError;
  return { ok: true };
}
