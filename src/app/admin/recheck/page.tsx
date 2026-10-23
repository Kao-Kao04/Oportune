import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { sourceHost } from "@/lib/opportunities/listing";
import { createClient } from "@/lib/supabase/server";
import { markChecked } from "../actions";
import { Flag, StatusLabel } from "../status-label";

export const instant = false;

// Listings to confirm: imported as "needs check", or rolling/TBA listings not
// checked for 30+ days (set by the daily job, M5).
export default async function RecheckPage() {
  await requireCurator();
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("opportunities")
    .select("id, title, organization, status, needs_check, recheck_due, source_url, last_checked_at, notes")
    .or("needs_check.eq.true,recheck_due.eq.true")
    .neq("status", "archived")
    .order("last_checked_at", { ascending: true, nullsFirst: true });
  if (error) throw error;

  return (
    <main className="px-4 py-4">
      <h1 className="text-xl font-bold text-ink">Re-check</h1>
      <p className="mt-1 text-sm text-muted">
        Open the source, confirm the details, then edit the listing (turn off “Needs check” and publish) or mark it
        checked.
      </p>
      {rows.length === 0 ? (
        <p className="mt-8 text-center text-muted">Nothing to re-check. Nice.</p>
      ) : (
        <ul className="mt-4 border-t border-line">
          {rows.map((row) => (
            <li key={row.id} className="border-b border-line py-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusLabel status={row.status} />
                {row.needs_check && <Flag>Needs check</Flag>}
                {row.recheck_due && <Flag>Re-check due</Flag>}
                <span className="tabular text-xs text-muted">
                  Last checked {row.last_checked_at ? formatLongDate(todayInManila(new Date(row.last_checked_at))) : "never"}
                </span>
              </div>
              <Link href={`/admin/opportunities/${row.id}`} className="mt-1 block font-semibold text-ink hover:underline">
                {row.title}
              </Link>
              <div className="text-sm text-muted">{row.organization}</div>
              {row.notes && <p className="mt-1 line-clamp-3 text-sm text-ink">{row.notes}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={row.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm text-teal"
                >
                  Open {sourceHost(row.source_url)}
                </a>
                <Link
                  href={`/admin/opportunities/${row.id}`}
                  className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm"
                >
                  Edit
                </Link>
                {!row.needs_check && (
                  <form action={markChecked}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="back" value="/admin/recheck" />
                    <button type="submit" className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm">
                      Still correct: mark checked
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
