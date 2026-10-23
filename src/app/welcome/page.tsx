import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { categoryChipLabel } from "@/lib/opportunities/categories";
import { isProfileComplete, type ProfileFields } from "@/lib/profile";
import { safeNextPath } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Quick setup", robots: { index: false } };

// Reads the session; let it block on the server.
export const instant = false;

// The quick profile shown right after sign-in (or from Me → Edit profile).
// Students who already finished it go straight on to `next`.
export default async function WelcomePage({ searchParams }: PageProps<"/welcome">) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/");
  const editing = params.edit === "1";

  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(next)}`);

  const supabase = await createClient();
  const [{ data: profile }, { data: categories }] = await Promise.all([
    supabase
      .from("profiles")
      .select("school, course_group, course, year_level, interests, is_18_or_over")
      .eq("user_id", user.id)
      .single(),
    supabase.from("categories").select("slug, name").order("sort_order"),
  ]);
  const values: ProfileFields = profile ?? {
    school: null,
    course_group: null,
    course: null,
    year_level: null,
    interests: [],
    is_18_or_over: null,
  };
  if (!editing && isProfileComplete(values)) redirect(next);

  return (
    <main className="px-4 py-8">
      <h1 className="text-2xl font-bold text-ink">{editing ? "Edit profile" : "Quick setup"}</h1>
      <p className="mb-6 mt-1 text-muted">
        {editing ? "Used only to show what fits you." : "So we can show what fits you. Takes 20 seconds."}
      </p>
      <ProfileForm
        values={values}
        next={next}
        submitLabel={editing ? "Save" : "Done"}
        categories={(categories ?? []).map((c) => ({ slug: c.slug, label: categoryChipLabel(c.slug, c.name) }))}
      />
    </main>
  );
}
