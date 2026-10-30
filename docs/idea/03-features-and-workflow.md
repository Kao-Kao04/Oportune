# Idea 3/5 — Features, Student Workflow & Categories

> Part of [idea](../idea.md) · ← [Previous](02-users-and-principles.md) · [Next](04-mvp-scope-and-roadmap.md) →

## ✅ What to do with this file

- [ ] **Feature freeze until the [30-day sprint](../validation/06-30-day-validation-sprint.md) passes (2026-11-25).** §6.1 and §6.2 are built; nothing in §6.2b or later gets built before then, except `?ref=` links.
- [ ] Don't start §6.2b until the sprint says "Continue"; then build one item at a time, in the order students asked for them.
- [ ] Don't start **Phase 3** (§6.3) until Phase 2 is live.
- [ ] Don't build anything in **Not now** (§6.4).
- [ ] After launch, check each feature's "How we'll know" signal (see [Part 5 §13](05-validation-metrics-risks.md#13-how-well-know-each-feature-is-needed)).

---

## 6. Features

### 6.1 Must have (MVP)

| # | Feature | Why students need it |
|---|---|---|
| 1 | **Opportunity list + detail page:** title, organization, deadline, eligibility, requirements, official link, source, last-checked date | The whole point of the platform |
| 2 | **Browse without logging in** | Students won't sign up just to look; shared links must open directly |
| 3 | **"Closing soon" view + search + category filters** | Students act when deadlines are near |
| 4 | **Official-site badge + report button** | Protection from scams and outdated listings |
| 5 | **Share button** (Messenger, FB, copy link) with good link previews | This is how opportunities spread among students, and how the platform grows for free |
| 6 | **Save + deadline reminders** (email + phone push notification) | The main reason to create an account |
| 7 | **Quick sign-up:** email link (Google login once switched on) + school, course, year level, interests | Under 30 seconds; enough to show what fits |
| 8 | **Fast, phone-friendly, installable** to home screen | Prepaid data and cheap phones |
| 9 | **Admin panel:** add, edit, publish, expire listings; import the spreadsheet | Listings are curated by hand |
| 10 | **Delete account** | Required by the Data Privacy Act |

### 6.2 Phase 2 (built 2026-10-25)

Decided in [research/final-decisions.md](../research/final-decisions.md). All five are built (not committed yet). They stay as they are during the freeze: commit them, don't extend them ([§1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)):

| # | Feature | Notes |
|---|---|---|
| 1 | **Eligibility filters** | Filter Browse by region, course group, and year level. Curators tag each listing; an empty tag means "open to all". Signed-in students get their own course and year pre-selected. |
| 2 | **Add to calendar** | Download a calendar file (.ics) with the deadline and a reminder, or open it in Google Calendar. |
| 3 | **"Submit an opportunity" form + curator queue** | Signed-in students, orgs, and schools send a link with a short note. Curators check the official source, then create the listing in our own words. Rate-limited. |
| 4 | **OJT checklist** | Requirements from CMO 104 s. 2017 §16 plus common school items, ticked off on the student's phone. Links the official CMO; says "your school's OJT coordinator has the final list". |
| 5 | **Region tags** | 18 regions including NIR (RA 12000). Part of #1. |

### 6.2b Next small builds (after the sprint passes)

