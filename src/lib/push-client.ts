// Browser-side push helpers (client components only).

export type PushSupport = "supported" | "ios-needs-install" | "unsupported";

export function pushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported";
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  // iPhone web push only works after "Add to Home Screen".
  if (isIos && !standalone) return "ios-needs-install";
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return "unsupported";
  }
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? "supported" : "unsupported";
}

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  const registration = await navigator.serviceWorker.getRegistration("/");
  return (await registration?.pushManager.getSubscription()) ?? null;
}

// Asks for permission and subscribes this device. Returns the subscription
// as plain JSON for the server, or null if the student said no.
export async function subscribeThisDevice(): Promise<PushSubscriptionJSON | null> {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;
  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
  await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    }));
  return subscription.toJSON();
}
