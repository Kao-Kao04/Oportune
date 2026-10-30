import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const instant = false;

const RANGES = { "7": 7, "30": 30, "90": 90 } as const;

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

// The feature signals from docs/idea/05-validation-metrics-risks.md §13.
export default async function StatsPage({ searchParams }: PageProps<"/admin/stats">) {
  await requireCurator();
  const params = await searchParams;
  const days = RANGES[(typeof params.days === "string" ? params.days : "30") as keyof typeof RANGES] ?? 30;
  const since = daysAgo(days);

  const admin = createAdminClient();
  const [totals, top, bySource, signups, saved, reminders, published] = await Promise.all([
    admin.rpc("analytics_totals", { since }),
    admin.rpc("analytics_top_listings", { since, max_rows: 10 }),
    admin.rpc("analytics_by_ref", { since }),
    admin.from("profiles").select("user_id", { count: "exact", head: true }).gte("created_at", since),
    admin.from("saved_opportunities").select("user_id").gte("created_at", since).limit(1000),
    admin
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("delivery_status", "sent")
      .gte("created_at", since),
    admin.from("opportunities").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);
  for (const r of [totals, top, bySource, signups, saved, reminders, published]) if (r.error) throw r.error;

  const byEvent = new Map((totals.data ?? []).map((t) => [t.event, t]));
  const count = (e: string) => Number(byEvent.get(e)?.events ?? 0);
  const views = count("view");
  const clicks = count("official_click");
  const remindersSent = reminders.count ?? 0;
  const savers = new Set((saved.data ?? []).map((s) => s.user_id)).size;
  const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");
  const sources = bySource.data ?? [];
  const allVisitors = sources.reduce((n, s) => n + Number(s.visitors), 0);
  const returning = sources.reduce((n, s) => n + Number(s.returning_visitors), 0);

  const tiles = [
    { label: "Visitors", value: allVisitors, note: "browsers that opened any page" },
    { label: "Came back another week", value: returning, note: `${pct(returning, allVisitors)} of visitors · target ≥ 20%` },
    { label: "Listing viewers", value: Number(byEvent.get("view")?.visitors ?? 0), note: "browsers that viewed a listing" },
    { label: "Listing views", value: views },
    { label: "Official-link clicks", value: clicks, note: `${pct(clicks, views)} of views · target ≥ 10%` },
    { label: "Shares", value: count("share") },
    { label: "Saves", value: count("save"), note: `${savers} students saved something` },
    { label: "New sign-ups", value: signups.count ?? 0, note: `${pct(savers, signups.count ?? 0)} saved · target ≥ 30%` },
    { label: "Reminders sent", value: remindersSent },
    {
      label: "Reminders opened",
      value: count("reminder_open"),
      note: `${pct(count("reminder_open"), remindersSent)} · target ≥ 30%`,
    },
    { label: "Published listings", value: published.count ?? 0 },
  ];

  return (
    <main className="px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-ink">Stats</h1>
        <nav className="flex gap-2 text-sm">
          {Object.keys(RANGES).map((d) => (
            <Link
              key={d}
              href={`/admin/stats?days=${d}`}
              aria-current={Number(d) === days ? "page" : undefined}
              className={Number(d) === days ? "font-semibold text-teal" : "text-muted"}
            >
              {d} days
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-1 text-sm text-muted">Anonymous counts. Review every 2 weeks; drop or simplify what nobody uses.</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-ui border border-line bg-white p-3">
            <dt className="text-xs text-muted">{t.label}</dt>
            <dd className="tabular mt-1 text-2xl font-bold text-ink">{t.value.toLocaleString("en-US")}</dd>
            {t.note && <dd className="mt-1 text-xs text-muted">{t.note}</dd>}
          </div>
        ))}
      </dl>

      <h2 className="mt-6 text-sm font-semibold text-ink">Where visitors came from</h2>
      <p className="mt-1 text-xs text-muted">
        Give each org its own link, e.g. <code>/?ref=gdg-pup</code> (lowercase letters, numbers, dashes).
      </p>
      {sources.length === 0 ? (
        <p className="mt-2 text-sm text-muted">No visitors yet in this period.</p>
      ) : (
        <table className="tabular mt-2 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="py-2 font-normal">Source</th>
              <th className="py-2 text-right font-normal">Visitors</th>
              <th className="py-2 text-right font-normal">Came back</th>
              <th className="py-2 text-right font-normal">Views</th>
              <th className="py-2 text-right font-normal">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.ref} className="border-b border-line">
                <td className="py-2 pr-2 text-ink">{s.ref}</td>
                <td className="py-2 text-right">{Number(s.visitors)}</td>
                <td className="py-2 text-right">{pct(Number(s.returning_visitors), Number(s.visitors))}</td>
                <td className="py-2 text-right">{Number(s.views)}</td>
                <td className="py-2 text-right">{Number(s.official_clicks)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mt-6 text-sm font-semibold text-ink">Top listings by views</h2>
      {(top.data ?? []).length === 0 ? (
        <p className="mt-2 text-sm text-muted">No views yet in this period.</p>
      ) : (
        <table className="tabular mt-2 w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="py-2 font-normal">Listing</th>
              <th className="py-2 text-right font-normal">Views</th>
              <th className="py-2 text-right font-normal">Clicks</th>
              <th className="py-2 text-right font-normal">Saves</th>
            </tr>
          </thead>
          <tbody>
            {(top.data ?? []).map((row) => (
              <tr key={row.opportunity_id} className="border-b border-line">
                <td className="py-2 pr-2">
                  <Link href={`/admin/opportunities/${row.opportunity_id}`} className="text-ink hover:underline">
                    {row.title}
                  </Link>
                </td>
                <td className="py-2 text-right">{Number(row.views)}</td>
                <td className="py-2 text-right">{Number(row.official_clicks)}</td>
                <td className="py-2 text-right">{Number(row.saves)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
