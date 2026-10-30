# System Design 2/5 — Core Modules

> Part of [system-design](../system-design.md) · ← [Previous](01-architecture-and-stack.md) · [Next](03-data-model.md) →

## ✅ What to do with this file

- [ ] Use this page as the map of what's built: 4.1–4.5 are in the code (pages in `src/app/`, logic in `src/lib/`); 4.6 says which Phase 2 parts exist.
- [ ] Enforce authorization on the server for every protected action.
- [ ] Don't extend the Phase 2 work built on 2026-10-25, and don't start anything marked *planned* (rest of 4.6, 4.7), until the 30-day sprint passes ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).

---

## 4. Core Modules

### 4.1 Opportunity Catalog (public)
- Browse is the home page (`/`): sort by deadline (default), filter by category, search by keyword. Filters live in the URL (`?view=&category=&q=&region=&course=&year=`)
- **"Closing soon"** view (`?view=closing-soon`): open listings with a deadline in the next 7 days
- **Audience filters** (built 2026-10-25): region, course group, year level. A listing with none set is open to all
- Detail page: title, organization, summary, eligibility, requirements, deadline, location, delivery mode, official link, source, last-checked date, report form
- **Add to calendar** (built 2026-10-25): `.ics` download (`/opportunities/{slug}/calendar`) and a Google Calendar link, for dated listings
- **Official-site badge** only for `.gov.ph` / `.edu.ph` sources. Every listing shows "Last checked by our team on <date>". **"Checked"** means *a person opened the source and confirmed the details on the date shown*; we don't call listings "verified"
- A listing with no fixed date says why in its summary: "Rolling: apply any time" or "Usually opens in <month> (based on <year>)". Undated listings sort after dated ones, so they never fill the top of Browse
- **No login required**
- Every page has Open Graph tags (title, deadline, image) so links preview nicely in Messenger/FB
- Listings past their deadline are hidden from lists and marked "Closed" on the detail page
- Listing URLs (`/opportunities/{slug}`) never change, so shared links keep working
- Search tolerates typos and Taglish (see the search indexes in [Part 3](03-data-model.md#indexes))

### 4.2 Accounts and Profile
- Everyone signs in with a one-time email link (`/sign-in`). Google sign-in is wired (M4) but its button shows only after the Google provider is switched on in Supabase, which isn't done yet
- Quick profile (`/welcome`), all pick-from-a-list so a "For you" filter could work later: school (searchable list + "Other"), course group (fixed list) + course name, year level, interests (categories), and an "I am 18 or older" checkbox. Reminder settings live on `/me`
- Account deletion (`/me/delete`; removes profile, saved items, push subscriptions, and notifications)
- Roles: everyone is a `student`; `curator` and `admin` are granted only by an admin and stored in `user_roles`, never in the editable profile. The first admin is created with `npm run grant-role -- <email> admin`; after that, admins manage roles in the admin panel

### 4.3 Saved Opportunities
- Save/unsave a listing (prompts sign-in the first time)
- "My saved" page (`/saved`) sorted by deadline
- A status per saved item (application tracker) is deferred (see 4.6)

### 4.4 Notifications
- Deadline reminders for saved listings with a fixed date: **7 days and 1 day before**. Rolling/TBA listings get none
- Channels: **email** and **web push** (if the student allowed notifications)
- Student controls: turn each channel on/off
- Deduplication so a reminder is never sent twice
- Unsubscribe link in every email

### 4.5 Admin and Curation
- Create, edit, review, publish, expire, archive listings (`/admin`), including audience tags
- **Import `data/opportunities.csv`** (`/admin/import`): preview, validate, save new rows as drafts, and show a diff for changes to already-published listings
- Review queue for student reports (`/admin/reports`), and a re-check queue (`/admin/recheck`) for `needs_check` listings and rolling/TBA listings not checked in 30+ days
- Submissions queue (`/admin/submissions`, built 2026-10-25): create a listing from a submission, or mark it "Already listed" / "Not real / not eligible". Duplicates are spotted by the curator; nothing checks them automatically
- Wins queue (`/admin/wins`, built 2026-10-30): confirm a "we joined / placed / won" note on the organizer's or school's own announcement, edit the suggested headline (max 140 characters, team or school names only), then Publish, or "Can't confirm". Published wins can be taken down. Students send them from `/opportunities/<slug>/win` (signed in, 18+, consent checkbox); they show on the listing under "Students who joined"
- Stats (`/admin/stats`): visitors, visitors who came back another week, listing views, official-link clicks, saves, shares, reminder opens, and a "Where visitors came from" table by `?ref=` tag (e.g. `/?ref=gdg-pup`, one per pilot org)
- Admins grant or remove curator/admin roles (`/admin/roles`, audit-logged)
- Audit log of admin actions
- Required before publishing: title, organization, category, official/source URL, deadline (or "rolling"/"TBA"), last-checked date

### 4.6 Phase 2 modules

**Built 2026-10-25, kept as they are** (no extensions until the sprint passes, [§1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)):
- **Audience filters** and **add to calendar** (see 4.1)
- **"Submit an opportunity"** (`/submit`): sign-in required, Turnstile captcha, a hidden honeypot field, 10 per account per day. Stored in `opportunity_submissions`; reviewed in the curator queue (4.5)
- **OJT checklist** (`/ojt`): a fixed list in `src/lib/ojt-checklist.ts`, with items marked when they come from CHED CMO 104. Ticks are saved only in the browser (`localStorage`); no account, no tables

**Planned, frozen** (deferred in [final decisions §1](../research/final-decisions.md#1-decisions) until the pilot proves demand):
- **Simple application tracker:** status on saved items: `saved` → `applying` → `applied` → `result` (`accepted` / `not_accepted`)
- **"For you" filter:** listings matching profile course, year level, and interests
- **Documents:** upload files and attach them to OJT checklist items or saved listings
  - Private storage bucket; only the owner can read their files; downloads use links that expire in minutes
  - PDF, JPG, PNG only; 5 MB per file; 100 MB per student
  - Curators and admins can't open student files
  - Deleted with the account; the student can delete any file at any time
  - Turned on only after the NPC registration check (see [Part 4 §7.7](04-api-and-logic.md#77-document-uploads-phase-2))
- **AI helper** (server-side only):
  - "Explain in Taglish": a plain-language summary of a listing
  - "Pasok ba ako?": compares the listing's eligibility with the student's profile and answers *possible match* / *check this requirement*, never "you qualify"
  - Writing help: drafts for essays, cover letters, and resumes, which the student edits
  - Daily limit per student; every answer labeled "AI-generated — check the official link"
  - Student documents are sent to the AI only when the student explicitly picks one, after a separate consent screen

### 4.7 Phase 3 modules (planned, frozen)
- **Mobile app:** Capacitor wrapper around the web app for Google Play, with native push through Firebase Cloud Messaging alongside web push. The App Store comes after the app has enough native features to pass Apple's review (see [Part 4 §7.9](04-api-and-logic.md#79-mobile-app-phase-3))
- **Curator inbox:** grow the submissions queue (4.5) into one queue of suggested opportunities from three sources:
  - **"Share to Oportune":** the installed app appears in the phone's share menu (Web Share Target for the installed web app on Android; share intent / share extension in the mobile app). The student shares a link and optionally adds a note
  - **"Submit an opportunity" form:** already built as `/submit` (4.6)
  - **Paste-to-draft** for curators: paste a post's text and the app pulls out dates and links
  - **Connected pages:** a page admin signs in with Facebook or LinkedIn and grants read access to their own page; a daily job pulls that page's new posts
  - Sign-in required to share or submit; rate-limited
  - Stored: link, optional note or post text, submitter, dates. Not stored: names, comments, or photos of other people
  - A curator checks the official source, then turns the item into a draft listing in our own words, or ignores it; nothing is auto-published
  - The student who shared it gets a notice when it's published

### Deferred (not in the code)
- "Remind me when it opens" for rolling/TBA and closed listings that repeat yearly; weekly digest by push/email
- Education level (JHS / SHS / College / Graduate) on profiles, listings, and filters
- Automated link checking; automatic duplicate detection for submissions (today only the database's unique (`source_url`, `title`) and `external_id` block duplicates)
- DOST ROS tracker and penalty calculator
- AI-assisted admin entry, RSS feeds, Facebook Page Public Content Access
- Messenger/Telegram reminders, offline mode
- Payments
