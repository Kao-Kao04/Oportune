"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurator } from "@/lib/auth";
import { parseCsv } from "@/lib/opportunities/csv-import";
import { ctftimeToRows, fetchCtftimeEvents } from "@/lib/opportunities/ctftime";
import { feedUrl, icsToRows, parseIcs } from "@/lib/opportunities/ics-feed";
import { todayInManila } from "@/lib/opportunities/dates";
import {
  DIFF_FIELDS,
  planImport,
  selectedUpdate,
  type DbFields,
  type ExistingOpportunity,
} from "@/lib/opportunities/import-plan";
import { OPPORTUNITIES_TAG } from "@/lib/opportunities/queries";
import { createClient } from "@/lib/supabase/server";
import { audit } from "../audit";

// Server action bodies are capped at 1 MB, and apply sends the file back once.
const MAX_CSV_BYTES = 400_000;

export type PreviewChange = { field: string; label: string; from: string; to: string };

export type ImportPreview = {
  inserts: { externalId: string; title: string; needsCheck: boolean }[];
  draftUpdates: { externalId: string; title: string }[];
  publishedChanges: { id: string; externalId: string; title: string; status: string; changes: PreviewChange[] }[];
  unchanged: number;
  skipped: string[];
  rejected: { externalId: string; reasons: string[] }[];
};

export type ImportState =
  | { step: "upload"; error?: string }
  | { step: "preview"; csv: string; fileName: string; preview: ImportPreview }
  | { step: "done"; summary: string };

const LABELS: Partial<Record<keyof DbFields, string>> = {
  category_id: "Category",
  application_opens: "Opens date",
  application_opens_type: "Opens",
  deadline_type: "Deadline type",
  source_url: "Source URL",
  source_trust: "Badge",
  last_checked_at: "Last checked",
  delivery_mode: "Delivery",
};

async function buildPlan(csv: string) {
  const supabase = await createClient();
  const [{ data: categories, error: catError }, { data: existing, error: oppError }] = await Promise.all([
    supabase.from("categories").select("id, name"),
    supabase.from("opportunities").select("*"),
  ]);
  if (catError) throw catError;
  if (oppError) throw oppError;
  return {
    supabase,
    categories,
    plan: planImport(parseCsv(csv), categories, existing as ExistingOpportunity[]),
  };
}

// One action drives the three steps: upload → preview → apply.
export async function importAction(prev: ImportState, form: FormData): Promise<ImportState> {
  const user = await requireCurator();
  const step = form.get("step");

  if (step === "cancel") return { step: "upload" };

  if (step === "preview") {
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) return { step: "upload", error: "Choose a CSV file first." };
    if (file.size > MAX_CSV_BYTES) return { step: "upload", error: "That file is too big (400 KB max)." };
    const csv = await file.text();
    const { plan, categories } = await buildPlan(csv);
    const categoryNames = new Map(categories.map((c) => [c.id, c.name]));
    const show = (field: keyof DbFields, value: string) =>
      field === "category_id" ? (categoryNames.get(value) ?? value) : value || "(empty)";

    return {
      step: "preview",
      csv,
      fileName: file.name,
      preview: {
        inserts: plan.inserts.map((r) => ({ externalId: r.external_id, title: r.title, needsCheck: r.needs_check })),
        draftUpdates: plan.draftUpdates.map((r) => ({ externalId: r.externalId, title: r.title })),
        publishedChanges: plan.publishedChanges.map((p) => ({
          id: p.id,
          externalId: p.externalId,
          title: p.title,
          status: p.status,
          changes: p.changes.map((c) => ({
            field: c.field,
            label: LABELS[c.field] ?? c.field[0].toUpperCase() + c.field.slice(1).replaceAll("_", " "),
            from: show(c.field, c.from),
            to: show(c.field, c.to),
          })),
        })),
        unchanged: plan.unchanged.length,
        skipped: plan.skipped,
        rejected: plan.rejected,
      },
    };
  }

  if (step === "apply" && prev.step === "preview") {
    // The preview lives in the browser between steps, so re-validate and
    // re-plan against the current database instead of trusting it.
    if (prev.csv.length > MAX_CSV_BYTES) return { step: "upload", error: "That file is too big (400 KB max)." };
    const { plan, supabase } = await buildPlan(prev.csv);
    const picked = new Set(form.getAll("change").map(String)); // "<id>:<field>"

    if (plan.inserts.length > 0) {
      const { error } = await supabase.from("opportunities").insert(plan.inserts.map((r) => ({ ...r, created_by: user.id })));
      if (error) throw new Error(`Insert failed: ${error.message}`);
    }
    for (const { id, fields } of plan.draftUpdates) {
      const { error } = await supabase.from("opportunities").update(fields).eq("id", id);
      if (error) throw new Error(`Update failed for ${fields.external_id}: ${error.message}`);
    }

    const today = todayInManila();
    let appliedPublished = 0;
    for (const change of plan.publishedChanges) {
      const fieldsPicked = DIFF_FIELDS.filter((f) => picked.has(`${change.id}:${f}`));
      if (fieldsPicked.length === 0) continue;
      const update: Partial<DbFields> & { status?: "published" | "expired" } = {
        ...selectedUpdate(change.fields, fieldsPicked),
        last_checked_at: change.fields.last_checked_at,
      };
      // An applied deadline in the past closes the listing; a future one reopens it.
      if (update.deadline_type !== undefined && (change.status === "published" || change.status === "expired")) {
        const passed = update.deadline_type === "date" && !!update.deadline && update.deadline < today;
        update.status = passed ? "expired" : "published";
      }
      const { error } = await supabase.from("opportunities").update(update).eq("id", change.id);
      if (error) throw new Error(`Update failed for ${change.externalId}: ${error.message}`);
      await audit(supabase, user, "opportunity.import_change", { type: "opportunity", id: change.id }, {
        fields: fieldsPicked,
      });
      appliedPublished++;
    }

    await audit(supabase, user, "opportunities.csv_import", { type: "opportunities" }, {
      file: prev.fileName,
      inserted: plan.inserts.length,
      updated_drafts: plan.draftUpdates.length,
      published_updated: appliedPublished,
      rejected: plan.rejected.length,
    });
    updateTag(OPPORTUNITIES_TAG);

    return {
      step: "done",
      summary: `Imported ${prev.fileName}: ${plan.inserts.length} new drafts, ${plan.draftUpdates.length} drafts updated, ${appliedPublished} published listings updated, ${plan.rejected.length} rows rejected.`,
    };
  }

  return { step: "upload" };
}

