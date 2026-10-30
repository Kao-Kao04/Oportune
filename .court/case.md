Keep investing development time in Oportune, my existing "personalized opportunity radar" web app that helps students in the Philippines discover scholarships, hackathons, CTFs, cybersecurity events, fellowships and student programs they would otherwise miss.

# The case, as the founder describes it

Oportune is an opportunity-discovery platform. Thesis: opportunities are scattered across websites, community pages, social media posts and organizational announcements; users need one reliable place to discover them, understand eligibility, and know when to apply. It aims to be a personalized opportunity radar, not just another directory. Initial market: the Philippines, especially students, university communities, aspiring cybersecurity professionals and developers.

Constraints the founder states as design decisions:
- Facebook must not be scraped in ways that violate platform terms or access restrictions.
- AI should assist curation and extraction, never blindly publish unverified information.
- Listings must be accurate, relevant and trustworthy; expired, duplicate, misleading or low-quality listings undermine trust.
- Some events recur annually, so recurring-event tracking and reminders may be needed.
- Advertising and paid listings must not be assumed viable without evidence.
- It must be operable with limited starting capital and a small team.
- The existing implementation should be evaluated before proposing a rebuild.

The founder explicitly asks the court to weigh: whether students truly struggle to find opportunities or existing channels suffice; whether discovery is frequent/urgent enough for recurring use; whether users would return to a standalone platform instead of Facebook groups, Discord, university orgs, newsletters or directories; whether the market is too fragmented to curate; whether users will trust a new platform; retention, network effects and acquisition cost; whether it can make money in the Philippines and whether organizations would pay (promoted listings, organization subscriptions, institutional partnerships, premium user features, recruitment/talent services, curated advertising); whether search engines, social platforms, universities or established platforms could copy it; whether keeping listings fresh is an unsustainable burden; whether a narrow niche (e.g. cybersecurity/IT students) beats a general platform; and what the smallest product worth testing, first monetization experiment, 30-day validation plan and kill criteria should be. The founder asked for brutal honesty, with no favorable verdict just because the project exists and no rejection just because it is early.

The founder would like these perspectives represented: a budget-conscious Filipino college student, a scholarship seeker, a cybersecurity learner looking for CTFs, a student-org officer, an event organizer deciding whether to pay for promotion, a university administrator, a growth/distribution specialist, a SaaS operator, a skeptical investor, a competing platform, a retention-focused product designer, and a technical operator responsible for data quality.

# The team's own written plan (from the repository docs, dated 2026-10-25/26)

- Positioning: "Never miss a deadline for verified student opportunities." The radar, not an application platform: it links students to the official page (which may be iSkolar, JobStreet etc.).
- Beachhead: 3rd/4th-year IT/CS/IS students; pilot with 2 campus IT orgs (e.g. GDG on Campus, JPCS, AWS Cloud Clubs, Microsoft Learn Student Ambassadors). Vision: every student from Junior High to PhD, expanded in rings.
- Launch: soft launch January 2027 (OJT season), big push July 2027 (scholarship season).
- Differentiators claimed: verified listings (official source + last-checked date), deadline reminders, easy sharing to group chats.
- Sourcing: "Link, don't scrape." A person finds a public organizer post (mostly on Facebook), writes a summary, links back. Daily 15-minute routine checking 20-30 organizer pages. Planned: "Share to Oportune" from phone, paste-to-draft for curators, org members as volunteer "scouts".
- AI: only to assist curators later (extract details, flag scam signs); a person always publishes. Not built.
- Money: "Free for students. Always." Year 1: grants and competitions (DICT Philippine Startup Challenge first; Startup QC PHP 15,000-35,000 student category; DICT Startup Grant Fund PHP 500,000-1,000,000 after business registration). Year 2: sponsored listings at PHP 500-1,500, labeled and curator-checked. No ad networks. The PHP 500-1,500 price comes from a desk-research report, not from any organizer.
- 90-day targets after soft launch (set by the team, marked low confidence): 1,000 signed-up students; WAU/MAU >= 25%; >= 30% save something; >= 10% of new listings from submissions. Their own pivot rule: pivot if weekly active students < 300 after 12 weeks, or < 20% return in week 4.
- Legal: positioned as a free listing board that never recruits/places students (to stay outside DOLE recruitment licensing). Education data may be sensitive personal information under RA 10173; NPC registration may be required at 1,000+ users; lawyer review planned before 1,000 users. Under-18 users browse only.
- Org partnership offer: free weekly "opportunity drop" content, free event listings, talks, volunteer scout roles, in exchange for a post, a demo slot, submissions and 5-10 member interviews. No money asked.
- Team's own status line (docs/action-plan.md, 2026-10-26): "The app isn't the problem now. Content, a live link, and users are." Rule: "Don't build more features until steps 1-3 [admin/content/deploy] are done."

# Evidence of demand and traction (as of 2026-10-26)

- Users: 1 (the founder). Not deployed; no public URL; no domain bought.
- Customer interviews: an interview guide and an interview-log template exist; the log is empty (zero interviews recorded).
- No organizer, university, org or sponsor has been asked to pay or has agreed to anything. No partnerships.
- Desk research (two AI-generated deep-research reports in the repo) states that Facebook groups are the main channel and "the actual main competitor", with high scam prevalence; no primary survey backs how students find opportunities.
- Project age: first commit 2026-10-23; 26 commits by one git author over about 3 days.

# Codebase audit (read-only, verified in the repository)

Stack: Next.js 16, React 19, Supabase (Postgres + auth + row-level security), Vercel cron, web-push, Resend email. About 8,300 lines in src/, 21 pages, 8 API routes, 10 SQL migrations, 71 unit-test blocks (pure functions; no database or RLS tests).

