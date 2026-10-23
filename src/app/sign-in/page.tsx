import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const ERRORS: Record<string, string> = {
  "link-expired": "That sign-in link expired or was already used. Send a new one.",
  "not-curator": "Your account doesn't have curator access. Ask an admin to add you.",
};

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <main className="px-4 py-10">
      <h1 className="text-2xl font-bold text-ink">Sign in</h1>
      <p className="mt-1 text-muted">For curators and admins. Student sign-in with Google is coming soon.</p>
      <div className="mt-6">
        <Suspense fallback={null}>
          {searchParams.then((params) => {
            const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
            const next = typeof params.next === "string" && params.next.startsWith("/") ? params.next : "/admin";
            return (
              <>
                {error && (
                  <p role="alert" className="mb-4 rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
                    {error}
                  </p>
                )}
                <SignInForm next={next} />
              </>
            );
          })}
        </Suspense>
      </div>
    </main>
  );
}
