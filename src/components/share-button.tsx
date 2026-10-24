"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

// Phone share sheet when available (Messenger, group chats); otherwise a
// menu with Messenger first, then copy and Facebook (§7.4). `message` is a
// ready-made line students can send as-is.
export function ShareButton({
  title,
  path,
  message,
  opportunityId,
  compact = false,
}: {
  title: string;
  path: string;
  message?: string;
  opportunityId?: string;
  compact?: boolean;
}) {
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function url() {
    return new URL(path, window.location.origin).toString();
  }

  function isPhone() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: message, url: url() });
        track("share", opportunityId);
      } catch {
        // The student closed the share sheet; nothing to do.
      }
      return;
    }
    setFallbackOpen((open) => !open);
  }

  async function copy() {
    const text = message ? `${message} ${url()}` : url();
    try {
      await navigator.clipboard.writeText(text);
      track("share", opportunityId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this:", text);
    }
  }

  const item = "flex min-h-12 w-full items-center px-4 text-left text-sm font-semibold hover:bg-sun";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={share}
        className={`press inline-flex h-12 items-center justify-center gap-2 rounded-ui border-2 border-ink bg-card text-sm font-bold text-ink shadow-[3px_3px_0_0_#111] ${compact ? "w-12" : "px-4"}`}
        aria-expanded={fallbackOpen || undefined}
        aria-label={compact ? "Share" : undefined}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {!compact && "Share"}
      </button>
      {fallbackOpen && (
        <div className="sticker absolute bottom-full left-0 z-20 mb-3 w-60 overflow-hidden py-1">
          {isPhone() && (
            <a
              href={`fb-messenger://share/?link=${encodeURIComponent(url())}`}
              onClick={() => track("share", opportunityId)}
              className={`${item} font-semibold`}
            >
              Send in Messenger
            </a>
          )}
          <button type="button" onClick={copy} className={item}>
            {copied ? "Copied!" : message ? "Copy message and link" : "Copy link"}
          </button>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("share", opportunityId)}
            className={item}
          >
            Share on Facebook
          </a>
        </div>
      )}
    </div>
  );
}
