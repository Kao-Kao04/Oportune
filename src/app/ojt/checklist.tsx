"use client";

import { useSyncExternalStore } from "react";
import type { ChecklistStage } from "@/lib/ojt-checklist";

const STORAGE_KEY = "oportune:ojt-checklist";

const CHANGE_EVENT = "oportune:ojt-checklist-change";

// In-memory copy, so ticks still work when storage is blocked (private mode).
let memory = "[]";

function read(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memory;
  } catch {
    return memory;
  }
}

function store(done: Set<string>) {
  memory = JSON.stringify([...done]);
  try {
    window.localStorage.setItem(STORAGE_KEY, memory);
  } catch {
    // Storage blocked: ticks last until the page closes.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function parse(raw: string | null): Set<string> {
  try {
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

// Ticks are remembered on this phone only (nothing is sent to our servers).
export function Checklist({ stages }: { stages: ChecklistStage[] }) {
  // null on the server and during hydration, so the HTML matches.
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const loaded = raw !== null;
  const done = parse(raw);

  const total = stages.reduce((n, s) => n + s.items.length, 0);
  const count = stages.reduce((n, s) => n + s.items.filter((i) => done.has(`${s.id}:${i.id}`)).length, 0);

  function toggle(key: string) {
    const next = parse(read());
    if (next.has(key)) next.delete(key);
    else next.add(key);
    store(next);
  }

  return (
    <div>
      <div className="sticker mt-5 flex items-center gap-3 bg-sun p-3" aria-live="polite">
        <span className="tabular font-display text-2xl font-extrabold text-ink">
          {loaded ? count : 0}/{total}
        </span>
        <div className="h-3 flex-1 overflow-hidden rounded-pill border-2 border-ink bg-card">
          <div className="h-full bg-ink transition-[width]" style={{ width: `${loaded ? (count / total) * 100 : 0}%` }} />
        </div>
        <span className="sr-only">items done</span>
      </div>

      {stages.map((stage) => (
        <section key={stage.id} aria-labelledby={`stage-${stage.id}`} className="mt-6">
          <h2 id={`stage-${stage.id}`} className="font-display text-xl font-extrabold text-ink">
            {stage.title}
          </h2>
          <ul className="sticker mt-2 divide-y-2 divide-dashed divide-line">
            {stage.items.map((item) => {
              const key = `${stage.id}:${item.id}`;
              const checked = done.has(key);
              return (
                <li key={item.id}>
                  <label className="flex min-h-14 cursor-pointer items-start gap-3 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(key)}
                      className="mt-0.5 h-6 w-6 shrink-0 accent-ink"
                    />
                    <span className="min-w-0">
                      <span className={`font-semibold text-ink ${checked ? "line-through decoration-2" : ""}`}>
                        {item.text}
                      </span>
                      {item.source === "cmo104" && (
                        <span className="tag ml-2 bg-mint align-middle text-xs">CHED rule</span>
                      )}
                      {item.detail && <span className="mt-0.5 block text-sm text-muted">{item.detail}</span>}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      {loaded && count > 0 && (
        <button
          type="button"
          onClick={() => store(new Set())}
          className="mt-4 min-h-11 text-sm font-bold text-muted underline"
        >
          Clear all ticks
        </button>
      )}
    </div>
  );
}
