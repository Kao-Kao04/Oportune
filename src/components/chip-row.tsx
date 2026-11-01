"use client";

import { useEffect, useRef } from "react";

// A row of chips that scrolls sideways on phones and wraps on wider screens
// (where a mouse wheel can't scroll sideways). Keeps the selected chip in
// view without moving the page.
export function ChipRow({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const row = ref.current;
    // The last selected chip: in Browse, "Closing soon" can be on together
    // with a category further along the row.
    const active = [...(row?.querySelectorAll<HTMLElement>('[aria-current="page"]') ?? [])].at(-1);
    if (!row || !active) return;
    const left = active.offsetLeft - row.offsetLeft;
    if (left < row.scrollLeft || left + active.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollLeft = Math.max(0, left - 16);
    }
  });

  return (
    <nav
      ref={ref}
      aria-label={label}
      className={`flex gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:flex-wrap md:overflow-visible ${className}`}
    >
      {children}
    </nav>
  );
}
