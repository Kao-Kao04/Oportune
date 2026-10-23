import { allowRequest, hashedClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

// Anonymous product events (docs/idea/05-validation-metrics-risks.md §13).
// No names, emails, or IPs are stored: just the event, the listing, and a
// random ID the browser keeps.
const EVENTS = new Set(["view", "official_click", "share", "reminder_open"]);
const UUID = /^[0-9a-f-]{36}$/i;
const BOTS = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless/i;

export async function POST(request: Request) {
  if (BOTS.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  let body: { event?: unknown; opportunityId?: unknown; anonymousId?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  const event = typeof body.event === "string" ? body.event : "";
  const opportunityId = typeof body.opportunityId === "string" && UUID.test(body.opportunityId) ? body.opportunityId : null;
  const anonymousId =
    typeof body.anonymousId === "string" && /^[0-9a-z-]{8,40}$/i.test(body.anonymousId) ? body.anonymousId : null;
  if (!EVENTS.has(event)) return new Response("Bad request", { status: 400 });

  try {
    if (!(await allowRequest(`events:${await hashedClientIp()}`, 120, 60 * 60))) {
      return new Response(null, { status: 429 });
    }
    await createAdminClient().from("analytics_events").insert({ event, opportunity_id: opportunityId, anonymous_id: anonymousId });
  } catch (error) {
    // Analytics must never break the page; log and move on.
    console.warn("[events] not recorded", error);
  }
  return new Response(null, { status: 204 });
}
