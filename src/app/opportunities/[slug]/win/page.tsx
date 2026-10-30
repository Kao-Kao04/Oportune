import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { getCurrentUser } from "@/lib/auth";
import { getListingBySlug } from "@/lib/opportunities/queries";
import { WinForm } from "./win-form";

export const metadata: Metadata = {
  title: "Share your win",
  description: "Joined or won this? Tell us and our team will add it to the listing.",
  robots: { index: false },
};

// Reads the session; let it block on the server.
export const instant = false;

export default async function WinPage({ params }: PageProps<"/opportunities/[slug]/win">) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(`/opportunities/${slug}/win`)}`);

  const result = await getListingBySlug(slug);
  if (!result) notFound();
  if ("redirectTo" in result) redirect(`/opportunities/${result.redirectTo}/win`);
  const { listing } = result;

  return (
    <main className="px-4 py-4">
      <BackLink className="-ml-1 inline-flex min-h-11 items-center gap-1 px-1 text-sm font-bold text-ink">
        <span aria-hidden="true">←</span> Back
      </BackLink>
      <h1 className="mt-1 font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink">
        Sumali o nanalo kayo?
      </h1>
      <p className="mt-2 text-muted">
        Tell us about <span className="font-semibold text-ink">{listing.title}</span>. Our team checks it, then adds a short
        note to the listing so classmates see it&apos;s winnable.
      </p>
      <WinForm opportunityId={listing.id} slug={listing.slug} />
    </main>
  );
}
