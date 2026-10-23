"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SIGN_IN_NEXT_COOKIE } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { status: "idle" | "sent" | "error"; message?: string; email?: string };

function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

// Sends a one-time sign-in link. Students get Google sign-in in M4; for now
// this is how curators and admins sign in.
export async function sendSignInLink(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(formData.get("next"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email address.", email };
  }

  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${base}/?next=${encodeURIComponent(next)}`, shouldCreateUser: true },
  });
  if (error) {
    return {
      status: "error",
      message:
        error.status === 429
          ? "Too many sign-in emails. Wait a few minutes and try again."
          : `Couldn't send the link: ${error.message}`,
      email,
    };
  }

  (await cookies()).set(SIGN_IN_NEXT_COOKIE, next, {
    httpOnly: true,
    sameSite: "lax",
    secure: base.startsWith("https://"),
    maxAge: 60 * 60,
    path: "/",
  });
  return { status: "sent", email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
