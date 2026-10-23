import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
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
  themeColor: "#faf8f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${publicSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-bold tracking-tight text-ink">
              Oportune
            </Link>
            <Link
              href="/?view=all#search"
              className="rounded-ui p-2 text-ink hover:bg-ink/5"
              aria-label="Search opportunities"
            >
              <SearchIcon />
            </Link>
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">{children}</div>
        {/* Bottom padding leaves room for the fixed bottom nav on main screens. */}
        <footer className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 text-sm text-muted">
          <p>Checked by our team. Always confirm on the official site.</p>
          <p className="mt-2 flex gap-4">
            <Link href="/privacy" className="underline">
              Privacy
            </Link>
            <Link href="/terms" className="underline">
              Terms
            </Link>
          </p>
        </footer>
      </body>
    </html>
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
