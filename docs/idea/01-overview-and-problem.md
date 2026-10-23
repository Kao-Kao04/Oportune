# Idea 1/5 — Overview & Problem

> Part of [idea](../idea.md) · [Next](02-users-and-principles.md) →

## ✅ What to do with this file

- [ ] Read the overview so everyone agrees on the core loop: **find → share → save → get reminded**.
- [ ] Read §3 to understand what we kept from the research and what we changed.
- [ ] Keep posting from [`data/opportunities.csv`](../../data/opportunities.csv) while the app is being built.

---

## 1. Overview

**Student Opportunity Hub** is a free, phone-first platform for **college students in the Philippines** (any public or private school). It brings scattered opportunities into one trusted place:

- Scholarships and financial aid
- Internships, OJT, and entry-level/graduate programs
- Hackathons, competitions, and cybersecurity CTFs
- Free courses and certifications
- Student leadership/ambassador programs, events, and research grants

### The core loop

1. **Find:** browse verified listings, sorted by what's closing soon, without needing an account.
2. **Share:** send a listing to a group chat in one tap.
3. **Save:** keep the ones you want (needs a quick sign-up).
4. **Get reminded:** a notification before the deadline so you don't miss it.

Every listing shows its **official source**, **last-checked date**, and an **official-site badge** for `.gov.ph` / `.edu.ph` sources, so students can trust it over random Facebook posts.

> **Free for students. No payments.** Monetization is a later decision (see [Part 4 §12](04-mvp-scope-and-roadmap.md#12-monetization-deferred)).

## 2. Problem

- **Scattered.** Opportunities are spread across Facebook pages, group chats, school announcements, company sites, and government pages.
- **Missed deadlines.** Students find out too late, or forget after seeing a post once.
- **Scams.** Fake "scholarship" and "government assistance" posts target students.
- **Hard to tell what fits.** Eligibility and requirements are buried in long posts or PDFs.

## 3. What We Kept and What We Changed from the Research

The deep research recommended making compliance tools (CMO 104 OJT checklist, DOST Return of Service tracker) the core. After reviewing every feature from a **student's point of view**, we decided:

| Research recommendation | Our decision | Why |
|---|---|---|
| Compliance tools as the core | **Listings + reminders are the core**; compliance tools come later | Every student needs opportunities; only some need compliance tools, and only at certain times |
| CMO 104 OJT checklist in MVP | **Phase 2**, as an editable checklist | Only for 3rd/4th years during OJT season; each school's requirements differ |
| DOST ROS tracker + penalty calculator in MVP | **Deferred.** A simple info page linking to official DOST rules for now | The main users are **graduates** serving ROS, not current students; wrong numbers could cause real harm |
| Offline-first PWA | **Fast + installable now**, full offline later | Speed matters most on prepaid data; offline is extra work |
| AI extraction in admin panel | **Later** | Not needed while we curate dozens, not thousands, of listings |
| Hyper-local launch (Olongapo) | **All schools nationwide** | Start with opportunities open to everyone (national scholarships, online events, free courses) |
| Human curation, no scraping | **Kept** | Legal and platform rules (see [Part 5 §15](05-validation-metrics-risks.md#15-risks-and-mitigations)) |
| Official-domain badge, scam protection | **Kept, MVP** | Cheap to build, high trust value |
| No student subscriptions | **Kept.** No payments at all | Students have little money |
