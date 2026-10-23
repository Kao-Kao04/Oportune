# Deployment 5/5 — Security Checklist, Smoke Tests, Monitoring, Recovery & Release

> Part of [deployment](../deployment.md) · ← [Previous](04-domain-jobs-and-push.md)

## ✅ What to do with this file

- [ ] Complete the production security checklist before launch.
- [ ] Run the smoke tests after every production release.
- [ ] Set up monitoring and assign an owner for critical alerts.
- [ ] Write down the incident plan (including the NPC 72-hour rule) and test a backup restore.
- [ ] Fill in the "Deployment Decisions Still Needed" table.

---

## 13. Production Security Checklist

- [ ] HTTPS enforced
- [ ] Secrets stored outside source control; only `NEXT_PUBLIC_*` values in the browser
- [ ] Row-Level Security enabled and tested on all student-owned tables
- [ ] Admin/curator routes restricted and audited
- [ ] Input validation, XSS sanitization, and rate limits configured
- [ ] Job endpoints protected with `CRON_SECRET`
- [ ] Database backups enabled and restore tested
- [ ] Privacy notice and terms published
- [ ] Account deletion works and removes saved items, push subscriptions, and notifications
- [ ] Breach response plan written (notify NPC within 72 hours for qualifying breaches)
- [ ] Error monitoring configured
- [ ] Email delivery and unsubscribe tested
- [ ] Listing report and review workflow working
- [ ] Rollback procedure documented

## 14. Post-Deployment Smoke Tests

After each production release, verify:

1. Home page loads over HTTPS on a phone, logged out.
2. Listing list, "closing soon", search, and category filters work.
3. A listing detail page shows the deadline, source link, and badge (for a `.gov.ph` source).
4. A listing link pasted into Messenger shows a proper preview.
5. Share button works on a phone.
6. Google sign-in and the quick profile work.
7. Save/unsave works; reminders are scheduled for a saved test listing.
8. A test push notification arrives on a test device.
9. Report button creates a report visible in the admin panel.
10. Curators can import the CSV, publish, and expire listings.
11. Students cannot access admin pages or other students' saved items.
12. Account deletion works for a test account.

## 15. Monitoring and Operations

Monitor:
- Availability, error rate, page speed on mobile
- Daily job runs (expire, reminders): success/failure counts
- Email delivery, bounce, and unsubscribe rates
- Push delivery failures and expired subscriptions
- Listing freshness: expired, rolling/TBA not checked in 30+ days, open reports
- Product signals: views, official-link clicks, saves, shares, reminders opened, 7/30-day return

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
- [ ] Listings imported and reviewed (no `needs-check` rows published unconfirmed)
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
| Framework | Next.js (TypeScript) | TBD |
| Hosting | Vercel | TBD |
| Database + auth | Supabase (Google sign-in) | TBD |
| Scheduled jobs | Vercel Cron or Supabase scheduled functions | TBD |
| Email | Resend | TBD |
| Push | Web Push (VAPID) | TBD |
| Analytics | PostHog or Plausible | TBD |
| Error monitoring | — | TBD |
| Domain and DNS | — | TBD |
| Backup retention | — | TBD |
| Payment provider | **Not needed now** | — |
| AI provider (Phase 2) | An LLM API that doesn't train on API data (e.g., Claude) | TBD |
| File storage (Phase 2) | Supabase Storage, private bucket | TBD |
| Mobile app (Phase 3) | Capacitor + Firebase Cloud Messaging | TBD |
| Curator inbox (Phase 3) | Web Share Target + app share intent; Facebook/LinkedIn developer apps for connected pages | TBD |

Start with the smallest secure deployment that supports the MVP.
