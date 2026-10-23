import "server-only";
import { daysBetween, formatLongDate, todayInManila } from "../opportunities/dates";
import {
  emailConfigured,
  pushConfigured,
  sendReminderEmail,
  sendReminderPush,
  type DeliveryResult,
  type ReminderContent,
} from "../reminders/deliver";
import { planReminders, reminderSubject, reminderTargets, runDates, type PlannedReminder } from "../reminders/plan";
import { createAdminClient } from "../supabase/admin";
import type { JobOutcome } from "./run";

// Stop before the function time limit; whatever is left runs next time
// (this run is marked failed, so the next run covers the same dates again,
// and the dedup keys skip what was already sent).
const TIME_BUDGET_MS = 45_000;

export async function sendReminders(): Promise<JobOutcome> {
  const started = Date.now();
  const admin = createAdminClient();
  const today = todayInManila();
  const channels = { email: emailConfigured(), push: pushConfigured() };

  const { data: lastOk } = await admin
    .from("job_runs")
    .select("run_for_date")
    .eq("job", "send_reminders")
    .eq("status", "ok")
    .order("run_for_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const targets = reminderTargets(runDates(today, lastOk?.run_for_date ?? null), today);
  const deadlines = [...new Set(targets.map((t) => t.deadline))];

  // Re-read the listing now, so a changed or unpublished listing is never reminded.
  const { data: listings, error: listError } = await admin
    .from("opportunities")
    .select("id, slug, title, organization, deadline")
    .eq("status", "published")
    .eq("deadline_type", "date")
    .in("deadline", deadlines);
  if (listError) throw listError;
  if (listings.length === 0) return { ok: true, sent: 0, details: { targets, channels, planned: 0 } };
  const listingById = new Map(listings.map((l) => [l.id, l]));

  const { data: saved, error: savedError } = await admin
    .from("saved_opportunities")
    .select("user_id, opportunity_id")
    .in("opportunity_id", [...listingById.keys()]);
  if (savedError) throw savedError;
  const userIds = [...new Set(saved.map((s) => s.user_id))];
  if (userIds.length === 0) return { ok: true, sent: 0, details: { targets, channels, planned: 0 } };

  const [{ data: profiles, error: profileError }, { data: subs, error: subsError }] = await Promise.all([
    admin
      .from("profiles")
      .select("user_id, email_reminders_enabled, push_reminders_enabled, email_unsubscribe_token")
      .in("user_id", userIds),
    admin.from("push_subscriptions").select("id, user_id, endpoint, p256dh, auth").in("user_id", userIds),
  ]);
  if (profileError) throw profileError;
  if (subsError) throw subsError;
  const profileByUser = new Map(profiles.map((p) => [p.user_id, p]));
  const subsByUser = new Map<string, typeof subs>();
  for (const s of subs) subsByUser.set(s.user_id, [...(subsByUser.get(s.user_id) ?? []), s]);

  const planned = planReminders(
    targets,
    saved.flatMap((s) => {
      const profile = profileByUser.get(s.user_id);
      const listing = listingById.get(s.opportunity_id);
      if (!profile || !listing?.deadline) return [];
      return [
        {
          userId: s.user_id,
          opportunityId: s.opportunity_id,
          deadline: listing.deadline,
          emailEnabled: profile.email_reminders_enabled,
          pushEnabled: profile.push_reminders_enabled,
          hasPushSubscription: (subsByUser.get(s.user_id)?.length ?? 0) > 0,
        },
      ];
    }),
    channels,
  );

  const emails = new Map<string, string | null>();
  async function emailFor(userId: string) {
    if (!emails.has(userId)) {
      const { data } = await admin.auth.admin.getUserById(userId);
      emails.set(userId, data.user?.email ?? null);
    }
    return emails.get(userId) ?? null;
  }

  async function deliver(r: PlannedReminder): Promise<DeliveryResult> {
    const listing = listingById.get(r.opportunityId)!;
    const daysLeft = daysBetween(today, listing.deadline!);
    const content: ReminderContent = {
      title: listing.title,
      organization: listing.organization,
      subject: reminderSubject(r.type, daysLeft, listing.title),
      deadlineText: `Deadline: ${formatLongDate(listing.deadline!)}`,
      path: `/opportunities/${listing.slug}?ref=reminder`,
    };

    if (r.channel === "email") {
      const to = await emailFor(r.userId);
      const token = profileByUser.get(r.userId)?.email_unsubscribe_token;
      if (!to || !token) return { ok: false, error: "no email address" };
      return sendReminderEmail(to, token, content);
    }

    let delivered = false;
    let lastError = "no push subscriptions";
    for (const sub of subsByUser.get(r.userId) ?? []) {
      const result = await sendReminderPush(sub, content);
      if (result.ok) delivered = true;
      else {
        lastError = result.error;
        if (result.gone) await admin.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
    return delivered ? { ok: true } : { ok: false, error: lastError };
  }

  let sent = 0;
  let failed = 0;
  let skippedAsDuplicate = 0;
  let outOfTime = false;

  for (const r of planned) {
    if (Date.now() - started > TIME_BUDGET_MS) {
      outOfTime = true;
      break;
    }

    // Claim the reminder first; the unique key makes a second run a no-op.
    const { data: claimed, error: claimError } = await admin
      .from("notifications")
      .upsert(
        {
          user_id: r.userId,
          opportunity_id: r.opportunityId,
          channel: r.channel,
          type: r.type,
          deadline_on: r.deadline,
          delivery_status: "failed",
          deduplication_key: r.deduplicationKey,
        },
        { onConflict: "deduplication_key", ignoreDuplicates: true },
      )
      .select("id");
    if (claimError) throw claimError;

    let rowId = claimed[0]?.id as string | undefined;
    if (!rowId) {
      // Already claimed. Retry once if the earlier attempt failed.
      const { data: existing } = await admin
        .from("notifications")
        .select("id, delivery_status, sent_at")
        .eq("deduplication_key", r.deduplicationKey)
        .single();
      if (!existing || existing.delivery_status !== "failed") {
        skippedAsDuplicate++;
        continue;
      }
      rowId = existing.id;
      const result = await deliver(r);
      await admin
        .from("notifications")
        .update(result.ok ? { delivery_status: "sent", sent_at: new Date().toISOString() } : { delivery_status: "skipped" })
        .eq("id", rowId);
      if (result.ok) sent++;
      else failed++;
      continue;
    }

    const result = await deliver(r);
    if (result.ok) {
      await admin.from("notifications").update({ delivery_status: "sent", sent_at: new Date().toISOString() }).eq("id", rowId);
      sent++;
    } else {
      failed++;
      console.warn(`[reminders] ${r.channel} failed for ${r.opportunityId}: ${result.error}`);
    }
  }

  return {
    ok: !outOfTime,
    sent,
    failed,
    error: outOfTime ? "Stopped at the time budget; the rest runs next time." : undefined,
    details: { targets, channels, planned: planned.length, skippedAsDuplicate },
  };
}
