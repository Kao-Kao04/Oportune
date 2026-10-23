"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function updateReminderSettings(form: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/me");

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      email_reminders_enabled: form.get("email_reminders_enabled") === "on",
      push_reminders_enabled: form.get("push_reminders_enabled") === "on",
    })
    .eq("user_id", user.id);
  if (error) throw new Error("Couldn't save your reminder settings.");
  redirect("/me?saved=reminders");
}

// Deletes the account and everything tied to it (Data Privacy Act). Every
// foreign key to the user cascades or is set to null, so one delete is enough.
export async function deleteAccount(form: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (form.get("confirm") !== "DELETE") redirect("/me/delete?error=confirm");
  if (user.role !== "student") redirect("/me/delete?error=staff");

  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) throw new Error("Couldn't delete your account. Try again or contact us.");

  // The session is already invalid; clear its cookies on this device.
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/me/deleted");
}
