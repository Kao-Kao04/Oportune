# Launch Checklist (Phase 1 MVP)

Where the MVP stands after M1–M6, and what is left before students can use it. Update the boxes as you go.

**Two stages.** The [30-day validation sprint](validation/06-30-day-validation-sprint.md) (2026-10-27 → 11-25) needs §2, the **Sprint** rows of §3–§4, and §6. Everything marked **Soft launch** waits until the sprint says "Continue". Feature freeze until then ([final decisions §1c](research/final-decisions.md#1c-updates-after-the-court-review-2026-10-26)).

**Owner key:** **Team** = needs an account, a payment, a legal decision, or access only the team has. **Dev** = code or configuration work.

---

## 1. Built and tested (M1–M6)

- [x] Browse, Closing soon, category filters, typo-tolerant search, listing pages, link previews
- [x] Admin panel: listings, publish/expire/archive, re-check queue, reports, CSV import with diffs, roles, stats
- [x] Accounts: email-link sign-in (Google ready once configured), quick profile, save, Saved, Me, delete account
- [x] Reminders: daily job, push (tested with a real browser), email (code ready, needs Resend), unsubscribe
- [x] Daily jobs: auto-expire, cleanup; `job_runs` history; protected by `CRON_SECRET`
- [x] Installable app: manifest, icons, service worker
- [x] Analytics (anonymous, own database) and Stats page
- [x] Server error logging (`src/instrumentation.ts`)
- [x] Privacy notice and terms **drafts** (`/privacy`, `/terms`)
- [x] RLS verified for logged-out visitors and students; 70+ unit tests; `npm run smoke`

**Phase 2 (built 2026-10-25, not committed yet; frozen as is, [final decisions](research/final-decisions.md)):**

- [x] "Para sa'yo ba?" filters on Browse: region (18 incl. NIR), course group, year level; "Use my course and year"; admin tags per listing (empty = open to all)
- [x] Add to calendar on listing pages: `.ics` download (alerts 7 days and 1 day before) and Google Calendar link
- [x] `/submit` for signed-in students (captcha, 10 per day) + Admin → Submissions queue → "Create listing" pre-fills a draft and links the submission
- [x] `/ojt` checklist: CMO 104 §16.1 items marked "CHED rule", ticks saved on the phone only
- [x] 95 unit tests; end-to-end browser check of all four with a synthetic account (cleaned up)

## 2. Before launch: security (do first)

| | Task | Owner |
|---|---|---|
| [ ] | **Rotate the Supabase secret key** (it was pasted in chat): create a new one, delete the old one, update `.env.local` | Team |
| [ ] | **Reset the database password** (it was pasted in chat), update `DATABASE_URL` | Team |
| [ ] | Set a real `VAPID_SUBJECT` (`mailto:` a team address) | Team |
| [ ] | Turn on Supabase backups (Pro plan has daily backups) and **test one restore** | Team |

## 3. Before launch: accounts and services

| | Task | Owner |
|---|---|---|
| [ ] | Buy a domain (e.g. `oportune.ph`). **Soft launch**; the sprint can use the free `*.vercel.app` address | Team |
| [ ] | **Resend**: verify the domain (SPF/DKIM/DMARC), set `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM_ADDRESS`; send a test reminder. **Sprint** if a sending domain is ready; otherwise push-only reminders for the sprint | Team + Dev |
| [ ] | **Supabase custom SMTP** with the same Resend account (sign-in emails; the built-in sender is for testing only) | Team |
| [ ] | **Google sign-in**: OAuth client in Google Cloud, paste ID/secret in Supabase → Providers → Google. **Soft launch** (email link is enough for the sprint) | Team |
| [ ] | **Cloudflare Turnstile**: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (reports and submissions are refused in production without them). **Sprint** | Team |
| [ ] | Supabase → Authentication → URL configuration: Site URL = production URL; redirect allow-list `<URL>/**` | Team |
| [ ] | Supabase → Email templates → Magic Link: use the `/auth/confirm?token_hash=…` link ([Deployment Part 4 §9](deployment/04-domain-jobs-and-push.md#9-domain-and-https)) | Team |
| [ ] | Optional: error tracking service (e.g. Sentry) wired into `src/instrumentation.ts` | Dev |

## 4. Before launch: deploy

| | Task | Owner |
|---|---|---|
| [ ] | Push the branches to GitHub and merge `m1`…`m6` into `main` (CI runs lint, typecheck, tests, build) | Team (`gh auth login`) + Dev |
| [ ] | **Sprint:** create a Vercel project from the repo; add every variable from `.env.example` (production values). Only after §2 (keys rotated) | Team |
| [ ] | Separate **staging** Supabase project for testing (production data never goes to staging) | Team + Dev |
| [ ] | Connect the domain; confirm HTTPS | Team |
| [ ] | Confirm the 3 cron jobs appear in Vercel → Settings → Cron Jobs | Dev |
| [ ] | Run `npm run smoke -- https://<production URL>` and the manual checks it prints | Dev |
| [ ] | Paste a listing link into Messenger and Facebook's Sharing Debugger | Team |
| [ ] | Test on a low-end Android phone on mobile data, and on an iPhone added to the home screen | Team |

## 5. Before launch: legal and privacy (Data Privacy Act)

**Soft launch** (and always before 1,000 users). During the sprint (a few dozen sign-ups): keys rotated first, the `/privacy` draft live, profile kept to school, course, year, interests, and sign-up stays 18+.

| | Task | Owner |
|---|---|---|
| [ ] | Decide the legal entity that operates Oportune (the personal information controller) | Team |
| [ ] | Designate a **Data Protection Officer**; check whether NPC registration is required | Team |
| [ ] | Have a Philippine lawyer review `/privacy` and `/terms`; fill every `[bracketed]` placeholder | Team |
| [ ] | Decide the rule for users under 18 (parent/guardian consent?) and update the notice and app | Team, then Dev |
| [ ] | Confirm data processing terms with Supabase, Vercel, Resend (cross-border transfers) | Team |
| [ ] | Write the breach response plan (72-hour NPC notification) and name who runs it | Team |
| [ ] | Verify NPC Advisory No. 2026-01 and NPC rules cited in the docs | Team |
| [ ] | Ask the lawyer: is school/course/year "education" data (sensitive)? If yes, register with NPC before 1,000 users ([final decisions §2.4](research/final-decisions.md#24-data-privacy-act)) | Team |
| [ ] | Add to Terms: Oportune is a free directory; it doesn't recruit, screen, place, or charge students | Team, then Dev |

## 6. Before launch: content

| | Task | Owner |
|---|---|---|
| [ ] | Make the first admin: sign in once, then `npm run grant-role -- <email> admin` | Team + Dev |
| [ ] | Review the **25 draft listings** in Admin → Re-check (confirm on the organizer's own page, then publish) | Curators |
| [ ] | **Sprint:** reach **40+ open, dated listings** in hackathons, CTFs, OJT/internships, and tech scholarships, from organizers' own pages | Curators |
| [ ] | **Sprint:** rewrite every undated summary: "Rolling: apply any time" or "Usually opens in <month> (based on <year>)" | Curators |
| [ ] | **Sprint:** log curator time daily in [`curation-log.csv`](validation/templates/curation-log.csv) | Curators |
| [ ] | Prepare the post for the pilot orgs (link + one line on what "checked" means) | Team |
| [ ] | **Soft launch:** 30+ IT/CS OJT and internship listings for January 2027 from official career pages | Curators |
| [ ] | **Soft launch:** undergraduate scholarships and non-IT opportunities (after the IT/CS pilot) | Curators |
| [ ] | Tag every listing with region, course group, and year level (empty = open to all) | Curators |
| [ ] | Line up 2 campus IT orgs for the pilot | Team |
| [ ] | Test web push on real Xiaomi, Oppo, Realme, Samsung, and iPhone (installed app) | Team |

## 7. After launch (first 2–4 weeks)

- Review **Admin → Stats** every 2 weeks against the targets in [idea Part 5 §13](idea/05-validation-metrics-risks.md#13-how-well-know-each-feature-is-needed).
- Fix reports within 48 hours; clear the Re-check queue weekly.
- Watch `job_runs` (failed runs) and email sending limits.
- Known small gaps to schedule:
  - Link-preview image uses the default font (title not bold)
  - Unknown listing pages return HTTP 200 with a "not found" message (streaming limitation)
  - School list is suggestions only (full CHED list later)

## 8. Next phases

- **Now:** the [30-day validation sprint](validation/06-30-day-validation-sprint.md); no new features (`?ref=` links, the one exception, are built)
- **First after "Continue":** "Wins on listings", if the student stories test worked ([final decisions §1e](research/final-decisions.md#1e-student-stories-and-wins-2026-10-30))
- **After "Continue" (before January 2027):** the small builds in [idea Part 3 §6.2b](idea/03-features-and-workflow.md#62b-next-small-builds-after-the-sprint-passes), one at a time: education level, "Share to Oportune", paste-to-draft, hide thin categories
- **Phase 3 (July 2027 push):** Android app, "For you" filter, Messenger/Telegram reminders, offline saved listings
- **Deferred:** AI helper, document uploads, application tracker ([why](research/final-decisions.md))
