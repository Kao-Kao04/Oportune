"use client";

import { useEffect, useRef } from "react";
import { track, trackDailyVisit } from "@/lib/analytics";
import { todayInManila } from "@/lib/opportunities/dates";
import { normalizeRef } from "@/lib/ref";

// On every page: one daily "visit", tagged with the org's ?ref= if the
// student came from a shared link. The tag is then removed from the address
// bar so links the student shares stay clean.
export function VisitTracker() {
  useEffect(() => {
    trackDailyVisit(todayInManila());
    const url = new URL(window.location.href);
    if (normalizeRef(url.searchParams.get("ref"))) {
      url.searchParams.delete("ref");
      window.history.replaceState(null, "", url);
    }
  }, []);
  return null;
}

// Records a listing view, and a reminder open when the student arrived from a
// reminder (?ref=reminder, then removed from the address bar).
export function ViewTracker({ opportunityId }: { opportunityId: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track("view", opportunityId);
    const url = new URL(window.location.href);
    if (url.searchParams.get("ref") === "reminder") {
      track("reminder_open", opportunityId);
      url.searchParams.delete("ref");
      window.history.replaceState(null, "", url);
    }
  }, [opportunityId]);
  return null;
}

// External link that records an "official link" click.
export function OfficialLink({
  href,
  opportunityId,
  className,
  children,
}: {
  href: string;
  opportunityId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("official_click", opportunityId)}
    >
      {children}
    </a>
  );
}
