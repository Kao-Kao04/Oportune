# Google Stitch Prompts v2 — Student-Friendly Redesign

Prompts for redesigning Oportune in [Google Stitch](https://stitch.withgoogle.com/), starting from what is **already built** and making it easier for students to use. The original prompts are in [stitch-prompts.md](stitch-prompts.md); the colors and font stay the same so designs can be built straight into the app.

## How to use

1. New Stitch project in **Mobile** mode. Paste **Prompt 0** first, then one screen prompt at a time.
2. Generate **2–3 variants** of each screen and pick with real students (5 is enough). Ask: "What would you tap first?" and "Is anything confusing?"
3. If a screen looks generic, use the fix-up prompts in [stitch-prompts.md](stitch-prompts.md#fix-up-prompts-if-it-looks-too-ai).
4. Bring the chosen screens back to the team. Items marked **(needs data)** need new listing fields before they can be built.

## What changes, and why

| Student reality (from [idea Part 2](../idea/02-users-and-principles.md)) | Today | v2 change |
|---|---|---|
| Scrolls fast on a cheap phone; skims, doesn't read | Rows show title, org, category | **Quick-fact chips** on every row: Free, Online/In person, who it's for |
| Acts only when a deadline is near | "Closing soon" is a separate tab | **"Closing this week" strip** at the top of Browse |
| Long posts are hard to read | Detail page is paragraphs | **"At a glance" box** + numbered **How to apply** steps |
| Wary of scams | Badge + source link | **"Why you can trust this"** panel + scam tip ("Real scholarships never ask you to pay") |
| Lives in Messenger and group chats | Generic Share | **Messenger-first share** with a ready-made message |
| Hates long forms | 6 questions on one screen | **3 short steps** with progress, big tap targets |
| Wants to know "is this for me?" | No signal | **"For you" match line** from the profile **(needs data)** |
| Uses Taglish | English only | Friendly **Taglish microcopy** in a few key places (optional variant) |

---

## Prompt 0 — Master (paste first)

```
Redesign a mobile app called "Oportune" for college students in the Philippines (any school, any course). It lists verified scholarships, internships, hackathons, CTFs, and free courses, sorted by deadline. Students browse without an account, share listings to Messenger group chats, save them, and get reminders before deadlines. It is free.

Make it feel friendly and easy for a busy 19-year-old on a cheap Android phone with prepaid data, while staying trustworthy and calm, like a helpful upperclassman, not a bank and not a game.

Visual style (keep these exact values):
- Background warm off-white (#FAF8F3); text near-black (#1C1B19); secondary text warm gray (#6B675F); dividers #E4E0D6.
- One accent: deep teal (#0F5257) for main buttons and selected states.
- Deadline colors only for urgency: red (#B3261E) = 3 days or less; amber (#9A6700) = this week.
- Official-site badge: small green (#2E6B3F) check label "Official .gov.ph" / "Official .edu.ph".
- Font: Public Sans. Body text at least 16px. Tabular numbers for dates.
- Corner radius 6px; thin dividers; light shadows only on sheets and pop-ups.
- Tap targets at least 48px tall. Main actions within thumb reach at the bottom of the screen.
- No photos, gradients, glassmorphism, 3D illustrations, sparkles, or emojis. Simple outlined icons only where they help.

Navigation: bottom bar with 3 tabs — Browse, Saved, Me. Top bar: "Oportune" on the left, search icon on the right.

Tone: short, plain, warm. Talk like a classmate. Example: "Closes in 2 days", "Free to apply", "Open to all year levels".
```

## Prompt 1 — Browse (home)

```
Same style. Create the Browse screen (logged out).

From top to bottom:
1. A one-line welcome under the top bar (only for first-time visitors): "Scholarships, internships, and contests for PH college students. Checked by our team." with a small "×" to hide it.
2. A search field: "Search scholarships, OJT, contests…". Under it, 4 small suggestion chips: "DOST", "OJT", "CTF", "Free courses".
3. Section "Closing this week" — a horizontal scroll of compact cards (not tall), each with: a big red or amber countdown ("Today", "2 days left"), the title (2 lines max), and the organization. Cards:
   - "DOST-SEI ASTHRDP Graduate Scholarship" — DOST-SEI — Today — Official .edu.ph
   - "IEEEXtreme 20.0" — IEEE — 2 days left
4. Category chips (horizontal scroll): All, Scholarships, Internships, Jobs, Hackathons, CTFs, Courses.
5. The main list, grouped under small gray labels "Later" and "No fixed deadline". Each row:
   - Left column: date ("Nov 4") with "12 days left" under it.
   - Title (bold, 2 lines max), organization (gray).
   - A row of tiny quick-fact chips in gray outline: "Free", "Online" or "In person", and the category. Official badge if it applies.
   - Bookmark icon on the right (48px tap area).
   Rows:
   - "2nd Call: DOST-PCHRD Undergraduate Thesis Grant" — DOST-PCHRD — Oct 31 — Free · In person · Research grant — Official .gov.ph
   - "HKCERT CTF 2026 (Qualifying Round)" — HKCERT — Nov 4 — Free · Online · CTF
   - "2027 Graduate Talent Program – Global Banking" — UBS — Nov 4 — In person · Graduate program
   - "TESDA Online Program" — TESDA — Rolling — Free · Online · Course — Official .gov.ph
6. At the end: "Checked by our team. Always confirm on the official site."
```

## Prompt 2 — Search and quick filters

```
Same style. Create the search results screen after typing "scholarship".
- Search field at the top with the text and a clear "×".
- Under it, a row of toggle chips that filter instantly (no "Apply" button): "Closing this week", "Online", "Official sources only", "Open to my year" (this one shows a small lock icon and "Sign in" when logged out).
- Result count: "6 results for "scholarship"".
- Results use the same rows as Browse.
- Also design the no-results state: "No results for "schlarship". Did you mean scholarship?" with a teal link, and a second line "Or browse all opportunities".
```

## Prompt 3 — Opportunity detail

```
Same style. Create the detail screen for "2nd Call: 2026 DOST-PCHRD Undergraduate Thesis Grant in Natural Products" by DOST-PCHRD, Official .gov.ph.

From top to bottom:
1. Back arrow. Title, organization, category, official badge.
2. Deadline block with a thick left border: "Closes Oct 31, 2026 · 8 days left".
3. An "At a glance" box with 4 short rows and simple icons:
   - Who: "Undergrads in Pharmacy, Chemistry, Nursing, allied health"
   - What you get: "Up to ₱75,000 for your thesis"
   - Cost to apply: "Free"
   - Where: "Nationwide · submit through your regional consortium"
4. "How to apply" as numbered steps (3 max):
   1. "Check that your thesis hasn't started yet"
   2. "Prepare your proposal and endorsement"
   3. "Submit through your Regional Health R&D Consortium"
5. A collapsible "Why you can trust this" panel: source "pchrd.dost.gov.ph", "Last checked Oct 23, 2026 by our team", and a tip in a soft amber box: "Real scholarships never ask you to pay a fee to apply."
6. Small gray link: "Something wrong? Report this listing".
7. Sticky bottom bar (thumb zone): bookmark button (icon), share button (icon), and a wide teal button "Apply on official site ↗".
```

**(needs data):** "What you get", "Cost to apply", and "How to apply" steps are new listing fields. Until then the screen uses the summary, eligibility, and requirements text.

## Prompt 4 — Share to Messenger

```
Same style. Create the share sheet that opens from the share button on a listing.
- A preview of the message that will be sent, in a chat-bubble style box:
  "Uy, may thesis grant ang DOST-PCHRD, up to ₱75k! Deadline Oct 31. oportune.ph/opportunities/…"
- Big buttons in a row: "Messenger" (first), "Copy link", "Facebook", "More…".
- Small text: "The link shows a preview with the deadline."
Behind it the detail screen is dimmed.
```

## Prompt 5 — Save without an account

```
Same style. Create the bottom sheet shown when a logged-out student taps the bookmark.
- Heading: "Save this and we'll remind you"
- Line: "7 days and 1 day before the deadline. Free, no password."
- Button "Continue with Google" (standard Google style), then a text link "Use my email instead".
- Tiny gray text: "We only ask your school, course, and year."
```

## Prompt 6 — Quick setup in 3 short steps

```
Same style, no bottom bar. Create 3 frames of a quick setup with a thin progress bar at the top ("1 of 3").
Frame 1 — "Where do you study?": a big search field with suggestions as you type ("Gordon College", "PUP Manila", "UP Diliman"), and "My school isn't listed" link.
Frame 2 — "What's your course and year?": a list of big tappable rows for field of study (IT & Computer Science, Engineering, Health, Education, Business, Arts & Humanities, Sciences, Agriculture, Other), then year level as 6 large buttons (1st, 2nd, 3rd, 4th, 5th, Graduating).
Frame 3 — "What are you looking for?": large toggle chips (Scholarships, Internships, Jobs, Hackathons, CTFs, Courses, Events), a checkbox "I am 18 or older", and the button "Done — show my opportunities".
Each frame has a teal "Next" button at the bottom and a small "Back".
```

## Prompt 7 — Saved

```
Same style, "Saved" selected in the bottom bar. Create the Saved screen.
- At the top, a highlight card: "Next deadline: HKCERT CTF 2026 — Nov 4 (12 days)". Under it: "Reminders on: phone + email" with a small "Change" link.
- List grouped as "This week", "Later", "No fixed deadline", "Closed" (closed rows in gray).
- Each row has a filled bookmark (tap to remove) and a small line "Reminder Oct 28" in gray.
- Empty state frame: an outlined bookmark icon, "Nothing saved yet", "Tap the bookmark on any opportunity and we'll remind you before it closes.", and a teal button "Find opportunities".
```

## Prompt 8 — Notifications prompt (after the first save)

```
Same style. Create a small pop-up above the bottom bar right after the first save.
- "Saved! Want a phone notification too?"
- "We'll ping you 7 days and 1 day before. Nothing else, promise."
- Buttons: "Turn on" (teal) and "Not now".
Second frame for iPhone: "To get notifications on iPhone, tap Share → Add to Home Screen, then open Oportune from there." with "Got it".
```

## Prompt 9 — Me

```
Same style, "Me" selected. Create the Me screen.
- Top: initials avatar circle (teal), name "Juan dela Cruz", "Gordon College · BSIT · 3rd year", "Edit".
- "Reminders" card with two big switches: "Phone notifications — this phone", "Email reminders", and the line "7 days and 1 day before each deadline".
- "Help" list: "How we check listings", "Spot a scam", "Send feedback".
- "Account" list: "Privacy notice", "Terms", "Sign out", "Delete my account" (red).
```

## Prompt 10 — Taglish microcopy variant (optional)

```
Create a variant of the Browse and Detail screens with friendly Taglish microcopy in only these places, everything else in English:
- Closing strip label: "Malapit na ang deadline"
- Countdown: "Bukas na!" (1 day left), "Ngayon na!" (today)
- Empty saved state: "Wala ka pang na-save. I-bookmark mo lang ang gusto mo."
- Scam tip: "Walang totoong scholarship na maniningil ng bayad para mag-apply."
Keep it light; no slang that would confuse students from other regions.
```

---

## After picking designs

1. Screenshot the chosen frames into the team's shared folder.
2. Mark which changes need **new data** (quick-fact chips, "At a glance", steps, "For you" match) so curators can start filling those fields.
3. Hand them to development; the colors and fonts already match the app, so most changes are layout and copy.
