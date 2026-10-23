"use client";

import { useEffect, useState } from "react";
import { currentSubscription, pushSupport, subscribeThisDevice } from "@/lib/push-client";
import { removePushSubscription, savePushSubscription } from "./push-actions";

type DeviceState = "loading" | "on" | "off" | "blocked" | "ios-needs-install" | "unsupported";

// Phone notifications on *this* device (each phone/browser subscribes separately).
export function PushDevice() {
  const [state, setState] = useState<DeviceState>("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const support = pushSupport();
      if (support !== "supported") return setState(support);
      if (Notification.permission === "denied") return setState("blocked");
      setState((await currentSubscription()) ? "on" : "off");
    })().catch(() => setState("unsupported"));
  }, []);

  async function turnOn() {
    setBusy(true);
    try {
      const sub = await subscribeThisDevice();
      if (!sub) return setState(Notification.permission === "denied" ? "blocked" : "off");
      const { ok } = await savePushSubscription(sub, navigator.userAgent);
      setState(ok ? "on" : "off");
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    try {
      const sub = await currentSubscription();
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("off");
    } finally {
      setBusy(false);
    }
  }

  const text: Record<DeviceState, string> = {
    loading: "Checking this device…",
    on: "On for this device.",
    off: "Off for this device.",
    blocked: "Blocked in your browser settings for this site.",
    "ios-needs-install": "On iPhone: tap Share → Add to Home Screen, then open Oportune from there to turn this on.",
    unsupported: "This browser can't show notifications. We'll email you instead.",
  };

  return (
    <div className="text-sm">
      <p className="text-muted">{text[state]}</p>
      {(state === "on" || state === "off") && (
        <button
          type="button"
          onClick={state === "on" ? turnOff : turnOn}
          disabled={busy}
          className="mt-2 h-9 rounded-ui border border-line bg-white px-3 font-semibold text-ink disabled:opacity-60"
        >
          {state === "on" ? "Turn off on this device" : "Turn on for this device"}
        </button>
      )}
    </div>
  );
}
