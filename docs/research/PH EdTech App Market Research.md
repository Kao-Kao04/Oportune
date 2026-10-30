# **Strategic Market Research and Product Validation Report: Oportune**

## **Executive Summary**

Is Oportune worth building as planned? **YES WITH CHANGES.**  
The Philippine higher education and youth employment sectors suffer from severe structural information asymmetry. Despite the government injecting billions into the Universal Access to Quality Tertiary Education Act (RA 10931\) and various Tertiary Education Subsidy (TES) tranches, the discovery of these critical opportunities—alongside corporate internships and upskilling competitions—remains chaotic and highly fragmented. Students rely on an improvised infrastructure of unverified Facebook groups and noisy Messenger chats, exposing them to missed deadlines, misaligned qualifications, and predatory phishing scams explicitly targeting financial aid seekers1.  
Oportune’s core loop of curated discovery, verification badges, and deadline reminders directly addresses this acute market failure. The strategic choice of a lightweight Progressive Web App (PWA) architecture perfectly aligns with the mobile-first, prepaid-data constraints of the Filipino youth demographic.  
However, the product roadmap as currently planned contains fatal flaws for an unfunded, early-stage team. Relying solely on manual human curation is operationally unsustainable. Furthermore, the planned "Phase 2" roadmap is bloated with high-cost, high-risk features like AI helpers and private document uploads. These features will rapidly exhaust free-tier database limits—specifically Supabase's 500MB database and 1GB file storage limits3—and expose the startup to severe legal liabilities under the Philippine Data Privacy Act (RA 10173).  
To survive and scale, Oportune must pivot its go-to-market strategy toward a highly targeted beachhead: IT and Computer Science students navigating strict CMO 104-mandated internships and tech competitions. It must ruthlessly purge any features that incur variable API or cloud storage costs. For long-term viability, Oportune must transition from a consumer-only utility to a B2B2C model, securing equity-free government grants in Year 1 before charging verified employers for premium visibility, all while remaining strictly free for students.

## **1\. The Problem: Reality and Scale**

### **Information Fragmentation and Discovery Methods**

Filipino college students operate in a highly fragmented digital ecosystem characterized by high connectivity but low data organization. The discovery of scholarships, On-the-Job Training (OJT), and academic competitions occurs almost entirely on social media platforms—specifically Facebook groups (e.g., "CHED Scholarship Updates", "OJT/Internship Philippines"), university Facebook pages, and peer-to-peer transmission via Messenger group chats.  
Official sources, such as the Commission on Higher Education (CHED), the Department of Science and Technology (DOST), and the Unified Student Financial Assistance System for Tertiary Education (UniFAST), publish updates across disparate regional websites or via PDF memorandums that are hostile to mobile consumption5. Because algorithmic social feeds prioritize engagement over chronological relevance, time-sensitive opportunities are routinely buried, resulting in a systemic crisis of missed deadlines among students.

### **The Scam Epidemic and Vulnerability**

The reliance on unregulated social media channels exposes students to severe risks. The Philippine National Police Anti-Cybercrime Group (PNP-ACG) and the Cybercrime Investigation and Coordinating Center (CICC) report an escalating epidemic of cyber fraud targeting financial aid2. Scammers routinely deploy fake application portals mimicking the Department of Social Welfare and Development (DSWD), the Department of Labor and Employment (DOLE), or UniFAST1. These phishing campaigns are designed to harvest sensitive personal data, intercept One-Time Passwords (OTPs), or extort "processing fees" for fabricated scholarships and overseas job placements2. The proliferation of these scams creates a high-friction environment where students, driven by financial desperation, struggle to differentiate between legitimate government opportunities and sophisticated identity theft traps.

### **Market Size: TAM, SAM, and SOM**

The Philippine higher education market is massive, heavily skewed toward the private sector, and fundamentally unequal. Recent CHED statistical data indicates there are approximately 1,975 Higher Education Institutions (HEIs) in the country, with a stark division: 87.5% (1,729) are private institutions, while only 12.5% (246) are public State Universities and Colleges (SUCs) or Local Universities and Colleges (LUCs)8. Total tertiary enrollment consistently hovers between 3.4 million and 3.5 million students annually8.  
The labor market reality waiting for these students is grim. According to the July 2024 Labor Force Survey by the Philippine Statistics Authority (PSA), 2.38 million Filipinos were unemployed, with fresh graduates and youth (aged 15-24) comprising a massive portion of this demographic10. By mid-2025, DOLE data indicated a staggering 35.6% unemployment rate specifically among college graduates, forcing immense pressure on students to secure competitive internships and upskilling certifications prior to graduation11.  
Building the market model for a free student app:

* **Total Addressable Market (TAM):** 3.5 million enrolled tertiary students in the Philippines across all disciplines8.  
* **Serviceable Available Market (SAM):** 1.5 million students. This encompasses students in programs with strict internship mandates (such as IT, Engineering, Business, and Education) under CHED Memorandum Order No. 104, s. 2017, alongside those actively reliant on financial aid to combat rising private tuition costs5.  
* **Serviceable Obtainable Market (SOM):** 50,000 Monthly Active Users (MAU) for Year 1\. This is not constrained by market demand, but deliberately capped by the maximum free-tier limitations of backend infrastructure like Supabase (which allows 50,000 MAU before triggering usage-based pricing)3.

  ### **The Supply Side**

  The supply of opportunities is robust but institutionally uncoordinated.  
