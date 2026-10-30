# Idea 5/5 — Measuring Features, Risks & Open Decisions

> Part of [idea](../idea.md) · ← [Previous](04-mvp-scope-and-roadmap.md)

## ✅ What to do with this file

- [ ] **First:** the [30-day validation sprint](../validation/06-30-day-validation-sprint.md) (2026-10-27 → 11-25) and its day-30 kill criteria. §13–14 apply after the January soft launch, only if the sprint says "Continue".
- [x] Analytics built (views, official clicks, saves, shares, reminders opened; Admin → Stats).
- [ ] Review the numbers every 2 weeks after launch; drop or simplify features nobody uses.
- [ ] Assign an owner to each risk (§15).
- [ ] Verify each fact in §16 by the point it names (before launch, before Phase 2, or before Phase 3).

---

We validate by **launching small and measuring what students actually do**, not by guessing, and by **talking to students and organizers before building more**. Interviews are no longer optional: the [30-day sprint](../validation/06-30-day-validation-sprint.md) requires 15+ student interviews and 5+ organizer price quotes.

## 13. How We'll Know Each Feature Is Needed

| Feature | Signal | Keep if… (starting target) | If not… |
|---|---|---|---|
| Listings | Official-link clicks per listing view | ≥ 10% of detail views click the official link | Improve listing quality/relevance |
| Browse without login | Visits from shared links | Shared links bring new visitors every week | — (keep; it's cheap) |
| Closing soon / filters | Usage of each view and filter | Used in ≥ 20% of sessions | Simplify the home page |
| Badge + report | Reports submitted; time to fix | Reports are fixed within 48 hours | Add more curator time |
| Share | Shares per week | Shares grow week over week | Improve link previews and the button's placement |
| Save + reminders | % of signed-up users who save; % of reminders opened | ≥ 30% save something; ≥ 30% of reminders opened | Try a different reminder channel (Messenger/Telegram) |
| Quick sign-up | Sign-up completion rate | ≥ 70% of started sign-ups finish | Remove profile questions |
| Installable app | Installs | Some students install it | — (keep; low cost) |
| AI helper (Phase 2) | % of detail views that use it; "Report this answer" rate | Used on ≥ 10% of detail views; < 2% of answers reported | Fix prompts or narrow it to "Explain" only |
| Document uploads (Phase 2) | % of OJT checklist users who upload | ≥ 30% upload at least one file | Keep the checklist, drop uploads |
| Share to Oportune (Phase 2b) | Inbox items per week; % turned into listings | ≥ 20 items/week; ≥ 25% converted | Promote the submission form instead |
| Android app (Phase 3) | Installs; 30-day retention vs. web | App users return more often than web users | Keep the web app as the main channel |

These targets are starting points, not industry rules. Adjust them once you see real numbers, and write down why.

## 14. Success Metrics

- **Weekly active students**
- **Return rate** after 7 and 30 days
- **Official-link clicks** (students actually going to apply)
- **Saves and reminders opened**
- **Shares** (growth)
- **Listing freshness:** % of active listings with working links and future deadlines
- **Curator time** per week

**Gate 1: the 30-day validation sprint (2026-10-27 → 11-25).** Pass lines and kill criteria: [sprint §1 and §4](../validation/06-30-day-validation-sprint.md#4-day-30-decision). In short: ≥ 50% of 15+ interviewed IT/CS students describe a missed opportunity unprompted; ≥ 75 sign-ups from 2 orgs, ≥ 30% save, ≥ 20% return; 40+ dated listings kept with ≤ 6 curator hours/week. Stop if < 1 in 3 report the pain, no org will post, < 25 sign-ups or < 10% return, or curation takes > 10 hours/week.

**Gate 2: first 90 days after the January 2027 soft launch** (only after Gate 1 says "Continue"; [final decisions](../research/final-decisions.md)):

| Metric | Target | Stop / pivot if |
|---|---|---|
| Signed-up students | 1,000 | — |
| WAU / MAU | ≥ 25% | — |
| Signed-up students who save at least one listing | ≥ 30% | — |
| New listings that came from submissions | ≥ 10% | — |
| Weekly active students after 12 weeks | — | < 300 |
| Students who return in week 4 | — | < 20% |

## 15. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Listings go stale | Automatic expiry of dated listings; 30-day re-check queue for rolling/TBA listings; daily 15-minute check of a fixed list of organizer pages; report button. No automatic link checking yet |
| The promise doesn't match the feed ("never miss a deadline" over undated listings) | 40+ dated pilot listings; undated ones say "Rolling" or "Usually opens in <month>" and never fill the top of Browse ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)) |
| "Verified" overclaims (most sources aren't official) | Say "checked" and define it; official badge only for `.gov.ph`/`.edu.ph`; prefer the organizer's own page as the source |
| Building features instead of finding users | Feature freeze until the sprint passes; weekly scorecard with interviews, orgs, and organizer quotes |
| Leaked secrets (key and DB password were pasted in chat) | Rotate both before deploying or collecting any student data ([launch checklist §2](../launch-checklist.md#2-before-launch-security-do-first)) |
| Ad income is too small to cover costs | Stay on free tiers and grants until traffic exists; turn ads on only when expected income covers Vercel Pro |
| Not enough listings for some courses | Start with opportunities open to everyone; add categories based on demand |
| Scam or fake listings | Human review, source links, official-site badge, reporting |
| Students don't come back after one visit | Save + reminders; measure the 7/30-day return rate |
| Email reminders go unread | Push notifications in MVP; Messenger/Telegram later |
| Curation takes too much time | Track curator hours; add AI-assisted entry in Phase 3 |
| Legal issues with sources | No scraping; listings come from curators, student shares, organization submissions, and official APIs with the page admin's permission; short summaries in our own words with a link to the source; no personal data (Data Privacy Act, NPC Advisory No. 2026-01, RA 10175, RA 8293) |
| Spam or fake submissions in the inbox | Sign-in required to share or submit; rate limits; a curator checks the official source before publishing; repeat abusers blocked |
| AI misses a scam or gets a detail wrong | AI only assists curators; a person always opens the source and decides; Report button and re-check queue after publishing |
| A linked Facebook post is deleted, edited, or private | Link only public organizer posts; put the registration link as Apply; re-check queue; Report button |
| Ads hurt trust (scam-like ads next to listings) | Marked "Ad" slots only; block loans, gambling, crypto, dating, MLM, and scholarship/job-offer ads; no ads on account pages or in reminders; students can report an ad ([final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)) |
| Ads slow the app on prepaid data, or track students | Lazy-load ads, one slot per screen; non-personalized by default; never share profile data with the ad network; update `/privacy` before ads go live |
| Hosting terms: ads on a free plan | Switch Vercel to Pro before the first ad goes live (Hobby forbids ads) |
| Minors sign up | Under 18 browse without an account; sign-up stays 18+ until a lawyer approves a guardian-consent flow |
| Student data leak | Collect minimal data; Row-Level Security; breach plan (notify NPC within 72 hours for qualifying breaches) |
| Costs grow (AI, email, hosting) | AI only for curators, with a monthly budget; Resend Pro after 100 emails/day; Vercel Pro only when ad income pays for it |
| Free tiers run out (email cap, paused database) | Push reminders first, email second; watch daily send counts; upgrade before launch day if needed |
| Apple rejects the iPhone app | Android first; add native features before submitting to Apple |
| No money to run the platform | Keep costs low (free tiers where possible); grants first; ads only once there's traffic |

## 16. Facts to Verify

- [ ] Full text of NPC Advisory No. 2026-01 on scraping public personal data (before any automated collection)
- [ ] Facebook (Meta) and LinkedIn API rules for reading posts of pages whose admins connect them (before connected pages, Phase 3)
- [ ] NPC rules for storing students' documents (sensitive personal information) (before uploads, Phase 2)
- [ ] Google Play and Apple App Store requirements and fees, including Apple's minimum-functionality rule for wrapped web apps (before the Phase 3 app)
- [ ] Data Privacy Act rules for users under 18 (some first-year students are 17): what consent is needed and which features they can use (before launch)
- [x] Current free-tier limits of Supabase and Resend (checked 2026-10-25, see [final decisions §2.5](../research/final-decisions.md#25-infrastructure-costs-checked-2026-10-25)); Vercel still to check
- [ ] NPC registration: likely required at 1,000+ users because education data is sensitive personal information ([final decisions §2.4](../research/final-decisions.md#24-data-privacy-act)). Lawyer to confirm before launch
- [x] CMO 104 s. 2017 §16 student requirements ([final decisions §2.1](../research/final-decisions.md#21-ojt-rules-for-the-checklist)); still read the scanned official PDF once before launch
- [ ] Official DOST-SEI Return of Service rules before writing the ROS info page (Phase 3)

## 17. Open Decisions

- ~~Telegram channel or FB page for Phase 0?~~ Dropped: the pilot orgs' own pages and group chats are the channel; we give them a weekly "opportunity drop".
- Which reminder timing works best (7 days + 1 day before)?
- Who curates, and how many hours a week? **Measured in the sprint** ([`curation-log.csv`](../validation/templates/curation-log.csv)); target ≤ 6 hours/week for 40+ listings.
- ~~When to add regional/local listings?~~ Now: region tags are part of Phase 2.
- ~~When to revisit monetization?~~ Grants first; ads later as the only income; nobody pays ([final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)).
