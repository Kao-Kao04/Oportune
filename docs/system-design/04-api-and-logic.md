# System Design 4/5 — API Surface & Core Logic

> Part of [system-design](../system-design.md) · ← [Previous](03-data-model.md) · [Next](05-security-ops-testing-phases.md) →

## ✅ What to do with this file

- [ ] Build public pages first, then accounts/saved/reminders, then admin.
- [ ] Add input validation, authorization, and rate limiting to every endpoint.
- [ ] Implement the badge, closing-soon, expiry, and reminder logic exactly as described, with unit tests.
- [ ] Test link previews by pasting a listing URL into Messenger.

---

## 6. API Surface

Illustrative paths (these may become Next.js pages, route handlers, or server actions).

### Public (no login)
- `GET /opportunities?category=&q=&sort=deadline`
- `GET /opportunities/closing-soon`
- `GET /opportunities/{slug}`
- `GET /categories`
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
- Phase 3: `GET/POST/PATCH /admin/source-pages`, `GET /admin/inbox`, `POST /admin/inbox/{id}/convert` (creates a draft listing), `POST /admin/inbox/{id}/ignore`
- Phase 3 job: `POST /jobs/collect-social` (protected by `CRON_SECRET`)

All endpoints: input validation, authorization, rate limiting where needed, audit logs for admin actions.

## 7. Core Logic

### 7.1 Official-site badge
- Parse the URL with a real URL parser and read the **hostname** (don't regex the whole URL).
- `official_gov` if the hostname is `gov.ph` or ends with `.gov.ph`; `official_edu` if it is `edu.ph` or ends with `.edu.ph`.
- Reject lookalikes such as `gov.ph.example.com` or `example.com/gov.ph`. Require `https`.
- The badge means "official website," **not** "we guarantee this opportunity."

### 7.2 Closing soon and expiry
- **Closing soon:** `status = published` and `deadline` between today and today + 7 days (Philippine time, UTC+8).
- **Auto-expire job (daily):** set `status = expired` when `deadline < today` (Philippine time). Rolling/TBA listings never auto-expire. Instead, flag them for re-checking when `last_checked_at` is older than 30 days.
- Sort order: dated deadlines first (soonest first), then rolling, then TBA.

### 7.3 Reminders
- When a student saves a listing with a date deadline, schedule `deadline_7d` and `deadline_1d` notifications for each enabled channel (skip any that are already in the past).
- `deduplication_key` = `user_id:opportunity_id:type:channel`, so a job can safely run twice.
- Before sending, re-check that the listing is still saved and still published, and that the deadline hasn't changed. If the deadline changed, reschedule.
- Send at a sensible local time (e.g., 8:00 AM Philippine time).
- Remove push subscriptions that the push service reports as expired.

### 7.4 Sharing
- Use the browser's share sheet (Web Share API) on phones; fall back to "Copy link" and Messenger/FB share links.
- Open Graph tags: title, organization, deadline in the description, and a default image so previews look good in group chats.

### 7.5 Spreadsheet import
- Apply the [CSV → `opportunities` mapping](03-data-model.md#csv--opportunities-mapping) (dates vs. `rolling`/`open`/`TBA`, delivery mode, category lookup, slug).
- Recompute `source_trust` from the URL (don't trust the CSV value).
- Match existing rows by `external_id` first, then by (`source_url`, `title`); update unpublished drafts, skip published ones. Skip rows with `status = closed`.
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

### 7.7 Document uploads (Phase 2)
- The server checks type (by file content, not just the extension) and size, then issues a one-time signed upload URL into `<user_id>/` in the private bucket.
- Storage policies allow each student to read and delete only their own folder; there is no admin read access.
- Downloads use signed links that expire after a few minutes.
- Account deletion removes all files and `documents` rows; orphaned files are cleaned up by a weekly job.
- Show a notice before the first upload: what's stored, who can see it (only you), and how to delete it.

### 7.8 Social media sourcing (Phase 3)
- Only pages on the `source_pages` allow-list, added by a curator; public organization pages only.
- Use the platform's official API and approvals where available; respect rate limits and the platform's terms.
- Store only the post link, post text, and dates in `inbox_items`; drop names, comments, and images of people.
- Deduplicate by `post_url`; a curator converts a post into a draft listing written in our own words, with the official source link where one exists.
- If access is blocked or revoked, the job stops and alerts; the rest of the app is unaffected.

### 7.9 Mobile app (Phase 3)
- Capacitor app that loads the production web app; the same accounts and data.
- Native push via Firebase Cloud Messaging, stored in `push_subscriptions` with `platform`; the reminder job sends to web and native subscriptions.
- Google sign-in uses the system browser (not an embedded web view).
