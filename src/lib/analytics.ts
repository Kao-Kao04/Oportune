// Browser-side event tracking (client components only). Fire-and-forget:
// failures are ignored so tracking never gets in a student's way.

import { normalizeRef } from "./ref";

export type TrackedEvent = "view" | "official_click" | "share" | "reminder_open" | "visit";

const ID_KEY = "oportune:aid";
const REF_KEY = "oportune:ref";
const VISIT_KEY = "oportune:visit";

function anonymousId(): string | null {
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return null; // private browsing or storage blocked
  }
}

// The first ?ref= this browser arrived with. Read from the address bar too, so
// the very first event on a shared link already carries it.
function sourceRef(): string | null {
  try {
    const stored = normalizeRef(localStorage.getItem(REF_KEY));
    if (stored) return stored;
    const fromUrl = normalizeRef(new URL(window.location.href).searchParams.get("ref"));
    if (fromUrl) localStorage.setItem(REF_KEY, fromUrl);
    return fromUrl;
  } catch {
    return null;
  }
}

export function track(event: TrackedEvent, opportunityId?: string) {
  try {
    const body = JSON.stringify({ event, opportunityId, anonymousId: anonymousId(), ref: sourceRef() });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/events", blob)) {
      void fetch("/api/events", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // ignore
  }
}

// One "visit" per browser per day (Manila date), so return visits can be
// counted even when nobody opens a listing.
export function trackDailyVisit(today: string) {
  try {
    if (localStorage.getItem(VISIT_KEY) === today) return;
    localStorage.setItem(VISIT_KEY, today);
  } catch {
    return; // without storage we can't tell repeat visits apart; skip
  }
  track("visit");
}