> 1. **Government Financial Aid:** UniFAST manages the massive Tertiary Education Subsidy (TES) and Tulong Dunong programs, which process billions of pesos for hundreds of thousands of scholars13. DOST-SEI manages high-value STEM scholarships, processing nearly 90,000 applicants for roughly 10,700 slots annually15. CHED Merit Scholarships offer highly competitive slots (e.g., 2,779 available slots for AY 2025-2026)16.  
> 2. **Corporate and Private Foundations:** Large domestic conglomerates (Aboitiz, SM Investments, Gokongwei Brothers) operate foundation-based scholarships, usually announced via their independent corporate portals.  
> 3. **Internships (OJT):** CHED Memorandum Order (CMO) No. 104, s. 2017 mandates internship programs across almost all academic disciplines, creating a massive, recurring seasonal supply of employer openings5. With roughly 796,000 students graduating annually8, the economy must supply a nearly equivalent number of OJT slots each year.  
> 4. **Competitions and Grants:** Government entities frequently run national upskilling events. For example, the DICT runs the regional and national "Hack4Gov" Capture the Flag (CTF) cybersecurity competitions17, while local government units (LGUs) run localized entrepreneurship grants like the Startup QC program19.

   ### **Problem Ranking by Severity and Frequency**

> 1. **Scam Vulnerability (Severity: Critical, Frequency: Medium):** Phishing via fake scholarship posts results in direct financial loss or identity theft for desperate students2.  
> 2. **Missed Deadlines (Severity: High, Frequency: High):** Algorithmic social media feeds routinely bury time-sensitive application windows for high-value grants (e.g., DOST-SEI).  
> 3. **Eligibility Confusion (Severity: Medium, Frequency: High):** Students waste immense amounts of time applying for opportunities with hidden constraints (e.g., TES prioritization for students in municipalities without SUCs, strict income brackets)20.  
> 4. **OJT Bureaucratic Tracking (Severity: High, Frequency: Seasonal):** Managing CMO 104 compliance—which requires notarized Memorandums of Agreement (MOAs), medical clearances, and psychological evaluations—is a logistical nightmare for students5.  
> 5. **Fragmented Discovery (Severity: Low, Frequency: High):** The daily friction of checking dozens of disconnected university and government websites.  
   **So what for Oportune:**  
* The "Official .gov.ph / .edu.ph" verification badge is the most critical feature to combat the scam epidemic; it must be aggressively highlighted in the UI.  
* Deadline push notifications solve the highest-frequency problem (missed dates) and must serve as the core retention loop.  
* Growth must be artificially capped at 50,000 MAU in Year 1 to remain within free infrastructure limits while validating the curation model.

  ## **2\. The Users: Segmentation and Constraints**

  ### **User Segments**

> 1. **Provincial State University (SUC) Students:** Highly reliant on UniFAST/TES and local government grants. They suffer from poor internet connectivity, rely on low-end Android devices, and are highly motivated to sign up for any service promising financial aid.  
> 2. **Private HEI Students (Middle/Low Income):** Excluded from the Free Tuition Law (RA 10931\) unless they secure coveted TES slots specifically allocated for private institutions (PNSL)13. They experience high desperation for corporate scholarships and the Tulong Dunong program14.  
> 3. **IT/CS 3rd and 4th Years:** Highly digital, active in niche tech communities, deeply stressed by OJT hunting, and active in hackathons and CTFs17. They possess the technical literacy to understand and adopt Progressive Web Apps.  
> 4. **First-Generation College Students:** This demographic lacks familial networks to explain the complexities of application requirements, standardized testing, and CMO 104 internship compliance, making them highly reliant on external digital guidance.

   ### **Mobile, Data, and Platform Reality**

   The Philippines is fundamentally a mobile-first, prepaid-data economy. Smartphone penetration is nearly universal among the 18-24 demographic, but data bandwidth is severely constrained. Students rely on heavily metered "promo loads" (e.g., Smart or Globe promos providing 1GB to 2GB per day, often allocated specifically for whitelisted apps like Facebook, Messenger, and TikTok).  
   Crucially, email is rarely utilized outside of strict academic mandates. Relying on email for deadline reminders will yield abysmal open rates. Messenger and Telegram are the dominant communication protocols. Web push notifications on Android (via Chrome) are highly effective and do not require app store downloads, confirming that Oportune's PWA architecture is the optimal technical decision for this market.

   ### **The Beachhead Segment**

   **IT and Computer Science students in their 3rd and 4th years.** This segment represents the ideal beachhead for the first six months of operations. The current MVP already naturally skews toward IT/tech and cybersecurity \[cite: user prompt\]. These students understand beta software, actively seek specialized competitions (like DICT Hack4Gov) to build their portfolios23, require mandatory OJT placements, and are early adopters of PWAs. Winning this niche builds a highly engaged, technically literate initial user base that can provide high-quality bug reports and feature feedback without requiring massive, broad-market advertising spend.  
   **So what for Oportune:**  
* Email reminders must be immediately deprioritized in favor of Web Push and eventual Messenger/Telegram bot integrations.  
* The PWA asset payload must be rigorously optimized to load under 2MB to respect users' prepaid data constraints.  
* Content curation for the first 6 months must ignore broad non-tech opportunities and relentlessly focus on IT/CS OJTs, hackathons, and tech grants.

  ## **3\. Competition and Differentiation**

  ### **Alternative Platforms**

  The market features several entrenched players, but none serve the specific intersection of curated, cross-category student opportunities perfectly.  
