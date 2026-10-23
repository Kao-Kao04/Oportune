"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { safeNextPath } from "@/lib/safe-next";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type SaveResult = { saved: boolean; error?: string };

// Save or unsave a listing. Logged-out students are sent to sign in, then
// back to the listing, where the save finishes (?save=1).
export async function toggleSave(_prev: SaveResult, form: FormData): Promise<SaveResult> {
  const opportunityId = String(form.get("opportunity_id") ?? "");
  const back = safeNextPath(form.get("back"), "/");
  const wantSaved = form.get("intent") === "save";

  const user = await getCurrentUser();
  if (!user) {
    const sep = back.includes("?") ? "&" : "?";
    redirect(`/sign-in?next=${encodeURIComponent(`${back}${sep}save=1`)}`);
  }

  const supabase = await createClient();
  if (wantSaved) {
    // RLS only allows saving published listings, for yourself.
    const { error } = await supabase
      .from("saved_opportunities")
      .upsert({ user_id: user.id, opportunity_id: opportunityId }, { onConflict: "user_id,opportunity_id", ignoreDuplicates: true });
    if (error) return { saved: false, error: "Couldn't save this listing." };
    await recordSave(opportunityId);
    return { saved: true };
  }

  const { error } = await supabase
    .from("saved_opportunities")
    .delete()
    .eq("user_id", user.id)
    .eq("opportunity_id", opportunityId);
  if (error) return { saved: true, error: "Couldn't remove it. Try again." };
  return { saved: false };
}

// Save counts for the stats page (not linked to the student).
async function recordSave(opportunityId: string) {
  const { error } = await createAdminClient().from("analytics_events").insert({ event: "save", opportunity_id: opportunityId });
  if (error) console.warn("[events] save not recorded", error.message);
}
