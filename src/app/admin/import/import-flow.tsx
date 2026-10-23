"use client";

import { useActionState } from "react";
import { importAction, type ImportState } from "./actions";

const button = "h-11 rounded-ui px-4 font-semibold disabled:opacity-60";

export function ImportFlow() {
  const [state, action, pending] = useActionState<ImportState, FormData>(importAction, { step: "upload" });

  if (state.step === "done") {
    return (
      <div className="mt-4 rounded-ui border border-line bg-white p-4">
        <p className="font-semibold text-official">Import finished</p>
        <p className="mt-1 text-sm text-ink">{state.summary}</p>
        <form action={action} className="mt-3">
          <button name="step" value="cancel" className={`${button} border border-line bg-white text-ink`}>
            Import another file
          </button>
        </form>
      </div>
    );
  }

  if (state.step === "upload") {
    return (
      <form action={action} className="mt-4 flex flex-col gap-3">
        {state.error && (
          <p role="alert" className="rounded-ui bg-urgent/10 px-3 py-2 text-sm text-urgent">
            {state.error}
          </p>
        )}
        <label className="block rounded-ui border border-dashed border-muted bg-white p-6 text-center">
          <span className="block font-semibold text-ink">Choose the opportunities CSV</span>
          <span className="mt-1 block text-sm text-muted">Same columns as data/opportunities.csv</span>
          <input name="file" type="file" accept=".csv,text/csv" required className="mt-3 text-sm" />
        </label>
        <button name="step" value="preview" disabled={pending} className={`${button} bg-teal text-white`}>
          {pending ? "Checking…" : "Preview import"}
        </button>
      </form>
    );
  }

  const { preview } = state;
  const nothing =
    preview.inserts.length === 0 && preview.draftUpdates.length === 0 && preview.publishedChanges.length === 0;

  return (
    <form action={action} className="mt-4 flex flex-col gap-5">
      <p className="text-sm text-muted">
        {state.fileName}: {preview.inserts.length} new, {preview.draftUpdates.length} drafts updated,{" "}
        {preview.publishedChanges.length} published with changes, {preview.unchanged} unchanged,{" "}
        {preview.skipped.length} closed (skipped), {preview.rejected.length} rejected.
      </p>

      {preview.rejected.length > 0 && (
        <Group title={`Rejected (${preview.rejected.length}) — fix these in the sheet`} tone="urgent">
          {preview.rejected.map((r) => (
            <li key={r.externalId} className="py-2 text-sm">
              <span className="font-semibold">{r.externalId || "(no id)"}</span>: {r.reasons.join("; ")}
            </li>
          ))}
        </Group>
      )}

      {preview.publishedChanges.length > 0 && (
        <Group title={`Changed – published (${preview.publishedChanges.length}) — tick the changes to apply`}>
          {preview.publishedChanges.map((p) => (
            <li key={p.id} className="py-3">
              <div className="text-sm font-semibold text-ink">
                {p.externalId} · {p.title} <span className="font-normal text-muted">({p.status})</span>
              </div>
              <ul className="mt-1 space-y-1">
                {p.changes.map((c) => (
                  <li key={c.field}>
                    <label className="flex items-start gap-2 text-sm">
                      <input type="checkbox" name="change" value={`${p.id}:${c.field}`} className="mt-1" />
                      <span>
                        <span className="font-semibold">{c.label}:</span>{" "}
                        <span className="text-muted line-through">{c.from}</span> → <span>{c.to}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </Group>
      )}

      {preview.inserts.length > 0 && (
        <Group title={`New – will be drafts (${preview.inserts.length})`}>
          {preview.inserts.map((r) => (
            <li key={r.externalId} className="py-2 text-sm">
              {r.externalId} · {r.title}
              {r.needsCheck && <span className="ml-2 text-xs font-semibold text-urgent">needs check</span>}
            </li>
          ))}
        </Group>
      )}

      {preview.draftUpdates.length > 0 && (
        <Group title={`Drafts that will be updated (${preview.draftUpdates.length})`}>
          {preview.draftUpdates.map((r) => (
            <li key={r.externalId} className="py-2 text-sm">
              {r.externalId} · {r.title}
            </li>
          ))}
        </Group>
      )}

      <div className="flex gap-3">
        <button name="step" value="cancel" disabled={pending} className={`${button} border border-line bg-white text-ink`}>
          Cancel
        </button>
        <button name="step" value="apply" disabled={pending} className={`${button} flex-1 bg-teal text-white`}>
          {pending ? "Importing…" : nothing ? "Apply ticked changes" : "Import"}
        </button>
      </div>
    </form>
  );
}

function Group({ title, tone, children }: { title: string; tone?: "urgent"; children: React.ReactNode }) {
  return (
    <section>
      <h2 className={`text-sm font-semibold ${tone === "urgent" ? "text-urgent" : "text-ink"}`}>{title}</h2>
      <ul className="mt-1 divide-y divide-line border-y border-line">{children}</ul>
    </section>
  );
}
