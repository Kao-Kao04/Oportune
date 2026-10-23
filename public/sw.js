// Oportune service worker: shows deadline reminders sent by the server.
// Kept tiny on purpose; no offline caching yet (Phase 3).

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Oportune", body: event.data.text(), url: "/saved" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Oportune", {
      body: data.body || "",
      icon: "/icon/192",
      badge: "/icon/192",
      data: { url: data.url || "/saved" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Only open pages on this site.
  const url = new URL(event.notification.data?.url || "/saved", self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((w) => w.url === url.href);
      return existing ? existing.focus() : self.clients.openWindow(url.href);
    }),
  );
});
