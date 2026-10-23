# Student Opportunity Hub

A free, phone-first platform where college students in the Philippines (any public or private school) **find verified opportunities, share them, save them, and get reminded before deadlines**: scholarships, internships, hackathons, CTFs, free courses, and more.

Payments are deferred — the platform is free for students.

> Status: Phase 0 (curating and posting opportunities) and Phase 1: MVP milestones M1–M6 built. See [docs/launch-checklist.md](docs/launch-checklist.md) for what is left before launch.

## Project structure

```
├── docs/
│   ├── idea.md              # Product idea → 5 parts in docs/idea/
│   ├── system-design.md     # Architecture → 5 parts in docs/system-design/
│   ├── deployment.md        # Deployment → 5 parts in docs/deployment/
│   ├── design/stitch-prompts.md  # Google Stitch UI prompts (original)
│   ├── design/stitch-student-friendly.md  # v2: student-friendly redesign prompts
│   ├── design/adjust-prompts.md  # Tweak designs in Stitch; build them with Claude Code
│   ├── validation.md        # Optional interview kit → docs/validation/
│   └── launch-checklist.md  # What is left before launch
├── data/
│   ├── opportunities.csv    # Curated opportunity list (seed data for the app)
│   └── categories.csv       # Canonical category names + slugs
├── src/
│   ├── app/                 # Next.js pages (App Router)
│   ├── lib/supabase/        # Supabase clients: server, browser, session refresh
│   └── proxy.ts             # Refreshes the Supabase session on each request
├── supabase/migrations/     # Database schema (tables, RLS, views), applied in order
├── scripts/                 # Dev helpers (e.g. supabase-db.mjs)
├── tests/                   # Automated tests
├── .env.example             # Environment variable template (no real secrets)
└── README.md
```

## Where to start

1. **[docs/idea.md](docs/idea.md)** — understand the product and validate it first.
2. **[docs/system-design.md](docs/system-design.md)** — how the system will be built.
3. **[docs/deployment.md](docs/deployment.md)** — how to run and ship it.

**Current step:** Phase 0 — post curated opportunities from [`data/opportunities.csv`](data/opportunities.csv) while building the MVP ([features](docs/idea/03-features-and-workflow.md)).

Each part starts with a **"✅ What to do with this file"** checklist.

## Local setup

Needs Node.js 20.12 or newer.

```bash
npm install
cp .env.example .env.local   # fill in local values — never commit real secrets
npm run dev                  # http://localhost:3000
```

Checks (also run by GitHub Actions on every PR): `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

Database (uses `DATABASE_URL` from `.env.local`; use the Supabase **session pooler** URL):

```bash
npm run db -- migration list   # what's applied
npm run db -- push             # apply new files in supabase/migrations
npm run db -- lint             # check the schema
```

Add schema changes as new files in `supabase/migrations/` (`npx supabase migration new <name>`); never edit a migration that has already been pushed.

Import the curated spreadsheet into the database as **drafts** (needs `SUPABASE_SECRET_KEY` in `.env.local`):

```bash
npm run import:opportunities             # preview: new / updated / rejected rows
npm run import:opportunities -- --apply  # write
```

Re-running is safe: drafts are updated by their `OPP-###` id, slugs never change, and published listings are never touched.

See [Deployment Part 2](docs/deployment/02-configuration-and-local-dev.md) for the full local workflow.

### Admin panel

Curators and admins sign in at `/sign-in` with a one-time email link, then use `/admin` (listings, re-check queue, reports, CSV import with diffs, users & roles).

Create the first admin once (the account must have signed in at least once):

```bash
npm run grant-role -- you@example.com admin
```

Before going live, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile). In production, the report form refuses submissions without them.

### Student accounts

Students sign in at `/sign-in` (email link now; **Continue with Google** appears automatically once Google is switched on in Supabase → Authentication → Providers), answer the quick profile at `/welcome`, save listings, and manage reminders or delete their account at `/me`.

To turn on Google: create an OAuth client (type "Web application") in Google Cloud Console with the redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`, then paste its client ID and secret into the Supabase Google provider.

### Reminders and daily jobs

`vercel.json` schedules three jobs (times in UTC; Philippine time is UTC+8): auto-expire (00:05 PH), send reminders (08:00 PH), cleanup. Each needs `CRON_SECRET`:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/jobs/send-reminders
```

Phone notifications use web push (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`; generate with `npx web-push generate-vapid-keys`). Reminder emails use Resend: set `EMAIL_PROVIDER_API_KEY` and `EMAIL_FROM_ADDRESS` (a verified sender domain). Without them, the job sends push only and reports `email: false`.
