"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { parseProfileForm } from "@/lib/profile";
import { safeNextPath } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { errors?: Record<string, string>; message?: string };

export async function saveProfile(_prev: ProfileState, form: FormData): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  const next = safeNextPath(form.get("next"), "/");

  const supabase = await createClient();
  const { data: categories, error: catError } = await supabase.from("categories").select("slug");
  if (catError) return { message: "Couldn't save. Try again." };

  const parsed = parseProfileForm(form, new Set(categories.map((c) => c.slug)));
  if (!parsed.ok) return { errors: parsed.errors };

  // RLS limits this to the student's own row and the quick-profile columns.
  const { error } = await supabase.from("profiles").update(parsed.fields).eq("user_id", user.id);
  if (error) return { message: "Couldn't save. Try again." };
  redirect(next);
}
