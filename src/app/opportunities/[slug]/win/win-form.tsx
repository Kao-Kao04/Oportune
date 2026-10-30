"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState } from "react";
import { WIN_RESULTS } from "@/lib/wins";
import { submitWin, type WinState } from "./actions";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const input = "mt-1 h-12 w-full rounded-[8px] border-2 border-ink bg-card px-3 text-base text-ink";

export function WinForm({ opportunityId, slug }: { opportunityId: string; slug: string }) {
  const [state, action, pending] = useActionState<WinState, FormData>(submitWin, { status: "idle" });
  const errors = state.errors ?? {};
  const v = state.values ?? {};

  if (state.status === "sent") {
    return (
      <div className="sticker mt-5 bg-mint p-5">
        <p className="font-display text-xl font-extrabold text-ink">Congrats, and salamat!</p>
        <p className="mt-1 text-ink">
          Our team checks it first. If it&apos;s confirmed, it shows on the listing, usually within 2 days.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/opportunities/${slug}`} className="btn-pop press text-sm">
            Back to the listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="sticker mt-5 flex flex-col gap-4 p-4">
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <input type="hidden" name="opportunity_id" value={opportunityId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.message && (
        <p role="alert" className="rounded-[8px] border-2 border-ink bg-tomato px-3 py-2 text-sm font-semibold text-ink">
          {state.message}
        </p>
      )}

      <fieldset>
        <legend className="text-sm font-bold text-ink">What happened?</legend>
        <div className="mt-1 flex flex-col">
          {WIN_RESULTS.map((r) => (
            <label key={r.value} className="flex min-h-11 items-center gap-2 text-ink">
              <input
                type="radio"
                name="result"
                value={r.value}
                defaultChecked={(v.result ?? "won") === r.value}
                className="h-5 w-5"
              />
              <span aria-hidden="true">{r.emoji}</span> {r.label}
            </label>
          ))}
        </div>
        {errors.result && <p className="mt-1 text-sm font-semibold text-urgent">{errors.result}</p>}
      </fieldset>

      <Field label="Team, org, or school" hint="e.g. Team Bitbusters, JPCS Gordon College. No personal names here." error={errors.team}>
        <input
          name="team"
          required
          maxLength={120}
          defaultValue={v.team}
          className={input}
          aria-invalid={errors.team ? true : undefined}
        />
      </Field>

      <Field label="Details (optional)" hint="e.g. 2nd place, regional round. Don't include phone numbers or other personal info." error={errors.detail}>
        <textarea
          name="detail"
          rows={2}
          maxLength={300}
          defaultValue={v.detail}
          className="mt-1 w-full rounded-[8px] border-2 border-ink bg-card px-3 py-2 text-base text-ink"
        />
      </Field>

      <Field label="Link to the announcement (optional)" hint="The organizer's or school's own post or page helps us confirm it fast." error={errors.proof_url}>
        <input
          name="proof_url"
          type="url"
          inputMode="url"
          defaultValue={v.proof_url}
          placeholder="https://"
          className={input}
          aria-invalid={errors.proof_url ? true : undefined}
        />
      </Field>

      <div>
        <label className="flex min-h-11 items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={v.consent === "on"}
            className="mt-1 h-5 w-5 shrink-0 accent-teal"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            Everyone named here agreed to be featured (and a parent or guardian, for anyone under 18). We only show the team or
            school name.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-1 text-sm font-semibold text-urgent">
            {errors.consent}
          </p>
        )}
      </div>

      {SITE_KEY && <div className="cf-turnstile" data-sitekey={SITE_KEY} />}

      <button type="submit" disabled={pending} className="btn-pop press h-12 disabled:opacity-60">
        {pending ? "Sending…" : "Send for checking"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-ink">
        {label}
        {children}
      </label>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-sm font-semibold text-urgent">
          {error}
        </p>
      )}
    </div>
  );
}
