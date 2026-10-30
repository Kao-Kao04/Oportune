# Final Decisions (after deep research)

Agreed 2026-10-25 after reviewing two deep-research reports in this folder:
[PH EdTech App Market Research](PH%20EdTech%20App%20Market%20Research.md) (market, features, money) and
[Philippine Tech Education Research](Philippine%20Tech%20Education%20Research.md) (OJT rules, scholarships, grants, privacy, regions).

From here on the team builds against this page. Change a decision only with new evidence, and record it here.

## 1. Decisions

| Decision | What we do | Confidence |
|---|---|---|
| Beachhead | 3rd/4th-year IT/CS/IS students; pilot with 2 campus IT orgs | Medium |
| Launch | Soft launch January 2027 (OJT season); big push July 2027 (scholarship season) | Medium |
| Positioning | ~~"Never miss a deadline for verified student opportunities."~~ Replaced in [§1c](#1c-updates-after-the-court-review-2026-10-26) | Medium |
| Differentiators | Checked listings (source link + last-checked date; official badge for `.gov.ph`/`.edu.ph`) · deadline reminders · easy sharing to group chats | Medium |
| Drop / defer | AI helper, document uploads, application tracker: not before the pilot proves demand | High |
| Build next, in order | 1) Eligibility filters: region, course group, year level · 2) Add to calendar (.ics) · 3) "Submit an opportunity" form + curator queue · 4) OJT checklist (CMO 104) · 5) Region tags on listings (part of 1) | High |
| Reminders | Push first; email stays as a fallback the student can turn off. Move to Resend Pro once sends pass 100/day | Medium |
| Money | ~~Sponsored listings in Year 2~~ Replaced in [§1d](#1d-money-free-for-everyone-ads-only-2026-10-26): free for everyone; ads are the only income; grants fund the start | Medium |
| 90-day targets | 1,000 signed-up students · WAU/MAU ≥ 25% · ≥ 30% of signed-up students save something · ≥ 10% of new listings come from submissions | Low (set by us, adjust after 4 weeks) |
| Stop / pivot | First gate: the [30-day sprint](../validation/06-30-day-validation-sprint.md#4-day-30-decision) (ends 2026-11-25). Second gate, after the January soft launch: pivot if weekly active students < 300 after 12 weeks of campus promotion, or < 20% of students return in week 4 | Low |
| Legal position | A free directory/listing board: we never recruit, screen, place, or charge students (stays outside DOLE private-recruitment rules). Lawyer review before 1,000 users (see §2.4) | Medium |

## 1b. Updates agreed 2026-10-26

| Topic | Decision | Why |
|---|---|---|
| **Vision vs launch** | **Vision:** every student (Junior High, Senior High, College, Masters/PhD) finds every opportunity in one place, but *only sees what fits them*. **Launch:** college, with IT/CS as the pilot. Expand in rings: (1) college IT/CS pilot → (2) all college + Grade 12 before July 2027 → (3) Masters/PhD → (4) Junior/Senior High after a lawyer review for minors | "Everything for everyone" on day one is noise for each student and too much for our curators |
| **Education level** | Add an education level (JHS / SHS / College / Graduate) to the profile, listing tags, and Browse filters, so later rings need content, not code. **On hold since §1c:** not built until the sprint passes | Makes "all-in-one" work: one mall, many floors |
| **Minors** | Under 18 can browse and share without an account. Sign-up, save, and reminders stay 18+ until a lawyer approves a guardian-consent flow | Data Privacy Act rules for minors |
| **Positioning vs niche platforms** | We're the **radar**, not the application platform: we tell students what's open, what fits, when it closes, and whether it's real, then send them to the official page (which may be iSkolar, JobStreet, etc.). Don't compete on their turf; they can be partners | Niche platforms go deep on one type (applications, matching, employers). Our edge is discovery + trust + deadlines across types |
| **Facebook as a source** | **Link, don't scrape.** A person finds a public post by the organizer, writes a short summary in our own words, and links back to the post (source) and the registration form (Apply). No automated collection, no private groups, no copied photos or people's names | Most PH hackathons are posted on Facebook. Linking is fine; scraping breaks Meta's terms and the Data Privacy Act risk is high |
| **Getting Facebook posts in fast** | (1) "Share to Oportune" from the phone's share menu (installed web app on Android; iPhone uses copy-paste into `/submit`) · (2) paste-to-draft for curators: paste the post text, the app pulls out dates and links · (3) org members as "scouts" with credit | The bottleneck isn't the link, it's someone noticing the post and adding it quickly |
| **AI** | AI **assists curators**, never decides: pulls out details and flags scam signs (asks for fees/GCash, OTP or ID, shortened or look-alike links, impossible dates). A curator always checks the source and publishes. Add it when submissions outgrow manual review; it needs an API key and a monthly budget | AI can't prove a post is real and can be fooled; "checked by our team" is our main promise |
| **Ads** | ~~No ad networks; sponsored listings only.~~ Reversed in [§1d](#1d-money-free-for-everyone-ads-only-2026-10-26): ads are the only income, under strict rules | The trust and speed risks noted here still apply; §1d turns them into rules |
| **Org partnerships** | We give: weekly ready-to-post "opportunity drop", free listing of their events, a talk (opportunities/scams or "how we built it"), volunteer curator/scout roles. We ask: one post, a 5-minute demo slot, their events via `/submit`, 5–10 member interviews. Ask what they need first. No money, no member data, no logos without written permission | Officers need content, attendees, and member value; we need users and supply |
| **Retention ideas (next)** | "Remind me when it opens" on TBA/closed listings (most programs repeat yearly) · weekly digest by push/email · hide categories with too little content (entry-level jobs, leadership, hardware grants) until filled. **On hold since §1c:** none of these get built before the 30-day sprint passes | Half the feed has no fixed deadline; students need a reason to come back weekly |

## 1c. Updates after the court review (2026-10-26)

An adversarial review ("court": prosecutor, defense, 12 independent jurors, judge) voted **11–1 against "keep investing development time"** as the plan stood. Full record: `.court/20261026-012500/VERDICT.md`. The jurors agreed the app is sound; what's missing is evidence. These decisions replace anything older that disagrees.

| Topic | Decision | Why (what the jurors said) |
|---|---|---|
| **Feature freeze** | No new features until the [30-day validation sprint](../validation/06-30-day-validation-sprint.md) ends (2026-11-25) and passes. Allowed: security, config, deploy, bug fixes, content, and `?ref=` links so we know which org brought which visitors. **Update 2026-10-30:** the founder also chose to build "Wins on listings" now ([§1e](#1e-student-stories-and-wins-2026-10-30)); nothing else | 8 of 12 jurors: four features were built on 2026-10-25 while the app had never gone live, against our own "don't build more features" rule |
| **Phase 2 work** | The four features built 2026-10-25 (filters, calendar, submit, OJT checklist) stay as they are: commit them, don't extend them | Already built; polishing them is more building |
| **Evidence first** | Until the sprint ends, every week has a number: interviews done, orgs signed, sign-ups, returns. A week with only code is a week lost | 6 of 12 jurors: 1 user (us), 0 interviews |
| **Promise vs content** | The first screen must keep the promise. Pilot target: **40+ open, dated listings** in hackathons, CTFs, OJT/internships, and tech scholarships. A listing with no fixed date must say why at the start of its summary: "Rolling: apply any time", "Usually opens in <month> (based on <year>)", "Open now; no closing date listed", or "Not announced yet" (done for all 52 on 2026-10-30). Undated listings never fill the top of Browse | 5 of 12 jurors: 52 of 79 listings had no fixed date, so "never miss a deadline" broke on the first screen |
| **What "verified" means** | We say **"checked"**, and define it everywhere: *a person opened the source and confirmed the details on the date shown.* The **official badge** stays only for `.gov.ph` / `.edu.ph` sources. Pitches and posts don't say "verified" without that definition. Prefer the organizer's own page as the source; a re-post is a lead, not a source | The Lawyer and the Designer: "verified" over 63 of 79 non-official sources is a misrepresentation risk |
| **Positioning line** | "**Never miss a deadline.** Student opportunities in tech, each one checked by a person against its source." (Replaces "verified student opportunities.") | Same as above; narrower and true today |
| **Pilot niche** | The pilot leads with **IT/CS hackathons, CTFs, OJT, and tech scholarships**. General scholarships stay in the feed but are not the pitch: big free Facebook pages (Scholarships PH ≈ 639K followers) already cover them | The Competitor: a new site can't out-post a 639K-follower page; the IT/CS niche has no PH directory |
| **Money** | ~~Test a sponsored-listing price with organizers during the sprint.~~ Dropped the same day by the founder: see [§1d](#1d-money-free-for-everyone-ads-only-2026-10-26). No price test, no organizer sales | The Accountant and Investor wanted evidence that someone would pay; the founder chose not to charge anyone. Money now depends on ad income, which needs traffic first |
| **Security before launch** | Rotate the Supabase secret key and reset the database password **before** deploying or collecting any student data | The Parent and the Lawyer (the one Not Guilty vote was conditional on this) |
| **Legal before scale** | Lawyer/NPC review stays required before 1,000 users. Never move into arranging placements: we link out only | The Lawyer's flip condition |
| **Kill criteria** | Two gates: the **30-day sprint** gate ([criteria](../validation/06-30-day-validation-sprint.md#4-day-30-decision)) and, if it passes, the existing **12-week** rule after the January soft launch (§1, Stop / pivot) | The Statistician: a 12-week usage rule alone can't trigger until April 2027 and doesn't test pain |

## 1d. Money: free for everyone, ads only (2026-10-26)

Founder decision, after §1c. It replaces every earlier plan for sponsored listings, organizer pricing, and the sprint's price test.

| Topic | Decision |
|---|---|
| **Nobody pays to use Oportune** | Not students, not organizers, not schools, not orgs. No sponsored or featured listings, no paid ranking, no subscriptions, no premium features, no recruitment or placement fees. Listing an opportunity is always free |
| **Ads are the only income** | Ads appear only in clearly marked "Ad" slots, separate from listings. An ad never changes what is listed, how it ranks, or whether it's checked. Advertisers can't buy a listing |
| **Grants** | Startup grants and competitions (§3) still fund the start: they're funding for the team, not a payment for using Oportune |
| **When ads start** | **Not during the sprint, not before traffic.** The free Vercel Hobby plan forbids ads ([fair use](https://vercel.com/docs/limits/fair-use-guidelines)); Pro is about $20/month per member. Turn ads on only after the soft launch passes the 12-week gate, and only when expected ad income covers Vercel Pro. Ad income at small traffic is small, so plan costs around free tiers and grants until then |
| **Ad safety rules** | Block these ad categories: loans and lending apps, gambling, crypto and "investment" offers, dating, MLM, and any scholarship, "assistance", or job offer (these look like listings and are the scam types we warn about). One ad slot per screen at most; none on sign-in, welcome, Me, Submit, Saved, admin pages, or in reminders (push/email). Lazy-load ads so pages stay light on prepaid data |
| **Privacy** | Ad networks use cookies and may profile visitors. Before ads go live: update `/privacy` and `/terms`, show non-personalized ads by default, and include ads in the lawyer/NPC review. Never pass profile data (school, course, year) to an ad network |
| **Reporting ads** | Students can report a bad ad the same way they report a listing; a curator blocks that advertiser or category |
| **Pitch line** | "Free for everyone. Funded by grants now, by clearly marked ads later." |

## 1e. Student stories and wins (2026-10-30)

The founder wants student news in the feed, so students see people like them winning and know the feed is alive. Agreed:

| Topic | Decision | Why |
|---|---|---|
| **No scraping of students, ever** | We never collect students' names, photos, posts, or achievements automatically, from Facebook, LinkedIn, school sites, or anywhere else | Data Privacy Act (bulk personal data without consent, some students are minors), Meta's terms, and our "checked by a person" promise |
| **Stories test, during the sprint (no code)** | Write **3–4 short stories** in November ("This team won Hack4Gov: here's how they found it"), each with the students' **written consent**. Post them on the pilot orgs' pages with a `?ref=` link to the matching listings. Count clicks and sign-ups, and ask in interviews whether students would read more. Rules: [sprint §6](../validation/06-30-day-validation-sprint.md#6-student-stories-test-no-code-not-a-gate) | Cheap way to learn if stories bring students back, before building anything |
| **Wins on listings: built 2026-10-30** | The founder chose to build it now instead of after "Continue" (a second exception to the §1c freeze, made knowingly). A signed-in 18+ student sends "we joined / placed / won" from the listing (`/opportunities/<slug>/win`), with a consent checkbox; a curator confirms it on the organizer's or school's own announcement, writes a one-line headline in our own words (Admin → Wins), and it shows on that listing ("🏆 PUP team placed 2nd"). Team or school names only | Keeps Oportune a radar: wins sit on listings and lead back to opportunities. The stories test now also tells us whether anyone uses it |
| **Not a LinkedIn-style social feed** | No public student profiles or open posting. Revisit only if students send **10+ wins in a month without being asked** | Empty feed with no audience, months of building, heavy moderation, and the trust promise breaks if anyone can post |
| **What a story may show** | Team or school name always; a student's name or photo only with their written consent (and a parent's if under 18). Prefer linking to the school's or organizer's own announcement | Consent first; official sources first |

## 2. Verified facts we rely on

### 2.1 OJT rules (for the checklist)
- **CMO 104 s. 2017, Section 16.1:** a student intern must (1) be officially enrolled in a legitimate PH HEI, (2) be enrolled in an internship subject, (3) be at least 18 years old at the start of the internship, (4) pass the pre-internship requirements of the program, (5) submit a medical certificate (physical and psychological exam by a DOH-accredited clinic or hospital) plus any medical tests the host asks for, and (6) have a notarized written consent from a parent or legal guardian, with no waiver. Quoted in the [UPLB OVCSA intern guidelines](https://uplbosa.org/download/ovcsa-intern-guidelines). The official PDF ([UP OFA copy](https://ofa.upd.edu.ph/wp-content/uploads/2018/04/CMO-No.104-S.2017.pdf)) is a scan; read it directly before launch.
- **MOA, internship plan, and orientation** between school and host are standard under CMO 104 ([UP Diliman OFA guideline](https://ofa.upd.edu.ph/wp-content/uploads/2022/06/Guidelines-on-Practicum_Internship-Program-1A-revised.docx.pdf)).
- **Hours:** BSIT and BSIS 486 hours, BSCS 162 hours (CMO 25 s. 2015). Only secondary sources so far (UA&P, SchoolFinderPH): medium confidence. Schools may require more.
- **Onsite:** CMO 4 s. 2023 says OJT is mainly onsite; remote only if the host itself works remotely. **Abroad:** CMO 10 s. 2023 (SIAP).
- Not verified: "max 6 extra units during OJT" (SchoolFinderPH only). Leave it out.

### 2.2 Regions (for region tags)
18 regions, including the **Negros Island Region (NIR)** created by RA 12000 (2024): Negros Occidental, Negros Oriental, Siquijor. Store as our own short codes, not PSGC numbers.

### 2.3 The "35.6%" figure
It is the **share of unemployed people who are college graduates** (35.6% in December 2024 → 38.2% mid-2025), cited in [House Bill 11025](https://docs.congress.hrep.online/legisdocs/basic_20/HB11025.pdf). It is **not** an unemployment rate. Safe wording for pitches: "about 1 in 3 unemployed Filipinos is a college graduate." Check the PSA Labor Force Survey table before using it in a grant application.

### 2.4 Data Privacy Act
- NPC Circular 2022-04 makes registration mandatory when an organization processes **sensitive personal information of 1,000+ people** (also: 250+ employees, or risky processing).
- RA 10173 counts a person's **education** as sensitive personal information, so our profile (school, course, year level) may count. **Ask a lawyer before we reach 1,000 users.**
- Below the threshold, organizations may still need to file a sworn declaration in the NPC Registration System (secondary source; confirm with the lawyer).
- A "For you" feature that ranks listings from the profile may count as profiling. Keep it rule-based, explain it, and include it in the lawyer review.

### 2.5 Infrastructure costs (checked 2026-10-25)
- [Supabase Free](https://supabase.com/pricing): 500 MB database, 1 GB storage, 50,000 monthly active users (signed-in users only; browsing without login doesn't count). 500 MB is plenty for listings, so we **don't** delete expired listings (they keep links and saves working).
- [Resend Free](https://resend.com/pricing): 3,000 emails/month, **100/day**. Pro is $20/month for 50,000 with no daily limit. The daily cap is the first limit we'll hit.

### 2.6 Market and competitors (web check 2026-10-26)
✅ = confirmed on the source page; ⚠️ = search snippet or third-party estimate, check before quoting in a pitch.
- **Facebook scholarship pages are the incumbent, and free:** Scholarships PH ≈ 639K followers, Philippine Scholar ≈ 458K (also runs philscholar.com), Philippines Scholarship ≈ 81K, LGU pages such as Muntinlupa Scholarship Division ≈ 166K ⚠️.
- **No dedicated PH hackathon directory found.** PH hackathons appear on Luma, GDG community.dev pages, DEVCON, and Facebook ⚠️.
- **PH CTF scene is small:** CTFtime 2025 lists 4 ranked PH teams ✅ ([stats](https://ctftime.org/stats/2025/PH)); the upcoming-2026 list showed 37 events, none PH-organized ✅. Local anchors: DICT Hack4Gov (student CTF, 20-team national finals Dec 2025) ✅, ROOTCON ⚠️, university CTF tournaments ⚠️. The niche is open, but small: count CTFs as a hook for the IT/CS pilot, not a market by itself.
- **DOST-SEI undergraduate scholarship 2025:** 84,518 examinees, 10,907 qualified ✅ ([Summit Express](https://www.thesummitexpress.com/2025/06/10907-pass-2025-dost-scholarship-exam.html)).
- **Analogues:** Opportunity Desk (Nigeria, since 2012) is free to readers and earns from paid promotion, prices on request ✅ ([about](https://opportunitydesk.org/about/)). Unstop (India) raised $5M in 2023 ✅; organizer pricing is quote-only. Going Merry (US scholarships) closed March 2026 ⚠️; Fastweb was sold in Monster's 2025 bankruptcy ⚠️.
- **Willingness to pay:** no published evidence that PH student orgs, schools, or organizers pay for event promotion. Organizers can already reach students cheaply: Luma is free for free events ✅ ([pricing](https://luma.com/pricing)); PH Facebook CPM is reported around $1.35 ⚠️. This is why §1c tests the price before planning on it.
- **Reach:** 98.0M internet users (83.8%), Facebook ad reach 95.8M, Messenger 65.8M ✅ ([DataReportal 2026](https://datareportal.com/reports/digital-2026-philippines)). No PH survey on how students find scholarships was found: our own interviews are the only source.

## 3. Funding to apply for (Year 1)

| Program | Amount | Fit for us | Notes |
|---|---|---|---|
| DICT Philippine Startup Challenge | Mentorship, fast-track to DICT funding | **Best first step**: for student teams, ideation to MVP | Video pitch + deck; check the next cycle on DICT regional pages |
| Startup QC | ₱15,000–35,000 (student category); up to ₱1M (professional) | Good if a team member is QC-based | [How to join](https://quezoncity.gov.ph/qcitizen-guides/how-to-join-startup-qc/) |
| DICT Startup Grant Fund | ₱500,000–1,000,000, equity-free | Good after we register a business (DTI/SEC) and list on Startup Philippines | Needs a working MVP (we have one) and traction |
| DOST-PCIEERD Startup Grant | Up to ₱5,000,000 | Weak fit: aimed at R&D/deep tech | Skip unless there's a research angle |
| IdeaSpace | Acceleration (amount undisclosed) | Later, once there's traction | — |

## 4. Still open (no more desk research needed)

| Question | How we answer it |
|---|---|
| IT/CS OJT listings for January 2027 | Curators add them from official career pages (Globe, Smart, DOST-ASTI, Canva, banks, BPOs). This is the product's own job |
| Which IT orgs to pilot with | Ask JPCS chapters, GDG on Campus, AWS Cloud Clubs, and Microsoft Learn Student Ambassadors at the team's schools |
| Does web push work on Xiaomi/Oppo/Realme? | Test on real phones before launch |
| NPC registration, under-18 users, Terms | Lawyer review |
| Exact PSA figure (§2.3) | Read the PSA Labor Force Survey table |

## 5. What the reports got wrong (don't reuse)

- SOM "capped at 50,000 users because of Supabase": that's an infrastructure limit, not market size.
- "Delete expired listings after 30 days to save database space": not needed, and it breaks shared links and saved lists.
- "Resend free covers 10,000 users": the free plan allows 100 emails a day.
- "Email is rarely used": no source; we keep email as a fallback because web push needs an installed app on iPhone.
- Weak sources to ignore when they're the only source: personal portfolio sites, respicio.ph commentaries, Wikipedia, blogs like philippinego.com, collegesph.com, governmentph.com, assistance.ph.
