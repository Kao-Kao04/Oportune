"use client";

import { useActionState } from "react";
import { sendSignInLink, type SignInState } from "./actions";

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(sendSignInLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="rounded-ui border border-line bg-white p-4">
        <p className="font-semibold text-ink">Check your email</p>
        <p className="mt-1 text-sm text-muted">
          We sent a sign-in link to {state.email}. Open it on this device. The link works once and expires in an hour.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="email" className="text-sm font-semibold text-ink">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        defaultValue={state.email}
        className="h-11 rounded-ui border border-line bg-white px-3 text-base"
      />
      {state.status === "error" && (
        <p role="alert" className="text-sm text-urgent">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-ui bg-teal px-4 font-semibold text-white hover:bg-teal-dark disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
