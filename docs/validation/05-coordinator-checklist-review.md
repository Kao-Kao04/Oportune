# Validation 5/5 — OJT Coordinator Checklist Review & Synthesis

> Part of [validation](../validation.md) · ← [Previous](04-interview-guide-ojt-students.md)

## ✅ What to do with this file

- [ ] Read the actual CMO 104 s. 2017 text ([CHED PDF](https://legacy.ched.gov.ph/wp-content/uploads/2018/03/CMO-NO.-104-S.-2017.pdf)) and correct the draft checklist (§1) **before** meeting coordinators.
- [ ] Review the checklist with 3–5 coordinators from different schools (§2).
- [ ] Collect real requirement memos/handouts from schools (no student data).
- [ ] After all interviews, run the synthesis (§3) and make go/no-go decisions (§4).

---

## 1. Draft OJT Requirements Checklist (to be verified)

**This is a draft from our understanding of CMO 104 and common school practice. It is not verified.** Coordinators should mark each item.

| # | Requirement | Who issues / signs | Typical timing | Coordinator: Required? (Yes / No / School-specific) | Notes / corrections |
|---|---|---|---|---|---|
| 1 | Officially enrolled in the internship course; prerequisites completed | School/registrar | Before deployment | | |
| 2 | Memorandum of Agreement (MOA) between school and Host Training Establishment (HTE) | School + HTE | Before deployment | | |
| 3 | Internship/training plan (tasks, hours, learning outcomes) | School + HTE + student | Before deployment | | |
| 4 | Internship agreement/contract with the student | HTE + student | Before deployment | | |
| 5 | Parent/guardian consent | Parent/guardian | Before deployment | | |
| 6 | Medical/fitness certificate | Physician/clinic | Before deployment | | |
| 7 | Accident/health insurance coverage | Insurer / school | Before deployment | | |
| 8 | Pre-deployment orientation (rights, responsibilities, safety, anti-harassment) | School | Before deployment | | |
| 9 | HTE orientation | HTE | First days | | |
| 10 | Endorsement/recommendation letter | School | Before deployment | | |
| 11 | Daily/weekly attendance and hours log (DTR) | Student, signed by supervisor | During OJT | | |
| 12 | Journal/narrative or weekly reports | Student | During/after | | |
| 13 | Supervisor performance evaluation | HTE supervisor | End of OJT | | |
| 14 | Certificate of completion | HTE | End of OJT | | |
| 15 | Final report / portfolio / presentation | Student | End of OJT | | |

**Also verify:** the research claims CMO 104 limits OJT students' academic load (it mentions 6 units). Confirm the exact rule and whether it applies to all programs.

## 2. Coordinator Review Session (30 min)

1. **Today's process (10 min)**
   - How do you track each student's OJT requirements today (paper, Google Sheets, LMS)?
   - Which requirements are most often missing, late, or rejected? Why?
   - What takes most of your time each OJT season?
2. **Checklist review (12 min)** — go through §1 row by row:
   - Is this required at your school? Is anything missing or wrong?
   - What's the usual order and deadline?
   - Which items differ by program (IT, engineering, education, nursing…)?
3. **Acceptance (5 min)**
   - Would you accept a printed/exported summary from a student-run tool as a progress tracker (not a replacement for originals)?
   - What would it need to show for you to trust it?
   - Any privacy concerns with students tracking this in an app?
4. **Commitment (3 min)** — record yes/no:
   - Can you share your school's requirements memo/form (blank)?
   - Can we test an early version with a few of your students?
   - Can you introduce us to coordinators at other schools?

## 3. Synthesis (after all interviews)

1. **Tag** every note with pain codes, e.g., `ROS-TRACKING`, `ROS-UNCLEAR-RULES`, `STIPEND-DELAY`, `OJT-MOA-DELAY`, `OJT-MEDICAL-COST`, `OJT-UNCLEAR-REQS`, `SCAM-POST`, `DISCOVERY-FRAGMENTED`.
2. **Count** per pain: how many people, how many unprompted, highest evidence level.
3. **Fill the table:**

| Pain code | Segment | # mentioned / # interviewed | # unprompted | Highest evidence | Avg severity | Linked idea(s) |
|---|---|---|---|---|---|---|

4. **Re-score** every idea in `templates/idea-backlog.csv` (see [Part 1 §5](01-idea-validation-framework.md#5-scoring)).
5. **Write a 1-page summary**: top 3 validated problems, killed ideas, surprises, quotes.

## 4. Go / No-Go Decision Gates

Starting thresholds (adjust with reason):

| Feature | Go if… | Otherwise |
|---|---|---|
| ROS tracker + penalty calculator | ≥ 50% of segment B describe ROS tracking/rule difficulty **unprompted**, and ≥ 3 agree to try a beta | Make it a smaller "ROS info" page; drop from core |
| OJT checklist | ≥ 50% of segments C+D describe requirement confusion/delays, **and** ≥ 2 coordinators accept the summary format | Redesign the format, or focus on student-only tracking |
| Curated listings | Concierge channel click-through ≥ 10% on posted opportunities | Keep listings minimal; compliance tools are the product |
| Scam/official badge | Several unprompted scam stories | Keep it (cheap to build), but don't market it as the main feature |
| Stipend tracking | Many unprompted stipend-delay stories with workarounds | Keep in "Later" |

Record the decisions in `docs/idea/04-mvp-scope-and-roadmap.md`, then start coding.
