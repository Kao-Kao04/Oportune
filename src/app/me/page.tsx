import type { Metadata } from "next";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { getCurrentUser } from "@/lib/auth";
import { courseGroupLabel, yearLevelLabel } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../sign-in/actions";
import { updateReminderSettings } from "./actions";

export const metadata: Metadata = { title: "Me", robots: { index: false } };

// Reads the session; let it block on the server.
export const instant = false;

export default async function MePage({ searchParams }: PageProps<"/me">) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (!user) {
    return (
      <main className="px-4 py-10">
        <h1 className="text-2xl font-bold text-ink">Me</h1>
        <p className="mt-2 text-muted">Sign in to save opportunities and get reminded before deadlines.</p>
        <Link
          href="/sign-in?next=/me"
          className="mt-6 inline-flex h-11 items-center rounded-ui bg-teal px-5 font-semibold text-white"
        >
          Sign in
        </Link>
        <BottomNav active="/me" />
      </main>
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, school, course_group, course, year_level, email_reminders_enabled, push_reminders_enabled")
    .eq("user_id", user.id)
    .single();

  const summary = [
    profile?.school,
    profile?.course || courseGroupLabel(profile?.course_group ?? null),
    yearLevelLabel(profile?.year_level ?? null),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold text-ink">Me</h1>

      <section className="mt-4 border-b border-line pb-4">
        <p className="font-semibold text-ink">{profile?.display_name ?? user.email}</p>
        <p className="text-sm text-muted">{summary || "Profile not filled in yet"}</p>
        <Link href="/welcome?edit=1&next=/me" className="mt-2 inline-block text-sm text-teal underline">
          Edit profile
        </Link>
      </section>

      <section className="border-b border-line py-4">
        <h2 className="font-semibold text-ink">Reminders</h2>
        <p className="mt-1 text-sm text-muted">For saved listings: 7 days and 1 day before the deadline.</p>
        {params.saved === "reminders" && <p className="mt-2 text-sm text-official">Saved.</p>}
        <form action={updateReminderSettings} className="mt-3 flex flex-col gap-3">
          <label className="flex items-center justify-between gap-3">
            <span className="text-ink">Email reminders</span>
            <input
              type="checkbox"
              name="email_reminders_enabled"
              defaultChecked={profile?.email_reminders_enabled ?? true}
              className="h-5 w-5"
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-ink">
              Phone notifications <span className="text-sm text-muted">(coming soon)</span>
            </span>
            <input
              type="checkbox"
              name="push_reminders_enabled"
              defaultChecked={profile?.push_reminders_enabled ?? true}
              className="h-5 w-5"
            />
          </label>
          <button type="submit" className="h-10 self-start rounded-ui border border-line bg-white px-4 text-sm font-semibold">
            Save reminder settings
          </button>
        </form>
      </section>

      <section className="border-b border-line py-4">
        <h2 className="font-semibold text-ink">About</h2>
        <p className="mt-1 text-sm text-muted">
          Every listing is checked by our team against its official source. We collect only your name, email, school,
          course, year level, and interests.
        </p>
        {user.role !== "student" && (
          <Link href="/admin" className="mt-2 inline-block text-sm text-teal underline">
            Admin panel
          </Link>
        )}
      </section>

      <section className="flex flex-col items-start gap-3 py-4">
        <form action={signOut}>
          <button type="submit" className="text-ink underline">
            Sign out
          </button>
        </form>
        <Link href="/me/delete" className="text-urgent underline">
          Delete my account
        </Link>
      </section>
      <BottomNav active="/me" />
    </main>
  );
}
