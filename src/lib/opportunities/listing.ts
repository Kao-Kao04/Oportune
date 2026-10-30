import type { Database } from "../supabase/database.types";
import { CLOSING_SOON_DAYS, daysBetween } from "./dates";
import type { Audience } from "./audience";
import type { SourceTrust } from "./source-trust";

type ViewRow = Database["public"]["Views"]["public_opportunities"]["Row"];

// A listing as the public sees it (the public_opportunities view).
export type Listing = Audience & {
  id: string;
  slug: string;
  title: string;
  organization: string;
  categoryName: string;
  categorySlug: string;
  summary: string | null;
  eligibility: string | null;
  requirements: string | null;
  location: string | null;
  delivery_mode: "online" | "in_person" | "hybrid" | null;
  application_opens: string | null;
  application_opens_type: "date" | "open" | "rolling" | "tba";
  deadline: string | null;
  deadline_type: "date" | "rolling" | "tba";
  source_url: string;
  application_url: string;
  source_trust: SourceTrust;
  status: "published" | "expired";
  last_checked_at: string | null;
};

// View columns are all nullable in the generated types; the table's
// constraints guarantee the required ones.
export function toListing(row: ViewRow): Listing {
  return {
    id: row.id!,
    slug: row.slug!,
    title: row.title!,
    organization: row.organization!,
    categoryName: row.category_name!,
    categorySlug: row.category_slug!,
    summary: row.summary,
    eligibility: row.eligibility,
    requirements: row.requirements,
    location: row.location,
    delivery_mode: row.delivery_mode as Listing["delivery_mode"],
    application_opens: row.application_opens,
    application_opens_type: (row.application_opens_type ?? "tba") as Listing["application_opens_type"],
    deadline: row.deadline,
    deadline_type: (row.deadline_type ?? "tba") as Listing["deadline_type"],
    source_url: row.source_url!,
    application_url: row.application_url ?? row.source_url!,
    source_trust: (row.source_trust ?? "other") as SourceTrust,
    status: row.status as Listing["status"],
    last_checked_at: row.last_checked_at,
    regions: row.regions ?? [],
    course_groups: row.course_groups ?? [],
    year_levels: row.year_levels ?? [],
  };
}

const TYPE_ORDER = { date: 0, rolling: 1, tba: 2 } as const;

// Dated deadlines first (soonest first), then rolling, then TBA (§7.2).
export function compareByDeadline(a: Listing, b: Listing): number {
  const byType = TYPE_ORDER[a.deadline_type] - TYPE_ORDER[b.deadline_type];
  if (byType !== 0) return byType;
  if (a.deadline && b.deadline && a.deadline !== b.deadline) return a.deadline < b.deadline ? -1 : 1;
  return a.title.localeCompare(b.title);
}

// Still open: published, and a dated deadline isn't in the past.
export function isOpen(listing: Listing, today: string): boolean {
  if (listing.status !== "published") return false;
  return listing.deadline_type !== "date" || (listing.deadline !== null && listing.deadline >= today);
}

// Closing soon: open, dated deadline between today and today + 7 (§7.2).
export function isClosingSoon(listing: Listing, today: string): boolean {
  if (!isOpen(listing, today) || listing.deadline_type !== "date" || !listing.deadline) return false;
  return daysBetween(today, listing.deadline) <= CLOSING_SOON_DAYS;
}

export type ListingGroup = { label: string; listings: Listing[] };

// Sections for the "All" view: This week / Later / No fixed deadline.
export function groupByDeadline(listings: Listing[], today: string): ListingGroup[] {
  const groups: ListingGroup[] = [
    { label: "This week", listings: [] },
    { label: "Later", listings: [] },
    { label: "No fixed deadline", listings: [] },
  ];
  for (const listing of [...listings].sort(compareByDeadline)) {
    if (listing.deadline_type !== "date") groups[2].listings.push(listing);
    else if (isClosingSoon(listing, today)) groups[0].listings.push(listing);
    else groups[1].listings.push(listing);
  }
  return groups.filter((g) => g.listings.length > 0);
}

export function deliveryModeLabel(mode: Listing["delivery_mode"]): string | null {
  if (mode === "online") return "Online";
  if (mode === "in_person") return "In person";
  if (mode === "hybrid") return "Hybrid";
  return null;
}

export function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
