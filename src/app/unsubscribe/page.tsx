import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { unsubscribeByToken } from "@/lib/reminders/unsubscribe";

export const metadata: Metadata = { title: "Stop reminder emails", robots: { index: false } };

export const instant = false;

async function unsubscribe(form: FormData) {
  "use server";
  const token = String(form.get("token") ?? "");
  const ok = await unsubscribeByToken(token);
  redirect(ok ? "/unsubscribe?done=1" : "/unsubscribe?error=1");
}

// A button, not an automatic unsubscribe on open: email scanners open links.
export default async function UnsubscribePage({ searchParams }: PageProps<"/unsubscribe">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <main className="px-4 py-12">
      <h1 className="font-display text-[32px] font-extrabold leading-tight tracking-tight text-ink">Reminder emails</h1>
      {params.done ? (
        <p className="mt-3 text-ink">
          Done. You won&apos;t get reminder emails anymore. You can turn them back on in{" "}
          <Link href="/me" className="text-teal underline">
            Me
          </Link>
          .
        </p>
      ) : params.error || !token ? (
        <p className="mt-3 text-ink">
          This link doesn&apos;t work anymore. Sign in and turn off email reminders in{" "}
          <Link href="/me" className="text-teal underline">
            Me
          </Link>
          .
        </p>
      ) : (
        <form action={unsubscribe} className="mt-4">
          <input type="hidden" name="token" value={token} />
          <p className="text-ink">Stop getting deadline reminder emails for your saved listings?</p>
          <button type="submit" className="btn-pop press mt-4">
            Stop reminder emails
          </button>
        </form>
      )}
    </main>
  );
}
