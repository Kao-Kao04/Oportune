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

### Admin / curator
- `POST /admin/opportunities`, `PATCH /admin/opportunities/{id}`
- `POST /admin/opportunities/{id}/publish`, `POST /admin/opportunities/{id}/expire`
- `POST /admin/import` (CSV upload → preview → confirm)
- `GET /admin/reports`, `PATCH /admin/reports/{id}`

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