* **Edukasyon.ph:** The largest domestic EdTech player, having raised over \$7.9M across multiple rounds25. However, they have pivoted heavily toward senior high school (K-12) college search, B2B student recruitment, and digital advertising26. Their UI is heavily monetized and cluttered.  
* **Prosple Philippines:** Excellent for corporate graduate jobs and internships, featuring highly verified employer reviews, work-hour data, and salary transparency27. However, Prosple caters to final-year students and graduates, entirely ignoring scholarships, hackathons, and financial aid.  
* **Job Boards (Kalibrr, JobStreet, Indeed):** Built for full-time professionals. Their UI/UX is hostile to students seeking entry-level OJTs, and they lack filters for academic requirements.  
* **Government Portals (UniFAST, DOST-SEI):** Authoritative but highly fragmented. The user experience is generally poor, lacking any reminder functionality, modern mobile optimization, or cross-agency aggregation.  
* **Facebook Groups:** The actual main competitor. They possess maximum liquidity and reach, but offer zero trust, zero filtering, and suffer from high scam prevalence.

  ### **Competitor Comparison Table**


| Platform | Target User | Opportunity Types | Trust / Verification | Reminders | Price to Student | Weaknesses |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Facebook Groups** | All students | All | None (High scam rate) | None | Free | Noisy, algorithmic, dangerous2. |
| **Edukasyon.ph** | SHS / College entrants | Schools, some scholarships | High | Email (Spammy) | Free | Cluttered UI, heavily ad-driven26. |
| **Prosple PH** | Graduating / Alumni | Jobs, Internships | High (Verified employers) | Email | Free | Ignores scholarships and events27. |
| **Gov't Portals** | Specific applicants | Scholarships | Absolute | None | Free | Fragmented, poor mobile UX. |
| **Oportune (Current)** | College students | Scholarships, OJT, Events | High (Curated \+ Badged) | Web Push, Email | Free | Low inventory, manual curation bottleneck. |

  ### **Differentiation vs. Table Stakes**

* **Table Stakes (Easy to copy):** Deadline sorting, category filters, quick profiles.  
* **Differentiating (Hard to copy):** Strict verification badges ("Official .gov.ph/.edu.ph"), PWA zero-install architecture bypassing app store friction, and cross-category aggregation (OJT \+ Scholarships \+ Hackathons in one unified feed).  
* **Switching Triggers:** A student will switch from Facebook to Oportune the first time Oportune saves them from missing a high-value deadline (e.g., DOST-SEI closing) or when they realize they can filter out the anxiety-inducing "noise" of fake posts. Conversely, they will abandon Oportune permanently if the platform hosts stale data, broken links, or fails to trigger a promised push notification.

  ### **Market Gaps**

  No platform in the Philippines effectively maps the bureaucratic nightmare of CMO 104 compliance (internship requirements like MOAs and medical certificates)5. Furthermore, no platform aggregates niche technical competitions (Capture the Flag events, coding bootcamps) for Philippine students in a centralized, searchable manner.  
  **So what for Oportune:**  
* Do not attempt to compete with Kalibrr or JobStreet on general job listings; strictly own the "pre-graduation" space (Scholarships \+ OJT \+ Competitions).  
* Oportune must guarantee 100% accuracy on its deadlines. One missed deadline notification destroys user trust permanently.  
* Lean heavily into the PWA architecture—frictionless access without Google Play Store downloads is a massive competitive moat against heavy, bloated EdTech apps.

  ## **4\. Feature Validation: What's Missing, What's Extra?**

  The product roadmap must be ruthlessly trimmed to respect the zero-budget, free-tier infrastructure reality. Every byte of database storage and every API call represents a potential existential threat to the company's runway.

  ### **Feature Priority Evaluation**


| Feature | Evidence of Need | Priority | What to Measure |
| :---- | :---- | :---- | :---- |
| **Browse w/o login** | Reduces friction for prepaid users; critical for viral sharing. | Must | Bounce rate on landing page. |
| **Official Badges** | Widespread scam prevalence demands visual trust indicators1. | Must | Clicks on outbound verified links. |
| **Push Reminders** | Directly solves the core missed deadline problem. | Must | Opt-in rate for Web Push on Android. |
| **OJT Checklist** | CMO 104 requires heavy, confusing documentation5. | Should | Engagement rate with checklist UI. |
| **"For you" matching** | Users suffer from deep eligibility confusion (e.g., TES rules)21. | Should | Conversion rate from feed to click. |
| **Share to Messenger** | Primary sharing behavior in the PH digital ecosystem. | Should | Viral coefficient (shares per user). |
| **User Submissions** | Manual internal curation is mathematically unscalable. | Should | Volume of user-submitted links. |
| **Android Native App** | PWA suffices; native adds massive overhead and dev time. | Later | User requests for native features. |
| **Messenger Reminders** | High API overhead, but native to PH habits. | Later | Cost per message vs engagement. |
| **Application Tracker** | Redundant to the existing "Save" feature for an MVP. | Drop | N/A |
| **Document Uploads** | Devastating storage costs (Supabase limits file storage to 1GB on Free tier)3. | Drop | N/A |
| **AI Helper (Taglish)** | LLM API costs scale linearly; financially ruinous for a free app. | Drop | N/A |

  ### **10 Unconsidered Features Validated by Evidence**

