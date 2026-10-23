const STYLES: Record<string, string> = {
  draft: "bg-soon/10 text-soon",
  published: "bg-official/10 text-official",
  expired: "bg-ink/5 text-muted",
  archived: "bg-ink/5 text-muted line-through",
};

export function StatusLabel({ status }: { status: string }) {
  return (
    <span className={`rounded-ui px-1.5 py-0.5 text-xs font-semibold capitalize ${STYLES[status] ?? ""}`}>
      {status}
    </span>
  );
}

export function Flag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-ui bg-urgent/10 px-1.5 py-0.5 text-xs font-semibold text-urgent">{children}</span>;
}
