import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

// Temporary home page for M1: confirms the app can reach Supabase.
// Replaced by the listing page in M2.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold">Oportune</h1>
      <p>Scholarships, internships, hackathons, and more for college students in the Philippines.</p>
      {/* Reads the session cookie, so it streams in at request time */}
      <Suspense fallback={<p className="text-sm">Supabase: checking…</p>}>
        <SupabaseStatus />
      </Suspense>
    </main>
  );
}

async function SupabaseStatus() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  return (
    <p className="text-sm">
      Supabase:{" "}
      {error
        ? `not connected (${error.message})`
        : `connected · ${data?.claims ? "signed in" : "not signed in"}`}
    </p>
  );
}
