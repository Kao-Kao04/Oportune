import { PublishChecklist } from "@/components/publish-checklist";
import { requireCurator } from "@/lib/auth";
import { pasteToDraft } from "./actions";

export const instant = false;

export default async function PastePage({ searchParams }: PageProps<"/admin/paste">) {
  await requireCurator();
  const { error } = await searchParams;
  return (
    <main className="px-4 py-4">
      <h1 className="text-xl font-bold text-ink">Paste a post</h1>
      <p className="mt-1 text-sm text-muted">
        Saw an opportunity on Facebook, Instagram, X, LinkedIn, or a group chat? Copy the post&apos;s text and its link and
        paste them here. We pull out the title, links, and deadline into a new listing form. You still open the source,
        check every detail, and write the summary in our own words. Nothing is collected automatically.
      </p>
      <PublishChecklist />
      {error === "link" && (
        <p role="alert" className="mt-3 rounded-ui border border-urgent px-3 py-2 text-sm text-urgent">
          Add the link to the post (or to the official page) so the listing has a source.
        </p>
      )}
      <form action={pasteToDraft} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col text-sm font-semibold text-ink">
          Link to the post
          <input
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://www.facebook.com/…"
            className="mt-1 rounded-ui border border-line bg-card px-3 py-2 font-normal"
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-ink">
          The post&apos;s text
          <textarea
            name="text"
            rows={12}
            required
            maxLength={20000}
            className="mt-1 rounded-ui border border-line bg-card px-3 py-2 font-normal"
          />
        </label>
        <button type="submit" className="self-start rounded-ui bg-teal px-4 py-2 text-sm font-semibold text-paper">
          Make a draft
        </button>
      </form>
    </main>
  );
}
