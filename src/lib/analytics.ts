// Browser-side event tracking (client components only). Fire-and-forget:
// failures are ignored so tracking never gets in a student's way.

export type TrackedEvent = "view" | "official_click" | "share" | "reminder_open";

const ID_KEY = "oportune:aid";

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

export function track(event: TrackedEvent, opportunityId?: string) {
  try {
    const body = JSON.stringify({ event, opportunityId, anonymousId: anonymousId() });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/events", blob)) {
      void fetch("/api/events", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // ignore
  }
}