> 1. **Eligibility Filters (Region/Course/Income):** (Must / Effort: S). Evidence: DOST and TES are strictly tied to specific demographic and income qualifiers21.  
> 2. **LGU-Specific Tagging:** (Must / Effort: S). Evidence: Many high-value grants are limited to specific barangays or cities (e.g., Startup QC)19.  
> 3. **Auto-hide Expired Listings:** (Must / Effort: S). Evidence: Stale data destroys trust and bloats the database.  
> 4. **Report a Scam Button:** (Must / Effort: S). Crowdsourcing moderation protects the platform from liability.  
> 5. **Offline Cache for Saved Items:** (Should / Effort: M). Evidence: Intermittent prepaid data connectivity on campuses.  
> 6. **Scholarship Timeline View:** (Should / Effort: M). Evidence: Visualizing academic seasonality aids long-term planning.  
> 7. **Curator Leaderboard:** (Should / Effort: M). Evidence: Gamifying user-submissions to solve the supply bottleneck without spending cash.  
> 8. **One-Click Export to Calendar:** (Should / Effort: S). Hooks into native OS tools without backend database overhead.  
> 9. **"No SUC in your area" Flag:** (Later / Effort: S). Evidence: TES prioritizes private HEI students in municipalities without State Universities20.  
> 10. **Alumni Salary/Review Snippets:** (Later / Effort: L). Evidence: This is Prosple's core value prop27; requires heavy moderation.  
    **So what for Oportune:**  
* Kill the AI Helper and Document Uploads immediately. They introduce fatal variable costs and severe legal compliance requirements under the Data Privacy Act.  
* Shift engineering focus to Eligibility Filters and LGU tagging to dramatically reduce the time students waste on incompatible opportunities.  
* Implement user crowdsourcing (link submissions) quickly to relieve the operational burden on the internal team.

  ## **5\. Timing, Relevance, and Longevity**

  ### **Macro Trends (2023-2026)**

  The implementation of the Universal Access to Quality Tertiary Education Act (RA 10931\) drastically increased public HEI enrollments. However, massive funding deficiencies—such as the P9.7B Free Higher Education (FHE) funding gap spanning 108 SUCs between 2022 and 202529—have forced many students to frantically seek alternative private scholarships and subsidies.  
  Furthermore, the recent EDCOM II final report (2025/2026) highlights massive equity gaps in the Philippine education system. Disadvantaged students struggle to pass entrance exams or secure support without systemic intervention31. Concurrently, youth unemployment remains structurally high. Recent PSA data showed a 35.6% unemployment rate among college graduates, driving a desperate need for upskilling, CTF competitions, and highly competitive OJT placements11.

  ### **Seasonality Calendar**

| Month | Academic Cycle | Opportunity Cycle | Oportune Strategy |
| :---- | :---- | :---- | :---- |
| **Aug-Sep** | Semester 1 Starts | Late CHED/TES allocations. | Push remaining local grants and campus ambassadorships. |
| **Oct-Nov** | Midterms | Corporate grad programs open. | Highlight early-stage career events and foundational courses. |
| **Dec-Jan** | Sem 1 Ends / Break | OJT hunting begins. | **MAJOR PUSH:** CMO 104 Internship listings for Sem 2\. |
| **Feb-Mar** | Semester 2 Starts | Hackathons/Tech competitions. | Highlight specialized technical events (e.g., Hack4Gov). |
| **Apr-May** | Finals / Graduation | Summer OJT / Grad Jobs. | Focus on entry-level transitions. |
| **Jun-Jul** | Academic Break | Gov Scholarships (DOST, CHED). | **MAJOR PUSH:** Incoming freshmen scholarships. |

  ### **Longevity and Threats**

  Will this utility still be needed in 5-10 years? Yes, but the format will inevitably change. AI search agents (e.g., ChatGPT, Perplexity) will easily aggregate public web data. If Oportune only scrapes public government links, it will be rendered obsolete by AI. To survive a decade, Oportune must transition from a simple link aggregator to a verified network. It must possess proprietary data—such as exclusive local SME internship listings, direct API integrations with university career offices, or a robust community layer of peer reviews.

  The primary systemic threat is the Philippine government finally unifying its portals. If DICT or CHED builds a highly competent, centralized "Gov.ph Student Hub," Oportune's basic value proposition diminishes. However, historical precedent suggests government IT projects suffer from poor UX and slow updates, giving Oportune a substantial runway.

  **So what for Oportune:**

* Align marketing sprints with the two peak desperation windows: July (Scholarships) and January (OJT hunting).  
* Begin building relationships with local SME employers to host exclusive listings that AI cannot scrape.  
* Position the product as an antidote to the "noise" generated by AI and social media by doubling down on human/community verification.

  ## **6\. Money: Monetization Without Charging Students**

  A student-facing application in an emerging market cannot charge its users. The friction of payment gateways and the absolute lack of disposable student income will kill growth instantly. Oportune must operate a strict B2B2C model, subsidizing the student experience through enterprise and government capital.

  ### **Monetization Evaluation**


| Model | Who Pays | Est. Price Point (PHP) | Effort | Viability / Risk |
| :---- | :---- | :---- | :---- | :---- |
| **Sponsored Listings** | SME Employers / Organizers | ₱500 \- ₱1,500 / post | Low | **High.** Low friction, high volume. Risk: Dilutes trust if not clearly marked as "Sponsored." |
| **Employer Subscriptions** | Corporations | ₱5,000 / month | High | **Medium.** Requires a dedicated sales team. Similar to Prosple/Kalibrr. |
| **Gov't / LGU Contracts** | Mayors / LGUs | ₱50,000 / contract | Very High | **Low.** Brutal procurement cycles (RA 9184\) and extreme political volatility. |
| **Affiliate Partnerships** | Course Providers (Coursera) | ₱100 \- ₱500 / conversion | Low | **Medium.** Easy to implement, but notoriously low conversion rates in the PH. |
| **Grants (DOST, DICT)** | Gov Agencies | ₱1M \- ₱5M (Equity-free) | Medium | **High.** Perfect for early stage. DOST-PCIEERD offers up to ₱5M33; Startup QC up to ₱1M19. |

  ### **Unit Economics and Break-Even**

  Oportune's infrastructure relies heavily on Supabase (Database/Auth) and Resend (Emails).

