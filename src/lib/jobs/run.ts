import "server-only";
import { timingSafeEqual } from "node:crypto";
import { todayInManila } from "../opportunities/dates";
import { createAdminClient } from "../supabase/admin";

export type JobName = "auto_expire" | "send_reminders" | "cleanup";

// Vercel Cron sends "Authorization: Bearer <CRON_SECRET>".
export function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  return given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

export type JobOutcome = { ok: boolean; sent?: number; failed?: number; error?: string; details?: Record<string, unknown> };

// Records the run in job_runs (for catch-up and failure alerts) and turns
// the outcome into a response.
export async function runJob(job: JobName, work: (runForDate: string) => Promise<JobOutcome>): Promise<Response> {
  const admin = createAdminClient();
  const runForDate = todayInManila();
  const { data: run, error } = await admin
    .from("job_runs")
    .insert({ job, run_for_date: runForDate })
    .select("id")
    .single();
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

  let outcome: JobOutcome;
  try {
    outcome = await work(runForDate);
  } catch (e) {
    outcome = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  await admin
    .from("job_runs")
    .update({
      finished_at: new Date().toISOString(),
      status: outcome.ok ? "ok" : "failed",
      sent_count: outcome.sent ?? 0,
      failed_count: outcome.failed ?? 0,
      error: outcome.error?.slice(0, 1000) ?? null,
    })
    .eq("id", run.id);

  // Two failures in a row: log loudly so error tracking (M6) alerts someone.
  if (!outcome.ok) {
    const { data: recent } = await admin
      .from("job_runs")
      .select("status")
      .eq("job", job)
      .order("started_at", { ascending: false })
      .limit(2);
    if (recent?.length === 2 && recent.every((r) => r.status === "failed")) {
      console.error(`[jobs] ${job} failed twice in a row: ${outcome.error}`);
    }
  }

  return Response.json({ job, runForDate, ...outcome }, { status: outcome.ok ? 200 : 500 });
}
