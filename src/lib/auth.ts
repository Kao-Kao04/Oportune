import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { createClient } from "./supabase/server";

export type Role = "student" | "curator" | "admin";

export type CurrentUser = { id: string; email: string | null; role: Role };

// The signed-in user and their role, or null. getUser() checks the token with
// Supabase Auth, so it can be trusted for authorization.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  // Auth is always request-time (token expiry checks read the clock).
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  return { id: user.id, email: user.email ?? null, role: (roleRow?.role as Role | undefined) ?? "student" };
});

// For curator/admin pages and actions. Redirects instead of rendering anything.
export async function requireCurator(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/admin");
  if (user.role === "student") redirect("/sign-in?error=not-curator");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireCurator();
  if (user.role !== "admin") redirect("/admin?error=admins-only");
  return user;
}
