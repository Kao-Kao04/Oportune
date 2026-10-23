"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

// Phone share sheet when available (Messenger, group chats); otherwise
// copy link + Facebook (docs/system-design/04-api-and-logic.md §7.4).
export function ShareButton({
  title,
  path,
  opportunityId,
  compact = false,
}: {
  title: string;
  path: string;
  opportunityId?: string;
  compact?: boolean;
}) {
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function url() {
    return new URL(path, window.location.origin).toString();
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: url() });
        track("share", opportunityId);
      } catch {
        // The student closed the share sheet; nothing to do.
      }
      return;
    }
    setFallbackOpen((open) => !open);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      track("share", opportunityId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url());
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={share}
        className={`inline-flex h-11 items-center gap-2 rounded-ui border border-ink/20 bg-white text-sm font-semibold text-ink hover:border-ink/40 ${compact ? "px-3" : "px-4"}`}
        aria-expanded={fallbackOpen}
        aria-label={compact ? "Share" : undefined}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {!compact && "Share"}
      </button>
      {fallbackOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 rounded-ui border border-line bg-white py-1 shadow-lg">
          <button type="button" onClick={copy} className="block w-full px-4 py-2 text-left text-sm hover:bg-ink/5">
            {copied ? "Link copied" : "Copy link"}
          </button>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("share", opportunityId)}
            className="block px-4 py-2 text-sm hover:bg-ink/5"
          >
            Share on Facebook
          </a>
        </div>
      )}
    </div>
  );
}
