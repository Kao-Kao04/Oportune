# Idea 3/5 — Features, Student Workflow & Categories

> Part of [idea](../idea.md) · ← [Previous](02-users-and-principles.md) · [Next](04-mvp-scope-and-roadmap.md) →

## ✅ What to do with this file

- [ ] Turn each **Must have** feature (§6.1) into a screen or wireframe.
- [ ] Don't start **Should have** (§6.2) until the Must haves are live.
- [ ] Don't build anything in **Not now** (§6.3).
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
| 7 | **Quick sign-up:** Google login + school, course, year level, interests | Under 30 seconds; enough to show what fits |
| 8 | **Fast, phone-friendly, installable** to home screen | Prepaid data and cheap phones |
| 9 | **Admin panel:** add, edit, publish, expire listings; import the spreadsheet | Listings are curated by hand |
| 10 | **Delete account** | Required by the Data Privacy Act |

### 6.2 Should have (after the MVP is live)

| Feature | Notes |
|---|---|
| **Simple application tracker** | Statuses: Saved → Applying → Applied → Result (Accepted / Not accepted). No more than that. |
| **OJT requirements checklist** | Editable checklist based on CMO 104 plus the student's own school items. Status and dates only, **no document uploads**. Verify items against the official CMO 104 text first. |
| **"For you" filter** | Show listings matching the student's course, year level, and interests. Simple rules, no algorithm. |

### 6.3 Not now (deferred or dropped)

| Feature | Why |
|---|---|
| DOST Return of Service tracker + penalty calculator | Main users are graduates, not students; wrong numbers could cause financial harm. Use a simple info page linking to official DOST rules instead. |
| Full offline mode | A fast app is enough for now |
| AI in the admin panel | Not needed at the current listing volume |
| Messenger/Telegram reminders | Later, if email + push isn't enough |
| Employer portal, school dashboard | Users are students, not companies or schools |
| Stipend forecaster, ghost-job detector, peer forum | Complex; needs lots of data or moderation |
| Document uploads | Privacy and security risk |
| Payments, student-facing AI, scraping | Dropped |

## 7. Student Workflow

1. A student opens a shared link (or the home page) **without an account** and sees listings sorted by deadline.
2. They filter by category, search, or open "closing soon."
3. They open a listing: deadline, eligibility, requirements, official link, badge.
4. They **share** it to a group chat, or tap **Save**.
5. Saving asks for a quick sign-up (Google + 4 questions) the first time.
6. They get a **reminder** before the deadline (7 days and 1 day before, by default).
7. They tap through to the **official link** to apply.

The platform never applies on the student's behalf and never marks anything as "applied" unless the student does.

## 8. Opportunity Categories

The canonical list (names and URL slugs) lives in [`data/categories.csv`](../../data/categories.csv); every row in [`data/opportunities.csv`](../../data/opportunities.csv) must use one of these names exactly:

- Scholarship and financial aid
- Internship and OJT
- Entry-level jobs — graduate and trainee programs
- Hackathons and technical competitions
- Cybersecurity CTFs
- Courses, certifications, and TESDA programs
- Student leadership and ambassador programs
- Events and conferences
- Research grants and innovation programs
- Hardware, gadget, and connectivity grants
