import Link from "next/link";
import { requireCurator } from "@/lib/auth";
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
    .select("id, url, title, organization, deadline, status")
    .eq("id", id)
    .maybeSingle();
  if (!data || data.status !== "new") return values;
  return {
    ...values,
    submission_id: data.id,
    title: data.title ?? "",
    organization: data.organization ?? "",
    source_url: data.url,
    deadline: data.deadline ?? "",
    needs_check: true,
    notes: "From a student submission.",
  };
}
