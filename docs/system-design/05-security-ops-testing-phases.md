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
- Role checks for curator/admin routes; audit-log admin actions.
- Validate all inputs; use parameterized queries/ORM.
- Rate-limit reports, analytics events, and sign-in.
- Sanitize listing text to prevent stored XSS.
- **Data minimization:** only school, course, year level, interests, name, and email from Google. No ID numbers or financial info in the database.
- **Documents (Phase 2):** treated as sensitive personal information; private bucket, owner-only access, short-lived links, no admin access, deleted with the account.
- **AI (Phase 2):** server-side key; send the provider only what each request needs; no prompts/answers stored; choose a provider that doesn't train on API data.
- **Sourcing:** social media sourcing (Phase 3) only from allow-listed public organization pages, official APIs first; never personal profiles or private groups; store short factual summaries in our own words with a link to the source; no personal contact info of organizers (Data Privacy Act; NPC Advisory No. 2026-01; RA 10175; RA 8293).
- **Breach response:** for qualifying breaches of personal data, notify the NPC and affected users within **72 hours**. Write the plan now.
- Privacy notice, account deletion, and a contact for privacy questions.

## 9. Reliability and Operations

- Database migrations in version control.
- Automated backups; test a restore at least once before launch.
- Error tracking and uptime checks.
- Daily jobs: auto-expire, schedule/send reminders. Log each run; alert on repeated failures.
- Weekly curator routine: check reports, re-check rolling/TBA listings older than 30 days, import new listings.
- Separate staging and production.

## 10. Testing Strategy

- **Unit (highest priority):** official-site badge (including lookalike URLs), closing-soon and expiry in Philippine time, reminder scheduling and deduplication, CSV import mapping.
- **Integration:** Row-Level Security (a student can't read another student's saved items), Google sign-in, push subscription storage.
- **End-to-end:** open a shared link logged out → view → share → save (sign-in) → reminder scheduled → delete account.
- **Security:** admin routes blocked for students, input validation, XSS in listing text.
- **Phase 2:** a student can't read another student's files or a curator any student's files; wrong file types and oversized files are rejected; the AI never states a deadline or requirement missing from the listing.
- **Phase 3:** the sourcing job stores no names or comments; push reaches the Android app.
- **Device:** a low-end Android phone on a slow connection; link preview in Messenger.

Use only synthetic data in tests.

## 11. Build Phases

| Phase | Focus |
|---|---|
| **0 — Curate & post** | Channel + spreadsheet (`data/opportunities.csv`); no code |
| **1 — MVP** | Public listings, closing soon, search/filters, badge, report, share, Google sign-in + profile, save, email + push reminders, admin + CSV import, auto-expire, delete account, analytics |
| **2 — Track & prepare** | Application tracker statuses, OJT checklist, "for you" filter, document uploads, AI helper |
| **3 — Grow** | Android app (then iPhone), social media sourcing into the curator inbox, Messenger/Telegram reminders, offline saved items, AI-assisted admin entry, RSS feeds, DOST ROS info page |
| **Later / maybe** | ROS tracker, organizer submissions, school/employer features, payments/monetization |

## 12. What We Won't Build

- Payments (not needed now), loan referrals, microservices
- Collecting from personal profiles or private groups, or storing people's personal data from social media

## 13. Architecture Decisions to Record

- Hosting and database (Vercel + Supabase?)
- Auth (Supabase Auth + Google?)
- Scheduled jobs provider
- Email provider
- Web push setup (VAPID keys, service worker)
- Analytics tool and what's tracked
- Backup and breach-response plan
- Listing sourcing policy, including which social platforms and pages (Phase 3)
- AI provider, model, daily limits, and monthly cap (Phase 2)
- File storage limits and retention (Phase 2)
- Mobile app wrapper and store accounts (Phase 3)

Payment provider: **not needed now**.
