"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { audit } from "../audit";

// user_roles has no write policies, so role changes go through the secret key
// after this admin check (docs/system-design/03-data-model.md).

async function findUserIdByEmail(email: string): Promise<string | null> {
  const admin = createAdminClient();
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match.id;
    if (data.users.length < 200) return null;
  }
  return null;
}

export async function grantRole(form: FormData) {
  const user = await requireAdmin();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const role = form.get("role") === "admin" ? "admin" : "curator";

  const userId = await findUserIdByEmail(email);
  if (!userId) redirect(`/admin/roles?error=${encodeURIComponent("No account with that email. Ask them to sign in once first.")}`);

  const { error } = await createAdminClient()
    .from("user_roles")
    .upsert({ user_id: userId, role, granted_by: user.id });
  if (error) throw new Error(error.message);

  await audit(await createClient(), user, "role.grant", { type: "user", id: userId }, { role });
  redirect("/admin/roles?saved=1");
}

export async function removeRole(form: FormData) {
  const user = await requireAdmin();
  const userId = String(form.get("user_id") ?? "");
  if (userId === user.id) redirect(`/admin/roles?error=${encodeURIComponent("You can't remove your own role.")}`);

  const { error } = await createAdminClient().from("user_roles").delete().eq("user_id", userId);
  if (error) throw new Error(error.message);

  await audit(await createClient(), user, "role.remove", { type: "user", id: userId });
  redirect("/admin/roles?saved=1");
}
