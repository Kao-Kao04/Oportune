// OJT checklist (docs/research/final-decisions.md §2.1). Items marked "cmo104"
// come from CHED CMO No. 104 s. 2017, Section 16.1 (student intern
// requirements); the rest are common school or host practice and vary.

export type ChecklistSource = "cmo104" | "school";

export type ChecklistItem = { id: string; text: string; detail?: string; source: ChecklistSource };

export type ChecklistStage = { id: string; title: string; items: ChecklistItem[] };

export const CMO_104_URL = "https://legacy.ched.gov.ph/wp-content/uploads/2018/03/CMO-NO.-104-S.-2017.pdf";

export const OJT_CHECKLIST: ChecklistStage[] = [
  {
    id: "before",
    title: "Before you start",
    items: [
      { id: "enrolled", text: "Officially enrolled in your school", source: "cmo104" },
      { id: "subject", text: "Enrolled in your internship / OJT subject", source: "cmo104" },
      { id: "age", text: "At least 18 years old on your first day", source: "cmo104" },
      {
        id: "pre-internship",
        text: "Pre-internship requirements done",
        detail: "Whatever your program requires first, like an orientation or pre-deployment seminar.",
        source: "cmo104",
      },
      {
        id: "medical",
        text: "Medical certificate",
        detail:
          "Says you're physically and emotionally fit, from a physical and psychological exam at a DOH-accredited clinic or hospital. Your host may ask for more tests.",
        source: "cmo104",
      },
      {
        id: "consent",
        text: "Notarized consent from a parent or guardian",
        detail: "Required even if you're 18 or older. No waiver allowed.",
        source: "cmo104",
      },
      { id: "resume", text: "Resume and application to your host company or office", source: "school" },
      { id: "endorsement", text: "Endorsement letter from your school", source: "school" },
      {
        id: "moa",
        text: "MOA between your school and the host is signed",
        detail: "Your OJT coordinator handles this. Ask before your start date.",
        source: "school",
      },
      { id: "plan", text: "Internship (training) plan signed by your school and host", source: "school" },
      { id: "insurance", text: "Insurance, if your school or host requires it", source: "school" },
    ],
  },
  {
    id: "during",
    title: "During your OJT",
    items: [
      { id: "dtr", text: "Daily time record (DTR) signed by your supervisor", source: "school" },
      { id: "journal", text: "Journal or weekly reports", source: "school" },
      { id: "hours", text: "Required hours completed", detail: "See the hours note below.", source: "school" },
    ],
  },
  {
    id: "after",
    title: "After your OJT",
    items: [
      { id: "evaluation", text: "Evaluation from your host supervisor", source: "school" },
      { id: "certificate", text: "Certificate of completion from your host", source: "school" },
      { id: "report", text: "Final report or presentation for your OJT subject", source: "school" },
    ],
  },
];
