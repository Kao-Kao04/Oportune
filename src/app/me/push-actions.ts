"use server";

import { getCurrentUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type BrowserSubscription = { endpoint: string; keys: { p256dh: string; auth: string } };

function isValid(sub: unknown): sub is BrowserSubscription {
  const s = sub as BrowserSubscription;
  return (
    typeof s?.endpoint === "string" &&
    s.endpoint.startsWith("https://") &&
    s.endpoint.length < 1000 &&
    typeof s.keys?.p256dh === "string" &&
    typeof s.keys?.auth === "string"
  );
}

// Stores this device's push subscription for the signed-in student. A
// device's endpoint is unique, so if someone else used this browser before,
// their old subscription is replaced (the secret key is needed for that).
export async function savePushSubscription(sub: unknown, userAgent: string): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user || !isValid(sub)) return { ok: false };

  const admin = createAdminClient();
  await admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
  const { error } = await admin.from("push_subscriptions").insert({
    user_id: user.id,
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
    user_agent: userAgent.slice(0, 300),
  });
  if (error) return { ok: false };
  // Turning on notifications on a device means they want push reminders.
  await admin.from("profiles").update({ push_reminders_enabled: true }).eq("user_id", user.id);
  return { ok: true };
}

export async function removePushSubscription(endpoint: string): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const { error } = await createAdminClient()
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);
  return { ok: !error };
}
