import "server-only";
import { createAdminClient } from "../supabase/admin";

// Turns off reminder emails for the profile that owns this token. Works
// without signing in (links in emails). Returns false for an unknown token.
export async function unsubscribeByToken(token: string): Promise<boolean> {
  if (!/^[0-9a-f]{32}$/.test(token)) return false;
  const { data, error } = await createAdminClient()
    .from("profiles")
    .update({ email_reminders_enabled: false })
    .eq("email_unsubscribe_token", token)
    .select("user_id");
  if (error) throw error;
  return data.length > 0;
}
