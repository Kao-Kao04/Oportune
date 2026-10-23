import { unsubscribeByToken } from "@/lib/reminders/unsubscribe";

// One-click unsubscribe (RFC 8058) from the List-Unsubscribe email header.
// Email apps POST here directly; people use /unsubscribe instead.
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const ok = await unsubscribeByToken(token);
  return new Response(ok ? "Unsubscribed" : "Unknown link", { status: ok ? 200 : 404 });
}