// Upcoming online CTFs from CTFtime become drafts flagged "needs check". The
// same rules as the spreadsheet apply: drafts we already imported are
// refreshed, published listings are never touched.
export async function importCtftime() {
  const user = await requireCurator();
  const supabase = await createClient();
  const [{ data: categories, error: catError }, { data: existing, error: oppError }] = await Promise.all([
    supabase.from("categories").select("id, name"),
    supabase.from("opportunities").select("*"),
  ]);
  if (catError) throw catError;
  if (oppError) throw oppError;

  let events;
  try {
    events = await fetchCtftimeEvents(new Date());
  } catch (error) {
    console.warn("[ctftime] fetch failed", error);
    redirect("/admin/import?ctftime=error");
  }
  const rows = ctftimeToRows(events, new Date(), {
    titles: existing.filter((o) => !o.external_id?.startsWith("CTFTIME-")).map((o) => o.title),
    urls: existing
      .filter((o) => !o.external_id?.startsWith("CTFTIME-"))
      .flatMap((o) => [o.source_url, o.application_url].filter((u): u is string => Boolean(u))),
  });
  const plan = planImport(rows, categories, existing as ExistingOpportunity[]);

  if (plan.inserts.length > 0) {
    const { error } = await supabase.from("opportunities").insert(plan.inserts.map((r) => ({ ...r, created_by: user.id })));
    if (error) throw new Error(`Insert failed: ${error.message}`);
  }
  for (const { id, fields } of plan.draftUpdates) {
    const { error } = await supabase.from("opportunities").update(fields).eq("id", id);
    if (error) throw new Error(`Update failed for ${fields.external_id}: ${error.message}`);
  }
  await audit(supabase, user, "opportunities.ctftime_import", { type: "opportunities" }, {
    fetched: events.length,
    inserted: plan.inserts.length,
    updated: plan.draftUpdates.length,
  });
  redirect(`/admin/import?ctftime=${plan.inserts.length}-${plan.draftUpdates.length}`);
}

const MAX_FEED_BYTES = 2_000_000;

// Calendar feed import: only for calendars we run (e.g. our org's Luma) or
// whose owner agreed. Upcoming events become drafts marked "needs check".
export async function importCalendarFeed(form: FormData) {
  const user = await requireCurator();
  const url = feedUrl(String(form.get("feed") ?? ""));
  const organization = String(form.get("organization") ?? "").trim().slice(0, 200);
  const categoryId = String(form.get("category_id") ?? "");
  if (!url || organization.length < 2 || form.get("permission") !== "on") redirect("/admin/import?feed=invalid");

  const supabase = await createClient();
  const [{ data: categories, error: catError }, { data: existing, error: oppError }] = await Promise.all([
    supabase.from("categories").select("id, name"),
    supabase.from("opportunities").select("*"),
  ]);
  if (catError) throw catError;
  if (oppError) throw oppError;
  const category = categories.find((c) => c.id === categoryId);
  if (!category) redirect("/admin/import?feed=invalid");

  let text: string;
  try {
    const res = await fetch(url, { headers: { Accept: "text/calendar" }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(`feed returned ${res.status}`);
    text = await res.text();
    if (text.length > MAX_FEED_BYTES || !text.includes("BEGIN:VCALENDAR")) throw new Error("not a calendar feed");
  } catch (error) {
    console.warn("[feed] fetch failed", error);
    redirect("/admin/import?feed=error");
  }

  const rows = icsToRows(parseIcs(text), {
    now: new Date(),
    organization,
    category: category.name,
    feedHost: new URL(url).hostname,
  });
  const plan = planImport(rows, categories, existing as ExistingOpportunity[]);
  if (plan.inserts.length > 0) {
    const { error } = await supabase.from("opportunities").insert(plan.inserts.map((r) => ({ ...r, created_by: user.id })));
    if (error) throw new Error(`Insert failed: ${error.message}`);
  }
  for (const { id, fields } of plan.draftUpdates) {
    const { error } = await supabase.from("opportunities").update(fields).eq("id", id);
    if (error) throw new Error(`Update failed for ${fields.external_id}: ${error.message}`);
  }
  await audit(supabase, user, "opportunities.feed_import", { type: "opportunities" }, {
    feed_host: new URL(url).hostname,
    inserted: plan.inserts.length,
    updated: plan.draftUpdates.length,
  });
  redirect(`/admin/import?feed=${plan.inserts.length}-${plan.draftUpdates.length}`);
}
