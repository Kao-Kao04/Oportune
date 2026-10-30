"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { todayInManila } from "@/lib/opportunities/dates";
import { allowRequest, verifyCaptcha } from "@/lib/rate-limit";
import { parseSubmission } from "@/lib/submissions";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubmitState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

// Signed-in students send a link for curators to check. Inserted with the
// secret key after a captcha and a per-account daily limit.
export async function submitOpportunity(_prev: SubmitState, form: FormData): Promise<SubmitState> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/submit");

  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) if (typeof value === "string") values[key] = value;
  try {
    return { ...(await send(form, user.id)), values };
  } catch (error) {
    console.error("submitOpportunity failed", error);
    return { status: "error", message: "Couldn't send it. Try again later.", values };
  }
}

async function send(form: FormData, userId: string): Promise<SubmitState> {
  // Bots fill every field; people never see this one.
  if (form.get("website")) return { status: "sent" };

  const parsed = parseSubmission(form, todayInManila());
  if (!parsed.ok) return { status: "error", errors: parsed.errors, message: "Check the highlighted fields." };

  if (!(await verifyCaptcha(form.get("cf-turnstile-response") as string | null))) {
    return { status: "error", message: "Couldn't verify you're human. Try again." };
  }
  if (!(await allowRequest(`submit:${userId}`, 10, 24 * 60 * 60))) {
    return { status: "error", message: "You've sent 10 today. Salamat! Try again tomorrow." };
  }

  const { error } = await createAdminClient()
    .from("opportunity_submissions")
    .insert({ ...parsed.fields, user_id: userId });
  if (error) throw error;
  return { status: "sent" };
}
