# Action Plan — what we actually do next

Short version of everything decided so far. Details and reasons: [research/final-decisions.md](research/final-decisions.md) (latest: [§1c, after the court review](research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)). Update this page whenever a step is done.

## Where we are (2026-10-26)

| | Status |
|---|---|
| App | ✅ Built and working on our computer: Browse, filters, listing pages, save, reminders, share, submit, OJT checklist, admin. The filters, calendar, submit, and OJT checklist (built 2026-10-25) are not committed yet |
| Live link | ❌ Not deployed yet (nobody outside can open it) |
| Security | ❌ Supabase secret key and database password were pasted in chat; not rotated yet |
| Admin account | ❌ No admin yet, so nobody can open `/admin` |
| Content | ⚠️ 54 published, 25 drafts never reviewed; 52 of 79 listings have no fixed deadline; 63 of 79 sources aren't official `.gov.ph`/`.edu.ph`; no listing tagged for the filters |
| Daily jobs (auto-expire, reminders) | ❌ Never ran; they only run once deployed on Vercel |
| Email + captcha | ❌ Resend and Turnstile keys not set |
| Users | ❌ 1 (us) |
| Evidence | ❌ 0 student interviews, 0 orgs signed |

**The app isn't the problem now. Content, a live link, users, and evidence are.** A court-style review on 2026-10-26 voted 11–1 against spending more development time before that evidence exists ([verdict](../.court/20261026-012500/VERDICT.md)).

## Rules we keep

- **Feature freeze until 2026-11-25.** Allowed: security, config, deploy, bug fixes, content, and `?ref=` links. Nothing else gets built until the sprint passes.
- **Free for everyone. Always.** Nobody pays: not students, organizers, or schools ([§1d](research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26)).
- **Every listing is checked by a person** against its source before it's published. "Checked" means a person opened the source and confirmed the details on the date shown. AI may help later; it never decides.
- **The first screen keeps the promise:** dated listings first; undated ones say "Rolling: apply any time" or "Usually opens in <month>".
- **Link, don't scrape.** Facebook posts: public organizer pages only, summary in our own words, link back. No private groups, no copied photos or names.
- **Ads are the only income, and not yet.** No ads until after the soft launch has traffic; then only in marked "Ad" slots, with blocked categories (loans, gambling, fake scholarships). No sponsored or paid listings, ever.

## Do next: the 30-day validation sprint (2026-10-27 → 2026-11-25)

Full plan, pass lines, and kill criteria: [validation/06-30-day-validation-sprint.md](validation/06-30-day-validation-sprint.md).

### Week 1 (Oct 27 – Nov 2): switch it on, make the first screen honest
- [ ] Rotate the Supabase secret key and reset the database password ([launch checklist §2](launch-checklist.md#2-before-launch-security-do-first))
- [ ] Commit the Phase 2 work as it is
- [ ] Make our account admin: `npm run grant-role -- <email> admin`
- [ ] Review the 25 drafts (Admin → Re-check); publish only what's confirmed on the organizer's own page
- [ ] Reach **40+ open, dated listings** in hackathons, CTFs, OJT/internships, tech scholarships; rewrite undated summaries ("Rolling" / "Usually opens in <month>")
- [ ] Tag pilot listings: region, course group, year level (empty = open to all)
- [ ] Set Turnstile, Resend, real `VAPID_SUBJECT`; deploy on Vercel (free Hobby plan and `*.vercel.app` address are fine for the sprint)
- [x] `?ref=` links per org (built 2026-10-30; see Admin → Stats → "Where visitors came from")
- [x] Code fixes allowed by the freeze (2026-10-30): 18+ enforced on sign-up, save, and reminders; listings never checked now get flagged for re-check; "verified" copy replaced with "checked"; unused env vars removed
- [ ] Message 4–6 campus IT orgs (e.g. GDG on Campus PUP, MCC PUP, JPCS, AWS Cloud Clubs, MLSA); ask what they need first; goal: 2 yes
- [ ] Book the first 5 student interviews

### Week 2 (Nov 3 – 9): first org live
- [ ] Org 1 posts the link; we give the weekly "opportunity drop" in return
- [ ] 8 interviews done ([guide](validation/06-30-day-validation-sprint.md#5-interview-guide-itcs-students-segment-f-20-minutes))
- [ ] First 2 student stories, with written consent ([stories test](validation/06-30-day-validation-sprint.md#6-student-stories-test-no-code-not-a-gate))
- [ ] Daily 15-minute curation from a fixed list of 20–30 organizer pages (Facebook by linking, Devpost, MLH, CTFtime, Luma, GDG pages, DICT); log the time

### Week 3 (Nov 10 – 16): second org live
- [ ] Org 2 posts the link
- [ ] 15 interviews done in total; stories 3–4 posted
- [ ] Test push on real phones (Xiaomi, Oppo, Realme, Samsung, iPhone)

### Week 4 (Nov 17 – 25): decide
- [ ] Synthesis and the last scorecard row
- [ ] **Day-30 decision on 2026-11-25: Continue, Narrow, or Stop** ([criteria](validation/06-30-day-validation-sprint.md#4-day-30-decision)); record it in final decisions

## Only if the sprint says "Continue"

### Before the January 2027 soft launch
- [ ] Lawyer review (privacy, terms, NPC registration, minors) before 1,000 users ([launch checklist §5](launch-checklist.md#5-before-launch-legal-and-privacy-data-privacy-act))
- [ ] Domain, Google sign-in, custom SMTP ([launch checklist §3](launch-checklist.md#3-before-launch-accounts-and-services))
- [x] "Wins on listings" built 2026-10-30 (founder's call): students send wins from the listing page; curators approve them in Admin → Wins
- [ ] Unfreeze the other small builds one at a time, in the order students asked for them ([idea Part 3 §6.2b](idea/03-features-and-workflow.md#62b-next-small-builds-after-the-sprint-passes))
- [ ] Soft launch to the pilot orgs and more IT orgs; per org in 4 weeks: 100 sign-ups, 30% save at least one listing

### Pitch and money
- [ ] Pitch deck and 1-minute video using the sprint's real numbers ([docs/pitch/](pitch/))
- [ ] Apply: DICT Philippine Startup Challenge first
- [ ] Ads: only after the 12-week gate, when traffic covers Vercel Pro; follow the ad rules in [final decisions §1d](research/final-decisions.md#1d-money-free-for-everyone-ads-only-2026-10-26) and update `/privacy` first
