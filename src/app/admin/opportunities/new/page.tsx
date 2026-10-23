import Link from "next/link";
import { requireCurator } from "@/lib/auth";
import { OpportunityForm } from "../../opportunity-form";
import { emptyValues, loadCategories } from "../load";

export const instant = false;

export default async function NewOpportunityPage() {
  await requireCurator();
  const categories = await loadCategories();

  return (
    <main className="px-4 py-4">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">
        ← Listings
      </Link>
      <h1 className="mb-4 mt-2 text-xl font-bold text-ink">New listing</h1>
      <OpportunityForm values={emptyValues()} categories={categories} />
    </main>
  );
}
