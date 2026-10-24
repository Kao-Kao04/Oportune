"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LAST_BROWSE_KEY = "oportune:last-browse";

// Browse remembers its URL (filters included) for this tab.
export function RememberBrowse() {
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_BROWSE_KEY, window.location.pathname + window.location.search);
    } catch {
      // storage blocked: Back falls back to the plain list
    }
  });
  return null;
}

// "← All opportunities" goes back to the list the student came from, with
// its filters and scroll position. Opened from a shared link (nothing to go
// back to in this tab), it goes to Browse instead.
export function BackLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();

  function back(e: React.MouseEvent<HTMLAnchorElement>) {
    let last: string | null = null;
    try {
      last = sessionStorage.getItem(LAST_BROWSE_KEY);
    } catch {}
    e.preventDefault();
    if (last && window.history.length > 1) router.back();
    else router.push(last ?? "/");
  }

  return (
    <Link href="/" onClick={back} className={className}>
      {children}
    </Link>
  );
}
