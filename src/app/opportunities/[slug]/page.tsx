import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { BackLink } from "@/components/back-link";
import { OfficialBadge } from "@/components/official-badge";
import { ShareButton } from "@/components/share-button";
import { OfficialLink, ViewTracker } from "@/components/tracking";
import { audienceSummary } from "@/lib/opportunities/audience";
import { googleCalendarUrl, hasCalendarDate } from "@/lib/opportunities/calendar";
import { categoryBg, categoryLabel } from "@/lib/opportunities/categories";
import { closedLabel, deadlineInfo, formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { deliveryModeLabel, sourceHost, type Listing } from "@/lib/opportunities/listing";
import { getListingBySlug, getListingWins, getToday } from "@/lib/opportunities/queries";
import { shareMessage } from "@/lib/opportunities/share";
import { SaveButton } from "@/components/save-button";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { winEmoji } from "@/lib/wins";
import { ReportForm } from "./report-form";

export async function generateMetadata({ params }: PageProps<"/opportunities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getListingBySlug(slug);
  if (!result || !("listing" in result)) return { title: "Opportunity not found" };

  const { listing } = result;
  const today = await getToday();
  const deadline = deadlineInfo(listing, today);
  const when =
    deadline.daysLeft === null
      ? deadline.detail
      : deadline.tone === "closed"
        ? closedLabel(listing.deadline, today)
        : `Deadline ${formatLongDate(listing.deadline!)}`;
  const description = `${listing.organization} · ${when}. ${listing.summary ?? ""}`.trim().slice(0, 200);

  return {
    title: listing.title,
    description,
    alternates: { canonical: `/opportunities/${listing.slug}` },
    openGraph: { title: listing.title, description, url: `/opportunities/${listing.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: listing.title, description },
  };
}

export default function OpportunityPage({ params, searchParams }: PageProps<"/opportunities/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      {params.then(({ slug }) => (
        <OpportunityDetail slug={slug} searchParams={searchParams} />
      ))}
    </Suspense>
  );
}

async function OpportunityDetail({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [result, today] = await Promise.all([getListingBySlug(slug), getToday()]);
  if (!result) notFound();
  if ("redirectTo" in result) permanentRedirect(`/opportunities/${result.redirectTo}`);

  const { listing } = result;
  const wins = await getListingWins(listing.id);
  const deadline = deadlineInfo(listing, today);
  const closed = deadline.tone === "closed";

  return (
    <main className="flex flex-1 flex-col">
      <article className="flex-1 pb-8">
        <div className={`border-b-2 border-ink px-4 pb-6 pt-3 ${closed ? "bg-line" : categoryBg(listing.categorySlug)}`}>
          <BackLink className="-ml-1 inline-flex min-h-11 items-center gap-1 px-1 text-sm font-bold text-ink">
            <span aria-hidden="true">←</span> Back
          </BackLink>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="tag bg-card">{categoryLabel(listing.categorySlug, listing.categoryName)}</span>
            <OfficialBadge trust={listing.source_trust} />
          </div>
          <h1 className="mt-3 font-display text-[28px] font-extrabold leading-[1.1] tracking-tight text-ink">
            {listing.title}
          </h1>
          <p className="mt-2 font-semibold text-ink">{listing.organization}</p>
        </div>

        <div className="px-4">
          {closed && (
            <p className="sticker mt-5 bg-line px-3 py-2 text-sm font-semibold text-ink">
              {listing.deadline && listing.deadline < today
                ? `This opportunity closed on ${formatLongDate(listing.deadline)}.`
                : "This opportunity is closed."}
            </p>
          )}

          <DeadlineBlock listing={listing} today={today} />
          {!closed && hasCalendarDate(listing) && <AddToCalendar listing={listing} />}

          {listing.summary && <p className="mt-5 whitespace-pre-line text-[17px] leading-relaxed text-ink">{listing.summary}</p>}

        <AtAGlance listing={listing} closed={closed} />

        <Section title="What you need" body={listing.requirements} />

        <Wins wins={wins} slug={listing.slug} />

        <section aria-labelledby="trust" className="sticker mt-6 p-4">
          <h2 id="trust" className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
            <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-mint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Why you can trust this
          </h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink">
            <li>
              Source:{" "}
              <a
                href={listing.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-semibold text-teal underline"
              >
                {sourceHost(listing.source_url)}
              </a>
              {listing.source_trust !== "other" && <span className="text-muted"> (official website)</span>}
            </li>
            {listing.last_checked_at && (
              <li className="tabular">
                Last checked by our team on {formatLongDate(todayInManila(new Date(listing.last_checked_at)))}
              </li>
            )}
            <li className="text-muted">We summarize it in our own words. Always confirm on the official site.</li>
          </ul>
          <p className="mt-3 rounded-ui border-2 border-dashed border-ink bg-sun px-3 py-2 text-sm text-ink">
            <span className="font-bold">Scam tip:</span> walang totoong scholarship o internship na maniningil ng bayad
            para mag-apply.
          </p>
        </section>
        <ReportForm opportunityId={listing.id} />
        </div>
      </article>

      <div className="sticky bottom-0 z-10 border-t-2 border-ink bg-card px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
        <div className="flex gap-3">
          {!closed && (
            <Suspense fallback={<SaveButtonPlaceholder />}>
              <SaveSlot opportunityId={listing.id} slug={listing.slug} searchParams={searchParams} />
            </Suspense>
          )}
          <ShareButton
            title={listing.title}
            path={`/opportunities/${listing.slug}`}
            message={shareMessage(listing, closed)}
            opportunityId={listing.id}
            compact={!closed}
          />
          {closed ? (
            <Link
              href={`/?category=${listing.categorySlug}`}
              className="btn-pop press h-12 flex-1 text-sm"
            >
              Find similar opportunities
            </Link>
          ) : (
            <OfficialLink
              href={listing.application_url}
              opportunityId={listing.id}
              className="btn-pop press h-12 flex-1 whitespace-nowrap text-sm"
            >
              Apply on official site
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </OfficialLink>
          )}
        </div>
      </div>
      <ViewTracker opportunityId={listing.id} />
    </main>
  );
}

// Countdown color: tomato for 3 days or less, sun for this week.
const DEADLINE_BG: Record<string, string> = {
  urgent: "bg-tomato",
  soon: "bg-sun",
  normal: "bg-card",
  none: "bg-card",
  closed: "bg-line",
};

function DeadlineBlock({ listing, today }: { listing: Listing; today: string }) {
  const deadline = deadlineInfo(listing, today);
  let text: string;
  if (deadline.daysLeft === null) text = deadline.detail;
  else if (deadline.tone === "closed") text = closedLabel(listing.deadline, today);
  else text = `Closes ${formatLongDate(listing.deadline!)} · ${deadline.detail}`;

  return (
    <div className={`sticker mt-5 flex items-center gap-3 p-3 ${DEADLINE_BG[deadline.tone]}`}>
      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-card">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2M9 2h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="tabular font-display text-lg font-extrabold leading-tight text-ink">{text}</p>
    </div>
  );
}

// Phones open the .ics file in their own calendar app; Google Calendar gets a
// direct link for students who live in it.
function AddToCalendar({ listing }: { listing: Listing }) {
  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const pageUrl = `${base}/opportunities/${listing.slug}`;
  const link = "inline-flex min-h-11 items-center gap-1.5 rounded-pill border-2 border-ink bg-card px-3 text-sm font-bold text-ink hover:bg-paper";
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-sm font-bold text-muted">Add to calendar:</span>
      <a href={`/opportunities/${listing.slug}/calendar`} download className={link}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
        Phone calendar
      </a>
      <a href={googleCalendarUrl(listing, pageUrl)} target="_blank" rel="noopener noreferrer" className={link}>
        Google Calendar
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}

// The facts students check first, in one scannable box.
function AtAGlance({ listing, closed }: { listing: Listing; closed: boolean }) {
  const rows = [
    { label: "Open to", value: audienceSummary(listing) },
    { label: "Who can apply", value: listing.eligibility },
    {
      label: "Where",
      value: [listing.location, deliveryModeLabel(listing.delivery_mode)].filter(Boolean).join(" · ") || null,
    },
    { label: "Applications open", value: closed ? null : opensText(listing) },
  ].filter((r) => r.value);
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="at-a-glance" className="mt-6">
      <h2 id="at-a-glance" className="font-display text-lg font-extrabold text-ink">
        At a glance
      </h2>
      <dl className="sticker mt-2 divide-y-2 divide-dashed divide-line">
        {rows.map((row) => (
          <div key={row.label} className="px-4 py-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-muted">{row.label}</dt>
            <dd className="mt-0.5 whitespace-pre-line leading-relaxed text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// Checked "we joined / we won" notes: proof that students like them get in.
function Wins({ wins, slug }: { wins: Awaited<ReturnType<typeof getListingWins>>; slug: string }) {
  return (
    <section aria-labelledby="wins" className="mt-6">
      {wins.length > 0 && (
        <>
          <h2 id="wins" className="font-display text-lg font-extrabold text-ink">
            Students who joined
          </h2>
          <ul className="sticker mt-2 divide-y-2 divide-dashed divide-line">
            {wins.map((w) => (
              <li key={w.id} className="flex items-start gap-3 px-4 py-3">
                <span aria-hidden="true" className="text-xl leading-none">
                  {winEmoji(w.result)}
                </span>
                <p className="leading-relaxed text-ink">
                  {w.headline}
                  {w.proof_url && (
                    <>
                      {" "}
                      <a href={w.proof_url} target="_blank" rel="noopener noreferrer nofollow" className="text-sm font-semibold text-teal underline">
                        Announcement
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
      <Link
        href={`/opportunities/${slug}/win`}
        className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-teal underline"
      >
        Sumali o nanalo kayo dito? Tell us
      </Link>
    </section>
  );
}

function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section className="mt-6">
      <h2 className="font-display text-lg font-extrabold text-ink">{title}</h2>
      <p className="mt-1 whitespace-pre-line leading-relaxed text-ink">{body}</p>
    </section>
  );
}

function opensText(listing: Listing): string | null {
  switch (listing.application_opens_type) {
    case "date":
      return listing.application_opens ? formatLongDate(listing.application_opens) : null;
    case "open":
      return "Open now";
    case "rolling":
      return "Open all year (rolling)";
    default:
      return null;
  }
}

function DetailSkeleton() {
  return (
    <div aria-hidden="true" className="motion-safe:animate-pulse px-4 pt-4">
      <div className="h-4 w-32 rounded-ui bg-line/60" />
      <div className="mt-6 h-7 rounded-ui bg-line/60" />
      <div className="mt-2 h-4 w-1/2 rounded-ui bg-line/60" />
      <div className="mt-6 h-12 rounded-ui bg-line/60" />
      <div className="mt-6 space-y-2">
        <div className="h-4 rounded-ui bg-line/60" />
        <div className="h-4 rounded-ui bg-line/60" />
        <div className="h-4 w-3/4 rounded-ui bg-line/60" />
      </div>
    </div>
  );
}

// Reads the session (is it saved?), so it streams in after the cached page.
async function SaveSlot({
  opportunityId,
  slug,
  searchParams,
}: {
  opportunityId: string;
  slug: string;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  let saved = false;
  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("saved_opportunities")
      .select("id")
      .eq("user_id", user.id)
      .eq("opportunity_id", opportunityId)
      .maybeSingle();
    saved = Boolean(data);
  }
  return (
    <SaveButton
      opportunityId={opportunityId}
      initialSaved={saved}
      back={`/opportunities/${slug}`}
      autoSave={Boolean(user) && params.save === "1"}
      compact
    />
  );
}

function SaveButtonPlaceholder() {
  return <div aria-hidden="true" className="h-12 w-12 rounded-ui border-2 border-ink bg-card" />;
}
