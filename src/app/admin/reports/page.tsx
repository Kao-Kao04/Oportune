import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { createClient } from "@/lib/supabase/server";
import { updateReport } from "../actions";

export const instant = false;

const REASONS: Record<string, string> = {
  wrong_info: "Wrong information",
  expired: "Already closed",
  scam: "Looks like a scam",
  other: "Something else",
};

export default async function ReportsPage({ searchParams }: PageProps<"/admin/reports">) {
  await requireCurator();
  const params = await searchParams;
  const showAll = params.show === "all";

  const supabase = await createClient();
  let query = supabase
    .from("opportunity_reports")
    .select("id, reason, details, status, created_at, opportunity_id, opportunities(title, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (!showAll) query = query.eq("status", "open");
  const { data: reports, error } = await query;
  if (error) throw error;

  return (
    <main className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Reports</h1>
        <Link href={showAll ? "/admin/reports" : "/admin/reports?show=all"} className="text-sm text-teal underline">
          {showAll ? "Open only" : "Show all"}
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted">Target: fix within 48 hours.</p>

      {reports.length === 0 ? (
        <p className="mt-8 text-center text-muted">No open reports.</p>
      ) : (
        <ul className="mt-4 border-t border-line">
          {reports.map((r) => (
            <li key={r.id} className="border-b border-line py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`font-semibold ${r.reason === "scam" ? "text-urgent" : "text-ink"}`}>
                  {REASONS[r.reason] ?? r.reason}
                </span>
                <span className="tabular text-muted">{formatLongDate(todayInManila(new Date(r.created_at)))}</span>
                {r.status !== "open" && <span className="capitalize text-muted">· {r.status}</span>}
              </div>
              <Link
                href={`/admin/opportunities/${r.opportunity_id}`}
                className="mt-1 block font-semibold text-ink hover:underline"
              >
                {r.opportunities?.title ?? "Deleted listing"}
              </Link>
              {r.details && <p className="mt-1 whitespace-pre-line text-sm text-ink">{r.details}</p>}
              {r.status === "open" && (
                <div className="mt-2 flex gap-2">
                  {(["fixed", "dismissed"] as const).map((status) => (
                    <form key={status} action={updateReport}>
                      <input type="hidden" name="id" value={r.id} />
                      <input type="hidden" name="status" value={status} />
                      <button type="submit" className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm">
                        {status === "fixed" ? "Mark fixed" : "Dismiss"}
                      </button>
                    </form>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
