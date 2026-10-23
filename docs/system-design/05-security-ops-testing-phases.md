# System Design 5/5 — Security, Operations, Testing & Build Phases

> Part of [system-design](../system-design.md) · ← [Previous](04-api-and-logic.md)

## ✅ What to do with this file

- [ ] Use the security list (§8) as a code-review checklist.
- [ ] Write the breach response plan before launch.
- [ ] Set up migrations, backups, error tracking, and analytics early.
- [ ] Write tests in `tests/` following §10, starting with the core logic.
- [ ] Follow the build phases (§11) in order.

---

## 8. Security and Privacy

- HTTPS everywhere; secrets only on the server or in the host's secret manager.
- **Row-Level Security**: students can only access their own profile, saved items, push subscriptions, and notifications.
- **Public data only through views:** the public reads listings through `public_opportunities`, never the `opportunities` table, so internal columns can't leak through the public publishable key.
- **Roles live in `user_roles`**, which no student can write; role checks on curator/admin routes and in RLS read from it; audit-log admin actions and role changes.
- Validate all inputs; use parameterized queries/ORM.
- Rate-limit reports, analytics events, sign-in, AI, and shares using a shared store (Upstash Redis or the `rate_limits` table); captcha on logged-out forms.
- **Minors:** some first-year students are 17. Ask "I am 18 or older" at sign-up. Until the legal check in [idea Part 5 §16](../idea/05-validation-metrics-risks.md#16-facts-to-verify) is done, under-18 users can browse and save, but don't get the AI helper or document uploads, and nothing beyond the basic profile is collected from them.
- Sanitize listing text to prevent stored XSS.
- **Data minimization:** only school, course, year level, interests, the 18-or-older answer, and name and email from Google. No ID numbers or financial info in the database.
- **Documents (Phase 2):** treated as sensitive personal information; private bucket, owner-only access, short-lived links, no admin access, deleted with the account. Launch only after the NPC registration check.
- **AI (Phase 2):** server-side key; send the provider only what each request needs; no prompts/answers stored; choose a provider that doesn't train on API data; separate, revocable consent before any document is sent.
- **Sourcing:** no scraping of social platforms; Phase 3 inbox items come from student shares, submissions, and pages connected by their own admins through official APIs; connected-page tokens encrypted; store short factual summaries in our own words with a link to the source; no personal contact info of organizers (Data Privacy Act; NPC Advisory No. 2026-01; RA 10175; RA 8293).
- **Breach response:** for qualifying breaches of personal data, notify the NPC and affected users within **72 hours**. Write the plan now.
- Privacy notice, account deletion, and a contact for privacy questions.

## 9. Reliability and Operations

- Database migrations in version control.
- Automated backups; test a restore at least once before launch.
- Error tracking and uptime checks.
- Daily jobs: auto-expire, send reminders, cleanup. Log each run in `job_runs`; alert if a job fails twice in a row.
- Weekly curator routine: check reports, clear the "Re-check due" queue, import new listings (Phase 3: clear the inbox).
- Watch the email provider's daily send count against its cap.
- Separate staging and production.

## 10. Testing Strategy

- **Unit (highest priority):** official-site badge (including lookalike URLs), closing-soon and expiry in Philippine time, reminders (a TBA deadline that later gets a date, an extended deadline, an earlier deadline, a save 3 days before the deadline, running the job twice, catching up after a missed day), CSV import mapping (including the published-row diff), slug generation (`ñ`, long titles, collisions).
- **Integration:** Row-Level Security (a student can't read another student's saved items), the publishable key can't read `opportunities` or any internal column, Google sign-in, push subscription storage, deleting a user who has rows in every table.
- **End-to-end:** open a shared link logged out → view → share → save (sign-in) → reminder sent on the right day → delete account.
- **Security:** a student can't change their own role (direct API call to `profiles` and `user_roles`), admin routes blocked for students, rate limits hold across parallel requests, input validation, XSS in listing text.
- **Phase 2:** a student can't read another student's files or a curator any student's files; wrong file types and oversized files are rejected; the AI never states a deadline or requirement missing from the listing.
- **Phase 3:** sharing a link from Facebook on Android lands it in the inbox; duplicates are caught; logged-out sharing keeps the link through sign-in; a student can't see the inbox; push reaches the Android app.
- **Device:** a low-end Android phone on a slow connection; link preview in Messenger.

Use only synthetic data in tests.

## 11. Build Phases

| Phase | Focus |
|---|---|
| **0 — Curate & post** | Channel + spreadsheet (`data/opportunities.csv`); no code |
| **1 — MVP** | Public listings, closing soon, search/filters, badge, report, share, Google sign-in + profile, save, email + push reminders, admin + CSV import, auto-expire, delete account, analytics |
| **2 — Track & prepare** | Application tracker statuses, OJT checklist, "for you" filter, document uploads, AI helper |
| **3 — Grow** | Android app (then iPhone), curator inbox ("Share to Oportune", submission form, connected pages), Messenger/Telegram reminders, offline saved items, AI-assisted admin entry, RSS feeds, DOST ROS info page |
| **Later / maybe** | ROS tracker, Facebook Page Public Content Access, school/employer features, payments/monetization |

## 12. What We Won't Build

- Payments (not needed now), loan referrals, microservices
- Scraping of Facebook, LinkedIn, or other platforms

## 13. Architecture Decisions to Record

- Hosting and database (Vercel + Supabase?)
- Auth (Supabase Auth + Google?)
- Scheduled jobs provider
- Rate-limit store (Upstash Redis or Postgres) and captcha (Turnstile)
- Email provider
- Web push setup (VAPID keys, service worker)
- Analytics tool and what's tracked
- Backup and breach-response plan
- Listing sourcing policy, including inbox review rules and connected pages (Phase 3)
- AI provider, model, daily limits, and monthly cap (Phase 2)
- File storage limits and retention (Phase 2)
- Mobile app wrapper and store accounts (Phase 3)

Payment provider: **not needed now**.
