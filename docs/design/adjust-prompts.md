# Adjustment Prompts — Tweak Designs and Build Them

Two kinds of copy-paste prompts:

- **Part A — in Google Stitch:** adjust a generated screen without starting over.
- **Part B — in Claude Code:** turn a chosen Stitch design (or a change you describe) into real app code.

Use them after [stitch-student-friendly.md](stitch-student-friendly.md). Replace everything in `[brackets]`.

---

## Part A — Adjusting in Google Stitch

### Rules that make Stitch edits work

1. **One change per prompt.** Several changes at once make Stitch redraw the whole screen.
2. **Name the exact element** ("the deadline column in each list row"), not "the design".
3. **End with "Keep everything else the same."**
4. If a result is worse, undo and rephrase instead of stacking fixes.

### Template

```
On the [screen name] screen, change [exact element] to [what you want]. Keep everything else the same.
```

### Layout and spacing

```
On the Browse screen, make each list row more compact: reduce the vertical padding so about 5 rows fit on a 6-inch phone without feeling cramped. Keep everything else the same.
```
```
On the Browse screen, move the search field up into the top bar as a full-width field and remove the separate search icon. Keep everything else the same.
```
```
On the Opportunity detail screen, move the "Apply on official site" button so it stays fixed at the bottom of the screen, full width, 52px tall. Put the bookmark and share icons to its left. Keep everything else the same.
```
```
On the Browse screen, show the "Closing this week" cards as a vertical list of 2 rows instead of a horizontal scroll. Keep everything else the same.
```

### Readability and accessibility

```
On all screens, increase body text to 16px and secondary text to 14px, and make sure gray text on the off-white background has at least 4.5:1 contrast. Keep the layout the same.
```
```
On the [screen name] screen, make every button and tappable row at least 48px tall with at least 8px between tap targets. Keep everything else the same.
```
```
On the Opportunity detail screen, limit the summary to 3 lines with a "Read more" link that expands it. Keep everything else the same.
```

### Color and emphasis

```
On the Browse screen, make the deadline (date and days left) the strongest element in each row: bigger, bold, tabular numbers. Make the organization name lighter. Keep everything else the same.
```
```
Use red (#B3261E) only for deadlines 3 days or less, amber (#9A6700) only for this week, and gray for rolling or TBA. Remove any other use of red or amber. Keep everything else the same.
```
```
On the [screen name] screen, replace any card shadows with a 1px #E4E0D6 border. Keep everything else the same.
```

### Words (copy)

```
On the [screen name] screen, rewrite all button and label text in short, friendly words a Filipino college student would use. No slogans, no exclamation marks except for "Saved!". Keep the layout the same.
```
```
On the Opportunity detail screen, change the section headings to: "Who can apply", "What you get", "What you need", "How to apply", "Where". Keep everything else the same.
```
```
On the Saved screen, change the empty state text to: "Wala ka pang na-save. I-bookmark mo lang ang gusto mo, and we'll remind you before it closes." Keep everything else the same.
```

### Trust and safety

```
On the Opportunity detail screen, add a small amber info box under "Why you can trust this" that says "Real scholarships never ask you to pay a fee to apply. Report anything suspicious." Keep everything else the same.
```
```
On the Browse screen, make the "Official .gov.ph" badge slightly larger with a check icon, and add a tiny "?" that explains: "This links to an official government website." Keep everything else the same.
```

### Variants to compare with students

```
Create 2 variants of the Browse list rows: Variant A with the deadline column on the left (current); Variant B with the deadline as a colored label under the title. Use the same 4 listings in both.
```
```
Create 2 variants of the Quick setup: Variant A as one scrolling page; Variant B as 3 steps with a progress bar. Same questions in both.
```

### When something looks wrong

| Problem | Prompt |
|---|---|
| Looks "AI-made" (gradients, glow, sparkles) | `Remove all gradients, glows, sparkle icons, and illustrations. Use flat off-white backgrounds. Keep the layout the same.` |
| Too many colors | `Use only teal (#0F5257) as the accent color. Replace any other accent colors with near-black or gray. Keep the layout the same.` |
| Cards everywhere | `Replace the cards in the list with a simple list separated by thin 1px dividers. Keep the content the same.` |
| Text too small to read | `Increase all text sizes by one step; body text at least 16px. Keep the layout the same.` |
| Placeholder text | `Replace all placeholder text with these real listings: [paste 3–4 listings from data/opportunities.csv].` |
| Stitch changed things you didn't ask for | Undo, then repeat the prompt and add: `Do not change any other element.` |

---

## Part B — Building it in Claude Code

Paste one of these into Claude Code (this project) after picking a design. Attach the screenshot, or paste the HTML that Stitch exports.

### B1 — Implement a Stitch screen

```
Implement this Google Stitch design for the [screen name] screen in Oportune.

Design: [attach screenshot or paste the Stitch HTML/Tailwind export]

Rules:
- Keep the design tokens in src/app/globals.css (paper, ink, muted, line, teal, urgent, soon, official). Add a new token only if the design truly needs one, and tell me.
- Reuse existing components in src/components/ (ListingRow, OfficialBadge, SaveButton, ShareButton, BottomNav) and change them instead of making copies.
- Don't change data, queries, database, or server actions unless I ask. If the design needs data we don't have, show it only when the field exists and list what's missing.
- Phone first: check it at 390px wide, tap targets at least 48px, body text 16px.
- Keep accessibility: labels on inputs, alt text, visible focus, enough contrast.
- When done: run lint, typecheck, tests, and build; take a 390px screenshot; tell me what changed and what still differs from the design.
```

### B2 — Small adjustment, no Stitch

```
In Oportune, on the [screen name] screen ([URL, e.g. /opportunities/ieeextreme-20-0]), change [exact element] to [what you want].
Keep everything else the same. Show me a 390px screenshot before and after, and run lint, typecheck, and tests.
```

Examples:

```
In Oportune, on the Browse screen (/), add a "Closing this week" section at the top that shows listings due in 7 days or less as compact cards. Keep the rest of the list the same.
```
```
In Oportune, on the listing detail page, change the Share button so Messenger is the first option and the copied text says: "Uy, may [category] ang [organization]! Deadline [date]. [link]".
```
```
In Oportune, on the Quick setup (/welcome), split the form into 3 steps with a progress bar: school; field of study + year level; interests + 18-or-older. Keep the same fields and validation.
```

### B3 — New data a design needs

```
The [screen name] design needs new listing fields: [e.g., "What you get", "Cost to apply: Free/Paid", "How to apply" steps].
Add them end to end in Oportune: a database migration, the admin edit form, the CSV import mapping (optional columns), the public view, and the screen. Update docs/system-design/03-data-model.md. Existing listings keep working with the fields empty.
```

### B4 — Copy and Taglish pass

```
Review all student-facing text in Oportune (Browse, detail, sign-in, quick setup, Saved, Me, emails, notifications). Make it short and friendly for Filipino college students. Suggest Taglish only for [list places], and keep everything else in English. Show me a before/after table first; change nothing until I approve.
```

---

## Tips

- Keep a **"design changes" note**: screen, what changed, why (e.g., "students didn't notice the deadline"), and a screenshot. It helps later decisions.
- Test with **real students on real phones** before building big changes; small copy changes can ship right away.
