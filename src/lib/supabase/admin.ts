import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Secret-key client: bypasses RLS. Server-only. Use it only after checking the
// caller's permissions, and only for writes RLS deliberately blocks (reports
// from logged-out students, role changes, rate limits).
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
