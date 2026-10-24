import type { Metadata } from "next";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import { getCurrentUser } from "@/lib/auth";
import { courseGroupLabel, yearLevelLabel } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../sign-in/actions";
import { updateReminderSettings } from "./actions";
import { PushDevice } from "./push-device";

export const metadata: Metadata = { title: "Me", robots: { index: false } };

// Reads the session; let it block on the server.
export const instant = false;

export default async function MePage({ searchParams }: PageProps<"/me">) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);

  if (!user) {
    return (
      <main className="px-4 py-10">
        <h1 className="font-display text-[32px] font-extrabold tracking-tight text-ink">Me</h1>
        <p className="mt-2 text-muted">Sign in to save opportunities and get reminded before deadlines.</p>
        <Link
          href="/sign-in?next=/me"
          className="btn-pop press mt-6"
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
      <h1 className="font-display text-[32px] font-extrabold tracking-tight text-ink">Me</h1>

      <section className="sticker mt-4 flex items-center gap-4 bg-lilac p-4">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sun font-display text-xl font-extrabold"
        >
          {initials(profile?.display_name ?? user.email ?? "?")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-extrabold text-ink">{profile?.display_name ?? user.email}</p>
          <p className="text-sm text-ink">{summary || "Profile not filled in yet"}</p>
          <Link href="/welcome?edit=1&next=/me" className="inline-flex min-h-11 items-center text-sm font-bold text-ink underline underline-offset-4">
            Edit profile
          </Link>
        </div>
      </section>

      <section className="sticker mt-5 p-4">
        <h2 className="font-display text-lg font-extrabold text-ink">Reminders</h2>
        <p className="mt-1 text-sm text-muted">For saved listings: 7 days and 1 day before the deadline.</p>
        {params.saved === "reminders" && <p className="mt-2 text-sm text-official">Saved.</p>}
        <form action={updateReminderSettings} className="mt-3 flex flex-col gap-3">
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="font-semibold text-ink">Email reminders</span>
            <input
              type="checkbox"
              name="email_reminders_enabled"
              defaultChecked={profile?.email_reminders_enabled ?? true}
              className="h-6 w-6 accent-ink"
            />
          </label>
          <label className="flex min-h-11 items-center justify-between gap-3">
            <span className="font-semibold text-ink">Phone notifications</span>
            <input
              type="checkbox"
              name="push_reminders_enabled"
              defaultChecked={profile?.push_reminders_enabled ?? true}
              className="h-6 w-6 accent-ink"
            />
          </label>
          <button type="submit" className="btn-plain press self-start text-sm">
            Save reminder settings
          </button>
        </form>
        <div className="mt-4 border-t-2 border-dashed border-line pt-3">
          <PushDevice />
        </div>
      </section>

      <section className="sticker mt-5 p-4">
        <h2 className="font-display text-lg font-extrabold text-ink">About</h2>
        <p className="mt-1 text-sm text-muted">
          Every listing is checked by our team against its official source. We collect only your name, email, school,
          course, year level, and interests.
        </p>
        {user.role !== "student" && (
          <Link href="/admin" className="btn-plain press mt-3 text-sm">
            Admin panel
          </Link>
        )}
      </section>

      <section className="mt-5 flex flex-col gap-3">
        <form action={signOut}>
          <button type="submit" className="btn-plain press w-full">
            Sign out
          </button>
        </form>
        <Link href="/me/delete" className="inline-flex min-h-11 items-center justify-center text-sm font-bold text-urgent underline">
          Delete my account
        </Link>
      </section>
      <BottomNav active="/me" />
    </main>
  );
}

function initials(name: string): string {
  const parts = name.replace(/@.*/, "").split(/[s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}
