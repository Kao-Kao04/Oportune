import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { formatShortDate, todayInManila } from "@/lib/opportunities/dates";
import { createClient } from "@/lib/supabase/server";
import { Flag, StatusLabel } from "./status-label";

export const instant = false;

const STATUSES = ["all", "draft", "published", "expired", "archived"] as const;

export default async function AdminListingsPage({ searchParams }: PageProps<"/admin">) {
  await requireCurator();
  const params = await searchParams;
  const status = STATUSES.find((s) => s === params.status) ?? "all";
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const error = params.error === "admins-only" ? "Only admins can open that page." : null;

  const supabase = await createClient();
  let query = supabase
    .from("opportunities")
    .select("id, title, organization, status, deadline, deadline_type, needs_check, recheck_due, source_trust, categories(name)")
    .order("updated_at", { ascending: false })
    .limit(300);
  if (status !== "all") query = query.eq("status", status);
  // Characters that would break PostgREST's or() filter syntax.
  const safe = q.replace(/[*%,()"\\]/g, " ");
  if (q) query = query.or(`title.ilike.*${safe}*,organization.ilike.*${safe}*`);
  const { data: rows, error: loadError } = await query;
  if (loadError) throw loadError;
  const today = todayInManila();

  return (
    <main className="px-4 py-4">
      {error && <p className="mb-3 rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-ink">Listings</h1>
        <Link href="/admin/opportunities/new" className="rounded-ui bg-teal px-3 py-2 text-sm font-semibold text-white">
          New listing
        </Link>
      </div>

      <form className="mt-3 flex gap-2" action="/admin">
        <select name="status" defaultValue={status} className="h-10 rounded-ui border border-line bg-white px-2 text-sm">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Title or organization"
          className="h-10 min-w-0 flex-1 rounded-ui border border-line bg-white px-3 text-sm"
        />
        <button type="submit" className="h-10 rounded-ui border border-line bg-white px-3 text-sm">
          Filter
        </button>
      </form>

      <p className="tabular mt-3 text-xs text-muted">{rows.length} listings</p>
      <ul className="mt-1 border-t border-line">
        {rows.map((row) => (
          <li key={row.id} className="border-b border-line">
            <Link href={`/admin/opportunities/${row.id}`} className="block py-3 hover:bg-ink/[0.03]">
              <div className="flex flex-wrap items-center gap-2">
                <StatusLabel status={row.status} />
                {row.needs_check && <Flag>Needs check</Flag>}
                {row.recheck_due && <Flag>Re-check due</Flag>}
                <span className="tabular text-xs text-muted">
                  {row.deadline_type === "date" && row.deadline
                    ? formatShortDate(row.deadline, today)
                    : row.deadline_type === "rolling"
                      ? "Rolling"
                      : "TBA"}
                </span>
              </div>
              <div className="mt-1 font-semibold text-ink">{row.title}</div>
              <div className="text-sm text-muted">
                {row.organization} · {row.categories?.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
