# Validation 6/6 — 30-Day Validation Sprint (2026-10-27 → 2026-11-25)

> Part of [validation](../validation.md) · ← [Previous](05-coordinator-checklist-review.md)

## ✅ What to do with this file

- [ ] Work through the weeks in §2 in order. **No new features** during the sprint ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).
- [ ] Fill the scorecard (§3) every Sunday.
- [ ] On **2026-11-25**, make the day-30 decision (§4) and record it in [final decisions](../research/final-decisions.md).
- [ ] Run the student stories test (§6) alongside; it informs what we build first but doesn't decide Continue/Stop.
- [ ] Use the interview guide (§5). Log interviews in [`templates/interview-log.csv`](templates/interview-log.csv); log curator time in [`templates/curation-log.csv`](templates/curation-log.csv).

---

## Why this sprint exists

On 2026-10-26 a court-style review voted 11–1 against "keep investing development time" ([verdict](../../.court/20261026-012500/VERDICT.md)). The app was built; the evidence wasn't: 1 user (us), 0 interviews, and 52 of 79 listings with no fixed date. The jurors' conditions:

1. Freeze features, rotate the leaked keys, create the admin account, deploy a live link.
2. Fix the first screen: dated hackathon/CTF/OJT listings from the organizer's own sources.
3. Put it in front of two campus IT orgs on a dated test, with minimum counts for interviews and sign-ups, and quote at least one organizer a price.

This sprint does exactly that, and nothing else, with one change: **we don't quote any price.** Oportune takes no payments from anyone; ads will be the only income, later ([final decisions §1d](../research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)). So the sprint tests pain, return visits, and curation effort only.

## 1. What we're testing

Three hypotheses. Each has a pass line set **before** we start. These are our own starting numbers (low confidence): change one only before the sprint starts, or with a written reason.