Agreed 2026-10-26 ([final decisions §1b](../research/final-decisions.md#1b-updates-agreed-2026-10-26)), then put on hold the same day ([§1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)). Only after the [30-day sprint](../validation/06-30-day-validation-sprint.md#4-day-30-decision) says "Continue", one at a time. **Exception:** `?ref=` links may be built during the sprint, because the sprint needs them to count each org's visitors.

| # | Feature | Notes |
|---|---|---|
| 0 | **Wins on listings** (first, if the stories test works) | Teams or orgs send "we joined / we won" through `/submit`; a curator checks it and attaches it to that event's listing, with consent. Points students to the next edition. Not a social feed ([final decisions §1e](../research/final-decisions.md#1e-student-stories-and-wins-2026-10-30)) |
| 1 | **Education level** | JHS / SHS / College / Graduate in the profile, listing tags, and Browse filters, so later rings need content, not code |
| 2 | **"Share to Oportune"** (moved up from Phase 3) | From the phone's share menu (installed web app, Android). Opens `/submit` with the link and text filled in. iPhone: copy-paste into `/submit` |
| 3 | **Paste-to-draft** for curators | Paste the post text; the app pulls out dates and registration links into a draft. The curator still writes the summary and checks the source |
| 4 | **`?ref=` links** ✅ built 2026-10-30 | Shows which org or post brought which visitors, and how many came back (anonymous counts only; Admin → Stats) |
| 5 | **Hide thin categories** | Entry-level jobs, leadership, hardware grants stay hidden until they have enough listings |
| Later | **"Remind me when it opens"** | On TBA/closed listings; most programs repeat yearly. Until it exists, curators write "Usually opens in <month> (based on <year>)" in the summary |
| Later | **Weekly digest** | Push/email: this week's picks for your level and course |
| Later | **AI scam-flag helper for curators** | Pulls out details and flags scam signs; a curator always decides. Needs an API key and a monthly budget |

### 6.3 Phase 3

| Feature | Notes |
|---|---|
| **Android app** (iPhone later) | Wraps the same web app so there is one codebase; native push notifications. Publish on Google Play first since most students use Android. Apple rejects apps that are only a wrapped website, so the iPhone version waits until the app has real native features (share extension, offline saved listings). |
| **Connected pages** (optional) | An organization that admins a Facebook Page or LinkedIn page can connect it so its new posts flow into the queue, using the platform's official API with the admin's permission. |
| **"For you" filter** | Listings matching the student's profile. Rule-based and explained; include it in the privacy review (may count as profiling). |

Everything in the queue is published only after a curator checks the official source and writes the listing in our own words.

### 6.4 Not now (deferred or dropped)

| Feature | Why |
|---|---|
| AI helper | Deferred: cost, wrong-answer risk, and no proof students need it yet. Revisit after the pilot. |
| Document uploads | Deferred: uploaded IDs, grades, and medical certificates are sensitive personal information; needs a lawyer and a DPO first. |
| Application tracker | Deferred: Save + reminders cover the core need; revisit if students ask. |
| DOST Return of Service tracker + penalty calculator | Main users are graduates, not students; wrong numbers could cause financial harm. Use a simple info page linking to official DOST rules instead. |
| Full offline mode | A fast app is enough for now; Phase 3 adds offline viewing of saved listings only |
| AI-assisted admin entry (beyond scam flags) | Not needed at the current listing volume |
| Ads | Not now: no traffic yet, and Vercel's free plan forbids ads. Later, as the only income, under the rules in [final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26) (marked slots, blocked categories, no ads in reminders) |
| Automated collection (scraping) from Facebook or other platforms | Against their terms and risky under the Data Privacy Act. We link to public organizer posts instead |
| Messenger/Telegram reminders | Later, if push + email isn't enough |
| Employer portal, school dashboard | Users are students, not companies or schools |
| Student profiles and open posting (LinkedIn-style) | Not now: no audience, heavy moderation, privacy risk. Revisit only if students send 10+ wins a month unprompted ([final decisions §1e](../research/final-decisions.md#1e-student-stories-and-wins-2026-10-30)) |
| Scraping student data or posts | Never: Data Privacy Act, platform terms, and our trust promise |
| Stipend forecaster, ghost-job detector, peer forum | Complex; needs lots of data or moderation |
| Payments and paid listings | Nobody pays: students, organizers, and schools use everything for free |

## 7. Student Workflow

1. A student opens a shared link (or the home page) **without an account** and sees listings sorted by deadline.
2. They filter by category, search, or open "closing soon."
3. They open a listing: deadline, eligibility, requirements, official link, badge.
4. They **share** it to a group chat, or tap **Save**.
5. Saving asks for a quick sign-up (email link or Google, + 4 questions) the first time.
6. They get a **reminder** before the deadline (7 days and 1 day before, by default).
7. They tap through to the **official link** to apply.

The platform never applies on the student's behalf and never marks anything as "applied" unless the student does.

## 8. Opportunity Categories

The canonical list lives in [`data/categories.csv`](../../data/categories.csv). Every row in [`data/opportunities.csv`](../../data/opportunities.csv) must use a **name** from this table exactly:

| Name | Slug | Covers |
|---|---|---|
| Scholarship and financial aid | `scholarships` | Scholarships, grants, government and LGU financial aid |
| Internship and OJT | `internships` | Internships, OJT placements, summer programs |
| Entry-level jobs | `entry-level-jobs` | Graduate and trainee programs, first jobs |
| Hackathons and technical competitions | `hackathons` | Hackathons, programming and engineering contests |
| Cybersecurity CTFs | `ctfs` | Capture-the-flag competitions |
| Courses, certifications, and TESDA programs | `courses` | Free courses, certification programs, TESDA |
| Student leadership and ambassador programs | `leadership` | Ambassador, campus lead, and leadership programs |
| Events and conferences | `events` | Conferences, summits, job fairs, workshops |
| Research grants and innovation programs | `research-grants` | Thesis and research grants, innovation challenges |
| Hardware, gadget, and connectivity grants | `hardware-grants` | Laptop, device, and internet grants |
