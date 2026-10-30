import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { getCurrentUser } from "@/lib/auth";
import { formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { SUBMISSION_STATUS_LABELS, type SubmissionStatus } from "@/lib/submissions";
import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "./submit-form";

export const metadata: Metadata = {
  title: "Submit an opportunity",
  description: "Saw a scholarship, internship, or contest? Send the link and our team will check it.",
  robots: { index: false },
};

// Reads the session; let it block on the server.
export const instant = false;

const STATUS_BG: Record<SubmissionStatus, string> = {
  new: "bg-sky",
  added: "bg-mint",
  duplicate: "bg-line",
  rejected: "bg-line",
};

export default async function SubmitPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/submit");

  const supabase = await createClient();
  const { data: mine } = await supabase
    .from("opportunity_submissions")
    .select("id, url, title, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="px-4 py-4">
      <BackLink className="-ml-1 inline-flex min-h-11 items-center gap-1 px-1 text-sm font-bold text-ink">
        <span aria-hidden="true">←</span> Back
      </BackLink>
      <h1 className="mt-1 font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink">
        May alam kang opportunity?
      </h1>
      <p className="mt-2 text-muted">
        Send the link. Our team checks the official source before it goes live, so classmates only see real ones.
      </p>

      <SubmitForm />

      {mine && mine.length > 0 && (
        <section aria-labelledby="mine" className="mt-8">
          <h2 id="mine" className="font-display text-lg font-extrabold text-ink">
            Your submissions
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {mine.map((s) => (
              <li key={s.id} className="sticker flex items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{s.title ?? s.url}</p>
                  <p className="tabular text-xs text-muted">
                    Sent {formatLongDate(todayInManila(new Date(s.created_at)))}
                  </p>
                </div>
                <span className={`tag shrink-0 ${STATUS_BG[s.status as SubmissionStatus]}`}>
                  {SUBMISSION_STATUS_LABELS[s.status as SubmissionStatus]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
