import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { BottomNav } from "@/components/bottom-nav";
import { getCurrentUser } from "@/lib/auth";
import { formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { parsePost } from "@/lib/opportunities/post-text";
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

// "Share to Oportune": Android's share menu opens /submit?title=&text=&url=.
// Pre-fill the form from the shared post; the student can still edit it.
function sharedValues(params: Record<string, string | string[] | undefined>): Record<string, string> | undefined {
  const get = (k: string) => (typeof params[k] === "string" ? (params[k] as string).slice(0, 5000) : "");
  const text = get("text");
  const url = get("url");
  if (!text && !url) return undefined;
  const post = parsePost(`${get("title")}\n${text}`, new Date(), url || null);
  return {
    url: post.postUrl ?? post.applicationUrl ?? "",
    title: get("title") || post.title || "",
    deadline: post.deadline ?? "",
    note: text.slice(0, 1000),
  };
}

const STATUS_BG: Record<SubmissionStatus, string> = {
  new: "bg-sky",
  added: "bg-mint",
  duplicate: "bg-line",
  rejected: "bg-line",
};

export default async function SubmitPage({ searchParams }: PageProps<"/submit">) {
  const params = await searchParams;
  const shared = sharedValues(params);
  const user = await getCurrentUser();
  if (!user) {
    // Keep what was shared through sign-in (trimmed: the destination is kept
    // in a cookie, and cookies max out around 4 KB).
    const query = new URLSearchParams(
      Object.entries({ title: params.title, text: params.text, url: params.url })
        .filter((e): e is [string, string] => typeof e[1] === "string")
        .map(([k, v]) => [k, v.slice(0, 1000)]),
    ).toString();
    redirect(`/sign-in?next=${encodeURIComponent(query ? `/submit?${query}` : "/submit")}`);
  }

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
      <p className="mt-2 text-sm text-muted">
        Public opportunities only: if you saw it in a private group or group chat, ask the organizer first. Leave out other
        people&apos;s numbers, emails, and photos.{" "}
        <Link href="/terms" className="font-semibold text-ink underline">
          Rules
        </Link>
      </p>

      <SubmitForm initial={shared} />

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
      <BottomNav active="/submit" />
    </main>
  );
}
