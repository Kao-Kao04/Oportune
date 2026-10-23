import { requireCurator } from "@/lib/auth";
import { ImportFlow } from "./import-flow";

export const instant = false;

export default async function ImportPage() {
  await requireCurator();
  return (
    <main className="px-4 py-4">
      <h1 className="text-xl font-bold text-ink">Import spreadsheet</h1>
      <p className="mt-1 text-sm text-muted">
        New rows become drafts. Published listings only change where you tick a change. Nothing is saved until you
        confirm.
      </p>
      <ImportFlow />
    </main>
  );
}
