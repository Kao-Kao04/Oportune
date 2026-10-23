"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/safe-next";
import { SIGN_IN_NEXT_COOKIE } from "@/lib/supabase/proxy";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { status: "idle" | "sent" | "error"; message?: string; email?: string };

const BASE_URL = () => process.env.APP_BASE_URL ?? "http://localhost:3000";

// The destination survives the round trip in ?next= (if Supabase keeps it)
// and in a short-lived cookie (if it falls back to the Site URL).
async function rememberNext(next: string) {
  (await cookies()).set(SIGN_IN_NEXT_COOKIE, next, {
    httpOnly: true,
    sameSite: "lax",
    secure: BASE_URL().startsWith("https://"),
    maxAge: 60 * 60,
    path: "/",
  });
}

// Sends a one-time sign-in link (curators, admins, and students without Google).
export async function sendSignInLink(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = safeNextPath(formData.get("next"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email address.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${BASE_URL()}/?next=${encodeURIComponent(next)}`, shouldCreateUser: true },
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

  await rememberNext(next);
  return { status: "sent", email };
}

// Google sign-in for students (Supabase Auth → Providers → Google must be on).
export async function signInWithGoogle(formData: FormData) {
  const next = safeNextPath(formData.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${BASE_URL()}/?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) redirect(`/sign-in?error=google&next=${encodeURIComponent(next)}`);
  await rememberNext(next);
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
