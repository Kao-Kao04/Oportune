"use client";

import { useActionState } from "react";
import { sendSignInLink, type SignInState } from "./actions";

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(sendSignInLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <div className="sticker bg-mint p-4">
        <p className="font-semibold text-ink">Check your email</p>
        <p className="mt-1 text-sm text-ink">
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
        className="h-12 rounded-ui border-2 bg-card px-3 text-base"
      />
      {state.status === "error" && (
        <p role="alert" className="text-sm text-urgent">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-pop press disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
