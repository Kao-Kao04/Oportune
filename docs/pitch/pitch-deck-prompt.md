# Pitch Deck Prompt: 1-minute pitch + 5 interactive slides

Paste the prompt below into ChatGPT, Claude, Gemini, Gamma, or Canva Magic Design. It makes:
1. A **60-second spoken pitch** (with a 30-second version for hallway talks)
2. A **5-slide PowerPoint** you can click through, with a live demo moment

**Before pasting:** fill in every `[bracket]`. Check the live number on the Browse page ("__ open now"). Never let the tool add numbers that aren't in the prompt.

**Where the numbers come from:** traction brackets are filled **only** with real numbers from the [30-day validation sprint scorecard](../validation/06-30-day-validation-sprint.md#3-weekly-scorecard) (2026-10-27 → 2026-11-25). Market facts come only from [final decisions §2.6](../research/final-decisions.md#26-market-and-competitors-web-check-2026-10-26), with their ✅/⚠️ markers. Status on 2026-10-26, before the sprint: 1 user (the team), 0 interviews, not deployed, 0 paying organizers, ~79 curated listings (52 with no fixed date). If a bracket has no sprint number yet, write "pre-launch" or delete the line; never estimate.

**Wording:** say "checked" (a person opened the source and confirmed the details on the date shown), not "verified". The official badge is only for `.gov.ph` / `.edu.ph` sources ([final decisions §1c](../research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).

---

```
ROLE
You are a startup pitch coach and presentation designer who has coached winners of Philippine student startup competitions (DICT Philippine Startup Challenge, Startup QC, university innovation fairs). Write tight, spoken English with a little Taglish where it lands naturally. No jargon, no filler.

WHAT I NEED
1. A 60-second pitch script (about 140-150 spoken words), split by slide, with stage directions in [brackets] for what I do or click.
2. A 30-second "hallway" version for one-on-one meetings (about 75 words).
3. A 5-slide PowerPoint deck (16:9) that is INTERACTIVE, described slide by slide so I can build it, or generated directly if you can make .pptx.
4. Three versions of the closing "ask", one for each audience below.
5. Five likely questions from judges with short answers (2 sentences each).

THE PRODUCT (use only these facts; do not invent numbers, users, partners, revenue, or market facts)
- Name: Oportune. Tagline: "Huwag ma-late sa next opportunity mo." / "Never miss a deadline. Student opportunities in tech, each one checked by a person against its source."
- What it is: a free, phone-first web app for Filipino IT/CS college students to find hackathons, CTFs, OJT/internships, and tech scholarships, sorted by deadline. (General scholarships and free courses are also in the feed, but they are not the pitch.) Students save listings and get reminded 7 days and 1 day before the deadline.
- The problem: tech opportunities are scattered across Facebook pages, group chats, Luma, and GDG pages. Students find out late, miss deadlines, can't tell which ones fit them, and some fall for fake posts that ask for fees. [Team: back this with the sprint interviews: "[N of M] students we interviewed described a missed or nearly missed opportunity, unprompted." If the sprint hasn't produced this yet, present the problem as our hypothesis, not a finding.]
- Why us / what's different:
  1. Checked: every listing is checked by a person, meaning someone opened the source and confirmed the details on the date shown. Each listing shows the source link and "Checked by our team on <date>". Only listings from `.gov.ph` / `.edu.ph` sources get the "Official" badge. Students can report wrong or scam listings. Never call listings "verified".
  2. Deadline-first: "Closing this week" at the top, reminders by phone notification and email, "Add to calendar". Listings with no fixed date say so ("Rolling: apply any time" or "Usually opens in <month>").
  3. Made for how students share: one tap to share to Messenger group chats; no login needed to browse.
  4. "Para sa'yo ba?" filters by region (all 18), course, and year level; an OJT checklist based on CHED CMO 104; students can submit links that a curator then checks. No scraping; AI never publishes anything.
- Status: working app already built (not a mockup), built on free-tier infrastructure. [open, dated pilot listings: N from the sprint scorecard] · [live link: yes/no]. 30-day validation sprint with 2 campus IT organizations (2026-10-27 → 2026-11-25) [orgs live: N from the sprint scorecard]. Soft launch January 2027 (OJT season) only if the sprint passes.
- Who it's for first: 3rd- and 4th-year IT/CS/IS students looking for hackathons, CTFs, OJT, and tech scholarships. Wider college audience only after the pilot.
- Business model: free for everyone: students, organizers, and schools never pay, and listing an opportunity is free. Now: grants and startup competitions. Later, once there's traffic: clearly marked ads as the only income, with blocked categories (loans, gambling, fake scholarship or job offers) and no ads in reminders. No ads run yet.
- Market context (only these; keep the wording exact and drop any line marked ⚠️ from a judged pitch until someone checks the source):
  - "About 1 in 3 unemployed Filipinos is a college graduate." [Team: confirm the PSA Labor Force Survey source before a judged pitch, or remove this line.]
  - "We found no dedicated Philippine hackathon directory; they're posted on Luma, GDG pages, DEVCON, and Facebook." ⚠️
  - "84,518 students took the 2025 DOST-SEI undergraduate scholarship exam; 10,907 qualified." ✅
  - "The PH CTF scene is small, but it has anchors: DICT Hack4Gov ran a 20-team national student CTF final in December 2025." ✅
  - "Big free Facebook scholarship pages (Scholarships PH ≈ 639K followers) already cover general scholarships, so we lead with tech." ⚠️
- Team: [names, roles, schools, one line each on why we can build this]
- Traction to date (fill only from the sprint scorecard; leave out any line you can't fill): [interviews done: N] · [unprompted "missed one": N of M] · [sign-ups from the 2 orgs: N] · [% who saved a listing: N%] · [% who came back in a later week: N%] · [curator hours per week: N]. If there are no sprint numbers yet, write "pre-launch: working app, validation sprint under way". Never make these up.
- Live demo link / QR code target: [https://your-oportune-url]

THE AUDIENCES AND THEIR ASK (write one closing line for each)
A. Competition judges: [competition name, date] — ask them to back us / see the live app.
B. Student org officers and school career offices: join our pilot and share Oportune with their members.
C. People who might join the team or mentor us: [what roles we need, e.g., curator, marketing, mentor].

THE 5 SLIDES (keep this order)
1. HOOK — An audience question, not a logo slide. Example: "Raise your hand if you found out about a hackathon or OJT opening AFTER the deadline." Big text, one image of a messy Facebook feed or crowded group chat.
2. PROBLEM — Three short pains with icons: scattered, late, scams. One line each.
3. SOLUTION + LIVE DEMO — A phone mockup of the Browse screen and a big QR code to the live app. Stage direction: "Scan this now, find one opportunity for you in 10 seconds." This is the interactive moment. [Only if the app is deployed; otherwise use the screen recording.]
4. WHY IT WORKS + EVIDENCE — Our 3 differentiators (Checked / Deadline-first / Shared in group chats), then the evidence line built only from the sprint scorecard numbers in "Traction to date" (e.g., "[N] IT/CS students interviewed, [N] missed one"). If there are no sprint numbers yet, say "Validation sprint with 2 campus IT orgs, results [date]". Model in one line: "Free for everyone. Funded by grants now, by clearly marked ads later."
5. ASK — The ask for this audience, the QR code again, team names, and one contact line (email or Messenger link).

INTERACTIVITY REQUIREMENTS (PowerPoint features only, nothing that needs internet except the QR/link)
- Slide 1: a hidden "reveal" (click to show the answer line, using an Appear animation) after the audience answers.
- Slide 3: a clickable phone mockup that hyperlinks to the live app; a QR code big enough to scan from 3 meters (at least 6 cm on a projected slide).
- Use Zoom or hyperlinked buttons on slide 1 so I can jump to slide 3 (demo) or slide 5 (ask) if time runs short.
- Optional slide-4 poll: "Which do you miss most often? Hackathons / CTFs / OJT" with three clickable answers that each jump to a matching example listing screenshot, then back.
- Add speaker notes on every slide with the exact script lines.
- Transitions: Morph between slides 2 and 3 (the messy feed "cleans up" into the Oportune feed). Nothing slower than 0.5 s.

DESIGN (match our app's look: "campus sticker board")
- Background cream #FFF6E5, text near-black #111111.
- Accent colors as sticker cards with a 2-3 px black border and a hard offset shadow: sun #FFD23F, tomato #FF6B57, sky #7CC4FF, mint #6EE7B7, lilac #C4B5FD, lime #C6F26B.
- Headings: Bricolage Grotesque ExtraBold. Body: Public Sans. Minimum 28 pt on slides, max 15 words per slide (except slide 4).
- Real app screenshots instead of stock photos: [attach screenshots of Browse, a listing page, the OJT checklist].
- Must be readable on a phone screen too, because I'll show it one-on-one.

DELIVERY RULES
- The 60-second script must be speakable in 60 seconds at a calm pace. Mark where to pause.
- Open with the question, not with my name.
- Say "free for students" at least once and "checked" at least twice, and explain once what checked means ("a person opened the source and confirmed the details on the date shown"). Never say "verified".
- Never state a user, partner, revenue, or market number that isn't in THE PRODUCT above.
- End with one clear ask, not a list.
- Give me a 10-second fallback line if the QR/demo fails.

OUTPUT FORMAT
1. 60-second script (by slide, with [stage directions])
2. 30-second hallway version
3. Slide-by-slide build sheet: title, on-slide text, visuals, animations/links, speaker notes
4. Three closing asks (A, B, C)
5. Five judge questions with answers
6. A 5-item checklist to rehearse (timing, QR test, offline backup, etc.)
```

---

## Tips

- **Practice with a timer.** 60 seconds is about 145 words. If you go over, cut slide 2 to one line.
- **Test the QR code** from the back of a room and on mobile data, not Wi-Fi.
- **Have an offline backup:** a 15-second screen recording of the app in slide 3, in case there's no internet.
- **One-on-one meetings:** skip the deck, open the app on your phone, say the 30-second version, and let them scroll.
- Don't claim users, partners, or awards you don't have yet. Judges check. Your evidence is the [sprint scorecard](../validation/06-30-day-validation-sprint.md#3-weekly-scorecard): before it has numbers, "pre-launch with a working app, validation sprint under way" is the honest line.
- If a judge asks "how many users?", give the real scorecard number, even if it's small.
