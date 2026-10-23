import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { TONE_TEXT } from "@/components/listing-row";
import { OfficialBadge } from "@/components/official-badge";
import { ShareButton } from "@/components/share-button";
import { categoryLabel } from "@/lib/opportunities/categories";
import { closedLabel, deadlineInfo, formatLongDate, todayInManila } from "@/lib/opportunities/dates";
import { deliveryModeLabel, sourceHost, type Listing } from "@/lib/opportunities/listing";
import { getListingBySlug, getToday } from "@/lib/opportunities/queries";
import { SaveButton } from "@/components/save-button";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
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
  const deadline = deadlineInfo(listing, today);
  const closed = deadline.tone === "closed";

  return (
    <main className="flex flex-1 flex-col">
      <article className="flex-1 px-4 pb-28 pt-4">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <span aria-hidden="true">←</span> All opportunities
        </Link>

        {closed && (
          <p className="mt-4 rounded-ui bg-ink/5 px-3 py-2 text-sm text-ink">
            {listing.deadline && listing.deadline < today
              ? `This opportunity closed on ${formatLongDate(listing.deadline)}.`
              : "This opportunity is closed."}
          </p>
        )}

        <h1 className="mt-4 text-2xl font-bold leading-tight text-ink">{listing.title}</h1>
        <p className="mt-1 text-muted">{listing.organization}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="text-muted">{categoryLabel(listing.categorySlug, listing.categoryName)}</span>
          <OfficialBadge trust={listing.source_trust} />
        </div>

        <DeadlineBlock listing={listing} today={today} />

        {listing.summary && <p className="mt-5 whitespace-pre-line leading-relaxed text-ink">{listing.summary}</p>}

        <Section title="Who can apply" body={listing.eligibility} />
        <Section title="What you need" body={listing.requirements} />
        <Section
          title="Where"
          body={[listing.location, deliveryModeLabel(listing.delivery_mode)].filter(Boolean).join(" · ") || null}
        />
        <Section title="Applications open" body={closed ? null : opensText(listing)} />

        <section className="mt-6 border-t border-line pt-4">
          <h2 className="text-sm font-semibold text-ink">Source</h2>
          <a
            href={listing.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block break-all text-teal underline"
          >
            {sourceHost(listing.source_url)}
          </a>
          {listing.last_checked_at && (
            <p className="tabular mt-1 text-sm text-muted">Last checked {formatLongDate(todayInManila(new Date(listing.last_checked_at)))}</p>
          )}
          <p className="mt-3 text-sm text-muted">
            We summarize official sources in our own words. Always confirm details on the official site before applying.
          </p>
          <ReportForm opportunityId={listing.id} />
        </section>
      </article>

      <div className="sticky bottom-0 z-10 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-3">
          {!closed && (
            <Suspense fallback={<SaveButtonPlaceholder />}>
              <SaveSlot opportunityId={listing.id} slug={listing.slug} searchParams={searchParams} />
            </Suspense>
          )}
          <ShareButton title={listing.title} path={`/opportunities/${listing.slug}`} />
          {closed ? (
            <Link
              href={`/?category=${listing.categorySlug}`}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-ui bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark"
            >
              Find similar opportunities
            </Link>
          ) : (
            <a
              href={listing.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-ui bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark"
            >
              Apply on official site
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

const BORDER: Record<string, string> = {
  urgent: "border-urgent",
  soon: "border-soon",
  normal: "border-teal",
  none: "border-line",
  closed: "border-closed",
};

function DeadlineBlock({ listing, today }: { listing: Listing; today: string }) {
  const deadline = deadlineInfo(listing, today);
  let text: string;
  if (deadline.daysLeft === null) text = deadline.detail;
  else if (deadline.tone === "closed") text = closedLabel(listing.deadline, today);
  else text = `Closes ${formatLongDate(listing.deadline!)} · ${deadline.detail}`;

  return (
    <p
      className={`tabular mt-5 border-l-4 bg-white py-3 pl-3 pr-2 font-semibold ${BORDER[deadline.tone]} ${
        TONE_TEXT[deadline.tone]
      }`}
    >
      {text}
    </p>
  );
}

function Section({ title, body }: { title: string; body: string | null }) {
  if (!body) return null;
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
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
    <div aria-hidden="true" className="animate-pulse px-4 pt-4">
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
  return <div aria-hidden="true" className="h-11 w-11 rounded-ui border border-line bg-white" />;
}
