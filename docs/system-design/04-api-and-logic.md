# System Design 4/5 — API Surface & Core Logic

> Part of [system-design](../system-design.md) · ← [Previous](03-data-model.md) · [Next](05-security-ops-testing-phases.md) →

## ✅ What to do with this file

- [ ] Build in the module order from [Part 2](02-core-modules.md): public pages, then admin + import (so there is real data), then accounts, saved, and reminders.
- [ ] Add input validation, authorization, and rate limiting to every endpoint.
- [ ] Implement the badge, closing-soon, expiry, and reminder logic exactly as described, with unit tests.
- [ ] Test link previews by pasting a listing URL into Messenger.

---

## 6. API Surface

Illustrative paths (these may become Next.js pages, route handlers, or server actions).

### Public (no login)
- `GET /opportunities?category=&q=&sort=deadline`
- `GET /opportunities/closing-soon`
- `GET /opportunities/{slug}` (an old slug in `opportunity_slug_redirects` returns a permanent redirect)
- `GET /categories`
- `GET /unsubscribe?token=` (turns off email reminders without signing in)
- `POST /opportunities/{id}/report` (rate-limited)
- `POST /events`: analytics events such as official-link clicks and shares (rate-limited)

### Student (logged in)
- `GET /me`, `PATCH /me/profile`, `DELETE /me`
- `GET /me/saved`, `POST /me/saved`, `DELETE /me/saved/{opportunityId}`
- `PATCH /me/notification-settings`
- `POST /me/push-subscriptions`, `DELETE /me/push-subscriptions/{id}`
- Phase 2: `PATCH /me/saved/{id}` (tracker status), `/me/ojt-checklists`
- Phase 2: `POST /me/documents` (get a one-time upload URL), `GET /me/documents`, `GET /me/documents/{id}/download` (short-lived link), `DELETE /me/documents/{id}`
- Phase 2: `POST /ai/explain/{opportunityId}`, `POST /ai/eligibility-check/{opportunityId}`, `POST /ai/writing-help` (rate-limited per student)

### Admin / curator
- `POST /admin/opportunities`, `PATCH /admin/opportunities/{id}`
- `POST /admin/opportunities/{id}/publish`, `POST /admin/opportunities/{id}/expire`
- `POST /admin/import` (CSV upload → preview → confirm)
- `GET /admin/reports`, `PATCH /admin/reports/{id}`
- `GET /admin/recheck` (listings with `needs_check` or `recheck_due`), `POST /admin/opportunities/{id}/mark-checked`
- Admin only: `GET /admin/roles`, `POST /admin/roles` (grant curator/admin), `DELETE /admin/roles/{userId}`
- Phase 3: `GET /admin/inbox`, `POST /admin/inbox/{id}/convert` (creates a draft listing), `POST /admin/inbox/{id}/ignore`
- Phase 3 (logged in, rate-limited): `POST /share` (Web Share Target / app share), `POST /submit-opportunity`, `POST /connected-pages` (OAuth with Facebook/LinkedIn), `DELETE /connected-pages/{id}`
- Phase 3 job: `POST /jobs/sync-connected-pages` (protected by `CRON_SECRET`)

All endpoints: input validation, authorization, rate limiting where needed, audit logs for admin actions.

**Rate limiting:** serverless functions don't share memory, so counters live in a shared store: Upstash Redis (free tier) or the `rate_limits` table. Suggested limits: reports 5/hour per IP, analytics events 120/hour per IP, sign-in attempts per Supabase Auth settings, AI 20/day per student, shares/submissions 20/day per student. Logged-out forms (reports) also need a captcha such as Cloudflare Turnstile. IPs are stored only as a salted hash.

## 7. Core Logic

