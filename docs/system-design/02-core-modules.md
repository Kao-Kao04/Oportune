# System Design 2/5 — Core Modules

> Part of [system-design](../system-design.md) · ← [Previous](01-architecture-and-stack.md) · [Next](03-data-model.md) →

## ✅ What to do with this file

- [ ] Create one folder per module in `src/` (catalog, accounts, saved, notifications, admin).
- [ ] Build in this order: 4.1 → 4.5 → 4.2 → 4.3 → 4.4.
- [ ] Enforce authorization on the server for every protected action.
- [ ] Don't start the Phase 2 modules (4.6) until the MVP is live, or Phase 3 (4.7) until Phase 2 is live.

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
- **OJT requirements checklist:** admin-managed template (verified against CMO 104) copied to the student's own editable checklist
- **"For you" filter:** listings matching profile course, year level, and interests
- **Documents:** upload files and attach them to OJT checklist items or saved listings
  - Private storage bucket; only the owner can read their files; downloads use links that expire in minutes
  - PDF, JPG, PNG only; 5 MB per file; 100 MB per student
  - Curators and admins can't open student files
  - Deleted with the account; the student can delete any file at any time
- **AI helper** (server-side only):
  - "Explain in Taglish": a plain-language summary of a listing
  - "Pasok ba ako?": compares the listing's eligibility with the student's profile and answers *possible match* / *check this requirement*, never "you qualify"
  - Writing help: drafts for essays, cover letters, and resumes, which the student edits
  - Daily limit per student; every answer labeled "AI-generated — check the official link"
  - Student documents are sent to the AI only when the student explicitly picks one

### 4.7 Phase 3 modules
- **Mobile app:** Capacitor wrapper around the web app for Google Play (then the App Store), with native push through Firebase Cloud Messaging alongside web push
- **Curator inbox:** one queue of suggested opportunities from three sources:
  - **"Share to Oportune":** the installed app appears in the phone's share menu (Web Share Target for the installed web app on Android; share intent / share extension in the mobile app). The student shares a link and optionally adds a note
  - **"Submit an opportunity" form:** for schools, orgs, LGUs, and companies: title, organization, official link, deadline, submitter email
  - **Connected pages:** a page admin signs in with Facebook or LinkedIn and grants read access to their own page; a daily job pulls that page's new posts
  - Sign-in required to share or submit; rate-limited
  - Stored: link, optional note or post text, submitter, dates. Not stored: names, comments, or photos of other people
  - A curator checks the official source, then turns the item into a draft listing in our own words, or ignores it; nothing is auto-published
  - The student who shared it gets a notice when it's published

### Deferred
- DOST ROS tracker and penalty calculator
- AI-assisted admin entry, RSS feeds, Facebook Page Public Content Access
- Messenger/Telegram reminders, offline mode
- Payments
