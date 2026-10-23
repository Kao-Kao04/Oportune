// Gives an existing account the curator or admin role. Use it to create the
// first admin; after that, admins manage roles in the admin panel.
//   npm run grant-role -- someone@example.com admin
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
const [email, roleArg = "curator"] = process.argv.slice(2);
const role = roleArg === "admin" ? "admin" : roleArg === "curator" ? "curator" : null;
if (!email || !role) {
  console.error("Usage: npm run grant-role -- <email> <curator|admin>");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false },
});

async function main() {
  let userId: string | undefined;
  for (let page = 1; !userId && page <= 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    userId = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
    if (data.users.length < 200) break;
  }
  if (!userId) {
    console.error(`No account for ${email}. Sign in once at /sign-in first, then run this again.`);
    process.exit(1);
  }

  const { error } = await supabase.from("user_roles").upsert({ user_id: userId, role });
  if (error) throw error;
  const { error: auditError } = await supabase.from("audit_logs").insert({
    action: "role.grant",
    target_type: "user",
    target_id: userId,
    metadata: { role, via: "script" },
  });
  if (auditError) throw auditError;
  console.log(`${email} is now ${role}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
