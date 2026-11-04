import "server-only";
import type { createClient } from "@/lib/supabase/server";

type Client = Awaited<ReturnType<typeof createClient>>;

// The Re-check queue, oldest check first: imported "needs check" drafts and
// rolling/TBA listings not checked for 30+ days. Shared by the Re-check page
// and "Publish & next" so a curator can work through it one by one.
export async function recheckQueue(supabase: Client) {
  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, organization, status, needs_check, recheck_due, source_url, last_checked_at, notes")
    .or("needs_check.eq.true,recheck_due.eq.true")
    .neq("status", "archived")
    .order("last_checked_at", { ascending: true, nullsFirst: true });
  if (error) throw error;
  return data;
}

// Where to go after `currentId`: the next item in the queue (wrapping), or
// null when nothing else is left.
export function nextInQueue(ids: string[], currentId: string): string | null {
  const others = ids.filter((id) => id !== currentId);
  if (others.length === 0) return null;
  const at = ids.indexOf(currentId);
  return at === -1 ? others[0] : (ids.slice(at + 1).find((id) => id !== currentId) ?? others[0]);
}
