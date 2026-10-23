# Validation 1/5 — How We Collect and Validate Every Idea

> Part of [validation](../validation.md) · [Next](02-recruitment-and-consent.md) →

## ✅ What to do with this file

- [ ] Put every idea (ours, the research's, and new ones from interviews) into [`templates/idea-backlog.csv`](templates/idea-backlog.csv).
- [ ] Rewrite each idea as a **problem hypothesis** with a pass signal (§2).
- [ ] Pick the cheapest test for each idea (§4). Most ideas get tested inside the interviews.
- [ ] Re-score the backlog after every 5 interviews (§5).
- [ ] Only ideas marked **Validated** go into the MVP backlog.

---

## 1. The Rule: Evidence Beats Opinion

A real opportunity is a problem that students **already spend time, money, or stress on**. It isn't something they say they'd like.

| Evidence level | Example | Weight |
|---|---|---|
| 0 — Compliment | "Ang ganda ng idea!" / "I'd use that." | Ignore |
| 1 — Opinion | "That would be helpful." | Very weak |
| 2 — Past pain, prompted | Describes a problem **after** you asked about it | Weak |
| 3 — Past pain, unprompted | Brings up the problem on their own while describing what they did | Strong |
| 4 — Workaround | Already uses a spreadsheet, notebook, group chat, paid service, or asks seniors | Strong |
| 5 — Commitment | Joins the beta, shares their real checklist, refers friends, gives a follow-up time | Strongest |

Never ask "Would you use an app that…?" Ask about **the last time it happened**.

## 2. Turn Each Idea into a Hypothesis

Template:

> **We believe** [specific student group] **struggles with** [specific problem] **because** [reason].
> **We'll know this is true when** [measurable signal] **in** [test].

Example:

> We believe **DOST scholar graduates serving their Return of Service** struggle with **knowing how many months they still owe** because **they track employment periods manually and the rules are confusing**.
> We'll know this is true when **at least half of interviewed ROS-serving graduates describe tracking difficulty unprompted (level 3+)**.

## 3. Where Ideas Come From

| Source | How to collect |
|---|---|
| Research report (20 ideas) | Already loaded into the backlog |
| Interviews | Every unprompted pain becomes a new backlog row |
| OJT coordinators | Most common missing/rejected documents |
| Public communities | Read r/dostscholars, school freedom walls, and public scholarship/OJT groups. Note recurring complaints (don't copy names or personal data) |
| Competitor gaps | What do students complain about with JobStreet, FB groups, school portals? |
| Your team | Your own OJT/scholarship experience counts as one data point, not proof |

## 4. Cheapest Test per Idea Type

| Test | Use when | Cost |
|---|---|---|
| **Interview questions** | You need to know if the pain is real | Free; built into the interview guides |
| **Document/artifact check** | Ask to see (not keep) their current tracker, spreadsheet, or checklist | Free |
| **Fake door** | Post a feature description with a "join waitlist" link and count clicks/signups | Free |
| **Concierge** | Do the job by hand for 5–10 students (e.g., a manually built ROS calculation in Google Sheets) | Your time |
| **Paper/Figma prototype** | Test whether people understand the flow | 1–2 days |
| **Wizard of Oz** | The app looks automated but a person does the work behind it | Your time |

Build software only for ideas that passed at least an interview test **and** a behavior test (concierge, fake door, or prototype).

## 5. Scoring

Score each idea 1–5 after each batch of interviews:

| Factor | Question |
|---|---|
| **Frequency** | How many interviewees have this problem? |
| **Severity** | How bad is it (money, stress, delayed graduation, penalties)? |
| **Evidence** | Highest evidence level reached (§1) |
| **Workaround pain** | How costly/clumsy is what they do today? |
| **Feasibility** | Can we build it cheaply and safely (privacy/legal)? |

**Total = Frequency + Severity + Evidence + Workaround + Feasibility** (max 25).

## 6. Status and Decision Rules

| Status | Meaning |
|---|---|
| `untested` | In the backlog, no evidence yet |
| `testing` | Questions/test running |
| `validated` | Total ≥ 18 **and** evidence level ≥ 4 from several people |
| `promising` | Total 13–17, or strong pain but no behavior evidence yet → run a behavior test |
| `killed` | Total ≤ 12 after 8+ relevant interviews, or a legal/safety blocker |

These thresholds are a starting point. Adjust them once you see real data, but write down why.
