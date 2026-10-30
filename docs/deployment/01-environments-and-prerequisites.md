# Deployment 1/5 — Purpose, Environments & Prerequisites

> Part of [deployment](../deployment.md) · [Next](02-configuration-and-local-dev.md) →

## ✅ What to do with this file

- [ ] **First:** rotate the Supabase secret key and reset the database password (both were pasted in chat) before deploying or collecting any student data.
- [ ] Set up three environments: Local, Preview/Staging, Production.
- [ ] Go through the prerequisites list and tick off each item before deploying.
- [ ] Never copy real student data into local or staging.
- [ ] Create VAPID (web push) keys for each environment, and a Google OAuth client if you switch Google sign-in on.

---

## 1. Purpose and Status

This guide describes the deployment process for the Student Opportunity Hub. The app is built (Next.js on Vercel, Supabase) but **not deployed yet**: no production project, no domain, and no admin account (create one with `npm run grant-role -- <email> admin`).

For the 30-day sprint, deploy to the free `*.vercel.app` address; a custom domain can wait ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).

## 2. Recommended Environments

Maintain separate environments:

- **Local:** development with local or disposable test data
- **Preview/Staging:** integration testing using test accounts and test provider credentials
- **Production:** real users, protected secrets, backups, and monitoring

Never copy production student data into local development or preview environments unless there is a documented, authorized, privacy-safe process.

## 3. Prerequisites

Before deployment, confirm:

- **Supabase secret key rotated and database password reset** (both were exposed in chat)
- Application repository and a protected main branch
- Hosting: Vercel
- Managed PostgreSQL database (Supabase)
- Authentication configuration (Supabase Auth email links; Google sign-in optional, with an OAuth client per environment)
- Web push VAPID key pair per environment
- Transactional email provider (Resend) and verified sender domain
- `RATE_LIMIT_IP_SALT` set (rate limits use the Postgres `rate_limits` table) and a Cloudflare Turnstile site key
- Domain name and DNS access (not needed for the sprint: use `*.vercel.app`)
- Secret management for production credentials
- Database migration process
- Error monitoring and uptime checks
- Backup and restore procedure
- Privacy policy, terms, support contact, and account deletion process
- Breach response plan (NPC 72-hour notification) and a named privacy contact

Payments are out of scope for now; there is no payment provider to set up.

No AI provider is needed: the app has no AI. Planned and frozen until the sprint passes: an AI provider API key (server-side only, with a spending cap), a private Supabase Storage bucket, Google Play and Apple developer accounts, and a Firebase project for native push.

