// Short labels for chips and list rows. Full names live in data/categories.csv
// and the categories table.
const SHORT_LABELS: Record<string, string> = {
  scholarships: "Scholarship",
  internships: "Internship",
  "entry-level-jobs": "Graduate program",
  hackathons: "Hackathon",
  ctfs: "CTF",
  courses: "Course",
  leadership: "Leadership",
  events: "Event",
  "research-grants": "Research grant",
  "hardware-grants": "Device grant",
};

// Plural forms for the filter chips.
const CHIP_LABELS: Record<string, string> = {
  scholarships: "Scholarships",
  internships: "Internships",
  "entry-level-jobs": "Jobs",
  hackathons: "Hackathons",
  ctfs: "CTFs",
  courses: "Courses",
  leadership: "Leadership",
  events: "Events",
  "research-grants": "Research grants",
  "hardware-grants": "Device grants",
};

export function categoryLabel(slug: string, fallback: string): string {
  return SHORT_LABELS[slug] ?? fallback;
}

export function categoryChipLabel(slug: string, fallback: string): string {
  return CHIP_LABELS[slug] ?? fallback;
}

// Pop color per category (background, always with ink text). Full class names
// so Tailwind keeps them.
const CATEGORY_BG: Record<string, string> = {
  scholarships: "bg-sun",
  internships: "bg-sky",
  "entry-level-jobs": "bg-mint",
  hackathons: "bg-tomato",
  ctfs: "bg-lilac",
  courses: "bg-lime",
  leadership: "bg-pink",
  events: "bg-orange",
  "research-grants": "bg-lilac",
  "hardware-grants": "bg-sky",
};

export function categoryBg(slug: string): string {
  return CATEGORY_BG[slug] ?? "bg-sun";
}
