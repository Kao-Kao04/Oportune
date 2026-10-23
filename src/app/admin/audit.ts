import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CurrentUser } from "@/lib/auth";
import type { Database, Json } from "@/lib/supabase/database.types";

// Writes an audit entry as the signed-in curator. No personal data or secrets
// in metadata (docs/system-design/03-data-model.md).
export async function audit(
  supabase: SupabaseClient<Database>,
  user: CurrentUser,
  action: string,
  target: { type: string; id?: string | null },
  metadata: Record<string, Json> = {},
) {
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: user.id,
    action,
    target_type: target.type,
    target_id: target.id ?? null,
    metadata,
  });
  if (error) throw new Error(`Audit log failed: ${error.message}`);
}
