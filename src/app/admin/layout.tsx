import type { Metadata } from "next";
import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../sign-in/actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// Admin pages read the session on every request; let them block on the server.
export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireCurator();
  const supabase = await createClient();
  const [{ count: openReports }, { count: recheck }] = await Promise.all([
    supabase.from("opportunity_reports").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .or("needs_check.eq.true,recheck_due.eq.true")
      .neq("status", "archived"),
  ]);

  const links = [
    { href: "/admin", label: "Listings" },
    { href: "/admin/recheck", label: "Re-check", count: recheck },
    { href: "/admin/reports", label: "Reports", count: openReports },
    { href: "/admin/import", label: "Import" },
    ...(user.role === "admin" ? [{ href: "/admin/roles", label: "Users & roles" }] : []),
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-line bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-muted">
            {user.email} · <span className="font-semibold text-ink">{user.role}</span>
          </span>
          <form action={signOut}>
            <button type="submit" className="text-teal underline">
              Sign out
            </button>
          </form>
        </div>
        <nav aria-label="Admin" className="mt-3 flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-ui border border-line px-3 py-1.5 text-sm text-ink hover:border-muted"
            >
              {link.label}
              {link.count ? (
                <span className="tabular ml-1.5 rounded-ui bg-urgent px-1.5 text-xs font-semibold text-white">
                  {link.count}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
