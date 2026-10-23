"use client";

import { useActionState, useState } from "react";
import { sourceTrust } from "@/lib/opportunities/source-trust";
import { saveOpportunity, type SaveState } from "./actions";

export type FormValues = {
  id?: string;
  status: string;
  slug?: string;
  title: string;
  organization: string;
  category_id: string;
  summary: string;
  eligibility: string;
  requirements: string;
  location: string;
  delivery_mode: string;
  application_opens_type: string;
  application_opens: string;
  deadline_type: string;
  deadline: string;
  source_url: string;
  application_url: string;
  confidence: string;
  needs_check: boolean;
  notes: string;
  last_checked: string;
};

const input = "h-11 w-full rounded-ui border border-line bg-white px-3 text-base";
const textarea = "w-full rounded-ui border border-line bg-white px-3 py-2 text-base";

export function OpportunityForm({
  values,
  categories,
}: {
  values: FormValues;
  categories: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveOpportunity, {});
  const [deadlineType, setDeadlineType] = useState(values.deadline_type);
  const [opensType, setOpensType] = useState(values.application_opens_type);
  const [sourceUrl, setSourceUrl] = useState(values.source_url);
  const [summary, setSummary] = useState(values.summary);
  const [needsCheck, setNeedsCheck] = useState(values.needs_check);
  const errors = state.errors ?? {};
  // React resets the form after an action; keep what was typed when a save fails.
  const v = { ...values, ...(state.values ?? {}) } as FormValues;
  const trust = sourceTrust(sourceUrl);
  const isPublished = values.status === "published";

  return (
    <form action={action} className="flex flex-col gap-5">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      {state.message && (
        <p role="alert" className="rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
          {state.message}
        </p>
      )}

      <Field label="Title" error={errors.title}>
        <input name="title" defaultValue={v.title} required className={input} />
      </Field>
      {values.slug && (
        <p className="-mt-3 break-all text-xs text-muted">
          Page: /opportunities/{values.slug}
          {values.status === "draft" ? " (follows the title while it's a draft)" : " (fixed, so shared links keep working)"}
        </p>
      )}

      <Field label="Organization" error={errors.organization}>
        <input name="organization" defaultValue={v.organization} required className={input} />
      </Field>

      <Field label="Category" error={errors.category_id}>
        <select name="category_id" defaultValue={v.category_id} required className={input}>
          <option value="">Pick a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`Summary (${summary.length}/300)`} error={errors.summary} hint="Short and factual, in our own words.">
        <textarea
          name="summary"
          rows={3}
          maxLength={300}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={textarea}
        />
      </Field>

      <Field label="Who can apply" error={errors.eligibility}>
        <textarea name="eligibility" rows={3} defaultValue={v.eligibility} className={textarea} />
      </Field>

      <Field label="What you need (requirements)" error={errors.requirements}>
        <textarea name="requirements" rows={3} defaultValue={v.requirements} className={textarea} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location" error={errors.location}>
          <input name="location" defaultValue={v.location} className={input} />
        </Field>
        <Field label="Delivery" error={errors.delivery_mode}>
          <select name="delivery_mode" defaultValue={v.delivery_mode} className={input}>
            <option value="online">Online</option>
            <option value="in_person">In person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Applications open" error={errors.application_opens_type ?? errors.application_opens}>
          <select
            name="application_opens_type"
            value={opensType}
            onChange={(e) => setOpensType(e.target.value)}
            className={input}
          >
            <option value="date">On a date</option>
            <option value="open">Open now</option>
            <option value="rolling">Rolling</option>
            <option value="tba">TBA</option>
          </select>
          {opensType === "date" && (
            <input name="application_opens" type="date" defaultValue={v.application_opens} className={`${input} mt-2`} />
          )}
        </Field>
        <Field label="Deadline" error={errors.deadline_type ?? errors.deadline}>
          <select
            name="deadline_type"
            value={deadlineType}
            onChange={(e) => setDeadlineType(e.target.value)}
            className={input}
          >
            <option value="date">On a date</option>
            <option value="rolling">Rolling</option>
            <option value="tba">TBA</option>
          </select>
          {deadlineType === "date" && (
            <input name="deadline" type="date" defaultValue={v.deadline} className={`${input} mt-2`} />
          )}
        </Field>
      </div>

      <Field label="Official source URL" error={errors.source_url}>
        <input
          name="source_url"
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          required
          className={input}
        />
        <p className="mt-1 text-xs text-muted">
          Badge:{" "}
          <span className={trust === "other" ? "" : "font-semibold text-official"}>
            {trust === "official_gov" ? "Official .gov.ph" : trust === "official_edu" ? "Official .edu.ph" : "none (not a .gov.ph/.edu.ph site)"}
          </span>
        </p>
      </Field>

      <Field label="Application URL (if different)" error={errors.application_url}>
        <input name="application_url" type="url" defaultValue={v.application_url} className={input} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Confidence" error={errors.confidence}>
          <select name="confidence" defaultValue={v.confidence} className={input}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </Field>
        <Field label="Last checked" error={errors.last_checked}>
          <input name="last_checked" type="date" defaultValue={v.last_checked} required className={input} />
        </Field>
      </div>

      <label className="flex items-start gap-3 rounded-ui border border-line bg-white p-3">
        <input
          type="checkbox"
          name="needs_check"
          checked={needsCheck}
          onChange={(e) => setNeedsCheck(e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <span>
          <span className="font-semibold text-ink">Needs check</span>
          <span className="block text-sm text-muted">
            Details aren&apos;t confirmed on the official source yet. Can&apos;t be published while this is on.
          </span>
        </span>
      </label>

      <Field label="Internal notes (never shown to students)" error={errors.notes}>
        <textarea name="notes" rows={3} defaultValue={v.notes} className={textarea} />
      </Field>

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <button
          type="submit"
          name="intent"
          value="save"
          disabled={pending}
          className="h-11 flex-1 rounded-ui border border-ink/20 bg-white px-4 font-semibold text-ink disabled:opacity-60"
        >
          {isPublished ? "Save changes" : values.id ? "Save" : "Save draft"}
        </button>
        {!isPublished && (
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={pending || needsCheck}
            title={needsCheck ? "Turn off “Needs check” first" : undefined}
            className="h-11 flex-1 rounded-ui bg-teal px-4 font-semibold text-white hover:bg-teal-dark disabled:opacity-50"
          >
            {values.status === "expired" ? "Save and republish" : "Publish"}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
        {children}
      </label>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 text-sm text-urgent">
          {error}
        </p>
      )}
    </div>
  );
}
