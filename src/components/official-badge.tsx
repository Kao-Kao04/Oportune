import type { SourceTrust } from "@/lib/opportunities/source-trust";

// "Official .gov.ph" / "Official .edu.ph". Means the link is an official
// website, not that we guarantee the opportunity.
export function OfficialBadge({ trust }: { trust: SourceTrust }) {
  if (trust === "other") return null;
  const domain = trust === "official_gov" ? ".gov.ph" : ".edu.ph";

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold text-official"
      title={`The source is an official ${domain} website`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
        <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Official {domain}
    </span>
  );
}
