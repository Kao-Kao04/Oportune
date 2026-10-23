# System Design 3/5 — Data Model

> Part of [system-design](../system-design.md) · ← [Previous](02-core-modules.md) · [Next](04-api-and-logic.md) →

## ✅ What to do with this file

- [ ] Turn the MVP tables into PostgreSQL migrations.
- [ ] Add Row-Level Security so students can only read/write their own rows; serve listings to the public only through the `public_opportunities` view.
- [ ] Keep roles in `user_roles`, never in a table students can edit.
- [ ] Implement the [CSV → `opportunities` mapping](#csv--opportunities-mapping) in the importer, and seed `categories` from `data/categories.csv`.
- [ ] Don't add columns for sensitive data (ID numbers, home address, income). Documents go only in the private storage bucket (Phase 2), never in table columns.

---

## 5. Data Model

All `id` columns are UUIDs. All tables have `created_at` / `updated_at` unless noted. Timestamps are stored in UTC.

### MVP tables

**`profiles`** (one per auth user)
- `user_id` (PK, FK to auth users, `on delete cascade`), `display_name`
- `school` (picked from a list, with "Other" + free text), `course_group` (a fixed list based on CHED discipline groups, e.g. `it_cs`, `engineering`, `health`, `education`, `business`, `arts_humanities`, `sciences`, `agriculture`, `other`), `course` (free text, display only), `year_level` (`1` / `2` / `3` / `4` / `5` / `graduating`), `interests` (array of category slugs)
- `is_18_or_over` (boolean, asked at sign-up; see [Part 5 §8](05-security-ops-testing-phases.md#8-security-and-privacy))
- `email_reminders_enabled` (default true), `push_reminders_enabled` (default true), `email_unsubscribe_token` (random, unique; lets the unsubscribe link work without signing in)

Auth credentials are managed by Supabase Auth. **The role is not in `profiles`**, because students can edit their own profile row.

**`user_roles`**: `user_id` (PK, FK to auth users, `on delete cascade`), `role` (`curator` / `admin`), `granted_by`, `created_at`
- No row = student. RLS: nobody can insert, update, or delete through the public API; only admins through a server action using the service role, and every change is audit-logged.
- Role checks on the server and in RLS policies read this table (e.g., a `is_curator()` SQL function).

**`categories`**: `id`, `name`, `slug`, `sort_order`
- Seeded from [`data/categories.csv`](../../data/categories.csv), the single source of truth for category names. A category with no published listings is hidden from the filters.

**`opportunities`** (see the [CSV → table mapping](#csv--opportunities-mapping) below)
- `id`, `external_id` (the spreadsheet's `OPP-###`, unique, nullable for listings created in the admin panel), `slug` (unique, **never changes** once published), `title`, `organization`, `category_id`
- `summary`, `eligibility`, `requirements` (nullable; documents or steps needed to apply), `location`, `delivery_mode` (`online` / `in_person` / `hybrid`)
- `application_opens` (date, nullable), `application_opens_type` (`date` / `open` / `rolling` / `tba`)
- `deadline` (date, nullable), `deadline_type` (`date` / `rolling` / `tba`)
- `source_url`, `application_url` (nullable; defaults to `source_url`), `source_trust` (`official_gov` / `official_edu` / `other`)
- `confidence` (`high` / `medium` / `low`), `needs_check` (boolean; set by the import), `recheck_due` (boolean; set by the daily job for stale rolling/TBA listings), `notes` (internal)
- `status` (`draft`, `published`, `expired`, `archived`)
- `last_checked_at`, `created_by`, `reviewed_by` (FKs to auth users, `on delete set null`)
- `search_vector` (generated `tsvector`, see Indexes)
- unique (`source_url`, `title`) to block duplicate imports

"Closing soon" is never stored; it is computed from `deadline` (see [Part 4 §7.2](04-api-and-logic.md#72-closing-soon-and-expiry)).

**`opportunity_slug_redirects`**: `old_slug` (PK), `opportunity_id`. If a curator ever has to change a slug, the old one redirects so shared links keep working.

**Public access goes through a view, not the table.** The anon key is public, and RLS filters rows, not columns, so a public `select` on `opportunities` would expose `notes`, `confidence`, `needs_check`, `created_by`, and `reviewed_by`.
- `opportunities` has **no** policy for `anon` or `authenticated`; only curators/admins (via `user_roles`) can read or write it.
- `public_opportunities` is a view with only the public columns (no `notes`, `confidence`, `needs_check`, `recheck_due`, `external_id`, `created_by`, `reviewed_by`) and only `status in ('published', 'expired')`. `anon` and `authenticated` get `select` on the view only.
- Expired listings stay in the view so old shared links show "Closed"; `draft` and `archived` never appear.

**`opportunity_reports`**: `id`, `opportunity_id`, `user_id` (nullable, so logged-out students can report; `on delete set null`), `reason` (`wrong_info` / `expired` / `scam` / `other`), `details`, `status` (`open` / `fixed` / `dismissed`)
- Inserted only by the server (after the rate limit and captcha check), never directly with the anon key. Only curators can read reports.

**`saved_opportunities`**: `id`, `user_id` (`on delete cascade`), `opportunity_id`, `created_at`; unique (`user_id`, `opportunity_id`)
- Phase 2 adds: `status` (`saved` / `applying` / `applied` / `result`), `result` (`accepted` / `not_accepted`, nullable), `notes`

**`push_subscriptions`**: `id`, `user_id` (`on delete cascade`), `endpoint` (unique), `p256dh`, `auth`, `user_agent`

**`notifications`** (a log of reminders actually sent; rows are created by the reminder job, not when a student saves): `id`, `user_id` (`on delete cascade`), `opportunity_id`, `channel` (`email` / `push`), `type` (`deadline_7d` / `deadline_1d`), `deadline_on` (the deadline date the reminder was for), `sent_at`, `delivery_status` (`sent` / `failed` / `skipped`), `deduplication_key` (unique: `user_id:opportunity_id:type:channel:deadline_on`)

**`audit_logs`**: `id`, `actor_id` (`on delete set null`), `action`, `target_type`, `target_id`, `metadata` (no secrets or personal data), `created_at`

**`rate_limits`** (if not using a Redis service): `key` (e.g., `report:<ip-hash>`), `window_start`, `count`; primary key (`key`, `window_start`). Old windows are deleted daily.

**Account deletion:** every FK to a user is either `on delete cascade` (the student's own data) or `on delete set null` (records that must survive, like listings a curator created, audit logs, and reports). A test deletes a user who has data in every table.

**`analytics_events`** (optional if using an analytics tool): `event` (`view`, `official_click`, `save`, `share`, `reminder_open`), `opportunity_id`, `anonymous_id`, `created_at`

### CSV → `opportunities` mapping

[`data/opportunities.csv`](../../data/opportunities.csv) is a curator-friendly sheet, so its columns don't match the table one-to-one. The importer applies this mapping:

| CSV column | Table field | Rule |
|---|---|---|
| `id` | `external_id` | Kept as-is (`OPP-001`). Re-importing a row with a known `external_id` updates the draft instead of duplicating it |
| `status` | `status`, `needs_check` | `ready` → `draft`; `needs-check` → `draft` + `needs_check = true`; `closed` → row skipped. Nothing is imported as `published` |
| `title` | `title`, `slug` | `slug` is made once, on first import: remove accents (`ñ` → `n`, `ü` → `u`), lowercase, replace non-alphanumerics with `-`, cut to 80 characters, append `-2`, `-3`… if taken. Re-imports never change it |
| `organization`, `summary`, `eligibility`, `location`, `notes` | same name | Trimmed; sanitized as plain text |
| `requirements` (optional column) | `requirements` | If the column is missing or empty, left null; curators fill it in the admin panel |
| `category` | `category_id` | Exact match on `categories.name`; unknown category → row rejected in the preview |
| `delivery_mode` | `delivery_mode` | `Online` → `online`, `In-person` → `in_person`, `Hybrid` → `hybrid`; anything else → rejected |
| `application_opens` | `application_opens`, `application_opens_type` | `YYYY-MM-DD` → date + `date`; `open` / `rolling` / `TBA` (case-insensitive) → null + that type |
| `deadline` | `deadline`, `deadline_type` | `YYYY-MM-DD` → date + `date`; `rolling` / `TBA` → null + that type |
| `source_url` | `source_url`, `application_url` | Must be `https`; `application_url` defaults to `source_url` |
| `source_trust` | `source_trust` | **Ignored**; recomputed from `source_url` ([Part 4 §7.1](04-api-and-logic.md#71-official-site-badge)) |
| `confidence` | `confidence` | `high` / `medium` / `low` |
| `last_checked` | `last_checked_at` | Date, stored as 00:00 Philippine time converted to UTC |

Allowed CSV values: `status` ∈ {`ready`, `needs-check`, `closed`}; `delivery_mode` ∈ {`Online`, `In-person`, `Hybrid`} (put details such as the country in `location`).

### Indexes
- `opportunities(status, deadline)`, `opportunities(category_id)`, unique `opportunities(slug)`
- Search: `search_vector` generated with the **`simple`** text-search config (the `english` config stems words wrongly for Tagalog/Taglish) and a GIN index on it, plus a `pg_trgm` GIN index on `title` and `organization` for typo-tolerant and partial matches ("schlarship", "DOST")
- all `user_id` foreign keys
- `saved_opportunities(opportunity_id)` for the reminder job
- `notifications(deduplication_key)` (unique)

### Phase 2 tables
- `ojt_checklist_templates` (`id`, `name`, `version`, `source_reference`, `is_active`)
- `ojt_checklist_template_items` (`id`, `template_id`, `label`, `description`, `sort_order`)
- `ojt_checklists` (`id`, `user_id`, `template_id`, `company_name`, `start_date`, `end_date`, `required_hours`)
- `ojt_checklist_items` (`id`, `checklist_id`, `label`, `status` (`not_started`/`in_progress`/`submitted`/`approved`), `due_at`, `completed_at`, `notes`)
- `documents` (`id`, `user_id`, `storage_path`, `file_name`, `mime_type`, `size_bytes`, `checklist_item_id` (nullable), `saved_opportunity_id` (nullable)). The file itself lives in the private storage bucket under `<user_id>/`
- `profiles` gains `ai_document_consent_at` (nullable timestamp; null = no consent or withdrawn)
- `ai_requests` (`id`, `user_id`, `opportunity_id` (nullable), `feature` (`explain` / `eligibility_check` / `writing_help`), `tokens_used`, `created_at`). Used for daily limits and cost tracking; prompts and answers are **not** stored

### Phase 3 tables
- `inbox_items` (`id`, `source` (`share` / `submission` / `connected_page`), `url`, `note` (shared note or post text), `submitted_by` (nullable user), `submitter_email` (nullable, form only), `connected_page_id` (nullable), `status` (`new` / `converted` / `ignored` / `duplicate`), `opportunity_id` (nullable), `reviewed_by`); unique (`source`, `url`). No names, comments, or photos of other people
- `connected_pages` (`id`, `platform` (`facebook` / `linkedin`), `page_id`, `page_name`, `connected_by`, `access_token` (encrypted), `token_expires_at`, `is_active`); disconnecting deletes the token
- `push_subscriptions` gains `platform` (`web` / `android` / `ios`) and `fcm_token` (nullable) for the mobile app

### Not planned now
- Scholarship / Return of Service tables (deferred)
- Payments, subscriptions, organizations
