"use client";

import { useActionState } from "react";
import { COURSE_GROUPS, SCHOOL_SUGGESTIONS, YEAR_LEVELS, type ProfileFields } from "@/lib/profile";
import { saveProfile, type ProfileState } from "./actions";

const input = "h-11 w-full rounded-ui border border-line bg-white px-3 text-base";

export function ProfileForm({
  values,
  categories,
  next,
  submitLabel,
}: {
  values: ProfileFields;
  categories: { slug: string; label: string }[];
  next: string;
  submitLabel: string;
}) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(saveProfile, {});
  const errors = state.errors ?? {};

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      {state.message && (
        <p role="alert" className="rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
          {state.message}
        </p>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">School</span>
        <input
          name="school"
          list="schools"
          defaultValue={values.school ?? ""}
          placeholder="e.g., Polytechnic University of the Philippines"
          autoComplete="organization"
          className={input}
        />
        <datalist id="schools">
          {SCHOOL_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        {errors.school && <span className="mt-1 block text-sm text-urgent">{errors.school}</span>}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">Field of study</span>
        <select name="course_group" defaultValue={values.course_group ?? ""} className={input}>
          <option value="">Pick one</option>
          {COURSE_GROUPS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
        {errors.course_group && <span className="mt-1 block text-sm text-urgent">{errors.course_group}</span>}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-ink">
          Course <span className="font-normal text-muted">(optional)</span>
        </span>
        <input name="course" defaultValue={values.course ?? ""} placeholder="e.g., BS Information Technology" className={input} />
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">Year level</legend>
        <div className="grid grid-cols-3 gap-2">
          {YEAR_LEVELS.map((y) => (
            <label key={y.value} className="has-checked:border-teal has-checked:bg-teal has-checked:text-white flex h-11 cursor-pointer items-center justify-center rounded-ui border border-line bg-white text-sm">
              <input type="radio" name="year_level" value={y.value} defaultChecked={values.year_level === y.value} className="sr-only" />
              {y.label}
            </label>
          ))}
        </div>
        {errors.year_level && <p className="mt-1 text-sm text-urgent">{errors.year_level}</p>}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">
          What are you looking for? <span className="font-normal text-muted">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <label
              key={c.slug}
              className="has-checked:border-teal has-checked:bg-teal has-checked:text-white cursor-pointer rounded-ui border border-line bg-white px-3 py-1.5 text-sm"
            >
              <input
                type="checkbox"
                name="interests"
                value={c.slug}
                defaultChecked={values.interests.includes(c.slug)}
                className="sr-only"
              />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="is_18_or_over" defaultChecked={values.is_18_or_over === true} className="mt-1 h-4 w-4" />
        <span className="text-sm text-ink">I am 18 or older</span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-ui bg-teal px-4 font-semibold text-white hover:bg-teal-dark disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