| # | We believe… | Pass on day 30 | How we measure |
|---|---|---|---|
| **H1 Pain** | 3rd/4th-year IT/CS/IS students miss or nearly miss hackathons, CTFs, OJT openings, and tech scholarships they wanted, because posts are scattered across Facebook pages, group chats, Luma, and GDG pages | **≥ 50%** of interviewed students describe a missed or nearly missed opportunity from the last 12 months **unprompted** (evidence level 3+, [Part 1 §1](01-idea-validation-framework.md#1-the-rule-evidence-beats-opinion)) | Interviews (§5), at least **15** |
| **H2 Return** | Students who arrive through their org come back on their own | **≥ 75 sign-ups** from the two orgs; **≥ 30%** of them save a listing; **≥ 20%** of visitors come back in a later week | `profiles` rows; Admin → Stats; `analytics_events` (same `anonymous_id` in 2+ different weeks) |
| **H3 Supply** | One curator can keep the pilot feed correct | **40+** open, dated pilot listings kept up with **≤ 6 hours/week** of curator time; every report fixed within 48 hours | [`curation-log.csv`](templates/curation-log.csv); Admin → Reports |

## 2. Week by week

### Week 1 (Oct 27 – Nov 2): switch it on, make the first screen honest
- [ ] **Security first:** rotate the Supabase secret key; reset the database password ([launch checklist §2](../launch-checklist.md#2-before-launch-security-do-first)).
- [ ] Commit the Phase 2 work as it is. No polishing.
- [ ] Create the admin account: `npm run grant-role -- <email> admin`.
- [ ] Review the 25 drafts; publish only what you confirmed on the organizer's own page.
- [ ] **Content:** reach 40+ open, dated listings in hackathons, CTFs, OJT/internships, and tech scholarships. Rewrite every undated summary to say "Rolling: apply any time" or "Usually opens in <month> (based on <year>)".
- [ ] Turnstile and Resend keys, then deploy on Vercel (the free `*.vercel.app` address is fine for the sprint; a domain can wait).
- [x] `?ref=` links (the only code allowed): built 2026-10-30. Give each org its own link, e.g. `https://<site>/?ref=gdg-pup`; Admin → Stats shows visitors, returns, views, and clicks per tag.
- [ ] Message 4–6 campus IT orgs (GDG on Campus, JPCS, AWS Cloud Clubs, MLSA). Ask what they need first ([final decisions §1b](../research/final-decisions.md#1b-updates-agreed-2026-10-26)). Goal: 2 say yes.
- [ ] Book the first 5 student interviews.

### Week 2 (Nov 3 – 9): first org live
- [ ] Org 1 posts the link with its own `?ref=` tag. Offer the weekly "opportunity drop" post in return.
- [ ] First 2 student stories written, with consent (§6).
- [ ] 8 interviews done (§5). Log each one the same day.
- [ ] Curator log every day you curate.

### Week 3 (Nov 10 – 16): second org live
- [ ] Org 2 posts the link.
- [ ] 15 interviews done in total.
- [ ] Stories 3–4 posted (§6).
- [ ] Test web push on real Xiaomi/Oppo/Realme/Samsung phones and an iPhone (installed).

### Week 4 (Nov 17 – 25): measure and decide
- [ ] Synthesis: tag interview notes with pain codes and count them ([Part 5 §3](05-coordinator-checklist-review.md#3-synthesis-after-all-interviews)). Add `MISSED-OPPORTUNITY`, `FOUND-VIA-FB`, `FOUND-VIA-ORG`, `FOUND-VIA-GC` to the codes.
- [ ] Fill the last scorecard row.
- [ ] Make the day-30 decision (§4) on **2026-11-25** and write it into [final decisions](../research/final-decisions.md).

## 3. Weekly scorecard

Fill one row every Sunday. If a week shows only code and no numbers, the sprint is off track.

| Week ending | Interviews (total) | Unprompted "missed one" | Orgs live | Sign-ups | % saved | % returned | Open dated listings | Curator hours |
|---|---|---|---|---|---|---|---|---|
| Nov 2 | | | | | | | | |
| Nov 9 | | | | | | | | |
| Nov 16 | | | | | | | | |
| Nov 25 | | | | | | | | |

## 4. Day-30 decision

**Continue** to the January 2027 soft launch only if **H1, H2, and H3 pass** and both orgs went live. Then, and only then, unfreeze the small builds in [idea Part 3 §6.2b](../idea/03-features-and-workflow.md#62b-next-small-builds-after-the-sprint-passes), one at a time, starting with whatever students asked for most.

**Stop** building Oportune as an app if **any** of these is true:

| Kill signal | What it means |
|---|---|
| Fewer than **1 in 3** interviewed students describe a missed opportunity unprompted | The pain isn't there for this group |
| **No org** agrees to post after asking 6 or more | No distribution; an app with no way to reach students |
| Fewer than **25 sign-ups**, or fewer than **10%** of visitors come back in a later week | Students looked once and left |
| Keeping 40 listings correct takes more than **10 hours/week** | Not operable by this team |

If it's a stop, the cheapest fallback is to keep the content and run it as a weekly opportunity post for the orgs (no app), and record what we learned.

**Narrow** if the results fall between the two (for example, H1 passes only for OJT, or only for hackathons/CTFs): run one more 30-day sprint with that single category, still with no new features.

After a "Continue", the second gate is the existing 12-week rule after the soft launch ([idea Part 5 §14](../idea/05-validation-metrics-risks.md#14-success-metrics)).

## 5. Interview guide: IT/CS students (segment F, 20 minutes)

Who: 3rd/4th-year IT/CS/IS students, at least 2 schools, public and private ([Part 2](02-recruitment-and-consent.md) for recruitment and the consent script). Ask about **the last time**, never "would you use…". Don't describe Oportune until §5.5.

**5.1 Warm-up (2 min)**
1. School, course, year? Public or private?

**5.2 The last opportunity (8 min)**
2. Tell me about the last hackathon, CTF, internship/OJT opening, or scholarship you applied to or joined. How did you first hear about it?
3. How long before the deadline did you find it? Was that enough time?
4. Think of one in the last 12 months you **missed or almost missed**. What happened? *(Don't suggest one; note whether they bring it up themselves.)*
5. What did missing it cost you (a prize, a slot, money, an OJT placement)?

**5.3 How they find things today (5 min)**
6. Where do you look, and how often? Which pages, group chats, orgs, or friends? *(Ask to see a group chat or saved posts if comfortable; don't keep a copy.)*
7. How do you keep track of deadlines once you find one (screenshot, calendar, notes, nothing)?
8. Have you seen a fake or scam opportunity post? What made you suspicious?

**5.4 What a month looks like (2 min)**
9. In a normal month, how many opportunities do you actually act on?

**5.5 Concept and commitment (3 min): only now describe it**
> "It's a free site that lists tech opportunities for students (hackathons, CTFs, OJT, tech scholarships), each checked by a person against the organizer's page, with reminders before the deadline."

10. What would make you open it next week? What would make you not trust it?
11. **Commitment asks** (record yes/no): sign up now with the live link · save one listing today · share it with 2 classmates · a 5-minute follow-up in 2 weeks.

Log: `segment = F`. Pain codes: `MISSED-OPPORTUNITY`, `LATE-DISCOVERY`, `FOUND-VIA-FB`, `FOUND-VIA-ORG`, `FOUND-VIA-GC`, `SCAM-POST`, `NO-TRACKING`.

## 6. Student stories test (no code, not a gate)

Does student news bring students back? Test it by hand before building anything ([final decisions §1e](../research/final-decisions.md#1e-student-stories-and-wins-2026-10-30)).

- **Weeks 2–3:** write **3–4 short stories** about students who joined or won something a listing is about (a hackathon, a CTF, an OJT program, a scholarship). Example: "This PUP team won Hack4Gov regionals: here's how they found it."
- **Consent first:** get written consent (a filled-in [`story-consent.md`](templates/story-consent.md)) from every student named or pictured. Under 18: a parent or guardian signs too. No consent, no name, no photo: use the team or school name instead.
- **Sources:** the students themselves, or the school's or organizer's own public announcement (link to it). Never copy photos or posts from social media.
- **Post** each story on the pilot orgs' pages, with a link to the matching listing tagged with that org's `?ref=`.
- **Measure:** clicks and visitors from those links (Admin → Stats), plus one interview question: "Would you read stories like this on Oportune?"
- **Wins on listings is already built** (2026-10-30). Each story's team can also send their win from the listing page ("Sumali o nanalo kayo dito? Tell us"); approve it in Admin → Wins.
- **Result:** if the stories bring more visitors than the plain listing posts, most interviewees say yes, and teams send wins on their own, keep "Wins on listings" and promote it after "Continue". If not, hide the "Tell us" link and stop promoting it.

## 7. What we don't do during the sprint

- Build more features (`?ref=` links and "Wins on listings" are the only exceptions), redesign screens, or start the Android app.
- Sell anything, quote prices, or turn on ads.
- Collect anything about students that they didn't give us themselves (no scraping, ever).
- Add AI, scraping, or automated collection of any kind.
- Promote general scholarships as the headline: we lead with IT/CS ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).
- Collect any student data before the keys are rotated.
