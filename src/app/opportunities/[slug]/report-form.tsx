"use client";

import Script from "next/script";
import { useActionState, useState } from "react";
import { reportListing, type ReportState } from "./report-actions";

const REASONS = [
  { value: "wrong_info", label: "Wrong information" },
  { value: "expired", label: "It's already closed" },
  { value: "scam", label: "Looks like a scam" },
  { value: "other", label: "Something else" },
];

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ReportForm({ opportunityId }: { opportunityId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ReportState, FormData>(reportListing, { status: "idle" });

  if (state.status === "sent") {
    return <p className="mt-6 text-sm text-official">Thanks. Our team will check this listing within 48 hours.</p>;
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-4 min-h-11 text-sm text-muted underline">
        Something wrong? Report this listing
      </button>
    );
  }

  return (
    <form action={action} className="sticker mt-6 p-4">
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <input type="hidden" name="opportunity_id" value={opportunityId} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <fieldset>
        <legend className="font-semibold text-ink">What&apos;s wrong?</legend>
        <div className="mt-2 space-y-2">
          {REASONS.map((r) => (
            <label key={r.value} className="flex items-center gap-2 text-sm">
              <input type="radio" name="reason" value={r.value} required />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-3 block text-sm">
        <span className="font-semibold text-ink">Details (optional)</span>
        <textarea
          name="details"
          rows={3}
          maxLength={1000}
          placeholder="e.g., the deadline on the official site is Nov 15"
          className="mt-1 w-full rounded-ui border border-line px-3 py-2 text-base"
        />
      </label>
      <p className="mt-1 text-xs text-muted">Don&apos;t include personal info like phone numbers.</p>
      {SITE_KEY && <div className="cf-turnstile mt-3" data-sitekey={SITE_KEY} />}
      {state.status === "error" && (
        <p role="alert" className="mt-2 text-sm text-urgent">
          {state.message}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-plain press text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="btn-pop press flex-1 text-sm disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send report"}
        </button>
      </div>
    </form>
  );
}
