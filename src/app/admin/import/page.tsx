import { requireCurator } from "@/lib/auth";
import { loadCategories } from "../opportunities/load";
import { importCalendarFeed, importCtftime } from "./actions";
import { ImportFlow } from "./import-flow";

export const instant = false;

export default async function ImportPage({ searchParams }: PageProps<"/admin/import">) {
  await requireCurator();
  const [{ ctftime, feed }, categories] = await Promise.all([searchParams, loadCategories()]);
  const [inserted, updated] = typeof ctftime === "string" ? ctftime.split("-") : [];
  const [feedInserted, feedUpdated] = typeof feed === "string" ? feed.split("-") : [];
  return (
    <main className="px-4 py-4">
      <section className="mb-6 rounded-ui border border-line bg-white p-3">
        <h2 className="font-semibold text-ink">Upcoming CTFs from CTFtime</h2>
        <p className="mt-1 text-sm text-muted">
          Online, open or student-only CTFs in the next 90 days, from CTFtime&apos;s public API. They arrive as drafts
          marked &quot;needs check&quot;: open the official site, confirm the dates, then publish from Re-check.
        </p>
        {ctftime === "error" && (
          <p role="alert" className="mt-2 text-sm text-urgent">
            Couldn&apos;t reach CTFtime. Try again later.
          </p>
        )}
        {inserted !== undefined && ctftime !== "error" && (
          <p className="mt-2 text-sm text-ink">
            Done: {inserted} new draft{inserted === "1" ? "" : "s"}, {updated} draft{updated === "1" ? "" : "s"} refreshed.
          </p>
        )}
        <form action={importCtftime} className="mt-2">
          <button type="submit" className="rounded-ui bg-teal px-3 py-1.5 text-sm font-semibold text-white">
            Fetch upcoming CTFs
          </button>
        </form>
      </section>

      <section className="mb-6 rounded-ui border border-line bg-white p-3">
        <h2 className="font-semibold text-ink">Events from a calendar feed</h2>
        <p className="mt-1 text-sm text-muted">
          For calendars we run (like our org&apos;s Luma calendar) or whose owner said yes. Paste the calendar&apos;s
          subscribe link (.ics or webcal://). Events in the next 120 days with an event page become drafts marked
          &quot;needs check&quot;.
        </p>
        {feed === "invalid" && (
          <p role="alert" className="mt-2 text-sm text-urgent">
            Add the feed link, the organizer, a category, and confirm we have permission.
          </p>
        )}
        {feed === "error" && (
          <p role="alert" className="mt-2 text-sm text-urgent">
            Couldn&apos;t read that feed. Check the link is a calendar subscribe link.
          </p>
        )}
        {feedInserted !== undefined && feed !== "invalid" && feed !== "error" && (
          <p className="mt-2 text-sm text-ink">
            Done: {feedInserted} new draft{feedInserted === "1" ? "" : "s"}, {feedUpdated} draft
            {feedUpdated === "1" ? "" : "s"} refreshed.
          </p>
        )}
        <form action={importCalendarFeed} className="mt-2 flex flex-col gap-2 text-sm">
          <input
            name="feed"
            required
            placeholder="https://api.lu.ma/ics/get?entity=calendar&id=…"
            className="rounded-ui border border-line px-2 py-1.5"
          />
          <input name="organization" required placeholder="Organizer (e.g. Microsoft Student Community PUP)" className="rounded-ui border border-line px-2 py-1.5" />
          <select name="category_id" required defaultValue="" className="rounded-ui border border-line px-2 py-1.5">
            <option value="" disabled>
              Category for these events
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="flex items-start gap-2 text-ink">
            <input type="checkbox" name="permission" className="mt-0.5" />
            This is our calendar, or its owner agreed to be listed.
          </label>
          <button type="submit" className="self-start rounded-ui bg-teal px-3 py-1.5 font-semibold text-white">
            Import events
          </button>
        </form>
      </section>
      <h1 className="text-xl font-bold text-ink">Import spreadsheet</h1>
      <p className="mt-1 text-sm text-muted">
        New rows become drafts. Published listings only change where you tick a change. Nothing is saved until you
        confirm.
      </p>
      <ImportFlow />
    </main>
  );
}
