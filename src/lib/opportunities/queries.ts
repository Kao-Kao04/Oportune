import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "../supabase/public";
import { todayInManila } from "./dates";
import { toListing, type Listing } from "./listing";

// Public, cached reads. Everyone sees the same data, refreshed about every
// minute. Admin actions (M3) call updateTag("opportunities") to refresh now.

export const OPPORTUNITIES_TAG = "opportunities";

// Cached so it can be used while prerendering; refreshed every minute.
export async function getToday(): Promise<string> {
  "use cache";
  cacheLife("minutes");
  return todayInManila();
}

export type Category = { id: string; name: string; slug: string };

// Categories that have at least one published listing, in display order.
export async function getActiveCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(OPPORTUNITIES_TAG);

  const supabase = createPublicClient();
  const [{ data: categories, error }, { data: used, error: usedError }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("sort_order"),
    supabase.from("public_opportunities").select("category_id").eq("status", "published"),
  ]);
  if (error) throw error;
  if (usedError) throw usedError;

  const usedIds = new Set(used.map((row) => row.category_id));
  return categories.filter((c) => usedIds.has(c.id));
}

// All published listings (a few hundred at most during the pilot).
export async function getPublishedListings(): Promise<Listing[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(OPPORTUNITIES_TAG);

  const { data, error } = await createPublicClient()
    .from("public_opportunities")
    .select("*")
    .eq("status", "published");
  if (error) throw error;
  return data.map(toListing);
}

// Full-text + typo-tolerant search (supabase/migrations/*_search_opportunities.sql).
export async function searchListings(query: string): Promise<Listing[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(OPPORTUNITIES_TAG);

  const { data, error } = await createPublicClient().rpc("search_opportunities", { q: query });
  if (error) throw error;
  return data.map(toListing);
}

export type ListingWin = { id: string; result: string; headline: string; proof_url: string | null };

// Curator-checked wins on a listing (supabase/migrations/*_opportunity_wins.sql),
// newest first.
export async function getListingWins(opportunityId: string): Promise<ListingWin[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(OPPORTUNITIES_TAG);

  const { data, error } = await createPublicClient()
    .from("public_opportunity_wins")
    .select("id, result, headline, proof_url")
    .eq("opportunity_id", opportunityId)
    .order("published_at", { ascending: false })
    .limit(20);
  // Wins are extra: never let them break the listing page.
  if (error) {
    console.warn("[wins] not loaded", error.message);
    return [];
  }
  return data.map((w) => ({ id: w.id!, result: w.result!, headline: w.headline!, proof_url: w.proof_url }));
}

// A published or expired listing by slug, or by an old slug that redirects.
export async function getListingBySlug(
  slug: string,
): Promise<{ listing: Listing } | { redirectTo: string } | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(OPPORTUNITIES_TAG);

  const supabase = createPublicClient();
  const { data, error } = await supabase.from("public_opportunities").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (data) return { listing: toListing(data) };

  const { data: redirect, error: redirectError } = await supabase
    .from("opportunity_slug_redirects")
    .select("opportunity_id")
    .eq("old_slug", slug)
    .maybeSingle();
  if (redirectError) throw redirectError;
  if (!redirect) return null;

  const { data: target, error: targetError } = await supabase
    .from("public_opportunities")
    .select("slug")
    .eq("id", redirect.opportunity_id)
    .maybeSingle();
  if (targetError) throw targetError;
  return target?.slug ? { redirectTo: target.slug } : null;
}
