# Deployment 2/5 — Configuration & Local Development

> Part of [deployment](../deployment.md) · ← [Previous](01-environments-and-prerequisites.md) · [Next](03-database-ci-and-pipeline.md) →

## ✅ What to do with this file

- [ ] Use the root `.env.example` as the template; copy it to `.env.local` and fill in local values.
- [ ] Never commit real secrets; use different credentials per environment.
- [ ] Follow the 8-step local workflow to get the app running.
- [ ] Seed only synthetic (fake) data.

---

## 4. Configuration and Environment Variables

Create an `.env.example` containing names and safe placeholders only. Never commit real secrets.

Example variables (adapt to the selected stack):

```dotenv
NODE_ENV=development
APP_BASE_URL=http://localhost:3000

# Supabase (URL and anon key are public by design; RLS protects the data)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Google sign-in is configured in the Supabase dashboard (OAuth client ID/secret)

# Reminder emails
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=

# Web push notifications (generate with: npx web-push generate-vapid-keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:

# Protects the scheduled-job endpoints (reminders, auto-expire)
CRON_SECRET=

ERROR_TRACKING_DSN=
```

Important:
- Use only the variables required by the actual implementation.
- Only `NEXT_PUBLIC_*` values reach the browser. Never put the service role key, VAPID private key, or email key there.
- Keep production values in the host's secret manager.
- Rotate any secret accidentally committed or included in a build artifact.
- Use different credentials for local, staging, and production.

## 5. Local Development

A typical workflow:

1. Clone the repository.
2. Install dependencies using the package manager and lockfile committed by the project.
3. Copy `.env.example` to `.env.local`.
4. Configure a local or development database.
5. Run migrations.
6. Seed synthetic test users; you may import `data/opportunities.csv` (public listing data, no personal data).
7. Start the development server.
8. Run linting, type checks, unit tests, and integration tests.

Example commands for a Node.js project (adjust to actual scripts):

```bash
npm ci
cp .env.example .env.local
npm run lint
npm run typecheck
npm test
npm run dev
```

Do not run commands that reset or delete a database until its target environment is positively confirmed.

