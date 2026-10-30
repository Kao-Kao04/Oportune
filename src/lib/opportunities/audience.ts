import { COURSE_GROUPS, YEAR_LEVELS } from "../profile";

// Who a listing is for: regions, course groups, and year levels.
// An empty list means "open to all" (docs/research/final-decisions.md).

// The 18 regions, including the Negros Island Region (RA 12000, 2024).
export const REGIONS = [
  { value: "ncr", label: "NCR (Metro Manila)" },
  { value: "car", label: "CAR (Cordillera)" },
  { value: "ilocos", label: "Ilocos Region (I)" },
  { value: "cagayan-valley", label: "Cagayan Valley (II)" },
  { value: "central-luzon", label: "Central Luzon (III)" },
  { value: "calabarzon", label: "CALABARZON (IV-A)" },
  { value: "mimaropa", label: "MIMAROPA" },
  { value: "bicol", label: "Bicol Region (V)" },
  { value: "western-visayas", label: "Western Visayas (VI)" },
  { value: "nir", label: "Negros Island Region" },
  { value: "central-visayas", label: "Central Visayas (VII)" },
  { value: "eastern-visayas", label: "Eastern Visayas (VIII)" },
  { value: "zamboanga", label: "Zamboanga Peninsula (IX)" },
  { value: "northern-mindanao", label: "Northern Mindanao (X)" },
  { value: "davao", label: "Davao Region (XI)" },
  { value: "soccsksargen", label: "SOCCSKSARGEN (XII)" },
  { value: "caraga", label: "Caraga (XIII)" },
  { value: "barmm", label: "BARMM" },
] as const;

export type Audience = { regions: string[]; course_groups: string[]; year_levels: string[] };

export type AudienceFilter = { region: string | null; course: string | null; year: string | null };

const REGION_VALUES = new Set<string>(REGIONS.map((r) => r.value));
const COURSE_VALUES = new Set<string>(COURSE_GROUPS.map((c) => c.value));
const YEAR_VALUES = new Set<string>(YEAR_LEVELS.map((y) => y.value));

export const isRegion = (v: string | null | undefined): v is string => !!v && REGION_VALUES.has(v);
export const isCourseGroup = (v: string | null | undefined): v is string => !!v && COURSE_VALUES.has(v);
export const isYearLevel = (v: string | null | undefined): v is string => !!v && YEAR_VALUES.has(v);

// A listing fits when every chosen filter is either untagged on the listing
// (open to all) or one of its tags.
export function fitsAudience(audience: Audience, filter: AudienceFilter): boolean {
  const fits = (tags: string[], wanted: string | null) => !wanted || tags.length === 0 || tags.includes(wanted);
  return (
    fits(audience.regions, filter.region) &&
    fits(audience.course_groups, filter.course) &&
    fits(audience.year_levels, filter.year)
  );
}

export function regionLabel(value: string): string {
  return REGIONS.find((r) => r.value === value)?.label ?? value;
}

// Keeps known values only, in the canonical order, without duplicates.
export function cleanTags(values: string[], allowed: readonly { value: string }[]): string[] {
  const wanted = new Set(values);
  return allowed.map((a) => a.value).filter((v) => wanted.has(v));
}

// "Open to" line for a listing page, or null when it's open to everyone.
export function audienceSummary(audience: Audience): string | null {
  const parts: string[] = [];
  if (audience.year_levels.length > 0) {
    parts.push(
      audience.year_levels
        .map((y) => (y === "graduating" ? "graduating" : `${YEAR_LEVELS.find((l) => l.value === y)?.label} year`))
        .join(", ") + " students",
    );
  }
  if (audience.course_groups.length > 0) {
    parts.push(audience.course_groups.map((c) => COURSE_GROUPS.find((g) => g.value === c)?.label ?? c).join(", "));
  }
  if (audience.regions.length > 0) parts.push(`in ${audience.regions.map(regionLabel).join(", ")}`);
  return parts.length > 0 ? parts.join(" · ") : null;
}