* **1,000 MAU:** Supabase Free ($0)+ResendFree($0). Cost: ₱0.  
* **10,000 MAU:** Supabase Free ($0)+ResendFree($0). Cost: ₱0.  
* **50,000 MAU:** Supabase Free ($0)+ResendPro($20\)3. Cost: \~₱1,150/month.  
* **100,000 MAU:** Supabase Pro (\$25 \+ $162overageforMAU)+ResendScale($90). Cost: \~₱16,000/month3.  
  The unit economics are stellar up to 50,000 MAU. Because compute and database storage (limited to 500MB on free tier)3 are the primary bottlenecks, Oportune must fiercely optimize its database by archiving expired listings. The break-even point requires only a handful of sponsored posts per month to cover domain, hosting, and eventual email overages.

  ### **Recommendation and Milestones**

  **Best Path:** Pursue local government and agency grants immediately. Programs like the DOST-PCIEERD Startup Grant Program (which offers up to ₱5M for a maximum of 18 months for R\&D and commercialization)33 and the Startup QC program (equity-free grants up to ₱1M)19 provide the exact type of non-dilutive capital perfect for funding operational curation while keeping the product free. Simultaneously, roll out **Sponsored Listings for SMEs** in Year 2, allowing local businesses to pay a micro-fee (₱500) to pin their OJT listings to the top of the IT/CS feed.  
  For pre-seed/seed EdTech traction in the Philippines, institutional investors look for:  
> 1. Low Customer Acquisition Cost (CAC) via viral loops (e.g., Messenger sharing).  
> 2. High engagement (Weekly Active Users / Monthly Active Users ratio \> 30%).  
> 3. At least 10,000 to 50,000 highly engaged MAUs before seeking institutional venture capital.  
   **So what for Oportune:**  
* Do not spend a single peso on paid marketing; rely entirely on organic campus sharing to keep CAC at zero.  
* Apply for Startup QC and DOST-PCIEERD immediately. The team’s student/startup status is a major asset here.  
* Monitor Supabase metrics obsessively. If the database size nears 500MB, prune old expired listings rather than paying to upgrade to the Pro tier3.

  ## **7\. Legal and Trust Check**

  ### **Data Privacy Act (RA 10173\)**

  Educational records and affiliations are classified under the Data Privacy Act (DPA). Because Oportune targets college students (the vast majority being 18+), minor consent complexities are largely bypassed. However, the onboarding profile must include an explicit, unchecked opt-in box for data processing. If Oportune scales past 1,000 records of sensitive personal information, it is legally required to register its Data Processing Systems with the National Privacy Commission (NPC) and appoint a formal Data Protection Officer (DPO). The strategic decision to drop Document Uploads saves the company from massive compliance overhead and security liabilities.

  ### **DOLE Private Employment Agency (PEA) Regulations**

  Under Article 13 of the Philippine Labor Code and associated DOLE regulations, entities engaging in the recruitment and placement of workers must secure a Private Employment Agency (PEA) license. This requires a minimum paid-up capital of ₱500,000 for corporations, a physical office of at least 50 square meters, and NBI clearances for all directors36.  
  Oportune must explicitly position itself as a **digital advertising board or classifieds directory**, not a recruitment agency. It must never charge a placement fee to the student or get involved in the selection, screening, or contracting process.

  ### **Copyright and Scraping**

  Linking to government sources and summarizing the basic qualifications constitutes fair use. However, scraping full text, proprietary application forms, or lifting content behind competitor paywalls (e.g., Prosple) introduces legal risk. Relying on human curation and summarized metadata protects the platform.  
  **So what for Oportune:**  
* Implement a strict data-minimization policy: only ask for school, course, year, and email. Never ask for addresses, phone numbers, or uploaded IDs.  
* Add a legal disclaimer to the Terms of Service and every OJT listing stating: *"Oportune is an information aggregator and is not involved in the screening, interviewing, or hiring of candidates."*  
* Appoint a team member as the acting DPO immediately to handle user deletion requests.

  ## **8\. Risks and Kill Criteria**

  ### **Top 10 Risk Register**


| Risk | Likelihood | Impact | Early Warning Signal | Mitigation |
| :---- | :---- | :---- | :---- | :---- |
| **1\. Curation Burnout** | High | Critical | Stale listings (\>14 days old). | Gamify user submissions early to crowdsource supply. |
| **2\. DB Cost Overruns** | Med | High | Supabase DB nearing 500MB3. | Auto-delete expired listings after 30 days. |
| **3\. Trust Collapse (Scam)** | Low | Critical | User reports a scam on Oportune. | Strict adherence to linking only to .gov.ph/.edu.ph sources. |
| **4\. DOLE Legal Action** | Low | High | DOLE cease-and-desist letter. | Clear ToS defining the app strictly as an ad board36. |
| **5\. Low Retention** | High | High | WAU/MAU drops below 10%. | Improve relevance of push notifications via filtering. |
| **6\. Push Notification Fatigue** | Med | Med | High opt-out rates on Chrome. | Limit push to exactly 7 days and 1 day before a deadline. |
| **7\. Competitor Feature Clone** | High | Med | Edukasyon.ph adds reminder push. | Win on PWA load speed and hyper-niche focus (IT). |
| **8\. DPA Violation** | Low | High | Data breach or leak. | Zero document uploads; absolute minimal PII collection. |
| **9\. Grant Rejection** | High | High | Rejection from Startup QC / DOST. | Bootstrap via SME sponsored listings to maintain operations. |
| **10\. Team Attrition** | High | Critical | Missed internal dev deadlines. | Maintain narrow focus; aggressively avoid feature bloat. |

  ### **Stop / Pivot Criteria**

