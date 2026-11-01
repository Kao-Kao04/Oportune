"use server";

import { redirect } from "next/navigation";
import { requireCurator } from "@/lib/auth";
import { parsePost } from "@/lib/opportunities/post-text";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { audit } from "../audit";

// Paste-to-draft: the pasted post goes into the submissions queue as the
// curator's own submission, then opens the new-listing form pre-filled from
// it (same path as student submissions).
export async function pasteToDraft(form: FormData) {
  const user = await requireCurator();
  const text = String(form.get("text") ?? "").trim();
  const parsed = parsePost(text, new Date(), String(form.get("url") ?? "").trim() || null);
  const url = parsed.postUrl ?? parsed.applicationUrl;
  if (!url) redirect("/admin/paste?error=link");

  // Submissions are written by the server only (RLS has no insert policy).
  const { data, error } = await createAdminClient()
    .from("opportunity_submissions")
    .insert({
      user_id: user.id,
      url,
      title: parsed.title,
      deadline: parsed.deadline,
      note: text.slice(0, 1000) || null,
      submitter_role: "other",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await audit(await createClient(), user, "submission.paste", { type: "submission", id: data.id });
  redirect(`/admin/opportunities/new?from=${data.id}`);
}
