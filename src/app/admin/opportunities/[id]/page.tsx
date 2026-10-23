import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCurator } from "@/lib/auth";
import { todayInManila } from "@/lib/opportunities/dates";
import { createClient } from "@/lib/supabase/server";
import { markChecked, setOpportunityStatus } from "../../actions";
import { OpportunityForm } from "../../opportunity-form";
import { Flag, StatusLabel } from "../../status-label";
import { loadCategories } from "../load";

export const instant = false;

const SAVED_MESSAGES: Record<string, string> = {
  saved: "Saved.",
  published: "Published. It's live now.",
  draft: "Moved to drafts. It's hidden from students.",
  expired: "Marked as expired. Its page shows “Closed”.",
  archived: "Archived. It's hidden everywhere.",
};

const STATUS_ACTIONS: Record<string, { to: string; label: string }[]> = {
  draft: [{ to: "archived", label: "Archive" }],
  published: [
    { to: "expired", label: "Mark expired" },
    { to: "draft", label: "Move to drafts" },
    { to: "archived", label: "Archive" },
  ],
  expired: [{ to: "archived", label: "Archive" }],
  archived: [{ to: "draft", label: "Restore as draft" }],
};

export default async function EditOpportunityPage({ params, searchParams }: PageProps<"/admin/opportunities/[id]">) {
  await requireCurator();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: row }, categories] = await Promise.all([
    supabase.from("opportunities").select("*").eq("id", id).maybeSingle(),
    loadCategories(),
  ]);
  if (!row) notFound();

  const saved = typeof query.saved === "string" ? SAVED_MESSAGES[query.saved] : undefined;
  const isPublic = row.status === "published" || row.status === "expired";

  return (
    <main className="px-4 py-4">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">
        ← Listings
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusLabel status={row.status} />
        {row.needs_check && <Flag>Needs check</Flag>}
        {row.recheck_due && <Flag>Re-check due</Flag>}
        {row.external_id && <span className="text-xs text-muted">{row.external_id}</span>}
      </div>
      <h1 className="mt-1 text-xl font-bold text-ink">{row.title}</h1>

      {saved && <p className="mt-3 rounded-ui bg-official/10 px-3 py-2 text-sm text-official">{saved}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {isPublic && (
          <Link
            href={`/opportunities/${row.slug}`}
            target="_blank"
            className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm text-teal"
          >
            View public page
          </Link>
        )}
        <form action={markChecked}>
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="back" value={`/admin/opportunities/${row.id}?saved=saved`} />
          <button type="submit" className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm">
            Checked source today
          </button>
        </form>
        {STATUS_ACTIONS[row.status]?.map((a) => (
          <form key={a.to} action={setOpportunityStatus}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="to" value={a.to} />
            <button type="submit" className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm">
              {a.label}
            </button>
          </form>
        ))}
      </div>

      <div className="mt-6">
        <OpportunityForm
          key={row.updated_at}
          categories={categories}
          values={{
            id: row.id,
            status: row.status,
            slug: row.slug,
            title: row.title,
            organization: row.organization,
            category_id: row.category_id,
            summary: row.summary ?? "",
            eligibility: row.eligibility ?? "",
            requirements: row.requirements ?? "",
            location: row.location ?? "",
            delivery_mode: row.delivery_mode ?? "online",
            application_opens_type: row.application_opens_type,
            application_opens: row.application_opens ?? "",
            deadline_type: row.deadline_type,
            deadline: row.deadline ?? "",
            source_url: row.source_url,
            application_url: row.application_url ?? "",
            confidence: row.confidence ?? "medium",
            needs_check: row.needs_check,
            notes: row.notes ?? "",
            last_checked: row.last_checked_at ? todayInManila(new Date(row.last_checked_at)) : todayInManila(),
          }}
        />
      </div>
    </main>
  );
}
