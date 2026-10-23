"use client";

import { useEffect, useState } from "react";
import { savePushSubscription } from "@/app/me/push-actions";
import { pushSupport, subscribeThisDevice, type PushSupport } from "@/lib/push-client";

const DISMISSED_KEY = "oportune:push-prompt-dismissed";

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

// Shown right after a save (never on first visit): offers a phone
// notification before the deadline, or the iPhone home-screen hint.
export function PushPrompt({ onClose }: { onClose: () => void }) {
  // Only rendered after a click, so this runs in the browser.
  const [support] = useState<PushSupport | null>(() => {
    const s = pushSupport();
    // Ask only once per device, and only while the browser hasn't decided.
    if (readDismissed() || s === "unsupported" || (s === "supported" && Notification.permission !== "default")) {
      return null;
    }
    return s;
  });
  const [status, setStatus] = useState<"idle" | "working" | "done" | "denied">("idle");

  useEffect(() => {
    if (!support) onClose();
  }, [support, onClose]);

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Private browsing: the prompt may show again next time.
    }
    onClose();
  }

  async function turnOn() {
    setStatus("working");
    try {
      const sub = await subscribeThisDevice();
      if (!sub) {
        setStatus("denied");
        return;
      }
      const { ok } = await savePushSubscription(sub, navigator.userAgent);
      setStatus(ok ? "done" : "denied");
    } catch {
      setStatus("denied");
    }
  }

  if (!support) return null;

  return (
    <div role="dialog" aria-label="Phone notifications" className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-md rounded-ui border border-line bg-white p-4 shadow-lg">
      {status === "done" ? (
        <>
          <p className="font-semibold text-ink">Notifications are on</p>
          <p className="mt-1 text-sm text-muted">We&apos;ll notify this phone 7 days and 1 day before the deadline.</p>
          <button type="button" onClick={onClose} className="mt-3 text-sm font-semibold text-teal">
            OK
          </button>
        </>
      ) : support === "ios-needs-install" ? (
        <>
          <p className="font-semibold text-ink">Get a reminder on your iPhone</p>
          <p className="mt-1 text-sm text-muted">
            Tap Share, then <span className="font-semibold">Add to Home Screen</span>. Open Oportune from your home screen to
            turn on notifications. We&apos;ll still email you.
          </p>
          <button type="button" onClick={dismiss} className="mt-3 text-sm font-semibold text-teal">
            Got it
          </button>
        </>
      ) : (
        <>
          <p className="font-semibold text-ink">Saved. Want a phone notification too?</p>
          <p className="mt-1 text-sm text-muted">
            {status === "denied"
              ? "Notifications are blocked for this site. You can allow them in your browser settings. We'll still email you."
              : "We'll notify you 7 days and 1 day before the deadline."}
          </p>
          <div className="mt-3 flex gap-3">
            {status !== "denied" && (
              <button
                type="button"
                onClick={turnOn}
                disabled={status === "working"}
                className="h-10 rounded-ui bg-teal px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {status === "working" ? "Turning on…" : "Turn on"}
              </button>
            )}
            <button type="button" onClick={dismiss} className="h-10 px-2 text-sm text-muted">
              {status === "denied" ? "OK" : "Not now"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
