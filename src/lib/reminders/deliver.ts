import "server-only";
import webpush from "web-push";

// Delivery channels. Each one is "configured" only when its keys are set, so
// local development without keys never sends anything.

const BASE_URL = () => process.env.APP_BASE_URL ?? "http://localhost:3000";

export function emailConfigured(): boolean {
  return Boolean(process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_FROM_ADDRESS);
}

export function pushConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT,
  );
}

export type ReminderContent = {
  title: string;
  organization: string;
  subject: string;
  deadlineText: string;
  path: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export type DeliveryResult = { ok: true } | { ok: false; error: string; gone?: boolean };

// Reminder email through Resend (https://resend.com/docs/api-reference/emails/send-email).
export async function sendReminderEmail(to: string, unsubscribeToken: string, content: ReminderContent): Promise<DeliveryResult> {
  const url = `${BASE_URL()}${content.path}`;
  const unsubscribeUrl = `${BASE_URL()}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const html = `<!doctype html><html><body style="margin:0;background:#faf8f3;font-family:Arial,sans-serif;color:#1c1b19">
<div style="max-width:520px;margin:0 auto;padding:24px">
<p style="margin:0 0 16px;font-weight:bold;color:#0f5257">Oportune</p>
<h1 style="font-size:20px;line-height:1.3;margin:0 0 4px">${escapeHtml(content.title)}</h1>
<p style="margin:0 0 16px;color:#6b675f">${escapeHtml(content.organization)}</p>
<p style="margin:0 0 20px;font-weight:bold">${escapeHtml(content.deadlineText)}</p>
<p style="margin:0 0 24px"><a href="${url}" style="display:inline-block;background:#0f5257;color:#fff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:bold">View the listing</a></p>
<p style="margin:0 0 8px;font-size:13px;color:#6b675f">You saved this listing on Oportune. Always confirm details on the official site.</p>
<p style="margin:0;font-size:13px;color:#6b675f"><a href="${unsubscribeUrl}" style="color:#6b675f">Stop reminder emails</a></p>
</div></body></html>`;
  const text = `${content.title}\n${content.organization}\n\n${content.deadlineText}\n\nView the listing: ${url}\n\nStop reminder emails: ${unsubscribeUrl}\n`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_PROVIDER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM_ADDRESS,
      to: [to],
      subject: content.subject,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${BASE_URL()}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  if (res.ok) return { ok: true };
  return { ok: false, error: `email ${res.status}: ${(await res.text()).slice(0, 200)}` };
}

let vapidSet = false;

export async function sendReminderPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  content: ReminderContent,
): Promise<DeliveryResult> {
  if (!vapidSet) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
    vapidSet = true;
  }
  try {
    await webpush.sendNotification(
      { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
      JSON.stringify({ title: content.subject, body: `${content.organization} · ${content.deadlineText}`, url: content.path }),
      { TTL: 60 * 60 * 12 },
    );
    return { ok: true };
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode;
    // 404/410: the browser dropped this subscription; remove it.
    return { ok: false, error: `push ${status ?? "error"}`, gone: status === 404 || status === 410 };
  }
}