### 7.1 Official-site badge
- Parse the URL with a real URL parser and read the **hostname** (don't regex the whole URL).
- `official_gov` if the hostname is `gov.ph` or ends with `.gov.ph`; `official_edu` if it is `edu.ph` or ends with `.edu.ph`.
- Reject lookalikes such as `gov.ph.example.com` or `example.com/gov.ph`. Require `https`.
- The badge means "official website," **not** "we guarantee this opportunity."

### 7.2 Closing soon and expiry
- **Closing soon:** `status = published` and `deadline` between today and today + 7 days (Philippine time, UTC+8).
- **Auto-expire job (daily):** set `status = expired` when `deadline < today` (Philippine time). Rolling/TBA listings never auto-expire. Instead, set `recheck_due = true` when `last_checked_at` is older than 30 days; saving the listing with a new `last_checked_at` clears it. The admin panel shows a "Re-check due" queue.
- If a curator extends the deadline of an expired listing, it goes back to `published` (audit-logged).
- Sort order: dated deadlines first (soonest first), then rolling, then TBA.

### 7.3 Reminders
Reminders are **not** scheduled when a student saves. Instead, the daily job (8:00 AM Philippine time) works out what is due **today** from the current data, so TBA deadlines that later get a date, extensions, and earlier deadlines are all handled automatically.

1. Compute `today` in Philippine time.
2. Find every saved listing where `status = published`, `deadline_type = date`, and `deadline = today + 7` (type `deadline_7d`) or `deadline = today + 1` (type `deadline_1d`).
3. For each student and each enabled channel (email if `email_reminders_enabled`; push if `push_reminders_enabled` and they have a subscription), build `deduplication_key` = `user_id:opportunity_id:type:channel:deadline`.
4. Insert the `notifications` row first with `on conflict (deduplication_key) do nothing`; send only if the insert succeeded. Running the job twice never sends twice, and a changed deadline gets new reminders because the key changes.
5. Send in batches (e.g., 50 at a time) and continue in the next invocation if time runs out, so the job never hits the function time limit. Respect the email provider's daily limit; push goes first, email after.
6. Mark each row `sent` or `failed`; retry `failed` once on the next run.
7. **Catch-up:** the job records each run in `job_runs`. If any date since the last successful run was missed (e.g., cron didn't fire), it also processes those dates, still skipping reminders whose deadline has already passed. The dedup key keeps this safe.

Other rules:
- If a student saves a listing less than 7 days before its deadline, they get only the 1-day reminder; saving the day before or on the deadline sends none (the "Closing soon" label already shows it).
- Remove push subscriptions that the push service reports as expired (HTTP 404/410).
- Every email has a one-click unsubscribe link using `email_unsubscribe_token`, and a `List-Unsubscribe` header.

### 7.4 Sharing
- Use the browser's share sheet (Web Share API) on phones; fall back to "Copy link" and Messenger/FB share links.
- Open Graph tags: title, organization, deadline in the description, and a default image so previews look good in group chats.

### 7.5 Spreadsheet import
- Apply the [CSV → `opportunities` mapping](03-data-model.md#csv--opportunities-mapping) (dates vs. `rolling`/`open`/`TBA`, delivery mode, category lookup, slug).
- Recompute `source_trust` from the URL (don't trust the CSV value).
- Match existing rows by `external_id` first, then by (`source_url`, `title`). Skip rows with `status = closed`.
- New rows → created as drafts. Matching drafts → updated.
- Matching **published** rows → never changed silently. The preview marks them "Changed" and shows a field-by-field diff (e.g., deadline 2026-10-25 → 2026-11-08); the curator ticks which changes to apply. Applied changes update `last_checked_at` and are audit-logged.
- The preview lists rejected rows with the reason (unknown category, bad date, non-`https` URL) before anything is saved.
- Import as `draft` so a curator reviews them before publishing; `needs-check` rows keep `needs_check = true` and can't be published until a curator clears it.

### 7.6 AI helper (Phase 2)
- Runs only on the server; the API key never reaches the browser or the mobile app.
- The prompt contains only the **published listing's fields** (plus the student's school, course, and year level for "Pasok ba ako?"). The AI is told to answer only from that text and to say "not stated — check the official link" otherwise.
- It must never produce a deadline, amount, or requirement that isn't in the listing; a test suite checks this with sample listings.
- Eligibility answers are *possible match* / *check this requirement*, never a yes/no guarantee.
- Every answer shows "AI-generated — check the official link" and a "Report this answer" button.
- Limits: e.g., 20 requests per student per day; a monthly spending cap at the provider.
- Don't store prompts or answers; log only feature, token count, and time in `ai_requests`.
- **Consent before sending a document:** the first time a student attaches one of their documents to writing help, show a separate consent screen: which file, that it goes to an outside AI provider, that the provider doesn't keep it for training, and that they can say no. Record consent per student (with date) and allow withdrawing it in settings. Never send documents for "Explain" or "Pasok ba ako?".
- Choose a provider whose API terms say inputs aren't used for training, and list it in the privacy notice.

### 7.7 Document uploads (Phase 2)
- **Launch gate:** don't turn uploads on until the NPC registration question is answered (and registration done if required), the privacy notice covers documents, and a DPO/privacy contact is named. Medical certificates, IDs, and similar files are *sensitive personal information* under the Data Privacy Act.
- The server checks type (by file content, not just the extension) and size, then issues a one-time signed upload URL into `<user_id>/` in the private bucket.
- Storage policies allow each student to read and delete only their own folder; there is no admin read access.
- Downloads use signed links that expire after a few minutes.
- Account deletion removes all files and `documents` rows; orphaned files are cleaned up by a weekly job.
- Show a notice before the first upload: what's stored, who can see it (only you), and how to delete it.

### 7.8 Curator inbox (Phase 3)
- **Share to Oportune:** the web app manifest declares a `share_target` that posts `title`, `text`, and `url` to `/share`; the mobile app registers an Android share intent and an iOS share extension that call the same endpoint. Web Share Target works only in the installed app on Android, not in iPhone Safari.
- If the student isn't signed in, keep the shared link, sign them in, then save it.
- Normalize the URL (strip tracking parameters such as `fbclid` and `utm_*`), then mark it `duplicate` if it matches an existing inbox item or a listing's `source_url`.
- Don't fetch or store the contents of Facebook/LinkedIn posts; the curator opens the link themselves. Store only the link and the student's own note.
- **Connected pages:** only the page's own admin can connect it, through the platform's official OAuth flow and permissions; tokens are encrypted, refreshed before expiry, and deleted on disconnect. The daily job reads new posts from connected pages only.
- A curator converts an item into a draft listing in our own words, with the official source link (not the FB post) wherever one exists.

### 7.9 Mobile app (Phase 3)
- Capacitor app that loads the production web app; the same accounts and data.
- **Google Play first.** Apple often rejects apps that are only a website in a wrapper (App Store Review Guideline 4.2, minimum functionality). Before submitting to Apple, the app must have real native features: native push, the share extension ("Share to Oportune"), saved listings available offline, and native navigation. Budget extra time for iOS review.
- Native push via Firebase Cloud Messaging, stored in `push_subscriptions` with `platform`; the reminder job sends to web and native subscriptions.
- Google sign-in uses the system browser (not an embedded web view).
