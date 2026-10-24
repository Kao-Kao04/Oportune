import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

// Display font for headings and dates: chunky and friendly.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "Oportune — opportunities for college students in the Philippines",
    template: "%s · Oportune",
  },
  description:
    "Verified scholarships, internships, hackathons, and free courses for college students in the Philippines, sorted by deadline.",
  openGraph: { siteName: "Oportune", type: "website", locale: "en_PH" },
};

export const viewport: Viewport = {
  themeColor: "#fff6e5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${publicSans.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper">
          <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Oportune home">
              <LogoMark />
              <span className="font-display text-2xl font-extrabold tracking-tight text-ink">oportune</span>
            </Link>
            <Link
              href="/?view=all#search"
              className="sticker press flex h-11 w-11 items-center justify-center"
              aria-label="Search opportunities"
            >
              <SearchIcon />
            </Link>
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">{children}</div>
        {/* Bottom padding leaves room for the fixed bottom nav on main screens. */}
        <footer className="mx-auto w-full max-w-2xl px-4 pb-24 pt-10 text-sm text-muted">
          <p>
            <span className="font-display font-extrabold text-ink">oportune</span> · Checked by our team. Always confirm
            on the official site.
          </p>
          <p className="mt-1 flex gap-4">
            <Link href="/privacy" className="inline-block py-2 underline">
              Privacy
            </Link>
            <Link href="/terms" className="inline-block py-2 underline">
              Terms
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}

// A tilted ticket stub: the brand mark (decorative; the link has a label).
function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <g transform="rotate(-8 16 16)">
        <rect x="3" y="7" width="26" height="18" rx="4" fill="#ffd23f" stroke="#111" strokeWidth="2.5" />
        <path d="M11 7v18" stroke="#111" strokeWidth="2" strokeDasharray="2.5 2.5" />
        <circle cx="20" cy="16" r="3.5" fill="#111" />
      </g>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
