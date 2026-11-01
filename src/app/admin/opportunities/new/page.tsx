import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { parsePost } from "@/lib/opportunities/post-text";
import { createClient } from "@/lib/supabase/server";
import { OpportunityForm, type FormValues } from "../../opportunity-form";
import { emptyValues, loadCategories } from "../load";

export const instant = false;

export default async function NewOpportunityPage({ searchParams }: PageProps<"/admin/opportunities/new">) {
  await requireCurator();
  const [categories, params] = await Promise.all([loadCategories(), searchParams]);
  const values = await fromSubmission(typeof params.from === "string" ? params.from : null);

  return (
    <main className="px-4 py-4">
      <Link href={values.submission_id ? "/admin/submissions" : "/admin"} className="text-sm text-muted hover:text-ink">
        ← {values.submission_id ? "Submissions" : "Listings"}
      </Link>
      <h1 className="mb-4 mt-2 text-xl font-bold text-ink">New listing</h1>
      {values.submission_id && (
        <p className="mb-4 rounded-ui bg-sun/40 px-3 py-2 text-sm text-ink">
          From a submission. The link may be a social media post: replace it with the <strong>official source</strong>,
          and write the summary in our own words.
        </p>
      )}
      <OpportunityForm values={values} categories={categories} />
    </main>
  );
}

// Pre-fills the form from a student's submission (?from=<submission id>).
async function fromSubmission(id: string | null): Promise<FormValues> {
  const values = emptyValues();
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return values;
  const supabase = await createClient();
  const { data } = await supabase
    .from("opportunity_submissions")
    .select("id, url, title, organization, deadline, note, status")
    .eq("id", id)
    .maybeSingle();
  if (!data || data.status !== "new") return values;
  // Shared or pasted posts carry their text in the note: pull out the
  // registration link and deadline as a starting point.
  const post = parsePost(data.note ?? "", new Date(), data.url);
  const otherDates = post.dates.filter((d) => d !== (data.deadline ?? post.deadline));
  return {
    ...values,
    submission_id: data.id,
    title: data.title ?? post.title ?? "",
    organization: data.organization ?? "",
    source_url: data.url,
    application_url: post.applicationUrl && post.applicationUrl !== data.url ? post.applicationUrl : "",
    deadline: data.deadline ?? post.deadline ?? "",
    needs_check: true,
    notes: [
      "From a submission.",
      post.deadline && !data.deadline ? `Deadline read from the post text (${post.deadline}): confirm it.` : "",
      otherDates.length > 0 ? `Other dates in the post: ${otherDates.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" "),
  };
}
