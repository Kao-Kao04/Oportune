# Curator Guide

For everyone who helps fill Oportune: scouts who share posts and curators who publish listings. Read it once, keep it open for your first week. The rules behind it are in [final decisions §1f](research/final-decisions.md#1f-every-source-in-one-system-2026-11-01) and `/terms` §5–§7.

## 1. Our one promise

**Every listing was checked by a person against the organizer's own source.** That promise is the whole product. So:

- Nothing goes live without a curator opening the source. Not imports, not shares, not (later) AI drafts.
- We say "checked", never "verified" or "guaranteed".
- When in doubt, leave it as a draft with **Needs check** on. A missing listing costs little; a fake or wrong one costs our trust.

## 2. Who does what

| Role | Who | Can |
|---|---|---|
| **Scout** | Any signed-in student (usually one per org or campus) | Share posts to Oportune from their phone or `/submit`. Doesn't need a role |
| **Curator** | Trusted scouts the team picked | Everything in Admin: submissions, paste a post, new and edited listings, publish, re-check, reports, wins, imports, stats |
| **Admin** | The founder (and later 1–2 leads) | Everything a curator can, plus adding or removing curators in Admin → Users & roles |

To become a curator: sign in once at `/sign-in`, then ask an admin to add your email in **Admin → Users & roles**.

## 3. Setting up (10 minutes)

1. Sign in on your phone and laptop with the same email.
2. **Android:** open Oportune in Chrome → menu → **Install app** (or **Add to Home screen**). Now "Oportune" shows up in the share menu of Facebook, Instagram, X, LinkedIn, and Messenger. **iPhone:** no share menu yet; copy the link and paste it into `/submit`.
3. Follow your assigned pages (organizer pages, campus orgs, GDG/AWS/Microsoft communities, DICT, DOST-SEI, company career pages) and turn on notifications. The team keeps the shared list of 30–50 pages; tell us when you find a good new one.
4. Bookmark: **Admin → Submissions**, **Admin → Paste a post**, **Admin → Re-check**.

## 4. Daily routine (15 minutes)

Work in this order, oldest first:

1. **Reports** (Admin → Reports): wrong deadline, dead link, or an organizer asking for a fix or removal. These come first; we promise **48 hours**.
2. **Submissions** (Admin → Submissions): what students and scouts shared. Turn each into a listing (§5) or mark it Duplicate or Rejected.
3. **New posts you saw**: share them (phone) or use **Admin → Paste a post** (laptop), then finish the listing.
4. **Re-check** (Admin → Re-check): rolling or TBA listings nobody checked in 30 days. Open the source, update, and save.
5. **Log your time** in [`curation-log.csv`](validation/templates/curation-log.csv): date, your name, minutes, listings added, updated, expired, reports fixed, sources checked, notes.

**Weekly** (one curator, rotate): Admin → Import → **Fetch upcoming CTFs**; re-import permitted calendar feeds; review **Admin → Wins**; draft the "Opportunities this week" post for the pilot orgs' pages (links tagged `?ref=<org>`).

If curation takes the team more than **10 hours a week** in total, tell the founder: that's a sprint kill signal we must see, not hide.

## 5. Turning a post into a listing

**First, is it allowed?**
- ✅ Public post by the organizer (their Page, website, form, Luma, Devpost).
- ⚠️ Seen in a **private group or group chat**: find the same opportunity posted publicly, or ask the organizer (template in §9). Otherwise skip it.
- ❌ A student reposting with no organizer source anywhere: keep looking for the organizer, or reject.

**Then check for duplicates:** search the title in Admin → Listings. Already there? Mark the submission **Duplicate** (and update the listing if the post has newer info).

**Then fill the form, field by field:**

| Field | How |
|---|---|
| **Title** | The opportunity's own name, plus the year or batch: "HackPH 2026", not "CALLING ALL DEVS!" |
| **Organization** | Who runs it (the org or company), not the page that reposted it |
| **Category** | One of the 10. Hackathons and CTFs have their own; webinars and summits go in "Events and conferences" |
| **Summary** | Max 300 characters, our own words. See §6 |
| **Who can apply** | Exactly what the source says (year level, course, region, age, team size). Don't guess |
| **What you need** | Requirements from the source (CV, school ID, endorsement, fee if any) |
| **Open to** (tags) | Tick only what the source says. Empty = open to everyone |
| **Location / Delivery** | City or campus; Online, In person, or Hybrid |
| **Applications open** | A date, Open now, Rolling, or TBA |
| **Deadline** | The **registration** deadline, not the event day. No date? Rolling or TBA, and the summary must say why (§6) |
| **Official source URL** | The organizer's own post or page. A public Facebook post by the organizer is fine. The badge appears only for .gov.ph and .edu.ph |
| **Application URL** | The registration form or page, if different from the source |
| **Confidence** | High = everything confirmed on the source. Medium = some details from older cycles. Low = keep as draft |
| **Last checked** | Today, the day you opened the source |
| **Needs check** | On until you confirmed everything. You can't publish while it's on |
| **Internal notes** | For curators only: where you found it, who to ask, doubts. Never shown to students |

Before you press **Publish**, go through "Before you publish" on the page:
- ☐ Open to the public
- ☐ Source is the organizer's own; Apply is their form or page
- ☐ Our own words; no names, numbers, or photos of people
- ☐ Their poster or pubmat is linked, not uploaded

## 6. Writing the summary

- **One or two sentences:** what it is, the main benefit, and who it's for. Facts, not hype.
- **Our own words.** Never copy the caption. Facts (name, dates, prize, eligibility) are fine; their sentences and emojis are not ours.
- **No people:** no names, phone numbers, emails, or photos of contact persons or past winners.
- **Money:** write amounts plainly ("PHP 75,000 grant", "PHP 50,000 top prize"). If there's a registration fee, say so.
- **No dated deadline?** Start the summary with one of these, exactly:
  - "Rolling: apply any time."
  - "Usually opens in <month> (based on <year>)."
  - "Open now; no closing date listed."
  - "Not announced yet."

| ❌ Don't | ✅ Do |
|---|---|
| "🔥 CALLING ALL DEVS!!! Join the BIGGEST hackathon of the year!!! 🚀" | "A 36-hour hackathon for college students building AI tools for local government; teams of 3–5, PHP 50,000 top prize." |
| "Contact Ms. Reyes at 0917… for questions." | (Leave contacts on the source; students click through.) |
| "Guaranteed internship for all applicants!" | "A six-week paid summer internship with mentoring; past cycles took IT, CS, and engineering students." |

## 7. Scam and red-flag check

Keep it as a draft and tell the founder if any of these show up:

- Asks students to **pay** to apply ("processing fee", "reservation fee", "training kit") for something sold as a scholarship or job.
- Asks for **GCash, bank, or card details**, or OTPs, or government ID photos up front.
- Posted only by a **personal account** or a brand-new page; no organizer website or page you can find.
- Lookalike names ("DOST Scholarship Phillipines"), wrong logos, or links to odd domains or shortened links that don't lead to the organizer.
- "First 50 only, register in 1 hour" pressure plus a fee.
- Too good to be true: "guaranteed job", "PHP 100,000 for everyone who signs up".

Real programs (DOST-SEI, CHED, schools, companies) never charge to apply for a scholarship. When unsure, check the organizer's official page or email them.

## 8. Reports, organizer requests, and wins

- **Reports:** fix within 48 hours. Wrong detail → edit and set Last checked to today. Closed early → **Expire**. Fake or not allowed → **Archive** (hides it) and tell the founder. Then mark the report Fixed or Dismissed.
- **Organizer asks to fix or remove:** do it within 48 hours, no arguing. Reply politely (template in §9). Removal = **Archive** the listing and note why in Internal notes.
- **Wins** (Admin → Wins): confirm on the organizer's or school's own announcement, then write a one-line headline in our own words with **team or school names only** ("🏆 PUP team placed 2nd"). Never a student's name or photo. No proof → leave it New or reject.

## 9. Message templates

**After listing an organizer's event:**
> Hi! Nilista namin ang [event] sa Oportune, isang libreng radar ng opportunities para sa IT/CS students: [link?ref=org]. Naka-link pa rin ito sa post niyo, kaya sa inyo pa rin napupunta ang engagement. May mali ba o gusto niyong ipaayos? Sabihan niyo lang kami. Puwede rin kayong mag-submit ng susunod niyong events nang libre sa [Oportune link]/submit.

**Post from a private group or GC:**
> Hi! Nakita namin ang [event] sa [group]. Okay lang ba na ilista namin ito sa Oportune (libre, naka-link sa registration niyo)? Kung may public post kayo, iyon ang ili-link namin.

**Organizer asked for removal:**
> Noted po, tinanggal na namin ang listing. Salamat sa pagsabi, at pasensya na sa abala.

Use the live address (the `*.vercel.app` one during the sprint, the real domain later).

## 10. Never

- Scrape, use bots, or log in with tools to collect posts from Facebook, Instagram, X, LinkedIn, Devpost, or anywhere else.
- Collect students' names, photos, or achievements from social media.
- Copy captions, or upload posters, pubmats, or photos to Oportune.
- Publish something you didn't open yourself.
- Promise a student they'll qualify, or apply on their behalf.
- Share the admin panel, your sign-in links, or what's in submissions outside the curator team.

Unsure about anything? Leave it as a draft with Needs check on, write your doubt in Internal notes, and ask in the curator chat.
