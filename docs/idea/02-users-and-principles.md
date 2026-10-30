# Idea 2/5 — Users & Product Principles

> Part of [idea](../idea.md) · ← [Previous](01-overview-and-problem.md) · [Next](03-features-and-workflow.md) →

## ✅ What to do with this file

- [ ] Remember: **every user is a student**. Design every screen for a student on a phone with prepaid data.
- [ ] Check each feature idea against "What students are like" (§4) before building it.
- [ ] Print/pin the principles (§5).

---

## 4. Users

### Who
**Vision:** every student in the Philippines, from Junior High to Masters/PhD. **Now:** college students at any public or private school, starting with **3rd/4th-year IT/CS/IS students** in 2 campus IT orgs for the pilot ([30-day sprint](../validation/06-30-day-validation-sprint.md)); then all college + Grade 12, then graduate students, then Junior/Senior High ([rings](../research/final-decisions.md#1b-updates-agreed-2026-10-26)). Not companies, not schools.

Students under 18 can browse and share without an account; signing up stays 18+ until a lawyer approves a guardian-consent flow.

### What students are like (and what it means for the product)

| Reality | Product decision |
|---|---|
| Phone first, prepaid data, often cheap phones | Light, fast pages; installable to home screen |
| Live in Messenger, FB, and group chats | One-tap share with good link previews; email alone isn't enough for reminders |
| Busy; act when a deadline is near | Deadlines shown first; "closing soon" view; reminders |
| Wary of scams | Source link, "checked by our team on <date>", official-site badge for `.gov.ph`/`.edu.ph`, report button |
| Little or no money | Everything free, no payments |
| Won't sign up just to look | Browse without an account; sign up only to save |
| Hate long forms | One-tap email link (Google sign-in once it's switched on) + 4 quick profile questions (school, course, year, interests), all pick-from-a-list, plus an "18 or older" checkbox |

### Student types

| Type | Main need |
|---|---|
| **Tech competitor** (pilot) | Hackathons, CTFs, programming contests |
| **Career builder** (pilot) | Internships, OJT placements, graduate programs |
| **Scholarship hunter** | Scholarships and financial aid that fit their course and year (tech scholarships in the pilot) |
| **Self-learner** | Free courses and certifications |
| **OJT student** (Phase 2) | A checklist to track OJT requirements |

## 5. Product Principles

1. **Free for everyone.** No payments, subscriptions, paywalls, or paid listings, for students or organizers. Ads, later, stay in marked slots and never change what's listed.
2. **Browse first, sign up later.** Listings are public; an account is only needed to save and get reminders.
3. **Trust first.** Every listing shows its source and the date a person last checked it. Official `.gov.ph` / `.edu.ph` sources get a badge. We say "checked", not "verified", and never claim more than we did.
4. **No fabricated or unchecked listings.** Every listing has a traceable source and is reviewed by a person before publishing.
5. **Deadline first.** The most urgent opportunities are the easiest to see.
6. **Phone first and data-lite.** Fast on cheap phones and slow connections.
7. **Privacy by default.** The profile collects only school, course, year level, interests, and an "18 or older" confirmation. No documents, IDs, or financial info.
8. **AI helps, people verify.** If we use AI, it helps curators (pull out details, flag scam signs); a person always checks the source and decides. AI never publishes a listing.
9. **Link, don't scrape.** We link back to the organizer's own post or page and write summaries in our own words. No automated collection from Facebook or other platforms, no private groups.
10. **Show only what fits.** All-in-one only works if each student sees their level, course, region, and year first.
11. **Simple beats complete.** Ship the smallest useful version, then improve based on what students actually use.
12. **Evidence before features.** A new feature needs evidence from students or organizers first (interviews, usage, or a commitment). Until the [30-day sprint](../validation/06-30-day-validation-sprint.md) passes, nothing new gets built.
