import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { sourceHost } from "@/lib/opportunities/listing";
import { createClient } from "@/lib/supabase/server";
import { suggestHeadline, WIN_RESULTS, WIN_STATUS_LABELS, winEmoji, type WinStatus } from "@/lib/wins";
import { reviewWin } from "../actions";

export const instant = false;

export default async function WinsPage({ searchParams }: PageProps<"/admin/wins">) {
  await requireCurator();
  const params = await searchParams;
  const showAll = params.show === "all";

  const supabase = await createClient();
  let query = supabase
    .from("opportunity_wins")
    .select("id, result, team, detail, proof_url, headline, status, created_at, opportunity:opportunities(id, title, slug)")
    .order("created_at", { ascending: true })
    .limit(200);
  if (!showAll) query = query.eq("status", "new");
  const { data: wins, error } = await query;
  if (error) throw error;

  return (
    <main className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Wins</h1>
        <Link href={showAll ? "/admin/wins" : "/admin/wins?show=all"} className="text-sm text-teal underline">
          {showAll ? "New only" : "Show all"}
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted">
        Oldest first. Confirm it on the organizer&apos;s or school&apos;s own announcement, then write a short headline in our
        own words. Team or school names only: no individual names unless they gave written consent.
      </p>
      {params.error === "headline" && (
        <p role="alert" className="mt-3 rounded-ui border border-urgent px-3 py-2 text-sm text-urgent">
          Write a headline (at least 5 characters) before publishing.
        </p>
      )}

      {wins.length === 0 ? (
        <p className="mt-8 text-center text-muted">No new wins.</p>
      ) : (
        <ul className="mt-4 border-t border-line">
          {wins.map((w) => (
            <li key={w.id} className="border-b border-line py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="font-semibold text-ink">
                  {winEmoji(w.result)} {WIN_RESULTS.find((r) => r.value === w.result)?.label ?? w.result}
                </span>
                <span className="tabular">{formatLongDate(todayInManila(new Date(w.created_at)))}</span>
                {w.status !== "new" && <span>· {WIN_STATUS_LABELS[w.status as WinStatus]}</span>}
              </div>
              {w.opportunity && (
                <Link href={`/opportunities/${w.opportunity.slug}`} className="mt-1 block font-semibold text-ink hover:underline">
                  {w.opportunity.title}
                </Link>
              )}
              <p className="text-sm text-ink">Team: {w.team}</p>
              {w.detail && <p className="mt-1 whitespace-pre-line text-sm text-ink">“{w.detail}”</p>}
              {w.proof_url ? (
                <a href={w.proof_url} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 block break-all text-sm text-teal underline">
                  {sourceHost(w.proof_url)}: {w.proof_url}
                </a>
              ) : (
                <p className="mt-1 text-sm text-muted">No announcement link: find one before publishing.</p>
              )}

              {w.status === "new" ? (
                <div className="mt-2 flex flex-col gap-2">
                  <form action={reviewWin} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="id" value={w.id} />
                    <input type="hidden" name="status" value="published" />
                    <label className="flex min-w-60 flex-1 flex-col text-xs text-muted">
                      Public headline (max 140)
                      <input
                        name="headline"
                        maxLength={140}
                        defaultValue={suggestHeadline(w)}
                        className="mt-1 rounded-ui border border-line bg-white px-2 py-1.5 text-sm text-ink"
                      />
                    </label>
                    <button type="submit" className="rounded-ui bg-teal px-3 py-1.5 text-sm font-semibold text-white">
                      Publish
                    </button>
                  </form>
                  <form action={reviewWin}>
                    <input type="hidden" name="id" value={w.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <button type="submit" className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm">
                      Can&apos;t confirm / not real
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  {w.headline && <p className="text-sm text-ink">Shown as: “{w.headline}”</p>}
                  <form action={reviewWin}>
                    <input type="hidden" name="id" value={w.id} />
                    <input type="hidden" name="status" value="new" />
                    <button type="submit" className="text-sm text-teal underline">
                      {w.status === "published" ? "Take down" : "Reopen"}
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
