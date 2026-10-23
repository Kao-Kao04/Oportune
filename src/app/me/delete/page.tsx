import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { deleteAccount } from "../actions";

export const metadata: Metadata = { title: "Delete account", robots: { index: false } };

export const instant = false;

const ERRORS: Record<string, string> = {
  confirm: "Type DELETE in capital letters to confirm.",
  staff: "Curator and admin accounts can't be deleted here. Ask another admin to remove your role first.",
};

export default async function DeleteAccountPage({ searchParams }: PageProps<"/me/delete">) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  if (!user) redirect("/sign-in?next=/me");
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;

  return (
    <main className="px-4 py-6">
      <Link href="/me" className="text-sm text-muted hover:text-ink">
        ← Me
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-ink">Delete my account</h1>
      <p className="mt-2 text-ink">
        This removes your profile, saved items, reminders, and notification settings. This can&apos;t be undone.
      </p>
      <p className="mt-2 text-sm text-muted">
        Reports you sent stay, but without your name. You can sign up again anytime.
      </p>
      {error && (
        <p role="alert" className="mt-4 rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
          {error}
        </p>
      )}
      <form action={deleteAccount} className="mt-6 flex flex-col gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-ink">Type DELETE to confirm</span>
          <input name="confirm" autoComplete="off" className="h-11 w-full rounded-ui border border-line bg-white px-3 text-base" />
        </label>
        <div className="flex gap-3">
          <Link href="/me" className="inline-flex h-11 items-center rounded-ui border border-line bg-white px-4 font-semibold text-ink">
            Cancel
          </Link>
          <button type="submit" className="h-11 flex-1 rounded-ui bg-urgent px-4 font-semibold text-white">
            Delete
          </button>
        </div>
      </form>
    </main>
  );
}
