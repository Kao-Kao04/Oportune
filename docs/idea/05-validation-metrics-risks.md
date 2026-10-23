# Idea 5/5 — Measuring Features, Risks & Open Decisions

> Part of [idea](../idea.md) · ← [Previous](04-mvp-scope-and-roadmap.md)

## ✅ What to do with this file

- [ ] Set up analytics so every signal in §13 can be measured from day one.
- [ ] Review the numbers every 2 weeks after launch; drop or simplify features nobody uses.
- [ ] Assign an owner to each risk (§15).
- [ ] Verify the facts in §16 before building Phase 2 features.

---

We validate by **launching small and measuring what students actually do**, not by guessing. (Optional: the [validation kit](../validation.md) has interview guides if you want deeper answers later.)

## 13. How We'll Know Each Feature Is Needed

| Feature | Signal | Keep if… (starting target) | If not… |
|---|---|---|---|
| Listings | Official-link clicks per listing view | ≥ 10% of detail views click the official link | Improve listing quality/relevance |
| Browse without login | Visits from shared links | Shared links bring new visitors every week | — (keep; it's cheap) |
| Closing soon / filters | Usage of each view and filter | Used in ≥ 20% of sessions | Simplify the home page |
| Badge + report | Reports submitted; time to fix | Reports are fixed within 48 hours | Add more curator time |
| Share | Shares per week | Shares grow week over week | Improve link previews and the button's placement |
| Save + reminders | % of signed-up users who save; % of reminders opened | ≥ 40% save something; ≥ 30% of reminders opened | Try a different reminder channel (Messenger/Telegram) |
| Quick sign-up | Sign-up completion rate | ≥ 70% of started sign-ups finish | Remove profile questions |
| Installable app | Installs | Some students install it | — (keep; low cost) |

These targets are starting points, not industry rules. Adjust them once you see real numbers, and write down why.

## 14. Success Metrics

- **Weekly active students**
- **Return rate** after 7 and 30 days
- **Official-link clicks** (students actually going to apply)
- **Saves and reminders opened**
- **Shares** (growth)
- **Listing freshness:** % of active listings with working links and future deadlines
- **Curator time** per week

## 15. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Listings go stale | Automatic expiry; refresh the spreadsheet every 1–2 weeks; report button |
| Not enough listings for some courses | Start with opportunities open to everyone; add categories based on demand |
| Scam or fake listings | Human review, source links, official-site badge, reporting |
| Students don't come back after one visit | Save + reminders; measure the 7/30-day return rate |
| Email reminders go unread | Push notifications in MVP; Messenger/Telegram later |
| Curation takes too much time | Track curator hours; add AI-assisted entry in Phase 3 |
| Legal issues with sources | No scraping of social platforms; short summaries in our own words with a link to the source; no personal data (Data Privacy Act, NPC Advisory No. 2026-01, RA 10175, RA 8293) |
| Student data leak | Collect minimal data; Row-Level Security; breach plan (notify NPC within 72 hours for qualifying breaches) |
| No money to run the platform | Keep costs low (free tiers where possible); revisit monetization later |

## 16. Facts to Verify

- [ ] Full text of NPC Advisory No. 2026-01 on scraping public personal data (before any automated collection)
- [ ] NPC breach-notification rules and whether the app needs NPC registration
- [ ] CMO 104 s. 2017 requirements and any amendments ([CHED PDF](https://legacy.ched.gov.ph/wp-content/uploads/2018/03/CMO-NO.-104-S.-2017.pdf)) before building the OJT checklist (Phase 2)
- [ ] Official DOST-SEI Return of Service rules before writing the ROS info page (Phase 3)

## 17. Open Decisions

- Telegram channel or FB page for Phase 0?
- Which reminder timing works best (7 days + 1 day before)?
- Who curates, and how many hours a week?
- When to add regional/local listings?
- When (and whether) to revisit monetization?