* **Pivot Threshold:** If, after 8 weeks of launch, less than 15% of users utilize the "Save" feature, pivot the UI. This indicates the core value proposition (reminders) is failing to resonate.  
* **Stop/Kill Threshold:** If Weekly Active Students (WAS) remains below 500 after 12 weeks of launch despite active campus outreach, kill the project. The market does not care enough to change its behavior from Facebook.  
  **So what for Oportune:**  
* Operational survival depends entirely on transitioning from internal manual curation to crowdsourced user submissions within the first 90 days.  
* Cost discipline is existential. Track Supabase metrics weekly.

  ## **9\. Validation Plan Before and Right After Launch**

  ### **Pre-Launch (Weeks 1-2): The "Fake Door" & Curation Test**

  **Goal:** Prove students want organized deadlines enough to click away from Facebook.**Test:** Create a simple Carrd.co landing page listing 10 highly desirable tech OJTs and scholarships closing this month. Post it in 3 targeted IT/CS Facebook groups.**Metric:** Target 500 visitors. If email capture (for "Notify me of new deadlines") converts at \>15%, **GO**. If \<5%, **ADJUST** messaging.

  ### **Launch (Weeks 3-4): The Beachhead Pilot**

  **Goal:** Prove the core loop (Find \-\> Save \-\> Remind).**Test:** Onboard 2 specific IT student organizations (e.g., a local GDSC or computer society chapter). Give them exclusive access to the PWA. Ask them to mandate members use it to track an upcoming Hackathon or CTF event.**Metric:** Target 100 signups. If 30% of them "Save" an opportunity and return upon receiving the 7-day push notification, **GO**.

  ### **Post-Launch (Weeks 5-6): The Virality Test**

  **Goal:** Prove the "Share to Messenger" feature drives organic acquisition.**Test:** Monitor the analytics of shared links.**Metric:** If 1 shared link generates \>1.2 new unique visitors (Viral Coefficient \> 1), **GO**. If near zero, **ADJUST** the OpenGraph link previews to make them more enticing in Messenger.  
  **So what for Oportune:**  
* Do not spend months building code in a vacuum. The biggest risk is not technical; it is behavioral (getting students to leave the comfort of Facebook).  
* Conduct 15-minute user interviews with the first 20 students who trigger the "Save" button to understand exactly why they did it.

  ## **10\. What to Build Next (Top 5\)**

> 1. **Eligibility Filters (Course / Year / Location):**  
   * *Reason:* Reduces user frustration. A 1st-year student seeing only 4th-year OJTs will churn immediately. TES and DOST programs are highly exclusionary based on demographics21.  
   * *Metric:* Increase in "Saved" actions per session.  
> 2. **User Link Submissions (with Admin Queue):**  
   * *Reason:* Fixes the existential threat of manual curation burnout.  
   * *Metric:* % of active listings sourced from users vs. internal team (Target: \>40% by month 3).  
> 3. **Auto-Archiving of Expired Listings:**  
   * *Reason:* Protects the Supabase 500MB DB limit3 and ensures platform trust.  
   * *Metric:* DB size remains flat over time; 0 clicks on expired links.  
> 4. **CMO 104 OJT Checklist:**  
   * *Reason:* Deepens utility beyond a simple link board, embedding Oportune into the student's actual academic workflow to manage complex MOAs and clearances5.  
   * *Metric:* % of 3rd/4th year users engaging with the checklist.  
> 5. **LGU / Region Tagging:**  
   * *Reason:* Vital for accurately matching local government grants (which are geographically fenced) and eliminating false hope for applicants19.  
   * *Metric:* Increased engagement and return rates from provincial SUC users.

   ## **11\. What NOT to Build**

* **Document Uploads / Resume Hosting:** Drop immediately. It explodes cloud storage costs (hitting the 1GB free limit instantly)3 and triggers severe data privacy and security liabilities under RA 10173\.  
* **AI Taglish Explainer / Writing Help:** Drop immediately. OpenAI/Anthropic API costs will bankrupt a zero-budget project, and hallucination risks regarding legal scholarship requirements are unacceptable.  
* **Application Status Tracker (from providers):** Drop for now. Providers will not give an API to a new startup to track applications. This requires massive B2B sales effort.  
* **In-App Messaging / Forums:** Stick to the core loop. Students already use Messenger. Do not try to rebuild a chat app.

  ## **12\. FINAL DECISIONS**


| Decision | Recommendation | Evidence | Confidence |
| :---- | :---- | :---- | :---- |
| **Target Beachhead** | 3rd/4th Year IT & CS Students. | High OJT demand (CMO 104), Hack4Gov CTF participation17, high PWA tech literacy. | High |
| **Launch Timing** | January (OJT hunting) or July (Pre-enrollment Scholarships). | Aligns precisely with PH academic calendar shifts37. | High |
| **Positioning** | "Never miss a deadline for verified student opportunities." | Direct answer to the high-severity problem of missed dates and scams. | High |
| **Top 3 Differentiators** | 1\. Official verification badges. 2\. Push reminders. 3\. Zero-install PWA. | Addresses Facebook noise, missed deadlines, and prepaid data limits. | High |
| **Must Features** | Core loop (Browse, Save, Remind), Eligibility Filters, User Submission. | Addresses both user pain points and operational bottlenecks. | High |
| **Monetization Path** | DOST/LGU Grants in Y1. SME Sponsored OJT Listings in Y2. | Avoids charging students; utilizes available PH startup funds (PCIEERD, Startup QC)19. | Medium |
| **First 90 Days Metric** | 10,000 MAU; \>20% WAU/MAU ratio; \>40% user-sourced listings. | Proves organic traction and operational sustainability. | Medium |
| **Kill Threshold** | \<500 WAS after 12 weeks of active campus promotion. | Indicates complete market apathy. | High |

  ## **13\. Open Questions for the Team to Investigate**

