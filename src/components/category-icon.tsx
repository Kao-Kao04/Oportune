// Simple line icons per category (decorative; the category name is always
// shown as text next to them).
const PATHS: Record<string, string> = {
  // graduation cap
  scholarships: "M2 9l10-5 10 5-10 5L2 9zm4 2v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6",
  // briefcase
  internships: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  "entry-level-jobs": "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  // code brackets
  hackathons: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  // flag
  ctfs: "M5 21V4M5 4h12l-2 4 2 4H5",
  // open book
  courses: "M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z",
  // megaphone
  leadership: "M3 10v4h4l6 4V6L7 10H3zM17 9a4 4 0 0 1 0 6",
  // calendar
  events: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  // flask
  "research-grants": "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7 15h10",
  // laptop
  "hardware-grants": "M5 5h14v10H5zM2 19h20",
};

export function CategoryIcon({ slug, size = 24, strokeWidth = 2 }: { slug: string; size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[slug] ?? PATHS.scholarships} />
    </svg>
  );
}
