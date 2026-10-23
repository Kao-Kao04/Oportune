import type { MetadataRoute } from "next";
import { getPublishedListings } from "@/lib/opportunities/queries";

// Published listings, so search engines can find them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  // If the database is unreachable (e.g. CI builds with placeholder keys),
  // still publish the static pages; the sitemap refreshes within minutes.
  const listings = await getPublishedListings().catch(() => []);
  return [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    ...listings.map((l) => ({
      url: `${base}/opportunities/${l.slug}`,
      lastModified: l.last_checked_at ?? undefined,
      changeFrequency: "weekly" as const,
    })),
    { url: `${base}/privacy` },
    { url: `${base}/terms` },
  ];
}
