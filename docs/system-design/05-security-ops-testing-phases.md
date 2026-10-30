# System Design 5/5 — Security, Operations, Testing & Build Phases

> Part of [system-design](../system-design.md) · ← [Previous](04-api-and-logic.md)

## ✅ What to do with this file

- [ ] Use the security list (§8) as a code-review checklist.
- [ ] Before deploying: rotate the Supabase secret key and reset the database password (both were pasted in chat), and write the breach response plan.
- [ ] Set up backups and error tracking; migrations and analytics already exist.
- [ ] Keep tests in `tests/` following §10, starting with the core logic.
- [ ] Respect the feature freeze in §11 until the 30-day sprint ends (2026-11-25) and passes.

---

## 8. Security and Privacy

- HTTPS everywhere; secrets only on the server or in the host's secret manager. A secret that was ever pasted or committed is rotated before deploy.
- **Row-Level Security** on every table: students can only access their own profile, saved items, push subscriptions, notifications, and submissions.
- **Public data only through views:** the public reads listings through `public_opportunities`, never the `opportunities` table, so internal columns can't leak through the public publishable key.
- **Roles live in `user_roles`**, which no student can write; role checks on curator/admin routes and in RLS read from it; audit-log admin actions and role changes.
- Validate all inputs; use parameterized queries/ORM.
- Rate-limit reports, analytics events, submissions, and sign-in using the shared `rate_limits` table; Turnstile captcha on the report and submit forms.
- **Minors:** some first-year students are 17. Decision ([final decisions §1b](../research/final-decisions.md#1b-updates-agreed-2026-10-26)): under 18 can browse and share without an account; sign-up, save, and reminders stay 18+ until a lawyer approves a guardian-consent flow (see also [idea Part 5 §16](../idea/05-validation-metrics-risks.md#16-facts-to-verify)). Enforced since 2026-10-30: the quick profile can't be saved without "I am 18 or older", saving a listing checks it again, and the reminder job skips anyone not marked 18+.
- Sanitize listing text to prevent stored XSS.
- **Data minimization:** only school, course, year level, interests, the 18-or-older answer, and the sign-in email (plus name if Google is used). The OJT checklist stays in the browser. No ID numbers or financial info in the database.
- **Trust wording:** listings are "checked" (a person opened the source and confirmed the details on the date shown), never "verified"; the official badge is only for `.gov.ph` / `.edu.ph`.
- **Documents (planned, frozen):** treated as sensitive personal information; private bucket, owner-only access, short-lived links, no admin access, deleted with the account. Launch only after the NPC registration check.
- **AI (planned, frozen; none in the app today):** server-side key; send the provider only what each request needs; no prompts/answers stored; choose a provider that doesn't train on API data; separate, revocable consent before any document is sent.
- **Sourcing:** no scraping of social platforms; listings come from curators and `/submit`, and the planned (frozen) inbox would add student shares and pages connected by their own admins through official APIs; connected-page tokens encrypted; store short factual summaries in our own words with a link to the source; no personal contact info of organizers (Data Privacy Act; NPC Advisory No. 2026-01; RA 10175; RA 8293).
- **Breach response:** for qualifying breaches of personal data, notify the NPC and affected users within **72 hours**. Write the plan now.
- Privacy notice, account deletion, and a contact for privacy questions.

## 9. Reliability and Operations

- Database migrations in version control.
- Automated backups; test a restore at least once before launch.
- Error tracking and uptime checks (today errors go to Vercel logs; no tracking service is wired).
- Daily jobs: auto-expire, send reminders, cleanup. Log each run in `job_runs`; a job that fails twice in a row logs a loud error.
- Weekly curator routine: check reports (fix within 48 hours), clear the "Re-check due" queue, clear the submissions queue, import new listings. Log curator time in the sprint's [`curation-log.csv`](../validation/templates/curation-log.csv).
- Watch the email provider's daily send count against its cap.
- Separate staging and production.

## 10. Testing Strategy

- **Unit (highest priority):** official-site badge (including lookalike URLs), closing-soon and expiry in Philippine time, reminders (a TBA deadline that later gets a date, an extended deadline, an earlier deadline, a save 3 days before the deadline, running the job twice, catching up after a missed day), CSV import mapping (including the published-row diff), slug generation (`ñ`, long titles, collisions).
- **Integration:** Row-Level Security (a student can't read another student's saved items or submissions), the publishable key can't read `opportunities` or any internal column, email-link sign-in (and Google once configured), push subscription storage, deleting a user who has rows in every table.
- **End-to-end:** open a shared link logged out → view → share → save (sign-in) → reminder sent on the right day → delete account.
- **Security:** a student can't change their own role (direct API call to `profiles` and `user_roles`), admin routes blocked for students, rate limits hold across parallel requests, input validation, XSS in listing text.
- **Planned (frozen) Phase 2 parts:** a student can't read another student's files or a curator any student's files; wrong file types and oversized files are rejected; the AI never states a deadline or requirement missing from the listing.
- **Planned (frozen) Phase 3:** sharing a link from Facebook on Android lands it in the inbox; duplicates are caught; logged-out sharing keeps the link through sign-in; a student can't see the inbox; push reaches the Android app.
- **Device:** a low-end Android phone on a slow connection; link preview in Messenger.

Use only synthetic data in tests.

## 11. Build Phases

**Feature freeze:** nothing new gets built until the [30-day validation sprint](../validation/06-30-day-validation-sprint.md) ends (2026-11-25) and passes. Allowed: security, config, deploy, bug fixes, content, and `?ref=` links ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).

| Phase | Focus | Status |
|---|---|---|
| **0 — Curate & post** | Channel + spreadsheet (`data/opportunities.csv`); no code | Spreadsheet in use |
| **1 — MVP** | Public listings, closing soon, search/filters, badge, report, share, email-link sign-in (Google wired, not configured) + profile, save, email + push reminders, admin + CSV import, auto-expire, delete account, analytics | Built, not deployed |
| **2 — Track & prepare** | Audience filters, add to calendar, `/submit` + curator queue, OJT checklist (browser-only) | Built 2026-10-25, not committed; keep as is |
| | Application tracker statuses, "for you" filter, document uploads, AI helper, education level | Planned, frozen |
| **3 — Grow** | Android app (then iPhone), curator inbox ("Share to Oportune", paste-to-draft, connected pages), "remind me when it opens", weekly digest, Messenger/Telegram reminders, offline saved items, AI-assisted admin entry, RSS feeds, DOST ROS info page | Planned, frozen |
| **Later / maybe** | ROS tracker, Facebook Page Public Content Access, school/employer features, clearly marked ad slots (only after the 12-week gate, [§1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)) | Not planned |

## 12. What We Won't Build

- Payments (not needed now), loan referrals, microservices
- Paid, sponsored, or featured listings; any fee for students, organizers, or schools ([final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26))
- Scraping of Facebook, LinkedIn, or other platforms (link, don't scrape)

## 13. Architecture Decisions to Record

Already chosen in the code (record why): Vercel + Supabase; Supabase Auth with email links (Google optional); Vercel Cron; Postgres `rate_limits` + Turnstile; Resend; Web Push (VAPID keys, service worker); our own `analytics_events`.

Still open:
- Error tracking service (only Vercel logs today)
- Backup and breach-response plan
- Listing sourcing policy, including submission review rules (and inbox/connected pages, planned)
- Planned, frozen: AI provider, model, limits, and monthly cap; file storage limits and retention; mobile app wrapper and store accounts

Payment provider: **not needed now**.
