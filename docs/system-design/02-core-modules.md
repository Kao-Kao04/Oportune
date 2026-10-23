# System Design 2/5 — Core Modules

> Part of [system-design](../system-design.md) · ← [Previous](01-architecture-and-stack.md) · [Next](03-data-model.md) →

## ✅ What to do with this file

- [ ] Create one folder per module in `src/` (catalog, accounts, saved, notifications, admin).
- [ ] Build in this order: 4.1 → 4.5 → 4.2 → 4.3 → 4.4.
- [ ] Enforce authorization on the server for every protected action.
- [ ] Don't start the Phase 2 modules (4.6) until the MVP is live.

---

## 4. Core Modules

### 4.1 Opportunity Catalog (public)
- List page: sort by deadline (default), filter by category, search by keyword
- **"Closing soon"** view: open listings with a deadline in the next 7 days
- Detail page: title, organization, summary, eligibility, requirements, deadline, location, delivery mode, official link, source, last-checked date
- **Official-site badge** for `.gov.ph` / `.edu.ph` sources
- **No login required**
- Every page has Open Graph tags (title, deadline, image) so links preview nicely in Messenger/FB
- Listings past their deadline are hidden from lists and marked "Closed" on the detail page

### 4.2 Accounts and Profile
- Google sign-in
- Quick profile: school, course, year level, interests (categories)
- Account deletion (removes profile, saved items, push subscriptions, notifications)
- Roles: `student`, `curator`, `admin`

### 4.3 Saved Opportunities
- Save/unsave a listing (prompts sign-in the first time)
- "My saved" page sorted by deadline
- Phase 2 adds a status to each saved item (see 4.6)

### 4.4 Notifications
- Deadline reminders for saved listings: **7 days and 1 day before** by default
- Channels: **email** and **web push** (if the student allowed notifications)
- Student controls: turn each channel on/off
- Deduplication so a reminder is never sent twice
- Unsubscribe link in every email

### 4.5 Admin and Curation
- Create, edit, review, publish, expire, archive listings
- **Import `data/opportunities.csv`**: preview, validate, skip duplicates (same source URL), save as drafts
- Review queue for student reports
- Audit log of admin actions
- Required before publishing: title, organization, category, official/source URL, deadline (or "rolling"/"TBA"), last-checked date

### 4.6 Phase 2 modules (after the MVP)
- **Simple application tracker:** status on saved items: `saved` → `applying` → `applied` → `result` (`accepted` / `not_accepted`)
- **OJT requirements checklist:** admin-managed template (verified against CMO 104) copied to the student's own editable checklist; status and dates only, no files
- **"For you" filter:** listings matching profile course, year level, and interests

### Deferred
- DOST ROS tracker and penalty calculator
- AI-assisted admin entry, RSS feeds, organizer submissions
- Messenger/Telegram reminders, offline mode
