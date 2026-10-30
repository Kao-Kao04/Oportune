import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { sourceHost } from "@/lib/opportunities/listing";
import { SUBMISSION_STATUS_LABELS, type SubmissionStatus } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/server";
import { updateSubmission } from "../actions";

export const instant = false;

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  organizer: "Organizer",
  school: "School office",
  other: "Other",
};

export default async function SubmissionsPage({ searchParams }: PageProps<"/admin/submissions">) {
  await requireCurator();
  const params = await searchParams;
  const showAll = params.show === "all";

  const supabase = await createClient();
  let query = supabase
    .from("opportunity_submissions")
    .select("id, url, title, organization, deadline, note, submitter_role, status, opportunity_id, created_at")
    .order("created_at", { ascending: true })
    .limit(200);
  if (!showAll) query = query.eq("status", "new");
  const { data: submissions, error } = await query;
  if (error) throw error;

  return (
    <main className="px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Submissions</h1>
        <Link href={showAll ? "/admin/submissions" : "/admin/submissions?show=all"} className="text-sm text-teal underline">
          {showAll ? "New only" : "Show all"}
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted">
        Oldest first. Open the link, find the <strong>official</strong> source, then create the listing in our own words.
        Never copy the post or the submitter&apos;s note as-is.
      </p>

      {submissions.length === 0 ? (
        <p className="mt-8 text-center text-muted">No new submissions.</p>
      ) : (
        <ul className="mt-4 border-t border-line">
          {submissions.map((s) => (
            <li key={s.id} className="border-b border-line py-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="font-semibold text-ink">{ROLE_LABELS[s.submitter_role] ?? s.submitter_role}</span>
                <span className="tabular">{formatLongDate(todayInManila(new Date(s.created_at)))}</span>
                {s.status !== "new" && <span>· {SUBMISSION_STATUS_LABELS[s.status as SubmissionStatus]}</span>}
              </div>
              <p className="mt-1 font-semibold text-ink">{s.title ?? "(no title)"}</p>
              {s.organization && <p className="text-sm text-ink">{s.organization}</p>}
              <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-1 block break-all text-sm text-teal underline">
                {sourceHost(s.url)}: {s.url}
              </a>
              {s.deadline && <p className="tabular mt-1 text-sm text-ink">Deadline (per submitter): {formatLongDate(s.deadline)}</p>}
              {s.note && <p className="mt-1 whitespace-pre-line text-sm text-ink">“{s.note}”</p>}
              {s.status === "new" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href={`/admin/opportunities/new?from=${s.id}`}
                    className="rounded-ui bg-teal px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    Create listing
                  </Link>
                  {(["duplicate", "rejected"] as const).map((status) => (
                    <form key={status} action={updateSubmission}>
                      <input type="hidden" name="id" value={s.id} />
                      <input type="hidden" name="status" value={status} />
                      <button type="submit" className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm">
                        {status === "duplicate" ? "Already listed" : "Not real / not eligible"}
                      </button>
                    </form>
                  ))}
                </div>
              ) : s.opportunity_id ? (
                <Link href={`/admin/opportunities/${s.opportunity_id}`} className="mt-1 inline-block text-sm text-teal underline">
                  Open the listing
                </Link>
              ) : (
                <form action={updateSubmission} className="mt-1">
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="status" value="new" />
                  <button type="submit" className="text-sm text-teal underline">
                    Reopen
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
