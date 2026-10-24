import type { Metadata } from "next";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { redirect } from "next/navigation";
import { ListingRow } from "@/components/listing-row";
import { SaveButton } from "@/components/save-button";
import { getCurrentUser } from "@/lib/auth";
import { compareByDeadline, isOpen, toListing, type Listing } from "@/lib/opportunities/listing";
import { getToday } from "@/lib/opportunities/queries";
import { deadlineInfo, formatLongDate } from "@/lib/opportunities/dates";
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
  const [today, { data: rows, error: listError }, { data: prefs }, { count: devices }] = await Promise.all([
    getToday(),
    ids.length > 0
      ? supabase.from("public_opportunities").select("*").in("id", ids)
      : Promise.resolve({ data: [], error: null }),
    supabase.from("profiles").select("email_reminders_enabled, push_reminders_enabled").eq("user_id", user.id).single(),
    supabase.from("push_subscriptions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);
  if (listError) throw listError;

  const listings = (rows ?? []).map(toListing).sort(compareByDeadline);
  const open = listings.filter((l) => isOpen(l, today));
  const closed = listings.filter((l) => !isOpen(l, today));
  const nextUp = open.find((l) => l.deadline_type === "date");
  const channels = [
    prefs?.push_reminders_enabled && (devices ?? 0) > 0 ? "phone" : null,
    prefs?.email_reminders_enabled ? "email" : null,
  ].filter(Boolean);

  return (
    <main className="flex flex-col">
      <h1 className="px-4 pt-6 font-display text-[32px] font-extrabold tracking-tight text-ink">Saved</h1>
      {listings.length === 0 ? (
        <div className="sticker mx-4 mt-6 px-4 py-10 text-center">
          <p className="font-semibold text-ink">Nothing saved yet.</p>
          <p className="mt-1 text-sm text-muted">Tap the bookmark on a listing to keep it here and get deadline reminders.</p>
          <Link href="/" className="btn-pop press mt-4">
            Browse opportunities
          </Link>
        </div>
      ) : (
        <>
          <div className="sticker mx-4 mt-4 bg-sun p-4">
            {nextUp ? (
              <Link href={`/opportunities/${nextUp.slug}`} className="block">
                <span className="text-xs font-bold uppercase tracking-wide text-ink">Next deadline</span>
                <span className="mt-1 block font-display text-xl font-extrabold leading-snug text-ink">{nextUp.title}</span>
                <span className="tabular mt-1 inline-block rounded-pill border-2 border-ink bg-card px-2 text-sm font-bold text-ink">
                  {formatLongDate(nextUp.deadline!)} · {deadlineInfo(nextUp, today).detail}
                </span>
              </Link>
            ) : (
              <span className="text-sm text-ink">None of your saved listings has a fixed deadline.</span>
            )}
            <p className="mt-3 flex items-center justify-between gap-3 border-t-2 border-dashed border-ink pt-3 text-sm">
              <span className={channels.length ? "text-ink" : "text-urgent"}>
                {channels.length ? `Reminders on: ${channels.join(" + ")}` : "Reminders are off"}
                <span> · 7 days and 1 day before</span>
              </span>
              <Link href="/me" className="inline-flex min-h-11 shrink-0 items-center font-bold text-ink underline underline-offset-4">
                Change
              </Link>
            </p>
          </div>
          <h2 className="px-4 pb-2 pt-6 font-display text-lg font-extrabold text-ink">All saved</h2>
          <SavedList listings={open} today={today} />
          {closed.length > 0 && (
            <>
              <h2 className="px-4 pb-2 pt-6 font-display text-lg font-extrabold text-muted">Closed</h2>
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
    <ul className="flex flex-col gap-3 px-4">
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
