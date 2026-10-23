# System Design 3/5 — Data Model

> Part of [system-design](../system-design.md) · ← [Previous](02-core-modules.md) · [Next](04-api-and-logic.md) →

## ✅ What to do with this file

- [ ] Turn the MVP tables into PostgreSQL migrations.
- [ ] Add Row-Level Security so students can only read/write their own rows.
- [ ] Implement the [CSV → `opportunities` mapping](#csv--opportunities-mapping) in the importer, and seed `categories` from `data/categories.csv`.
- [ ] Don't add columns for sensitive data (ID numbers, home address, income). Documents go only in the private storage bucket (Phase 2), never in table columns.

---

## 5. Data Model

All `id` columns are UUIDs. All tables have `created_at` / `updated_at` unless noted. Timestamps are stored in UTC.

### MVP tables

**`profiles`** (one per auth user)
- `user_id` (PK, FK to auth users), `display_name`, `role` (`student`/`curator`/`admin`)
- `school`, `course`, `year_level`, `interests` (array of category slugs)
- `email_reminders_enabled` (default true), `push_reminders_enabled` (default true)

Auth credentials are managed by Supabase Auth.

**`categories`**: `id`, `name`, `slug`, `sort_order`
- Seeded from [`data/categories.csv`](../../data/categories.csv), the single source of truth for category names. A category with no published listings is hidden from the filters.

**`opportunities`** (see the [CSV → table mapping](#csv--opportunities-mapping) below)
- `id`, `external_id` (the spreadsheet's `OPP-###`, unique, nullable for listings created in the admin panel), `slug`, `title`, `organization`, `category_id`
- `summary`, `eligibility`, `location`, `delivery_mode` (`online` / `in_person` / `hybrid`)
- `application_opens` (date, nullable), `application_opens_type` (`date` / `open` / `rolling` / `tba`)
- `deadline` (date, nullable), `deadline_type` (`date` / `rolling` / `tba`)
- `source_url`, `application_url` (nullable; defaults to `source_url`), `source_trust` (`official_gov` / `official_edu` / `other`)
- `confidence` (`high` / `medium` / `low`), `needs_check` (boolean), `notes` (internal)
- `status` (`draft`, `published`, `expired`, `archived`)
- `last_checked_at`, `created_by`, `reviewed_by`
- unique (`source_url`, `title`) to block duplicate imports

"Closing soon" is never stored; it is computed from `deadline` (see [Part 4 §7.2](04-api-and-logic.md#72-closing-soon-and-expiry)).

**`opportunity_reports`**: `id`, `opportunity_id`, `user_id` (nullable, so logged-out students can report), `reason` (`wrong_info` / `expired` / `scam` / `other`), `details`, `status` (`open` / `fixed` / `dismissed`)

**`saved_opportunities`**: `id`, `user_id`, `opportunity_id`, `created_at`; unique (`user_id`, `opportunity_id`)
- Phase 2 adds: `status` (`saved` / `applying` / `applied` / `result`), `result` (`accepted` / `not_accepted`, nullable), `notes`

**`push_subscriptions`**: `id`, `user_id`, `endpoint` (unique), `p256dh`, `auth`, `user_agent`

**`notifications`**: `id`, `user_id`, `opportunity_id`, `channel` (`email` / `push`), `type` (`deadline_7d` / `deadline_1d`), `scheduled_at`, `sent_at`, `delivery_status`, `deduplication_key` (unique)

**`audit_logs`**: `id`, `actor_id`, `action`, `target_type`, `target_id`, `metadata` (no secrets or personal data), `created_at`

**`analytics_events`** (optional if using an analytics tool): `event` (`view`, `official_click`, `save`, `share`, `reminder_open`), `opportunity_id`, `anonymous_id`, `created_at`

### CSV → `opportunities` mapping

[`data/opportunities.csv`](../../data/opportunities.csv) is a curator-friendly sheet, so its columns don't match the table one-to-one. The importer applies this mapping:

| CSV column | Table field | Rule |
|---|---|---|
| `id` | `external_id` | Kept as-is (`OPP-001`). Re-importing a row with a known `external_id` updates the draft instead of duplicating it |
| `status` | `status`, `needs_check` | `ready` → `draft`; `needs-check` → `draft` + `needs_check = true`; `closed` → row skipped. Nothing is imported as `published` |
| `title` | `title`, `slug` | `slug` = lowercase title with non-alphanumerics replaced by `-`; append `-2`, `-3`… if taken |
| `organization`, `summary`, `eligibility`, `location`, `notes` | same name | Trimmed; sanitized as plain text |
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
- `opportunities(status, deadline)`, `opportunities(category_id)`, full-text index on title/organization/summary
- all `user_id` foreign keys
- `notifications(scheduled_at)` where `sent_at is null`

### Phase 2 tables
- `ojt_checklist_templates` (`id`, `name`, `version`, `source_reference`, `is_active`)
- `ojt_checklist_template_items` (`id`, `template_id`, `label`, `description`, `sort_order`)
- `ojt_checklists` (`id`, `user_id`, `template_id`, `company_name`, `start_date`, `end_date`, `required_hours`)
- `ojt_checklist_items` (`id`, `checklist_id`, `label`, `status` (`not_started`/`in_progress`/`submitted`/`approved`), `due_at`, `completed_at`, `notes`)
- `documents` (`id`, `user_id`, `storage_path`, `file_name`, `mime_type`, `size_bytes`, `checklist_item_id` (nullable), `saved_opportunity_id` (nullable)). The file itself lives in the private storage bucket under `<user_id>/`
- `ai_requests` (`id`, `user_id`, `opportunity_id` (nullable), `feature` (`explain` / `eligibility_check` / `writing_help`), `tokens_used`, `created_at`). Used for daily limits and cost tracking; prompts and answers are **not** stored

### Phase 3 tables
- `inbox_items` (`id`, `source` (`share` / `submission` / `connected_page`), `url`, `note` (shared note or post text), `submitted_by` (nullable user), `submitter_email` (nullable, form only), `connected_page_id` (nullable), `status` (`new` / `converted` / `ignored` / `duplicate`), `opportunity_id` (nullable), `reviewed_by`); unique (`source`, `url`). No names, comments, or photos of other people
- `connected_pages` (`id`, `platform` (`facebook` / `linkedin`), `page_id`, `page_name`, `connected_by`, `access_token` (encrypted), `token_expires_at`, `is_active`); disconnecting deletes the token
- `push_subscriptions` gains `platform` (`web` / `android` / `ios`) and `fcm_token` (nullable) for the mobile app

### Not planned now
- Scholarship / Return of Service tables (deferred)
- Payments, subscriptions, organizations
