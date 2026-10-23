// Runs a Supabase CLI database command against DATABASE_URL from .env.local.
// Usage: npm run db -- push | migration list | lint
import { spawnSync } from "node:child_process";

process.loadEnvFile(".env.local");
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: npm run db -- push | migration list | lint");
  process.exit(1);
}
const command = args[0] === "push" || args[0] === "lint" ? ["db", ...args] : args;

const result = spawnSync("npx", ["supabase", ...command, "--db-url", dbUrl], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
