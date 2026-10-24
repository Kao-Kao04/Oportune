"use client";

import { useState } from "react";
import { WELCOME_COOKIE } from "@/lib/welcome";

// One-line intro for first-time visitors. The server decides whether to show
// it (cookie), so there is no layout jump; closing it remembers for a year.
export function WelcomeNote() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  function dismiss() {
    document.cookie = `${WELCOME_COOKIE}=1; max-age=31536000; path=/; samesite=lax`;
    setOpen(false);
  }

  return (
    <div className="sticker mx-4 mt-4 flex items-start gap-2 bg-sky py-2 pl-3 pr-1">
      <p className="flex-1 py-1 text-sm text-ink">
        <span className="font-bold">Bago ka dito?</span> Browse without an account. Save a listing and we&apos;ll remind you
        before it closes. Every listing is checked by our team.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide this message"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ui text-ink hover:bg-ink/10"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
