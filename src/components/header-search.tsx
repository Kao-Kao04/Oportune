"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// On Browse, jumps to the search field and focuses it, keeping the current
// filters. Elsewhere, opens Browse with the search field focused.
export function HeaderSearch() {
  const router = useRouter();

  function open(e: React.MouseEvent<HTMLAnchorElement>) {
    const input = document.getElementById("search");
    if (window.location.pathname === "/" && input) {
      e.preventDefault();
      input.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      input.focus({ preventScroll: true });
      return;
    }
    e.preventDefault();
    router.push("/#search");
  }

  return (
    <Link href="/#search" onClick={open} className="sticker press flex h-11 w-11 items-center justify-center" aria-label="Search opportunities">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
