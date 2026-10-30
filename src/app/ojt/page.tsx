import type { Metadata } from "next";
import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { CMO_104_URL, OJT_CHECKLIST } from "@/lib/ojt-checklist";
import { Checklist } from "./checklist";

export const metadata: Metadata = {
  title: "OJT checklist",
  description:
    "What Filipino college students need before, during, and after OJT: CHED CMO 104 requirements plus common school items.",
  alternates: { canonical: "/ojt" },
};

export default function OjtPage() {
  return (
    <main className="px-4 py-4">
      <BackLink className="-ml-1 inline-flex min-h-11 items-center gap-1 px-1 text-sm font-bold text-ink">
        <span aria-hidden="true">←</span> Back
      </BackLink>
      <p className="tag mt-1 bg-sky">OJT season prep</p>
      <h1 className="mt-2 font-display text-[30px] font-extrabold leading-tight tracking-tight text-ink">
        OJT checklist
      </h1>
      <p className="mt-2 text-muted">
        Tick things off as you go. Your ticks stay on this phone only. Items marked{" "}
        <span className="tag bg-mint text-xs">CHED rule</span> come from CHED&apos;s internship rules (CMO 104, s. 2017);
        the rest are common school requirements.
      </p>

      <p className="sticker mt-4 border-dashed bg-card px-3 py-2 text-sm text-ink">
        <span className="font-bold">Your OJT coordinator has the final list.</span> Schools and companies often add
        their own forms, so ask them first.
      </p>

      <Checklist stages={OJT_CHECKLIST} />

      <section aria-labelledby="hours" className="sticker mt-6 bg-lilac p-4">
        <h2 id="hours" className="font-display text-lg font-extrabold text-ink">
          How many hours?
        </h2>
        <p className="mt-1 text-sm text-ink">
          It depends on your program. For computing programs, CHED&apos;s curriculum rules (CMO 25, s. 2015) are commonly
          read as <strong>486 hours</strong> for BSIT and BSIS, and <strong>162 hours</strong> for BSCS. Your school can
          require more, so confirm with your coordinator.
        </p>
        <p className="mt-2 text-sm text-ink">
          OJT is mainly done onsite (CMO 4, s. 2023). Remote OJT is usually allowed only if the company itself works
          remotely.
        </p>
      </section>

      <section className="mt-6 flex flex-col gap-3">
        <Link href="/?category=internships" className="btn-pop press">
          Find OJT and internships
        </Link>
        <a href={CMO_104_URL} target="_blank" rel="noopener noreferrer" className="btn-plain press text-sm">
          Read CMO 104 on ched.gov.ph
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </a>
      </section>
    </main>
  );
}
