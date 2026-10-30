# Student Opportunity Hub — Deployment Guide

How to run the app locally, ship it safely to production, and keep it running: Vercel + Supabase, email-link sign-in (Google optional), daily jobs for reminders and auto-expiry, email + web push. The app is built but **not deployed yet**: no domain, no admin account.

**Before the first deploy:** rotate the Supabase secret key and reset the database password; both were pasted in chat ([Part 5 §13](deployment/05-launch-security-and-operations.md#13-production-security-checklist), [final decisions §1c](research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)). The free `*.vercel.app` address is fine for the 30-day sprint. No payment setup needed; an AI provider, file storage, and app stores are planned and frozen until the sprint passes.

The full document is split into 5 parts — read them in order:

| # | Part | Covers | Main action |
|---|---|---|---|
| 1 | [Purpose, Environments & Prerequisites](deployment/01-environments-and-prerequisites.md) | §1–3 | Set up local / staging / production |
| 2 | [Configuration & Local Development](deployment/02-configuration-and-local-dev.md) | §4–5 | Configure `.env.local` and run locally |
| 3 | [Database, CI & Deployment Pipeline](deployment/03-database-ci-and-pipeline.md) | §6–8 | Provision DB with RLS, set up CI and release flow |
| 4 | [Domain/HTTPS, Scheduled Jobs, Push & Installable App](deployment/04-domain-jobs-and-push.md) | §9–12 | Domain, daily jobs, push, link previews |
| 5 | [Security Checklist, Smoke Tests, Monitoring, Recovery & Release](deployment/05-launch-security-and-operations.md) | §13–18 | Pass the checklists and launch |
