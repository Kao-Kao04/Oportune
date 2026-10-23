# Student Opportunity Hub — Deployment Guide

How to run the app locally, ship it safely to production, and keep it running: Vercel + Supabase, Google sign-in, daily jobs for reminders and auto-expiry, email + web push. No payment or AI setup needed.

The full document is split into 5 parts — read them in order:

| # | Part | Covers | Main action |
|---|---|---|---|
| 1 | [Purpose, Environments & Prerequisites](deployment/01-environments-and-prerequisites.md) | §1–3 | Set up local / staging / production |
| 2 | [Configuration & Local Development](deployment/02-configuration-and-local-dev.md) | §4–5 | Configure `.env.local` and run locally |
| 3 | [Database, CI & Deployment Pipeline](deployment/03-database-ci-and-pipeline.md) | §6–8 | Provision DB with RLS, set up CI and release flow |
| 4 | [Domain/HTTPS, Scheduled Jobs, Push & Installable App](deployment/04-domain-jobs-and-push.md) | §9–12 | Domain, daily jobs, push, link previews |
| 5 | [Security Checklist, Smoke Tests, Monitoring, Recovery & Release](deployment/05-launch-security-and-operations.md) | §13–18 | Pass the checklists and launch |
