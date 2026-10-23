# Launch Checklist (Phase 1 MVP)

Where the MVP stands after M1–M6, and what is left before students can use it. Update the boxes as you go.

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
| [ ] | Buy a domain (e.g. `oportune.ph`) | Team |
| [ ] | **Resend**: verify the domain (SPF/DKIM/DMARC), set `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM_ADDRESS`; send a test reminder | Team + Dev |
| [ ] | **Supabase custom SMTP** with the same Resend account (sign-in emails; the built-in sender is for testing only) | Team |
| [ ] | **Google sign-in**: OAuth client in Google Cloud, paste ID/secret in Supabase → Providers → Google | Team |
| [ ] | **Cloudflare Turnstile**: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (reports are refused in production without them) | Team |
| [ ] | Supabase → Authentication → URL configuration: Site URL = production URL; redirect allow-list `<URL>/**` | Team |
| [ ] | Supabase → Email templates → Magic Link: use the `/auth/confirm?token_hash=…` link ([Deployment Part 4 §9](deployment/04-domain-jobs-and-push.md#9-domain-and-https)) | Team |
| [ ] | Optional: error tracking service (e.g. Sentry) wired into `src/instrumentation.ts` | Dev |

## 4. Before launch: deploy

| | Task | Owner |
|---|---|---|
| [ ] | Push the branches to GitHub and merge `m1`…`m6` into `main` (CI runs lint, typecheck, tests, build) | Team (`gh auth login`) + Dev |
| [ ] | Create a Vercel project from the repo; add every variable from `.env.example` (production values) | Team |
| [ ] | Separate **staging** Supabase project for testing (production data never goes to staging) | Team + Dev |
| [ ] | Connect the domain; confirm HTTPS | Team |
| [ ] | Confirm the 3 cron jobs appear in Vercel → Settings → Cron Jobs | Dev |
| [ ] | Run `npm run smoke -- https://<production URL>` and the manual checks it prints | Dev |
| [ ] | Paste a listing link into Messenger and Facebook's Sharing Debugger | Team |
| [ ] | Test on a low-end Android phone on mobile data, and on an iPhone added to the home screen | Team |

## 5. Before launch: legal and privacy (Data Privacy Act)

| | Task | Owner |
|---|---|---|
| [ ] | Decide the legal entity that operates Oportune (the personal information controller) | Team |
| [ ] | Designate a **Data Protection Officer**; check whether NPC registration is required | Team |
| [ ] | Have a Philippine lawyer review `/privacy` and `/terms`; fill every `[bracketed]` placeholder | Team |
| [ ] | Decide the rule for users under 18 (parent/guardian consent?) and update the notice and app | Team, then Dev |
| [ ] | Confirm data processing terms with Supabase, Vercel, Resend (cross-border transfers) | Team |
| [ ] | Write the breach response plan (72-hour NPC notification) and name who runs it | Team |
| [ ] | Verify NPC Advisory No. 2026-01 and NPC rules cited in the docs | Team |

## 6. Before launch: content

| | Task | Owner |
|---|---|---|
| [ ] | Review the **25 draft listings** in Admin → Re-check (confirm on the official source, then publish) | Curators |
| [ ] | Add undergraduate scholarships and non-IT opportunities (current list leans to IT and graduate study) | Curators |
| [ ] | Make the first admin: sign in once, then `npm run grant-role -- <email> admin` | Team + Dev |
| [ ] | Prepare the launch announcement for the Phase 0 channel | Team |

## 7. After launch (first 2–4 weeks)

- Review **Admin → Stats** every 2 weeks against the targets in [idea Part 5 §13](idea/05-validation-metrics-risks.md#13-how-well-know-each-feature-is-needed).
- Fix reports within 48 hours; clear the Re-check queue weekly.
- Watch `job_runs` (failed runs) and email sending limits.
- Known small gaps to schedule:
  - Link-preview image uses the default font (title not bold)
  - Unknown listing pages return HTTP 200 with a "not found" message (streaming limitation)
  - School list is suggestions only (full CHED list later)

## 8. Next phases

- **Phase 2:** application tracker, OJT checklist, "For you" filter, document uploads (after NPC check), AI helper
- **Phase 3:** Android app, "Share to Oportune" + curator inbox, Messenger/Telegram reminders, offline saved listings
