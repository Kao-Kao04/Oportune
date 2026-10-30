"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState } from "react";
import { SUBMITTER_ROLES } from "@/lib/submissions";
import { submitOpportunity, type SubmitState } from "./actions";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const input = "mt-1 h-12 w-full rounded-[8px] border-2 border-ink bg-card px-3 text-base text-ink";

export function SubmitForm() {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitOpportunity, { status: "idle" });
  const errors = state.errors ?? {};
  const v = state.values ?? {};

  if (state.status === "sent") {
    return (
      <div className="sticker mt-5 bg-mint p-5">
        <p className="font-display text-xl font-extrabold text-ink">Salamat! Natanggap namin.</p>
        <p className="mt-1 text-ink">
          Our team checks the official source first. If it&apos;s real and open, it goes live, usually within 2 days.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/submit" className="btn-pop press text-sm">
            Submit another
          </Link>
          <Link href="/" className="btn-plain press text-sm">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="sticker mt-5 flex flex-col gap-4 p-4">
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.message && (
        <p role="alert" className="rounded-[8px] border-2 border-ink bg-tomato px-3 py-2 text-sm font-semibold text-ink">
          {state.message}
        </p>
      )}

      <Field label="Link" hint="The official page is best. A Facebook or LinkedIn post is OK too." error={errors.url}>
        <input
          name="url"
          type="url"
          inputMode="url"
          required
          defaultValue={v.url}
          placeholder="https://"
          className={input}
          aria-invalid={errors.url ? true : undefined}
        />
      </Field>

      <Field label="What is it? (optional)" error={errors.title}>
        <input name="title" maxLength={200} defaultValue={v.title} placeholder="e.g. Globe IT Internship 2027" className={input} />
      </Field>

      <Field label="Who runs it? (optional)" error={errors.organization}>
        <input name="organization" maxLength={200} defaultValue={v.organization} placeholder="Company, school, or agency" className={input} />
      </Field>

      <Field label="Deadline (optional)" error={errors.deadline}>
        <input name="deadline" type="date" defaultValue={v.deadline} className={input} aria-invalid={errors.deadline ? true : undefined} />
      </Field>

      <Field label="Anything we should know? (optional)" hint="Don't include phone numbers or other personal info." error={errors.note}>
        <textarea
          name="note"
          rows={3}
          maxLength={1000}
          defaultValue={v.note}
          placeholder="e.g. Open to 3rd-year IT students in Region VII"
          className="mt-1 w-full rounded-[8px] border-2 border-ink bg-card px-3 py-2 text-base text-ink"
        />
      </Field>

      <fieldset>
        <legend className="text-sm font-bold text-ink">You are…</legend>
        <div className="mt-1 flex flex-col">
          {SUBMITTER_ROLES.map((r) => (
            <label key={r.value} className="flex min-h-11 items-center gap-2 text-ink">
              <input
                type="radio"
                name="submitter_role"
                value={r.value}
                defaultChecked={(v.submitter_role ?? "student") === r.value}
                className="h-5 w-5"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

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
