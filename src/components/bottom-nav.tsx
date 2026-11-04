import Link from "next/link";

const TABS = [
  { href: "/", label: "Browse", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/saved", label: "Saved", icon: "M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" },
  { href: "/submit", label: "Submit", icon: "M12 5v14M5 12h14" },
  { href: "/me", label: "Me", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
] as const;

export type MainTab = (typeof TABS)[number]["href"];

// Rendered by the main screens only; listing pages have their own action bar.
// Icon above label so four tabs fit a 360px phone.
export function BottomNav({ active }: { active: MainTab }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-card pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid h-16 max-w-2xl grid-cols-4 gap-1 px-2 py-1.5">
        {TABS.map((tab) => {
          const isActive = active === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-ui text-xs font-bold ${
                isActive ? "border-2 border-ink bg-sun text-ink" : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive && tab.href === "/saved" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
                <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
