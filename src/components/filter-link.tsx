"use client";

import Link, { useLinkStatus } from "next/link";

// Filter links (tabs, chips, suggestions) keep the scroll position, so
// changing a filter doesn't jump to the top of the page, and show a small
// spinner while the new results load.
export function FilterLink({
  href,
  className,
  current,
  children,
}: {
  href: string;
  className?: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} scroll={false} aria-current={current ? "page" : undefined} className={className}>
      {children}
      <Pending />
    </Link>
  );
}

function Pending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span role="status" className="ml-1.5 inline-flex">
      <span className="sr-only">Loading</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="motion-safe:animate-spin">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
