# Idea 4/5 — MVP Scope & Roadmap

> Part of [idea](../idea.md) · ← [Previous](03-features-and-workflow.md) · [Next](05-validation-metrics-risks.md) →

## ✅ What to do with this file

- [x] Build the MVP (§9) and Phase 2: done (M1–M6, Phase 2 on 2026-10-25), not deployed yet.
- [ ] **Now: the validation sprint** (§10), with a feature freeze until it passes.
- [ ] Follow the phases (§10) in order; each one starts only if the one before met its targets.
- [ ] Remember: **nobody pays**; ads come later, not during the sprint.

---

## 9. MVP Scope (Phase 1)

1. Public opportunity list and detail pages (no login needed)
2. "Closing soon" view, search, category filters
3. Official-site badge (`.gov.ph`/`.edu.ph`), source link, "checked by our team on <date>"
4. Report button for wrong or suspicious listings
5. Share button with link previews for Messenger/FB
6. Email-link sign-in (Google once switched on) + quick profile (school, course, year level, interests)
7. Save listings
8. Deadline reminders by email and phone push notification, with on/off controls
9. Fast, phone-first, installable app
10. Admin panel: add, edit, publish, expire listings; import `data/opportunities.csv`
11. Automatic expiry of listings past their deadline
12. Delete account
13. Basic analytics (views, official-link clicks, saves, shares, reminders opened)

## 10. Roadmap

| Phase | What | Notes |
|---|---|---|
| **0 — Curate** | Curated spreadsheet ([`data/opportunities.csv`](../../data/opportunities.csv)), 79 rows | Done. The planned Telegram/FB channel was never started |
| **1 — MVP** | Everything in §9 | ✅ Built (M1–M6), not deployed |
| **2 — Phase 2** | Eligibility filters + region tags, add to calendar, "Submit an opportunity" + curator queue, OJT checklist | ✅ Built 2026-10-25, not committed. Frozen as is |
| **Validation sprint (now: 2026-10-27 → 11-25)** | Rotate keys, deploy, 40+ dated IT/CS listings, 2 campus IT orgs, 15+ student interviews, 5+ organizer price quotes. **No new features** | [Sprint plan](../validation/06-30-day-validation-sprint.md). Day-30 decision: Continue, Narrow, or Stop |
| **Soft launch (January 2027, only after "Continue")** | Small builds from [Part 3 §6.2b](03-features-and-workflow.md#62b-next-small-builds-after-the-sprint-passes), one at a time; lawyer review; more IT orgs | OJT season. Second gate: the 12-week rule in [Part 5 §14](05-validation-metrics-risks.md#14-success-metrics) |
| **3 — Grow (July 2027 push)** | Expand to all college + Grade 12, **Android app** (iPhone after), connected pages, "For you" filter, more categories and regional listings, Messenger/Telegram reminders, offline viewing of saved items, DOST ROS info page | Based on what pilot students use most |
| **Later / maybe** | AI helper, document uploads, application tracker, DOST ROS tracker, Facebook Page Public Content Access, school or employer features | Only with evidence from the pilot (and a lawyer for uploads) |

## 11. What We Won't Build

- Payments or subscriptions (not needed now; see §12)
- Loan referrals
- Sponsored, featured, or paid listings (see §12)
- Scraping of Facebook, LinkedIn, or other platforms (against their terms); we use sharing, submissions, and official APIs instead

## 12. Money

**Nobody pays.** Decided in [final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26):

- **Free for everyone:** students, organizers, and schools. Listing an opportunity is free; there are no sponsored or paid listings.
- **Now: grants and competitions** fund the start. DICT Philippine Startup Challenge first, then Startup QC and the DICT Startup Grant Fund (needs a registered business). Apply with the sprint's real numbers.
- **Later: ads are the only income.** Only after the soft launch passes the 12-week gate and traffic covers Vercel Pro (the free plan forbids ads). Marked "Ad" slots only, blocked categories (loans, gambling, crypto, dating, MLM, scholarship/job offers), no ads in reminders, non-personalized by default, privacy notice updated first.
