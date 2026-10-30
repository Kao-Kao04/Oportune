# Deployment 4/5 — Domain/HTTPS, Scheduled Jobs, Push & Installable App

> Part of [deployment](../deployment.md) · ← [Previous](03-database-ci-and-pipeline.md) · [Next](05-launch-security-and-operations.md) →

## ✅ What to do with this file

- [ ] For the sprint, use the free `*.vercel.app` address; add a custom domain later. Configure Supabase redirect URLs (and Google's, if switched on) and SPF/DKIM/DMARC using your providers' exact values.
- [ ] Set `CRON_SECRET` so the daily jobs in `vercel.json` (auto-expire, reminders, cleanup) can run.
- [ ] Test push notifications on Android Chrome and on an iPhone with the app added to the home screen.
- [ ] Test link previews by pasting a listing URL into Messenger and FB.

---

## 9. Domain and HTTPS

- **Sprint:** the free `*.vercel.app` address is enough (HTTPS included); skip the domain steps until after the sprint.
- Configure the domain at the hosting provider using the exact DNS records it supplies.
- Enable HTTPS with automatic certificate renewal (required for service workers and push).
- Set the canonical app URL (`APP_BASE_URL`) per environment.
- If you switch Google sign-in on: add the Google OAuth redirect URLs for each environment in Google Cloud and Supabase. The Google button stays hidden until the provider is on.
- In Supabase → Authentication → URL Configuration, set the Site URL to the app URL and add `<app URL>/**` to the redirect allow-list for each environment.
- Change the **Magic Link** email template link to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/admin`, so sign-in links also work when opened in another browser or device.
- Supabase's built-in email sender is for testing only (low hourly limit). Before launch, set custom SMTP (the same provider as reminders).
- Configure SPF, DKIM, and DMARC for the email domain so reminders don't land in spam.

Don't guess DNS records or callback URLs.

## 10. Scheduled Jobs

| Job | When | What it does |
|---|---|---|
| Auto-expire (`/api/jobs/auto-expire`) | Daily, 00:05 PH time (`5 16 * * *` UTC) | Marks listings past their deadline as `expired`; sets `recheck_due` on rolling/TBA listings not checked in 30+ days |
| Send reminders (`/api/jobs/send-reminders`) | Daily, 8:00 AM PH time (`0 0 * * *` UTC) | Finds saved listings due in 7 or 1 days and sends reminders by push, then email ([System Design §7.3](../system-design/04-api-and-logic.md#73-reminders)) |
| Cleanup (`/api/jobs/cleanup`) | Daily, 00:30 PH time (`30 16 * * *` UTC) | Deletes old `rate_limits` windows, `job_runs` older than 180 days, and `analytics_events` older than 13 months |

Rules:
- Store timestamps in UTC; calculate "today" in Philippine time (UTC+8). Cron schedules are in UTC: midnight PH = 16:00 UTC, 8:00 AM PH = 00:00 UTC.
- Jobs must be idempotent (unique deduplication key per reminder, including the deadline date).
- The reminder job stops after 45 seconds (functions allow 60) and the next run resumes, so a big day never hits the time limit.
- Protect job endpoints with `CRON_SECRET` (Vercel Cron sends it as `Authorization: Bearer <CRON_SECRET>`). Schedules live in `vercel.json`.
- Run a job by hand: `curl -H "Authorization: Bearer $CRON_SECRET" <app URL>/api/jobs/send-reminders`.
- Each run is logged in `job_runs` (count sent, count failed). Two failures in a row write a `[jobs] ... failed twice in a row` error to the Vercel logs; set up an alert on it (no error-tracking service is wired yet).
- Respect each student's reminder settings and email unsubscribes.

### Free-tier limits to plan around
Check current limits before launch; they change.
- **Vercel Hobby:** for personal, non-commercial projects (fine while the app has no ads; move to Pro before any ad goes live, [final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)). Cron jobs on Hobby run once a day and may fire anytime within the scheduled hour; functions have a time limit, hence batching.
- **Supabase Free:** projects are paused after a period of inactivity, and database/storage sizes are capped. Daily jobs keep it active; upgrade before launch if pausing is still possible.
- **Email provider free tier:** has a daily and monthly sending cap. Estimate reminders per day (saves × 2 reminders) and upgrade before you reach it; push reminders don't count against it.

## 11. Push Notifications and Installable App

- Web app manifest (name, icons, theme color) + service worker.
- Ask for notification permission **only after** a student saves something, not on first visit.
- Store push subscriptions per device; delete them when the push service says they've expired, and on account deletion.
- iPhone: web push works only after the student adds the app to the home screen. Show a short hint.
- Keep pages light: compress images, avoid heavy libraries, server-render listing pages.
- Test on a low-end Android phone with a throttled connection.

## 12. Link Previews

- Every listing page has Open Graph and Twitter card tags: title, organization, deadline, default image.
- Check previews with Facebook's Sharing Debugger after deploying.
- Closed/expired listings still render (with a "Closed" label) so old shared links don't break.
