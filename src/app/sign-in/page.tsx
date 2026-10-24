import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getEnabledProviders } from "@/lib/auth-providers";
import { safeNextPath } from "@/lib/safe-next";
import { signInWithGoogle } from "./actions";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const ERRORS: Record<string, string> = {
  "link-expired": "That sign-in link expired or was already used. Try again.",
  "not-curator": "Your account doesn't have curator access. Ask an admin to add you.",
  google: "Google sign-in isn't available right now. Use the email link instead.",
};

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <main className="px-4 py-10">
      <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">Sign in</h1>
      <p className="mt-1 text-muted">Save opportunities and get reminded before deadlines. Free, no password.</p>
      <Suspense fallback={null}>
        {Promise.all([searchParams, getEnabledProviders()]).then(([params, providers]) => {
          const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
          // After signing in, students finish the quick profile first if needed.
          const next = safeNextPath(params.next, "/");
          const afterSignIn = next.startsWith("/admin") ? next : `/welcome?next=${encodeURIComponent(next)}`;
          return (
            <div className="mt-6 flex flex-col gap-6">
              {error && (
                <p role="alert" className="rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
                  {error}
                </p>
              )}
              {/* Shown once Google is switched on in Supabase → Authentication → Providers. */}
              {providers.google && (
                <>
                  <form action={signInWithGoogle}>
                    <input type="hidden" name="next" value={afterSignIn} />
                    <button
                      type="submit"
                      className="btn-plain press w-full gap-3"
                    >
                      <GoogleIcon />
                      Continue with Google
                    </button>
                  </form>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="h-px flex-1 bg-line" /> or get a link by email <span className="h-px flex-1 bg-line" />
                  </div>
                </>
              )}
              <SignInForm next={afterSignIn} />
              <p className="text-xs text-muted">
                We only use your name and email, plus the 4 quick questions you answer next. By continuing, you agree to
                our{" "}
                <Link href="/terms" className="underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  privacy notice
                </Link>
                .
              </p>
            </div>
          );
        })}
      </Suspense>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-10l-7.8 6C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}
