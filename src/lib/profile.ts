// Quick-profile options (docs/system-design/03-data-model.md, profiles).

export const COURSE_GROUPS = [
  { value: "it_cs", label: "IT & Computer Science" },
  { value: "engineering", label: "Engineering" },
  { value: "health", label: "Health & Allied Sciences" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business & Accountancy" },
  { value: "arts_humanities", label: "Arts, Humanities & Social Sciences" },
  { value: "sciences", label: "Natural Sciences & Math" },
  { value: "agriculture", label: "Agriculture, Fisheries & Forestry" },
  { value: "other", label: "Other" },
] as const;

export const YEAR_LEVELS = [
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4", label: "4th" },
  { value: "5", label: "5th" },
  { value: "graduating", label: "Graduating" },
] as const;

// Suggestions only; students can type any school ("Other").
export const SCHOOL_SUGGESTIONS = [
  "Ateneo de Manila University",
  "Bulacan State University",
  "Cebu Technological University",
  "Central Luzon State University",
  "De La Salle University",
  "Far Eastern University",
  "Gordon College",
  "Isabela State University",
  "Mapúa University",
  "Mindanao State University",
  "Pamantasan ng Lungsod ng Maynila",
  "Polytechnic University of the Philippines",
  "Technological Institute of the Philippines",
  "Technological University of the Philippines",
  "University of Mindanao",
  "University of San Carlos",
  "University of Santo Tomas",
  "University of Southeastern Philippines",
  "University of the East",
  "University of the Philippines Diliman",
  "University of the Philippines Los Baños",
  "University of the Philippines Manila",
  "University of the Philippines Visayas",
  "West Visayas State University",
];

export type ProfileFields = {
  school: string | null;
  course_group: string | null;
  course: string | null;
  year_level: string | null;
  interests: string[];
  is_18_or_over: boolean | null;
};

export const UNDER_18_MESSAGE =
  "Accounts are for 18 and older for now. You can still browse and share listings without one.";

// Complete once the quick-profile questions are answered.
export function isProfileComplete(p: Pick<ProfileFields, "school" | "course_group" | "year_level" | "is_18_or_over">) {
  return Boolean(p.school && p.course_group && p.year_level && p.is_18_or_over !== null);
}

export function courseGroupLabel(value: string | null): string | null {
  return COURSE_GROUPS.find((g) => g.value === value)?.label ?? null;
}

export function yearLevelLabel(value: string | null): string | null {
  if (!value) return null;
  return value === "graduating" ? "Graduating" : `${YEAR_LEVELS.find((y) => y.value === value)?.label} year`;
}

export type ProfileFormResult = { ok: true; fields: ProfileFields } | { ok: false; errors: Record<string, string> };

export function parseProfileForm(form: FormData, categorySlugs: Set<string>): ProfileFormResult {
  const get = (name: string) => (typeof form.get(name) === "string" ? String(form.get(name)).trim() : "");
  const errors: Record<string, string> = {};

  const school = get("school").slice(0, 150);
  const courseGroup = get("course_group");
  const course = get("course").slice(0, 150);
  const yearLevel = get("year_level");
  const interests = form
    .getAll("interests")
    .map(String)
    .filter((slug) => categorySlugs.has(slug));

  if (!school) errors.school = "Type or pick your school.";
  if (!COURSE_GROUPS.some((g) => g.value === courseGroup)) errors.course_group = "Pick your field of study.";
  if (!YEAR_LEVELS.some((y) => y.value === yearLevel)) errors.year_level = "Pick your year level.";
  // Accounts stay 18+ until a lawyer approves a guardian-consent flow.
  if (form.get("is_18_or_over") !== "on") errors.is_18_or_over = UNDER_18_MESSAGE;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    fields: {
      school,
      course_group: courseGroup,
      course: course || null,
      year_level: yearLevel,
      interests: [...new Set(interests)],
      is_18_or_over: true,
    },
  };
}
