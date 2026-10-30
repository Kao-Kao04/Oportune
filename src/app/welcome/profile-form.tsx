"use client";

import { useActionState, useRef, useState } from "react";
import { COURSE_GROUPS, SCHOOL_SUGGESTIONS, YEAR_LEVELS, type ProfileFields } from "@/lib/profile";
import { saveProfile, type ProfileState } from "./actions";

const input = "h-12 w-full rounded-ui border-2 bg-card px-3 text-base";
const option =
  "flex min-h-12 cursor-pointer items-center justify-center rounded-ui border-2 border-ink bg-card px-3 text-sm font-semibold has-checked:bg-sun has-checked:font-extrabold has-checked:shadow-[3px_3px_0_0_#111] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-teal";

// Which step each field lives on (server errors jump back to that step).
const STEP_OF: Record<string, number> = { school: 0, course_group: 1, year_level: 1, is_18_or_over: 2 };
const STEPS = ["Where do you study?", "What's your course and year?", "What are you looking for?"];

// Quick profile. New students get 3 short steps with a progress bar; editing
// from Me shows everything on one page. Fields are controlled so nothing is
// lost when a save comes back with an error.
export function ProfileForm({
  values,
  categories,
  next,
  submitLabel,
  stepped = false,
}: {
  values: ProfileFields;
  categories: { slug: string; label: string }[];
  next: string;
  submitLabel: string;
  stepped?: boolean;
}) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(saveProfile, {});
  const [step, setStep] = useState(0);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [school, setSchool] = useState(values.school ?? "");
  const [courseGroup, setCourseGroup] = useState(values.course_group ?? "");
  const [course, setCourse] = useState(values.course ?? "");
  const [yearLevel, setYearLevel] = useState(values.year_level ?? "");
  const [interests, setInterests] = useState<string[]>(values.interests);
  const [adult, setAdult] = useState(values.is_18_or_over === true);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const errors = { ...state.errors, ...localErrors };

  // A new server error sends the student back to the step that needs fixing
  // (adjusted during render, React's pattern for state derived from props).
  const [seenErrors, setSeenErrors] = useState(state.errors);
  if (state.errors !== seenErrors) {
    setSeenErrors(state.errors);
    const first = Object.keys(state.errors ?? {})[0];
    if (stepped && first !== undefined && STEP_OF[first] !== undefined) setStep(STEP_OF[first]);
  }

  function goNext() {
    const problems: Record<string, string> = {};
    if (step === 0 && !school.trim()) problems.school = "Type or pick your school.";
    if (step === 1 && !courseGroup) problems.course_group = "Pick your field of study.";
    if (step === 1 && !yearLevel) problems.year_level = "Pick your year level.";
    setLocalErrors(problems);
    if (Object.keys(problems).length > 0) return;
    setStep((s) => s + 1);
    // Move focus to the new step's heading for screen readers and keyboards.
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function goBack() {
    setLocalErrors({});
    setStep((s) => s - 1);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  const show = (i: number) => !stepped || step === i;
  const last = !stepped || step === STEPS.length - 1;

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="next" value={next} />

      {stepped && (
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-muted">
            <span>
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div
            className="mt-2 h-3 overflow-hidden rounded-full border-2 border-ink bg-card"
            role="progressbar"
            aria-label="Quick setup progress"
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-valuenow={step + 1}
          >
            <div className="h-full bg-sun transition-[width]" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <h2 ref={headingRef} tabIndex={-1} className="mt-5 font-display text-2xl font-extrabold text-ink outline-none">
            {STEPS[step]}
          </h2>
        </div>
      )}

      {state.message && (
        <p role="alert" className="rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
          {state.message}
        </p>
      )}

      {/* Step 1: school */}
      <div hidden={!show(0)}>
        <label htmlFor="school" className="mb-1 block text-sm font-semibold text-ink">
          School
        </label>
        <input
          id="school"
          name="school"
          list="schools"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Start typing, e.g. Gordon College"
          autoComplete="organization"
          aria-invalid={Boolean(errors.school)}
          aria-describedby={errors.school ? "school-error" : "school-help"}
          className={input}
        />
        <datalist id="schools">
          {SCHOOL_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        {errors.school ? (
          <p id="school-error" className="mt-1 text-sm text-urgent">
            {errors.school}
          </p>
        ) : (
          <p id="school-help" className="mt-1 text-sm text-muted">
            Not in the list? Just type the full name.
          </p>
        )}
      </div>

      {/* Step 2: course and year */}
      <div hidden={!show(1)} className="flex flex-col gap-6">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Field of study</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {COURSE_GROUPS.map((g) => (
              <label key={g.value} className={`${option} justify-start`}>
                <input
                  type="radio"
                  name="course_group"
                  value={g.value}
                  checked={courseGroup === g.value}
                  onChange={() => setCourseGroup(g.value)}
                  className="sr-only"
                />
                {g.label}
              </label>
            ))}
          </div>
          {errors.course_group && <p className="mt-1 text-sm text-urgent">{errors.course_group}</p>}
        </fieldset>

        <div>
          <label htmlFor="course" className="mb-1 block text-sm font-semibold text-ink">
            Course <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="course"
            name="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g., BS Information Technology"
            className={input}
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Year level</legend>
          <div className="grid grid-cols-3 gap-2">
            {YEAR_LEVELS.map((y) => (
              <label key={y.value} className={option}>
                <input
                  type="radio"
                  name="year_level"
                  value={y.value}
                  checked={yearLevel === y.value}
                  onChange={() => setYearLevel(y.value)}
                  className="sr-only"
                />
                {y.label}
              </label>
            ))}
          </div>
          {errors.year_level && <p className="mt-1 text-sm text-urgent">{errors.year_level}</p>}
        </fieldset>
      </div>

      {/* Step 3: interests and age */}
      <div hidden={!show(2)} className="flex flex-col gap-6">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">
            Pick any <span className="font-normal text-muted">(optional)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <label key={c.slug} className={option}>
                <input
                  type="checkbox"
                  name="interests"
                  value={c.slug}
                  checked={interests.includes(c.slug)}
                  onChange={(e) =>
                    setInterests((list) => (e.target.checked ? [...list, c.slug] : list.filter((s) => s !== c.slug)))
                  }
                  className="sr-only"
                />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex min-h-11 items-center gap-3">
          <input
            type="checkbox"
            name="is_18_or_over"
            checked={adult}
            onChange={(e) => setAdult(e.target.checked)}
            aria-invalid={Boolean(errors.is_18_or_over)}
            aria-describedby={errors.is_18_or_over ? "adult-error" : undefined}
            className="h-5 w-5 accent-teal"
          />
          <span className="text-ink">I am 18 or older</span>
        </label>
        {errors.is_18_or_over && (
          <p id="adult-error" className="-mt-4 text-sm text-urgent">
            {errors.is_18_or_over}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        {stepped && step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="btn-plain press px-5"
          >
            Back
          </button>
        )}
        {last ? (
          <button
            type="submit"
            disabled={pending}
            className="btn-pop press flex-1 disabled:opacity-60"
          >
            {pending ? "Saving…" : submitLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="btn-pop press flex-1"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}
