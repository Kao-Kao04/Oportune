"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { toggleSave, type SaveResult } from "@/app/saved/actions";
import { PushPrompt } from "./push-prompt";

// Bookmark button. `autoSave` finishes a save that started before sign-in.
export function SaveButton({
  opportunityId,
  initialSaved,
  back,
  autoSave = false,
  compact = false,
}: {
  opportunityId: string;
  initialSaved: boolean;
  back: string;
  autoSave?: boolean;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<SaveResult, FormData>(toggleSave, { saved: initialSaved });
  const formRef = useRef<HTMLFormElement>(null);
  const autoSaved = useRef(false);
  // After the first save on this page, offer phone notifications.
  const [promptOpen, setPromptOpen] = useState(false);
  const wasSaved = useRef(initialSaved);
  useEffect(() => {
    if (state.saved && !wasSaved.current && !state.error) setPromptOpen(true);
    wasSaved.current = state.saved;
  }, [state.saved, state.error]);
  const closePrompt = useCallback(() => setPromptOpen(false), []);

  useEffect(() => {
    if (!autoSave || autoSaved.current || initialSaved) return;
    autoSaved.current = true;
    formRef.current?.requestSubmit();
    // Drop ?save=1 so a refresh doesn't save again after an unsave.
    const url = new URL(window.location.href);
    url.searchParams.delete("save");
    window.history.replaceState(null, "", url);
  }, [autoSave, initialSaved]);

  const saved = state.saved;
  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="opportunity_id" value={opportunityId} />
      <input type="hidden" name="back" value={back} />
      <input type="hidden" name="intent" value={saved ? "unsave" : "save"} />
      <button
        type="submit"
        disabled={pending}
        aria-pressed={saved}
        aria-label={compact ? (saved ? "Remove from saved" : "Save") : undefined}
        className={`inline-flex h-11 items-center gap-2 rounded-ui border px-4 text-sm font-semibold disabled:opacity-60 ${
          saved ? "border-teal bg-teal/10 text-teal" : "border-ink/20 bg-white text-ink hover:border-ink/40"
        } ${compact ? "px-3" : ""}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" strokeLinejoin="round" />
        </svg>
        {!compact && (saved ? "Saved" : "Save")}
      </button>
      {state.error && (
        <p role="alert" className="mt-1 text-xs text-urgent">
          {state.error}
        </p>
      )}
      {promptOpen && <PushPrompt onClose={closePrompt} />}
    </form>
  );
}
