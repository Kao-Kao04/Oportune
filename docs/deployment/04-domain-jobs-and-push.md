# Deployment 4/5 — Domain/HTTPS, Scheduled Jobs, Push & Installable App

> Part of [deployment](../deployment.md) · ← [Previous](03-database-ci-and-pipeline.md) · [Next](05-launch-security-and-operations.md) →

## ✅ What to do with this file

- [ ] Configure domain, HTTPS, Google sign-in redirect URLs, and SPF/DKIM/DMARC using your providers' exact values.
- [ ] Set up the daily jobs (auto-expire, reminders) and protect them with `CRON_SECRET`.
- [ ] Test push notifications on Android Chrome and on an iPhone with the app added to the home screen.
- [ ] Test link previews by pasting a listing URL into Messenger and FB.

---

## 9. Domain and HTTPS

- Configure the domain at the hosting provider using the exact DNS records it supplies.
- Enable HTTPS with automatic certificate renewal (required for service workers and push).
- Set the canonical app URL and allowed origins per environment.
- Add the Google OAuth redirect URLs for each environment in Google Cloud and Supabase.
- Configure SPF, DKIM, and DMARC for the email domain so reminders don't land in spam.

Don't guess DNS records or callback URLs.

## 10. Scheduled Jobs

| Job | When | What it does |
|---|---|---|
| Auto-expire | Daily, just after midnight PH time | Marks listings past their deadline as `expired`; flags rolling/TBA listings not checked in 30+ days |
| Send reminders | Daily, ~8:00 AM PH time | Sends due 7-day and 1-day reminders by email/push |

Rules:
- Store timestamps in UTC; calculate "today" in Philippine time (UTC+8).
- Jobs must be idempotent (unique deduplication key per reminder).
- Protect job endpoints with `CRON_SECRET`.
- Log each run (count sent, count failed); alert someone if a job fails twice in a row.
- Respect each student's reminder settings and email unsubscribes.

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
