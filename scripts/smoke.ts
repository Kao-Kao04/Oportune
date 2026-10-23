// Automated part of the post-deploy smoke tests (docs/deployment/05 §14).
// Run against any environment:
//   npm run smoke -- https://your-app.vercel.app
// Uses NEXT_PUBLIC_SUPABASE_URL / _PUBLISHABLE_KEY from .env.local (or the
// environment) for the database checks. The manual checks are printed at the end.
import { existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const base = (process.argv[2] ?? process.env.APP_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let failures = 0;
async function check(name: string, run: () => Promise<string | true>) {
  try {
    const result = await run();
    if (result === true) console.log(`  ✓ ${name}`);
    else {
      failures++;
      console.log(`  ✗ ${name}: ${result}`);
    }
  } catch (error) {
    failures++;
    console.log(`  ✗ ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const get = (path: string, init?: RequestInit) => fetch(`${base}${path}`, { redirect: "manual", ...init });
const BOT = { headers: { "User-Agent": "facebookexternalhit/1.1" } };

async function main() {
  console.log(`Smoke tests for ${base}\n`);
  let listingPath: string | null = null;

  await check("home page loads", async () => {
    const res = await get("/");
    const html = await res.text();
    return res.status === 200 && html.includes("Oportune") ? true : `status ${res.status}`;
  });

  await check("sitemap lists published listings", async () => {
    const xml = await (await get("/sitemap.xml")).text();
    listingPath = xml.match(/<loc>[^<]*(\/opportunities\/[^<]+)<\/loc>/)?.[1] ?? null;
    return listingPath ? true : "no listing URLs in sitemap.xml";
  });

  await check("listing page has link-preview tags (as Facebook's crawler)", async () => {
    if (!listingPath) return "skipped: no listing";
    const html = await (await get(listingPath, BOT)).text();
    return /property="og:title"/.test(html) && /property="og:image"/.test(html) ? true : "og:title/og:image missing";
  });

  await check("listing preview image renders", async () => {
    if (!listingPath) return "skipped: no listing";
    const res = await get(`${listingPath}/opengraph-image`);
    return res.status === 200 && res.headers.get("content-type")?.includes("image/png") ? true : `status ${res.status}`;
  });

  await check("unknown listing shows not found", async () => {
    const html = await (await get("/opportunities/this-does-not-exist-123")).text();
    return html.includes("couldn") ? true : "no not-found message";
  });

  await check("admin requires sign-in", async () => {
    const res = await get("/admin");
    const location = res.headers.get("location") ?? "";
    return (res.status >= 300 && res.status < 400 && location.includes("/sign-in")) || (await res.text()).includes("/sign-in")
      ? true
      : `status ${res.status}`;
  });

  await check("job endpoints reject requests without CRON_SECRET", async () => {
    const codes = await Promise.all(
      ["auto-expire", "send-reminders", "cleanup"].map(async (j) => (await get(`/api/jobs/${j}`)).status),
    );
    return codes.every((c) => c === 401) ? true : `got ${codes.join(", ")}`;
  });

  await check("manifest, icons, and service worker", async () => {
    const [manifest, icon, sw] = await Promise.all([get("/manifest.webmanifest"), get("/icon/192"), get("/sw.js")]);
    const json = (await manifest.json()) as { display?: string };
    if (json.display !== "standalone") return "manifest not standalone";
    if (icon.status !== 200) return `icon ${icon.status}`;
    return sw.headers.get("cache-control")?.includes("no-cache") ? true : "sw.js is cacheable";
  });

  await check("privacy notice and terms are published", async () => {
    const [p, t] = await Promise.all([get("/privacy"), get("/terms")]);
    return p.status === 200 && t.status === 200 ? true : `privacy ${p.status}, terms ${t.status}`;
  });

  await check("security headers", async () => {
    const h = (await get("/")).headers;
    const missing = ["x-content-type-options", "x-frame-options", "referrer-policy"].filter((k) => !h.get(k));
    if (base.startsWith("https://") && !h.get("strict-transport-security")) missing.push("strict-transport-security");
    return missing.length === 0 ? true : `missing ${missing.join(", ")}`;
  });

  if (supabaseUrl && publishableKey) {
    const rest = (path: string) =>
      fetch(`${supabaseUrl}/rest/v1/${path}`, { headers: { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` } });
    await check("public key can read the public view", async () => {
      const res = await rest("public_opportunities?select=id&limit=1");
      return res.status === 200 ? true : `status ${res.status}`;
    });
    await check("public key cannot read drafts or internal notes", async () => {
      const res = await rest("opportunities?select=notes&limit=1");
      return res.status === 401 || res.status === 403 ? true : `status ${res.status} (should be blocked)`;
    });
    await check("public key cannot read roles, job runs, or analytics", async () => {
      const results = await Promise.all(["job_runs", "analytics_events", "rate_limits"].map(async (t) => (await rest(`${t}?select=*&limit=1`)).status));
      return results.every((s) => s === 401 || s === 403) ? true : `got ${results.join(", ")}`;
    });
  } else {
    console.log("  - database checks skipped (no Supabase URL/key)");
  }

  console.log(`\n${failures === 0 ? "All automated checks passed." : `${failures} check(s) failed.`}`);
  console.log(`
Still check by hand (on a real phone):
  1. Paste a listing link into Messenger: the preview shows title, organization, deadline.
  2. Share button opens the phone's share sheet.
  3. Sign in (Google and email link), finish the quick profile, save a listing.
  4. Turn on phone notifications; run send-reminders for a test listing due in 7 days.
  5. Report a listing; it appears in Admin → Reports.
  6. Import the CSV in Admin → Import; publish and expire a test listing.
  7. Delete a test account.`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
