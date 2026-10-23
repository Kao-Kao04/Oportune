"use server";

import { allowRequest, hashedClientIp, verifyCaptcha } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ReportState = { status: "idle" | "sent" | "error"; message?: string };

const REASONS = ["wrong_info", "expired", "scam", "other"] as const;

// Students (signed in or not) report a listing. Inserted with the secret key
// after a rate limit and captcha check; reports are only readable by curators.
export async function reportListing(_prev: ReportState, form: FormData): Promise<ReportState> {
  try {
    return await sendReport(form);
  } catch (error) {
    console.error("reportListing failed", error);
    return { status: "error", message: "Couldn't send the report. Try again later." };
  }
}

async function sendReport(form: FormData): Promise<ReportState> {
  // Bots fill every field; people never see this one.
  if (form.get("website")) return { status: "sent" };

  const opportunityId = String(form.get("opportunity_id") ?? "");
  const reason = String(form.get("reason") ?? "");
  const details = String(form.get("details") ?? "").trim().slice(0, 1000) || null;
  if (!REASONS.includes(reason as (typeof REASONS)[number])) {
    return { status: "error", message: "Pick what's wrong." };
  }

  if (!(await verifyCaptcha(form.get("cf-turnstile-response") as string | null))) {
    return { status: "error", message: "Couldn't verify you're human. Try again." };
  }
  const ip = await hashedClientIp();
  if (!(await allowRequest(`report:${ip}`, 5, 60 * 60))) {
    return { status: "error", message: "Too many reports from this connection. Try again in an hour." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: listing } = await admin
    .from("public_opportunities")
    .select("id")
    .eq("id", opportunityId)
    .maybeSingle();
  if (!listing) return { status: "error", message: "That listing isn't available anymore." };

  const { error } = await admin.from("opportunity_reports").insert({
    opportunity_id: opportunityId,
    user_id: user?.id ?? null,
    reason,
    details,
  });
  if (error) return { status: "error", message: "Couldn't send the report. Try again." };
  return { status: "sent" };
}
