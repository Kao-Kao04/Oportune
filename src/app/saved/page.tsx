import type { Metadata } from "next";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { redirect } from "next/navigation";
import { ListingRow } from "@/components/listing-row";
import { SaveButton } from "@/components/save-button";
import { getCurrentUser } from "@/lib/auth";
import { compareByDeadline, isOpen, toListing, type Listing } from "@/lib/opportunities/listing";
import { getToday } from "@/lib/opportunities/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Saved", robots: { index: false } };

// Reads the session; let it block on the server.
export const instant = false;

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/saved");

  const supabase = await createClient();
  const { data: saved, error } = await supabase
    .from("saved_opportunities")
    .select("opportunity_id")
    .eq("user_id", user.id);
  if (error) throw error;

  const ids = saved.map((s) => s.opportunity_id);
  const [today, { data: rows, error: listError }] = await Promise.all([
    getToday(),
    ids.length > 0
      ? supabase.from("public_opportunities").select("*").in("id", ids)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (listError) throw listError;

  const listings = (rows ?? []).map(toListing).sort(compareByDeadline);
  const open = listings.filter((l) => isOpen(l, today));
  const closed = listings.filter((l) => !isOpen(l, today));

  return (
    <main className="flex flex-col">
      <h1 className="px-4 pt-6 text-2xl font-bold text-ink">Saved</h1>
      {listings.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p className="font-semibold text-ink">Nothing saved yet.</p>
          <p className="mt-1 text-sm text-muted">Tap the bookmark on a listing to keep it here and get deadline reminders.</p>
          <Link href="/" className="mt-4 inline-block font-semibold text-teal underline">
            Browse opportunities
          </Link>
        </div>
      ) : (
        <>
          <p className="px-4 pb-2 pt-1 text-sm text-muted">Sorted by deadline. We&apos;ll remind you 7 days and 1 day before.</p>
          <SavedList listings={open} today={today} />
          {closed.length > 0 && (
            <>
              <h2 className="border-t border-line px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted">
                Closed
              </h2>
              <SavedList listings={closed} today={today} />
            </>
          )}
        </>
      )}
      <BottomNav active="/saved" />
    </main>
  );
}

function SavedList({ listings, today }: { listings: Listing[]; today: string }) {
  return (
    <ul className="border-t border-line">
      {listings.map((l) => (
        <ListingRow
          key={l.id}
          listing={l}
          today={today}
          trailing={<SaveButton opportunityId={l.id} initialSaved back="/saved" compact />}
        />
      ))}
    </ul>
  );
}
