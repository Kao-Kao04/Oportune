import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold text-ink">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">The listing may have been removed, or the link is wrong.</p>
      <Link href="/" className="mt-6 inline-block font-semibold text-teal underline">
        Browse opportunities
      </Link>
    </main>
  );
}
