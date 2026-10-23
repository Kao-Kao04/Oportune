# Student Opportunity Hub — System Design

How the platform is built: one Next.js + PostgreSQL (Supabase) app with public listing pages, Google sign-in, save + email/push reminders, an admin panel with spreadsheet import, and automatic expiry. No payments, no student-facing AI.

The full document is split into 5 parts — read them in order:

| # | Part | Covers | Main action |
|---|---|---|---|
| 1 | [Purpose, Architecture & Tech Stack](system-design/01-architecture-and-stack.md) | §1–3 | Confirm the stack; use free tiers |
| 2 | [Core Modules](system-design/02-core-modules.md) | §4 | Scaffold modules in `src/` |
| 3 | [Data Model](system-design/03-data-model.md) | §5 | Write migrations + Row-Level Security |
| 4 | [API Surface & Core Logic](system-design/04-api-and-logic.md) | §6–7 | Badge, closing soon, expiry, reminders, sharing, import |
| 5 | [Security, Operations, Testing & Build Phases](system-design/05-security-ops-testing-phases.md) | §8–13 | Follow phases 0→3; record decisions |
