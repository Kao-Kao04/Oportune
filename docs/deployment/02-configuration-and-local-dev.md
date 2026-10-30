# Deployment 2/5 — Configuration & Local Development

> Part of [deployment](../deployment.md) · ← [Previous](01-environments-and-prerequisites.md) · [Next](03-database-ci-and-pipeline.md) →

## ✅ What to do with this file

- [ ] Use the root `.env.example` as the template; copy it to `.env.local` and fill in local values.
- [ ] Never commit real secrets; use different credentials per environment.
- [ ] Follow the 8-step local workflow to get the app running.
- [ ] Rotate the Supabase secret key and reset the database password before deploying (both were pasted in chat).
- [ ] Seed only synthetic (fake) data.

---

## 4. Configuration and Environment Variables

The root [`.env.example`](../../.env.example) is the single list of variables, with names and safe placeholders only. Keep it up to date whenever code needs a new variable; don't copy the list into the docs.

It covers: app URL (`APP_BASE_URL`); Supabase (URL, publishable key, secret key, database URL); reminder emails (Resend key, sender); web push (VAPID keys); `CRON_SECRET` for job endpoints; rate limiting (`RATE_LIMIT_IP_SALT`); and captcha (Cloudflare Turnstile). Rate limits use the Postgres `rate_limits` table and errors go to Vercel logs, so there are no Redis or error-tracking variables. Google sign-in is configured in the Supabase dashboard (OAuth client ID/secret), not in env vars. Planned, frozen: an AI provider key, Firebase, and Facebook/LinkedIn app credentials.

Important:
- Use only the variables required by the actual implementation.
- Only `NEXT_PUBLIC_*` values reach the browser. Never put the secret key, VAPID private key, email key, Turnstile secret, or AI key there.
- Keep production values in the host's secret manager.
- Rotate any secret accidentally committed, pasted in chat, or included in a build artifact. The Supabase secret key and database password were pasted in chat: rotate the key and reset the password before deploying.
- Use different credentials for local, staging, and production.

## 5. Local Development

A typical workflow:

1. Clone the repository.
2. Install dependencies using the package manager and lockfile committed by the project.
3. Copy `.env.example` to `.env.local`.
4. Configure a development Supabase project (set `DATABASE_URL` to the session pooler URL).
5. Run migrations: `npm run db -- push`.
6. Seed synthetic test users; you may import `data/opportunities.csv` (public listing data, no personal data) with `npm run import:opportunities` (preview; add `-- --apply` to write drafts).
7. Start the development server.
8. Run linting, type checks, and unit tests.

Commands (from `package.json`):

```bash
npm ci
cp .env.example .env.local
npm run db -- push
npm run lint
npm run typecheck
npm test
npm run dev
```

Do not run commands that reset or delete a database until its target environment is positively confirmed.