Built and committed:
- Browse feed without login, "closing soon" (within 7 days), category filter, full-text search; listings whose dated deadline has passed are hidden.
- Listing page with official-source badge (.gov.ph/.edu.ph), "last checked by our team" date, official-link click tracking, share button, report-a-problem form (captcha, rate limit, honeypot).
- Sign-in by email link (Google OAuth wired but not configured), short profile (school, course, year level, interests, 18+ flag), save listings, account deletion.
- Reminders 7 days and 1 day before deadline for saved, dated listings, by web push and email, with dedup and one-click unsubscribe. Daily jobs: auto-expire past-deadline listings, send reminders, cleanup. The jobs have never run (they only run once deployed).
- Admin panel for curators: listings, CSV import as drafts with diffs, re-check queue (rolling/TBA listings not checked in 30 days), reports queue, user roles, stats. Database blocks publishing anything flagged needs-check. Audit log of curator actions. Analytics events (views, official clicks, shares, saves).
- RLS enabled on every table; anonymous users read only a published/expired view.

Built but uncommitted (made 2026-10-25): eligibility filters (region, course group, year level; empty = open to all), add-to-calendar (.ics + Google Calendar link), public "Submit an opportunity" form (sign-in required, captcha, 10/day limit) with a curator review queue, OJT requirements checklist (CHED CMO 104; stored in browser only).

Not found in the code: recurring/annual event tracking ("remind me when it opens" is only planned), automated link checking, any AI/LLM use, any scraping, automatic duplicate detection for submissions (duplicates handled manually; DB unique on source URL + title), personalized "For you" recommendations, weekly digest, Messenger/Telegram reminders, mobile app.

Content: 79 curated listings in a spreadsheet; 54 marked ready (published locally), 25 drafts never reviewed. By category: scholarships 21, hackathons 11, internship/OJT 11, courses 11, CTFs 10, entry-level jobs 7, research grants 3, leadership 3, events 2. 52 of 79 have no fixed date (TBA or rolling). Source trust: 63 "other", 13 official government, 3 official school. No listing yet tagged for the eligibility filters. No admin account created yet.

Open operational items from the team's launch checklist: rotate the Supabase secret key and reset the database password (both noted as "pasted in chat"); set up email, captcha and domain; test push on Xiaomi/Oppo/Realme/iPhone; lawyer/DPO/NPC review not done.

# Market and competitive facts (web research 2026-10-26; [V] verified on source, [S] secondary/snippet, [U] unverified)

Philippine alternatives:
- Facebook scholarship pages, free: Scholarships PH ~639K followers, Philippine Scholar ~458K (also runs philscholar.com with a 2026 scholarship guide), Philippines Scholarship ~81K, Colleges PH ~75K, plus LGU pages (e.g. Muntinlupa Scholarship Division ~166K) [S].
- Edukasyon.ph: Manila edtech with school/scholarship search; raised a Series A (second close Sept 2020) [V]; Dealroom says $3.37M total and that it moved toward B2B, courses and K-12 tutoring [S]. Prosple runs university career portals in PH (internships/graduate jobs) [S]. Government portals (DOST-SEI, UniFAST, CHED) are free and authoritative.
- DOST-SEI undergraduate scholarship 2025: 84,518 examinees, 10,907 qualified [V]; reported 97,617 applicants for 2026 with ~8,500 slots [S]. UniFAST TES: 210,202 grantees SY 2023-24 [S].
- No dedicated Philippine hackathon directory found [U]; PH hackathons appear on Luma, GDG community.dev pages, DEVCON, and Facebook [S].
- Cybersecurity/CTF: CTFtime 2025 Philippines page lists 4 ranked teams [V]; CTFtime upcoming-2026 list shows 37 events, none PH-organized [V]. DICT Hack4Gov student CTF with regional qualifiers, 20-team national finals Dec 2025 [V]. A university CTF tournament for 16 universities in Oct 2025 [S]. ROOTCON 20, Sept 2026 [S].

Global analogues:
- Opportunity Desk (Nigeria, since 2012): free to readers, earns from paid promotion, prices on request [V]; self-reports 500K-1M monthly views [S]. Opportunities for Youth self-reports 5M+ yearly visitors [S].
- Unstop (India): raised $5M in 2023 [V]; FY24 revenue ~INR 21.9 crore reported [S]; organizer pricing quote-only. Devpost: organizer pricing not public; reportedly free for student-run events [S]. MLH funded by corporate partners [S]. CTFtime: free, community-run.
- Fastweb (US scholarships) sold during Monster's 2025 bankruptcy [S]; Going Merry (scholarship app, acquired by Earnest 2021) closed March 2026 [S]; Scholly acquired by Sallie Mae 2023, founder later sued alleging student data was sold (denied) [V].

Philippine context:
- About 5.14M higher-education students AY 2023-24 (CHED via secondary source) [S].
- 98.0M internet users (83.8%); Facebook ad reach 95.8M; Messenger 65.8M (DataReportal 2026) [V].
- No Philippine survey on how students find scholarships was found [U]. One study: 92.5% of 483 Filipino undergraduates read the Facebook news feed [S].
- Meta's Automated Data Collection Terms prohibit automated collection without written permission [S]; case law mixed.

Willingness to pay:
- No published rate cards or evidence that Philippine student orgs, universities or organizers pay for event promotion [U].
- Comparable organizer tools: Luma free for free events, Luma Plus $59/month [V]; Meetup from $29.99/month [S]. Philippine Facebook CPM reported around $1.35 (third-party benchmark) [S].
