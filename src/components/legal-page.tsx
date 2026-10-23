// Layout for the privacy notice and terms (plain, readable on a phone).

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 py-8">
      <p role="note" className="rounded-ui border border-soon/40 bg-soon/10 px-3 py-2 text-sm text-ink">
        <span className="font-semibold">Draft for review.</span> This page has not yet been reviewed by a lawyer or the
        Data Protection Officer. Placeholders in [brackets] must be filled in before launch.
      </p>
      <h1 className="mt-6 text-2xl font-bold text-ink">{title}</h1>
      <p className="tabular mt-1 text-sm text-muted">Last updated {updated}</p>
      <div className="mt-6 space-y-6 leading-relaxed text-ink [&_h2]:text-lg [&_h2]:font-bold [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
