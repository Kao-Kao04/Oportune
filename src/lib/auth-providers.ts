import { cacheLife } from "next/cache";

// Which sign-in providers are switched on in Supabase (Authentication →
// Providers), so the sign-in page only shows buttons that work.
export async function getEnabledProviders(): Promise<{ google: boolean }> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
    });
    if (!res.ok) return { google: false };
    const settings = (await res.json()) as { external?: Record<string, boolean> };
    return { google: settings.external?.google === true };
  } catch {
    return { google: false };
  }
}
