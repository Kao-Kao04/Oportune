import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account deleted", robots: { index: false } };

export default function AccountDeletedPage() {
  return (
    <main className="px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-ink">Your account is deleted</h1>
      <p className="mt-2 text-muted">Your profile, saved items, and reminders are gone. You can still browse anytime.</p>
      <Link href="/" className="mt-6 inline-block font-semibold text-teal underline">
        Browse opportunities
      </Link>
    </main>
  );
}