> 1. **Submission Quality:** Will students actually submit high-quality, verified links, or will the submission queue be flooded with spam, merely shifting the operational burden from searching to moderating? *(Test via a Google Form pilot before writing the code).*  
> 2. **Web Push Reliability:** Do the aggressive battery-saving features on Android skins (like Xiaomi and Oppo, which dominate the Philippine market) silently kill Oportune's Chrome web push notifications? *(Test extensively across physical device types).*  
> 3. **University Career Office Threat:** Are local universities actively enforcing the use of their own internal portals for CMO 104 compliance, which might forbid students from using outside OJT boards? *(Conduct calls with 3-5 university OJT coordinators to confirm).*

   #### **Works cited**

> 1. How to Verify Government Financial Aid Text Messages and Avoid, [https\://www\.respicio.ph/commentaries/how-to-verify-government-financial-aid-text-messages-and-avoid-scams-in-the-philippines](https://www.respicio.ph/commentaries/how-to-verify-government-financial-aid-text-messages-and-avoid-scams-in-the-philippines)  
> 2. Filing a Case Against Facebook Scammers in the Philippines, [https\://www\.respicio.ph/commentaries/filing-a-case-against-facebook-scammers-in-the-philippines](https://www.respicio.ph/commentaries/filing-a-case-against-facebook-scammers-in-the-philippines)  
> 3. Pricing & Fees \- Supabase, [https\://supabase.com/pricing](https://supabase.com/pricing)  
> 4. Supabase pricing: plans, free tier, and hidden costs \- CloudZero, [https\://www\.cloudzero.com/blog/supabase-pricing/](https://www.cloudzero.com/blog/supabase-pricing/)  
> 5. CMO-No.104-S.2017.pdf \- OFFICE OF FIELD ACTIVITIES, [https\://ofa.upd.edu.ph/wp-content/uploads/2018/04/CMO-No.104-S.2017.pdf](https://ofa.upd.edu.ph/wp-content/uploads/2018/04/CMO-No.104-S.2017.pdf)  
> 6. Republic of the Philippines \- Commission on Higher Education, [https\://legacy.ched.gov.ph/wp-content/uploads/Draft-Policies-and-Guidelines-for-the-Deployment-of-Pre-service-Teachers-Sept.-7-2020.pdf](https://legacy.ched.gov.ph/wp-content/uploads/Draft-Policies-and-Guidelines-for-the-Deployment-of-Pre-service-Teachers-Sept.-7-2020.pdf)  
> 7. How to Report Online Gaming Scams in the Philippines, [https\://www\.respicio.ph/commentaries/how-to-report-online-gaming-scams-in-the-philippines](https://www.respicio.ph/commentaries/how-to-report-online-gaming-scams-in-the-philippines)  
> 8. Philippine Higher Education Profile \- Facts igures, [https\://cpbrd.congress.gov.ph/wp-content/uploads/2024/10/FF2024-18-Phil-Higher-Education.pdf](https://cpbrd.congress.gov.ph/wp-content/uploads/2024/10/FF2024-18-Phil-Higher-Education.pdf)  
> 9. Higher education in the Philippines \- Wikipedia, [https\://en.wikipedia.org/wiki/Higher\_education\_in\_the\_Philippines](https://en.wikipedia.org/wiki/Higher_education_in_the_Philippines)  
> 10. Fresh grads push PH unemployment to 2.38M in July 2024 \- PSA, [https\://www\.unitednews.net.ph/en/article.php?post=65076](https://www.unitednews.net.ph/en/article.php?post=65076)  
> 11. Republic of the Philippines HOUSE OF REPRESENTATIVES, [https\://docs.congress.hrep.online/legisdocs/basic\_20/HB11025.pdf](https://docs.congress.hrep.online/legisdocs/basic_20/HB11025.pdf)  
> 12. navigating the path from graduate unemployment to workforce success, [https\://www\.researchgate.net/publication/405475711\_NAVIGATING\_THE\_PATH\_FROM\_GRADUATE\_UNEMPLOYMENT\_TO\_WORKFORCE\_SUCCESS](https://www.researchgate.net/publication/405475711_NAVIGATING_THE_PATH_FROM_GRADUATE_UNEMPLOYMENT_TO_WORKFORCE_SUCCESS)  
> 13. higher edu \- UniFAST, [https\://unifast.gov.ph/assets/pdf/guidelines/UniFAST\_MC052023.pdf](https://unifast.gov.ph/assets/pdf/guidelines/UniFAST_MC052023.pdf)  
> 14. CHED UniFAST Scholarships 2024-2025: Tulong Dunong Program, [https\://philippinego.com/51383/](https://philippinego.com/51383/)  
> 15. 201 students in CAR qualify for the S\&T Undergraduate Scholarship, [https\://car.dost.gov.ph/201-students-in-car-qualify-for-the-st-undergraduate-scholarship-program/](https://car.dost.gov.ph/201-students-in-car-qualify-for-the-st-undergraduate-scholarship-program/)  
> 16. CHED Merit Scholarship Program \- Commission on Higher Education, [https\://legacy.ched.gov.ph/merit-scholarship/](https://legacy.ched.gov.ph/merit-scholarship/)  
> 17. Team CyberBabies of USTP Alubijid secures 2nd place in DICT, [https\://www\.ustp.edu.ph/team-cyberbabies-of-ustp-alubijid-secures-2nd-place-in-dict-hack4gov-2025-capture-the-flag-challenge/](https://www.ustp.edu.ph/team-cyberbabies-of-ustp-alubijid-secures-2nd-place-in-dict-hack4gov-2025-capture-the-flag-challenge/)  
> 18. THE MLUC VOICE \- Heyzine, [https\://cdnc.heyzine.com/files/uploaded/v3/d5a8962023040b9df9ec43e84c3693df7e1de4f5.pdf](https://cdnc.heyzine.com/files/uploaded/v3/d5a8962023040b9df9ec43e84c3693df7e1de4f5.pdf)  
> 19. How to Join StartUp QC \- Quezon City Government, [https\://quezoncity.gov.ph/qcitizen-guides/how-to-join-startup-qc/](https://quezoncity.gov.ph/qcitizen-guides/how-to-join-startup-qc/)  
> 20. No SUCs or LUCs in your area? Tertiary Education Subsidy under, [https\://legacy.ched.gov.ph/no-sucs-or-lucs-in-your-area-tertiary-education-subsidy-under-r-a-10931-to-help-students-in-private-colleges-and-universities-avail-free-education/](https://legacy.ched.gov.ph/no-sucs-or-lucs-in-your-area-tertiary-education-subsidy-under-r-a-10931-to-help-students-in-private-colleges-and-universities-avail-free-education/)  
> 21. An Evaluation of the Tertiary Education Subsidy Program, [https\://pidswebs.pids.gov.ph/CDN/document/pidsdps2422.pdf](https://pidswebs.pids.gov.ph/CDN/document/pidsdps2422.pdf)  
> 22. Guidelines on Practicum or Internship Program in the Philippines, [https\://ofa.upd.edu.ph/wp-content/uploads/2018/04/Memo-No.-MLT-18-126.-Guidelines-on-Practicum-or-Internship-Program-in-the-Philippines-UPD-Academic-Field-Activity-Type-1A.pdf](https://ofa.upd.edu.ph/wp-content/uploads/2018/04/Memo-No.-MLT-18-126.-Guidelines-on-Practicum-or-Internship-Program-in-the-Philippines-UPD-Academic-Field-Activity-Type-1A.pdf)  
> 23. Arvy Aggabao (Arvss), [https\://www\.arvss.com/](https://www.arvss.com/)  
> 24. Carl Victoria — Full Stack Developer Philippines, [https\://carlvx.vercel.app/](https://carlvx.vercel.app/)  
> 25. Edukasyon.ph \- Valuation, Funding & Investors \- PitchBook, [https\://pitchbook.com/profiles/company/137304-28](https://pitchbook.com/profiles/company/137304-28)  
> 26. Edukasyon.ph Valuation & Funding History \- Caplight, [https\://www\.caplight.com/company/edukasyon](https://www.caplight.com/company/edukasyon)  
> 27. Methodology \- Prosple Philippines, [https\://ph.prosple.com/rankings-methodology](https://ph.prosple.com/rankings-methodology)  
> 28. Prosple has landed in the Philippines\!, [https\://recruiters.prosple.com/resources-all/post/prosple-has-landed-in-the-philippines](https://recruiters.prosple.com/resources-all/post/prosple-has-landed-in-the-philippines)  
> 29. Press Releases \- UniFAST, [https\://unifast.gov.ph/press-rel.html](https://unifast.gov.ph/press-rel.html)  
> 30. Acidre welcomes increased SUC funding in 2026 National Budget, [https\://www\.congress.gov.ph/media/press-releases/9579](https://www.congress.gov.ph/media/press-releases/9579)  
> 31. EDCOM II • FINAL REPORT, [https\://edcom2.gov.ph/media/2026/01/EDCOM-II\_Y03\_Reflections-of-Reform.pdf](https://edcom2.gov.ph/media/2026/01/EDCOM-II_Y03_Reflections-of-Reform.pdf)  
> 32. EDCOM II flags gaps in affirmative action, student support, and, [https\://edcom2.gov.ph/edcom-ii-flags-gaps-in-affirmative-action-student-support-and-equity-in-philippine-universities/](https://edcom2.gov.ph/edcom-ii-flags-gaps-in-affirmative-action-student-support-and-equity-in-philippine-universities/)  
> 33. CALL FOR PROPOSALS FOR THE PCIEERD STARTUP GRANT, [https\://pcieerd.dost.gov.ph/work-with-us/2023-call-for-proposals-for-the-pcieerd-startup-grant-fund-program-cycle-2/](https://pcieerd.dost.gov.ph/work-with-us/2023-call-for-proposals-for-the-pcieerd-startup-grant-fund-program-cycle-2/)  
> 34. Pricing \- Resend, [https\://resend.com/pricing](https://resend.com/pricing)  
> 35. Quezon City Awards Seven Startups with Php 1 Million each at the, [https\://quezoncity.gov.ph/quezon-city-awards-seven-startups-with-php-1-million-each-at-the-startup-qc-cohort-4-demo-day/](https://quezoncity.gov.ph/quezon-city-awards-seven-startups-with-php-1-million-each-at-the-startup-qc-cohort-4-demo-day/)  
> 36. DOLE RULES AND REGULATIONS GOVERNING PRIVATE, [https\://elibrary.judiciary.gov.ph/thebookshelf/showdocs/11/40819](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/11/40819)  
> 37. Academic Calendar \- CHED Region 10, [https\://ro10.ched.gov.ph/hei-profile/academic-calendar](https://ro10.ched.gov.ph/hei-profile/academic-calendar)