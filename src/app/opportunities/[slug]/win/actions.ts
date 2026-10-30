"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UNDER_18_MESSAGE } from "@/lib/profile";
import { allowRequest, verifyCaptcha } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseWin } from "@/lib/wins";

export type WinState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

// A signed-in, 18+ student tells us their team joined or won. Inserted with
// the secret key after a captcha and a per-account daily limit; a curator
// writes the public headline.
export async function submitWin(_prev: WinState, form: FormData): Promise<WinState> {
  const slug = String(form.get("slug") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/opportunities/${slug}/win`)}`);

  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) if (typeof value === "string") values[key] = value;
  try {
    return { ...(await send(form, user.id)), values };
  } catch (error) {
    console.error("submitWin failed", error);
    return { status: "error", message: "Couldn't send it. Try again later.", values };
  }
}

async function send(form: FormData, userId: string): Promise<WinState> {
  // Bots fill every field; people never see this one.
  if (form.get("website")) return { status: "sent" };

  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("is_18_or_over").eq("user_id", userId).maybeSingle();
  if (profile?.is_18_or_over !== true) return { status: "error", message: UNDER_18_MESSAGE };

  const parsed = parseWin(form);
  if (!parsed.ok) return { status: "error", errors: parsed.errors, message: "Check the highlighted fields." };

  const opportunityId = String(form.get("opportunity_id") ?? "");
  const { data: listing } = await supabase.from("public_opportunities").select("id").eq("id", opportunityId).maybeSingle();
  if (!listing) return { status: "error", message: "This listing isn't available any more." };

  if (!(await verifyCaptcha(form.get("cf-turnstile-response") as string | null))) {
    return { status: "error", message: "Couldn't verify you're human. Try again." };
  }
  if (!(await allowRequest(`win:${userId}`, 5, 24 * 60 * 60))) {
    return { status: "error", message: "You've sent 5 today. Salamat! Try again tomorrow." };
  }

  const { error } = await createAdminClient()
    .from("opportunity_wins")
    .insert({ ...parsed.fields, opportunity_id: opportunityId, user_id: userId });
  if (error) throw error;
  return { status: "sent" };
}
