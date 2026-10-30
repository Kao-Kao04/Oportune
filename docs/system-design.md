# Student Opportunity Hub — System Design

How the platform is built: one Next.js + PostgreSQL (Supabase) app with public listing pages, email-link sign-in (Google sign-in wired but not configured yet), save + push/email reminders, an admin panel with spreadsheet import, and automatic expiry. Also built (2026-10-25, not yet committed): audience filters, add to calendar, a "Submit an opportunity" form with a curator queue, and an OJT checklist. Not deployed yet.

Everything else here (document uploads, AI, the mobile app, "Share to Oportune", connected pages) is **planned and frozen** until the 30-day sprint passes ([final decisions §1c](research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)). Nobody pays to use it; clearly marked ads come later, never during the sprint ([§1d](research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)).

The full document is split into 5 parts — read them in order:

| # | Part | Covers | Main action |
|---|---|---|---|
| 1 | [Purpose, Architecture & Tech Stack](system-design/01-architecture-and-stack.md) | §1–3 | Confirm the stack; use free tiers |
| 2 | [Core Modules](system-design/02-core-modules.md) | §4 | See what's built vs. planned |
| 3 | [Data Model](system-design/03-data-model.md) | §5 | Keep in sync with `supabase/migrations/` |
| 4 | [API Surface & Core Logic](system-design/04-api-and-logic.md) | §6–7 | Badge, closing soon, expiry, reminders, sharing, import |
| 5 | [Security, Operations, Testing & Build Phases](system-design/05-security-ops-testing-phases.md) | §8–13 | Check build status (§11); record decisions |
