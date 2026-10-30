# Deployment 5/5 — Security Checklist, Smoke Tests, Monitoring, Recovery & Release

> Part of [deployment](../deployment.md) · ← [Previous](04-domain-jobs-and-push.md)

## ✅ What to do with this file

- [ ] Complete the production security checklist before launch, starting with the first item (rotate the leaked Supabase credentials).
- [ ] Run the smoke tests after every production release.
- [ ] Set up monitoring and assign an owner for critical alerts.
- [ ] Write down the incident plan (including the NPC 72-hour rule) and test a backup restore.
- [ ] Fill in the "Deployment Decisions Still Needed" table.

---

## 13. Production Security Checklist

- [ ] **Do first, before deploying:** Supabase secret key rotated and database password reset (both were pasted in chat); `.env.local` and Vercel updated with the new values
- [ ] HTTPS enforced
- [ ] Secrets stored outside source control; only `NEXT_PUBLIC_*` values in the browser
- [ ] Row-Level Security enabled and tested on every table
- [ ] Anon key can read only `public_opportunities` (no internal columns, no drafts)
- [ ] Roles stored in `user_roles`; a student can't grant themselves a role
- [ ] Admin/curator routes restricted and audited
- [ ] Input validation, XSS sanitization, and rate limits configured
- [ ] Job endpoints protected with `CRON_SECRET`
- [ ] Database backups enabled and restore tested
- [ ] Privacy notice and terms published
- [ ] Account deletion works and removes saved items, push subscriptions, and notifications
- [ ] Breach response plan written (notify NPC within 72 hours for qualifying breaches)
- [ ] Error monitoring configured (at least an alert on Vercel log errors)
- [ ] Email delivery and unsubscribe tested
- [ ] Listing report and review workflow working
- [ ] Rollback procedure documented

## 14. Post-Deployment Smoke Tests

After each production release, run `npm run smoke -- <app URL>` (automated checks; it prints the manual ones), then verify:

1. Home page loads over HTTPS on a phone, logged out.
2. Browse, "closing soon", search, category, and region/course/year filters work.
3. A listing detail page shows the deadline, source link, "Last checked by our team" date, and the official badge (only for a `.gov.ph` / `.edu.ph` source); "Add to calendar" works for a dated listing.
4. A listing link pasted into Messenger shows a proper preview.
5. Share button works on a phone.
6. Email-link sign-in (and Google, if switched on) and the quick profile work.
7. Save/unsave works; a test listing with a deadline 7 days away gets a reminder on the next reminder run.
8. A test push notification arrives on a test device.
9. Report button creates a report visible in the admin panel.
10. Curators can import the CSV, publish, and expire listings; a `/submit` entry shows up in `/admin/submissions`.
11. Students cannot access admin pages or other students' saved items, and a request with the public publishable key can't read draft listings or internal notes.
12. Account deletion works for a test account.

## 15. Monitoring and Operations

Monitor:
- Availability, error rate, page speed on mobile
- Daily job runs (expire, reminders, cleanup) from `job_runs`: success/failure counts, missed days
- Email delivery, bounce, and unsubscribe rates, and daily sends vs. the provider's cap
- Push delivery failures and expired subscriptions
- Listing freshness: expired, rolling/TBA not checked in 30+ days, open reports
- Product signals in Admin → Stats (`analytics_events`): views, official-link clicks, saves, shares, reminders opened; return visits by `anonymous_id` for the [sprint scorecard](../validation/06-30-day-validation-sprint.md#1-what-were-testing)

Set an owner for critical alerts. Avoid personal data in logs.

## 16. Incident and Recovery Plan

1. Assess impact and restrict affected access or credentials.
2. Preserve logs and investigate without exposing user data further.
3. Rotate compromised credentials.
4. Restore from a known-good release or backup if needed.
5. If personal data is involved, decide quickly whether the NPC and affected users must be notified (**within 72 hours** for qualifying breaches).
6. Document root cause, timeline, and fixes.
7. Review the process and test the fix.

## 17. Release Checklist

Before launch:
- [ ] Supabase secret key rotated and database password reset (§13, first item)
- [ ] Admin account created: `npm run grant-role -- <email> admin`
- [ ] Listings imported and reviewed (no `needs-check` rows published unconfirmed); 40+ open, dated pilot listings; every undated listing says "Rolling: apply any time" or "Usually opens in <month> (based on <year>)"
- [ ] Public wording says "checked", not "verified"
- [ ] Core journeys tested on a real phone (browse → share → save → reminder)
- [ ] Production isolated from staging
- [ ] Migrations and RLS policies reviewed
- [ ] Monitoring, analytics, and backups enabled
- [ ] Privacy notice, terms, and sourcing policy published
- [ ] Support/privacy contact set up
- [ ] Rollback plan available
- [ ] Launch announcement ready for the Phase 0 channel

## 18. Deployment Decisions Still Needed

| Decision | Suggested | Selected value |
|---|---|---|
| Framework | Next.js (TypeScript) | Next.js 16 (in code) |
| Hosting | Vercel | Vercel Hobby (in code: `vercel.json`) |
| Database + auth | Supabase | Supabase; email-link sign-in; Google wired, not configured |
| Scheduled jobs | Vercel Cron | Vercel Cron (in code) |
| Email | Resend | Resend (in code) |
| Rate limiting + captcha | Postgres table + Cloudflare Turnstile | Postgres `rate_limits` + Turnstile (in code) |
| Push | Web Push (VAPID) | Web Push (in code) |
| Analytics | Own `analytics_events` table | Own table + Admin → Stats (in code) |
| Error monitoring | — | TBD (Vercel logs only today) |
| Domain and DNS | `*.vercel.app` for the sprint | TBD after the sprint |
| Backup retention | — | TBD |
| Payment provider | **Not needed**: nobody pays to use Oportune | — |
| Ads | Later only, under [§1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26): after the soft launch has traffic, marked "Ad" slots, blocked categories, none in reminders, Vercel Pro first | — |
| AI provider (planned, frozen) | An LLM API that doesn't train on API data (e.g., Claude) | — |
| File storage (planned, frozen) | Supabase Storage, private bucket | — |
| Mobile app (planned, frozen) | Capacitor + Firebase Cloud Messaging | — |
| Curator inbox (planned, frozen) | Web Share Target + app share intent; Facebook/LinkedIn developer apps for connected pages | — |

Frozen rows wait for the 30-day sprint ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).

Start with the smallest secure deployment that supports the MVP.
