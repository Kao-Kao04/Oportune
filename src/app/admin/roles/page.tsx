import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { grantRole, removeRole } from "./actions";

export const instant = false;

export default async function RolesPage({ searchParams }: PageProps<"/admin/roles">) {
  const me = await requireAdmin();
  const params = await searchParams;
  const admin = createAdminClient();

  const { data: roles, error } = await admin.from("user_roles").select("user_id, role, created_at").order("created_at");
  if (error) throw error;
  const emails = new Map<string, string>();
  await Promise.all(
    roles.map(async (r) => {
      const { data } = await admin.auth.admin.getUserById(r.user_id);
      emails.set(r.user_id, data.user?.email ?? "(unknown)");
    }),
  );

  return (
    <main className="px-4 py-4">
      <h1 className="text-xl font-bold text-ink">Users &amp; roles</h1>
      <p className="mt-1 text-sm text-muted">
        Curators manage listings, imports, and reports. Admins can also manage roles. Everyone else is a student.
      </p>

      {typeof params.error === "string" && (
        <p role="alert" className="mt-3 rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
          {params.error}
        </p>
      )}
      {params.saved && <p className="mt-3 rounded-ui bg-official/10 px-3 py-2 text-sm text-official">Saved.</p>}

      <form action={grantRole} className="mt-4 flex flex-wrap gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="their@email.com"
          className="h-10 min-w-0 flex-1 rounded-ui border border-line bg-white px-3 text-sm"
        />
        <select name="role" className="h-10 rounded-ui border border-line bg-white px-2 text-sm">
          <option value="curator">Curator</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="h-10 rounded-ui bg-teal px-3 text-sm font-semibold text-white">
          Add
        </button>
      </form>

      <ul className="mt-4 border-t border-line">
        {roles.map((r) => (
          <li key={r.user_id} className="flex items-center justify-between gap-3 border-b border-line py-3">
            <div className="min-w-0">
              <div className="truncate font-semibold text-ink">{emails.get(r.user_id)}</div>
              <div className="text-sm capitalize text-muted">{r.role}</div>
            </div>
            {r.user_id !== me.id && (
              <form action={removeRole}>
                <input type="hidden" name="user_id" value={r.user_id} />
                <button type="submit" className="rounded-ui border border-line bg-white px-3 py-1.5 text-sm text-urgent">
                  Remove
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
