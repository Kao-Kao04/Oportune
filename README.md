# Student Opportunity Hub

A free, phone-first platform where college students in the Philippines (any public or private school) **find verified opportunities, share them, save them, and get reminded before deadlines**: scholarships, internships, hackathons, CTFs, free courses, and more.

Payments are deferred — the platform is free for students.

> Status: Phase 0 (curating and posting opportunities) and Phase 1, M1 Setup: Next.js app connected to Supabase; no features yet.

## Project structure

```
├── docs/
│   ├── idea.md              # Product idea → 5 parts in docs/idea/
│   ├── system-design.md     # Architecture → 5 parts in docs/system-design/
│   ├── deployment.md        # Deployment → 5 parts in docs/deployment/
│   ├── design/stitch-prompts.md  # Google Stitch UI prompts
│   └── validation.md        # Optional interview kit → docs/validation/
├── data/
│   ├── opportunities.csv    # Curated opportunity list (seed data for the app)
│   └── categories.csv       # Canonical category names + slugs
├── src/
│   ├── app/                 # Next.js pages (App Router)
│   ├── lib/supabase/        # Supabase clients: server, browser, session refresh
│   └── proxy.ts             # Refreshes the Supabase session on each request
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

Needs Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # fill in local values — never commit real secrets
npm run dev                  # http://localhost:3000
```

Checks: `npm run lint`, `npm run typecheck`, `npm run build`.

See [Deployment Part 2](docs/deployment/02-configuration-and-local-dev.md) for the full local workflow.
