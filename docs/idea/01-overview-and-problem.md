# Idea 1/5 — Overview & Problem

> Part of [idea](../idea.md) · [Next](02-users-and-principles.md) →

## ✅ What to do with this file

- [ ] Read the overview so everyone agrees on the core loop: **find → share → save → get reminded**.
- [ ] Read §3 to understand what we kept from the research and what we changed.
- [ ] Read §2 as **hypotheses**, not facts: no student has been interviewed yet. The [30-day sprint](../validation/06-30-day-validation-sprint.md) tests them.

---

## 1. Overview

**Oportune** (earlier working name: Student Opportunity Hub) is a free, phone-first platform for **students in the Philippines**. The vision: every student, from Junior High to Masters/PhD, finds every opportunity in one place, but only sees what fits them. We launch with **college students** (IT/CS pilot first) and expand in rings ([final decisions §1b](../research/final-decisions.md#1b-updates-agreed-2026-10-26)). It brings scattered opportunities into one trusted place:

- Scholarships and financial aid
- Internships, OJT, and entry-level/graduate programs
- Hackathons, competitions, and cybersecurity CTFs
- Free courses and certifications
- Student leadership/ambassador programs, events, and research grants

### The core loop

1. **Find:** browse checked listings, sorted by what's closing soon, without needing an account.
2. **Share:** send a listing to a group chat in one tap.
3. **Save:** keep the ones you want (needs a quick sign-up).
4. **Get reminded:** a notification before the deadline so you don't miss it.

Every listing shows its **source link** and the **date a person last checked it** against that source; `.gov.ph` / `.edu.ph` sources also get an **official-site badge**. "Checked" means exactly that: a person opened the source and confirmed the details on the date shown. A listing with no fixed deadline says so ("Rolling: apply any time" or "Usually opens in <month>").

> **Free for everyone. Always.** Students, organizers, and schools never pay; listing an opportunity is free. Clearly marked ads will be the only income, later (see [Part 4 §12](04-mvp-scope-and-roadmap.md#12-money)).

**Positioning line:** "**Never miss a deadline.** Student opportunities in tech, each one checked by a person against its source." The pilot leads with IT/CS hackathons, CTFs, OJT, and tech scholarships; big free Facebook pages already cover general scholarships ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).

**What we are, and aren't:** we're the **radar** (what's open, what fits, when it closes, is it real) and we send students to the official page to apply. We're not an application platform like iSkolar (scholarships), internship boards, or JobStreet (jobs); those can be our sources and partners.

## 2. Problem (hypotheses to test)

What we believe, not yet what we've seen: as of 2026-10-26 we have 0 interviews. The [30-day sprint](../validation/06-30-day-validation-sprint.md) tests the first two with IT/CS students.

- **Scattered.** Opportunities are spread across Facebook pages, group chats, school announcements, company sites, and government pages.
- **Missed deadlines.** Students find out too late, or forget after seeing a post once.
- **Scams.** Fake "scholarship" and "government assistance" posts target students.
- **Hard to tell what fits.** Eligibility and requirements are buried in long posts or PDFs.

## 3. What We Kept and What We Changed from the Research

The deep research recommended making compliance tools (CMO 104 OJT checklist, DOST Return of Service tracker) the core. After reviewing every feature from a **student's point of view**, we decided the following. The last rows are later changes to our own first plan.

| Research recommendation or earlier plan | Our decision | Why |
|---|---|---|
| Compliance tools as the core | **Listings + reminders are the core**; compliance tools come later | Every student needs opportunities; only some need compliance tools, and only at certain times |
| CMO 104 OJT checklist in MVP | **Phase 2**, as an editable checklist | Only for 3rd/4th years during OJT season; each school's requirements differ |
| DOST ROS tracker + penalty calculator in MVP | **Deferred.** A simple info page linking to official DOST rules for now | The main users are **graduates** serving ROS, not current students; wrong numbers could cause real harm |
| Offline-first PWA | **Fast + installable now**, full offline later | Speed matters most on prepaid data; offline is extra work |
| AI extraction in admin panel | **Phase 3 at the earliest** | Not needed while we curate dozens, not thousands, of listings |
| Hyper-local launch (Olongapo) | **Content for all schools nationwide; pilot with 2 campus IT orgs** | Most listings are open to everyone (national programs, online events); the pilot needs a few orgs to reach real students |
| Official-domain badge, scam protection | **Kept, MVP** | Cheap to build, high trust value |
| Human curation, no scraping | **Kept: link, don't scrape.** People find public organizer posts (mostly on Facebook) and add them via `/submit` or "Share to Oportune"; curators write our own summary and link back to the post | Most PH hackathons are only on Facebook. Linking is fine; scraping breaks Meta's terms (see [Part 5 §15](05-validation-metrics-risks.md#15-risks-and-mitigations)) |
| No AI for students | **Kept for now.** AI helper for students deferred; AI may first help *curators* (extract details, flag scam signs), never deciding | Cost, wrong-answer risk, and no proof students need it yet ([final decisions](../research/final-decisions.md)) |
| No document uploads | **Kept for now (deferred).** | Uploaded IDs, grades, and medical certificates are sensitive data; needs a lawyer and a DPO first |
| Web app only | **Changed.** Android app in Phase 3, iPhone after; nothing new before the sprint passes | A store app is easier to find and keep than "add to home screen" |
| No payments | **Kept for everyone.** Nobody pays; ads in marked slots, with blocked categories, are the only income once there's traffic | Students have little money; a free listing board gets more listings; ad rules keep scam-like ads out ([final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)) |
