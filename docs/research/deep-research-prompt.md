# Deep Research Prompt — Final Validation of Oportune

Use this once, before the team switches to "build only" mode. Paste the prompt below into a deep-research tool (Claude Research, ChatGPT Deep Research, or Gemini Deep Research). Running it in **two different tools** and comparing the answers catches gaps and made-up sources.

**How to use the results**
1. Save each tool's report in `docs/research/` (e.g. `2026-11-validation-claude.md`).
2. Check every number that drives a decision against its source link. Discard claims without a source.
3. Fill in the "Final decisions" table at the end of the report with the team, then update [idea Part 5](../idea/05-validation-metrics-risks.md) and the [launch checklist](../launch-checklist.md).

---

## The prompt (copy everything inside the box)

```
ROLE
You are a senior product strategist and market researcher specializing in Philippine higher education, youth employment, and EdTech business models. Do deep, source-backed research. Prefer primary and official sources (CHED, PSA, DOST-SEI, DOLE, DICT, TESDA, BSP, NPC, UniFAST, World Bank, ADB, UNESCO, company filings) and recent reputable reporting. Cite every factual claim with a link and its publication date. If data is missing or older than 2023, say so plainly and give your best estimate with the method and a confidence level (High / Medium / Low). Never invent numbers, quotes, or sources.

CONTEXT: THE PRODUCT
Oportune is a free, phone-first web app (installable PWA) for college students in the Philippines, at any public or private school. Core loop: FIND verified opportunities -> SHARE them to group chats -> SAVE them -> GET REMINDED before deadlines.
Opportunity types: scholarships and financial aid, internships/OJT, entry-level graduate programs, hackathons and tech competitions, cybersecurity CTFs, free courses/certifications (incl. TESDA), student leadership/ambassador programs, events, research grants, device/connectivity grants.

Already built (MVP):
- Public listings without login, sorted by deadline; "Closing soon"; category filters; typo-tolerant search; social-post style feed
- Every listing is curated by a human from an official source, with the source link, a last-checked date, and an "Official .gov.ph / .edu.ph" badge; students can report wrong or scam listings
- Share to Messenger/Facebook with link previews
- Sign in (email link; Google ready), 3-step quick profile (school, field of study, year level, interests, 18+)
- Save, plus deadline reminders 7 days and 1 day before, by web push and email
- Admin panel: curation, CSV import, re-check queue, reports, anonymous analytics
- Strict privacy: minimal data, Data Privacy Act (RA 10173) draft notice, account deletion
Planned: Phase 2: application tracker, OJT requirements checklist (CMO 104), "For you" matching, private document uploads, AI helper ("explain in Taglish", "am I eligible?", writing help). Phase 3: Android app, "Share to Oportune" + submission form + curator inbox, Messenger/Telegram reminders.
Deliberately NOT doing: scraping Facebook/LinkedIn, charging students, payments (deferred).
Current data: ~79 curated listings; content skews to IT/tech and graduate-level scholarships.
Team: early-stage student/startup team, near-zero budget, free-tier infrastructure.

RESEARCH QUESTIONS
Answer every section. Use tables where asked. Be specific to the Philippines.

1. THE PROBLEM — is it real, and how big?
   a. How do Filipino college students currently discover scholarships, internships/OJT, competitions, and free courses? (Facebook pages/groups, school offices, Messenger group chats, TikTok, friends, job boards.) Quantify where possible.
   b. Evidence that students MISS opportunities or deadlines, fall for fake scholarship/job scams, or can't tell which ones fit them. Include NPC, DICT/CICC, PNP-ACG, or news data on student-targeted scams.
   c. Market size: number of HEI students (public vs private, by region, by discipline), first-year entrants, graduating students per year, OJT-required programs (CMO 104). Build a TAM / SAM / SOM for a free student app, showing your math.
   d. Supply side: roughly how many scholarship programs (national government, LGU, private/corporate, foundation), internships, and competitions open to PH students exist per year? Who publishes them and where?
   e. Rank the problems by severity and frequency for students (top 5), with evidence.

2. THE USERS — who needs this most?
   a. Segments (e.g., state university students in provinces, private university students, scholarship-dependent students, IT/CS students, OJT-season 3rd-4th years, first-generation college students). For each: size, main need, where they spend time online, device and data constraints, and willingness to sign up.
   b. Mobile, data, and platform reality: smartphone ownership, prepaid data costs, Messenger/Facebook/TikTok usage among Filipino 18-24 year olds, email usage, web push support on common Android phones.
   c. Which segment should be the beachhead for the first 6 months, and why?

3. COMPETITION AND DIFFERENTIATION
   a. Map every alternative: PH platforms (e.g., Edukasyon.ph, Kalibrr, JobStreet, Indeed PH, Prosple PH, LinkedIn, scholarship listing sites/blogs, government portals like UniFAST/DOST-SEI/CHED), large Facebook pages/groups, school career offices, and international models (Handshake, Unstop, Devpost, Fastweb, Bold.org, ScholarshipOwl, Prosple, Jobteaser).
   b. Comparison table: target user, opportunity types covered, verification/trust, reminders, mobile experience, price to student, business model, traction (users, funding), weaknesses.
   c. Which of Oportune's features are truly differentiating, which are table stakes, and which are easy to copy? Be blunt.
   d. What would make a student switch from Facebook groups to Oportune and keep coming back? What would make them stop?
   e. Gaps in the market nobody serves well that Oportune could own.

4. FEATURE VALIDATION — what's missing, what's extra?
   For each feature below, give: evidence of student need, priority (Must / Should / Later / Drop), and what to measure.
   Built: browse without login; deadline sorting and Closing soon; official-site badge and last-checked date; report button; share to Messenger; quick profile; save; push + email reminders; social-post feed; installable app.
   Planned: application tracker; OJT checklist; "For you" matching; document uploads; AI helper (Taglish explain, eligibility check, writing help); Android app; student link submissions; organizer submissions; Messenger/Telegram reminders.
   Then list up to 10 features we have NOT considered that evidence says students want (e.g., eligibility filters by region/course/income, requirement checklists per scholarship, application status from providers, alumni tips, mock interviews), each with evidence and effort (S/M/L).

5. TIMING, RELEVANCE, AND LONGEVITY
   a. Why now? Relevant trends 2023-2026: free tuition law (RA 10931) and UniFAST, TES/Tulong Dunong changes, K-12 graduates entering college, OJT/CMO 104 updates, remote internships, AI in hiring, cybersecurity talent push, DICT/DOST programs, internet penetration.
   b. Seasonality: map the PH academic calendar and the typical months when scholarships, OJT placements, graduate programs, and competitions open and close. When should Oportune launch and run its biggest pushes?
   c. Will this still be needed in 5 and 10 years? Consider AI search/assistants answering "what scholarships can I get?", platform shifts (Facebook decline, TikTok search), government digitization (e.g., a central scholarship portal), and demographic trends. What must Oportune become to stay relevant?
   d. Threats: what could make Oportune unnecessary (e.g., a strong government portal, a big platform adding this)?

6. MONEY — can this make money without charging students?
   a. Evaluate each model for the Philippine market: sponsored/featured listings for organizers, employer internship postings (pay per post or subscription), university/HEI partnerships (career office tools, analytics), LGU/government contracts for scholarship outreach, foundation/CSR partnerships, brand sponsorships targeting students, affiliate partnerships with course providers, anonymized aggregate insights, grants (DOST, DICT, Startup QC, international EdTech funds), and a premium tier.
   b. For each: who pays, realistic price points in PHP with comparable examples, sales cycle, effort, risks (trust, Data Privacy Act, conflict of interest with "verified" listings), and Year 1-3 revenue potential.
   c. Unit economics: estimate running costs per 1,000 / 10,000 / 100,000 monthly active students on free/low tiers (hosting, database, email, push), and the break-even point.
   d. Recommend the 1-2 best monetization paths and the earliest moment to start them without hurting trust.
   e. What traction milestones do PH investors, accelerators, and grant programs expect at pre-seed and seed for EdTech?

7. LEGAL AND TRUST CHECK (brief)
   Confirm what the team must do before launch under the Data Privacy Act (registration, DPO, consent for education data as sensitive personal information, minors 17 and under), rules for listing third-party opportunities (copyright, summarizing, linking), and any regulation for job/internship platforms (DOLE) or scholarship intermediaries. Flag only what changes our plans.

8. RISKS AND KILL CRITERIA
   Top 10 risks (market, content supply, curation workload, trust, legal, funding, team). For each: likelihood, impact, early warning signal, mitigation. Then give clear "stop / pivot" criteria with numbers (e.g., if weekly active students < X after Y weeks of launch).

9. VALIDATION PLAN BEFORE AND RIGHT AFTER LAUNCH
   The cheapest tests that would confirm or kill our riskiest assumptions in 4-6 weeks (e.g., landing page + Messenger channel, 20 student interviews, school career office calls, a pilot with 2 student orgs). Include target numbers, sample interview questions, and what result means go / adjust / stop.

REQUIRED OUTPUT FORMAT
1. Executive summary (max 300 words): Is Oportune worth building as planned? Answer YES / YES WITH CHANGES / NO, and why.
2. One section per research question above, each ending with "So what for Oportune" (2-4 bullets).
3. Tables: competitor comparison; feature priority (Must/Should/Later/Drop); monetization comparison; risk register; seasonality calendar.
4. "What to build next" — the top 5 things in order, with the reason and the metric that proves each worked.
5. "What NOT to build" — features or ideas to drop, with reasons.
6. FINAL DECISIONS table for the team to confirm:
   | Decision | Recommendation | Evidence (link) | Confidence |
   Cover at least: target beachhead segment; launch timing; positioning statement (one sentence); top 3 differentiators; Must features for launch; first monetization path and when; key metrics and targets for the first 90 days; stop/pivot thresholds.
7. Sources: numbered list with title, publisher, date, link. Mark any source older than 2023.
8. Open questions you could not answer and how the team can find out.

Write in clear, plain English. Use PHP for money. Be critical; we want the truth, not encouragement.
```

---

## Tips
- **If the tool asks clarifying questions,** answer: "Philippines nationwide; college students of all courses; free for students; focus on decisions for the next 12 months."
- **If the report is too general,** follow up with: "Go deeper on section [N] with Philippine-specific numbers and sources from 2024–2026."
- **Run a second pass on money only** if section 6 is weak: "Find 5 real Philippine or Southeast Asian examples of companies paying to reach college students, with prices."
- Don't paste API keys, passwords, student data, or the `.env.local` file into any research tool.
