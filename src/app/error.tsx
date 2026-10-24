"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown when a page fails to load (e.g. the database can't be reached), so
// students get a way out instead of a blank screen.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="px-4 py-12">
      <div className="sticker bg-sky p-6 text-center">
        <h1 className="font-display text-2xl font-extrabold text-ink">Hindi ma-load ngayon</h1>
        <p className="mt-2 text-ink">Something went wrong loading this page. Check your connection and try again.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => retry()} className="btn-pop press">
            Try again
          </button>
          <Link href="/" className="btn-plain press">
            Go to Browse
          </Link>
        </div>
      </div>
    </main>
  );
}
