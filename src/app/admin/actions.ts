"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurator } from "@/lib/auth";
import { todayInManila } from "@/lib/opportunities/dates";
import { parseOpportunityForm } from "@/lib/opportunities/form";
import { OPPORTUNITIES_TAG } from "@/lib/opportunities/queries";
import { uniqueSlug } from "@/lib/opportunities/slug";
import { createClient } from "@/lib/supabase/server";
import { audit } from "./audit";

export type SaveState = { errors?: Record<string, string>; message?: string; values?: Record<string, string> };

type Status = "draft" | "published" | "expired" | "archived";

async function takenSlugs(supabase: Awaited<ReturnType<typeof createClient>>, exceptId?: string) {
  const { data, error } = await supabase.from("opportunities").select("id, slug");
  if (error) throw error;
  return new Set(data.filter((r) => r.id !== exceptId).map((r) => r.slug));
}

// Create or edit a listing. intent "publish" also publishes it; "save" keeps
// the current status (new listings start as drafts).
export async function saveOpportunity(_prev: SaveState, form: FormData): Promise<SaveState> {
  // Success redirects (throws); anything returned is an error, so send the
  // submitted values back for the form to keep.
  const result = await save(form);
  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) if (typeof value === "string") values[key] = value;
  return { ...result, values };
}

async function save(form: FormData): Promise<SaveState> {
  const user = await requireCurator();
  const supabase = await createClient();
  const id = typeof form.get("id") === "string" && form.get("id") ? String(form.get("id")) : null;
  const intent = form.get("intent") === "publish" ? "publish" : "save";

  const { data: categories, error: catError } = await supabase.from("categories").select("id");
  if (catError) return { message: catError.message };
  const parsed = parseOpportunityForm(form, new Set(categories.map((c) => c.id)));
  if (!parsed.ok) return { errors: parsed.errors, message: "Fix the highlighted fields." };
  const fields = parsed.fields;

  let current: { status: string; slug: string; title: string } | null = null;
  if (id) {
    const { data, error } = await supabase.from("opportunities").select("status, slug, title").eq("id", id).single();
    if (error) return { message: "That listing no longer exists." };
    current = data;
  }

  let status = (current?.status ?? "draft") as Status;
  const today = todayInManila();
  const deadlinePassed = fields.deadline_type === "date" && fields.deadline !== null && fields.deadline < today;

  if (intent === "publish") {
    if (fields.needs_check) return { message: "Turn off “Needs check” after confirming the details, then publish." };
    if (deadlinePassed) return { errors: { deadline: "This deadline has passed. Update it or leave the listing unpublished." } };
    status = "published";
  } else if (status === "published" && fields.needs_check) {
    return { message: "A published listing can't be marked “Needs check”. Use “Move to drafts” first." };
  } else if (status === "published" && deadlinePassed) {
    status = "expired";
  }

  // Slugs follow the title only while a listing is a draft. A draft may have
  // been public before ("Move to drafts"), so the old slug always redirects.
  let slug = current?.slug;
  if (!current || (current.status === "draft" && current.title !== fields.title)) {
    slug = uniqueSlug(fields.title, await takenSlugs(supabase, id ?? undefined));
  }
  const oldSlug = current && current.slug !== slug ? current.slug : null;

  const row = {
    ...fields,
    slug: slug!,
    status,
    ...(intent === "publish" ? { reviewed_by: user.id } : {}),
  };

  let savedId = id;
  if (id) {
    const { error } = await supabase.from("opportunities").update(row).eq("id", id);
    if (error) return { message: friendlyDbError(error.message) };
    if (oldSlug) {
      const { error: redirectError } = await supabase
        .from("opportunity_slug_redirects")
        .upsert({ old_slug: oldSlug, opportunity_id: id });
      if (redirectError) return { message: redirectError.message };
    }
  } else {
    const { data, error } = await supabase
      .from("opportunities")
      .insert({ ...row, created_by: user.id })
      .select("id")
      .single();
    if (error) return { message: friendlyDbError(error.message) };
    savedId = data.id;
  }

  await audit(supabase, user, id ? (intent === "publish" ? "opportunity.publish" : "opportunity.update") : "opportunity.create", {
    type: "opportunity",
    id: savedId,
  }, { status });
  updateTag(OPPORTUNITIES_TAG);
  redirect(`/admin/opportunities/${savedId}?saved=${intent === "publish" ? "published" : "saved"}`);
}

function friendlyDbError(message: string): string {
  if (message.includes("opportunities_source_url_title_key")) {
    return "Another listing already has this source URL and title.";
  }
  return message;
}

const TRANSITIONS: Record<string, Status[]> = {
  draft: ["archived"],
  published: ["draft", "expired", "archived"],
  expired: ["archived"],
  archived: ["draft"],
};

// Expire, archive, move to drafts, or restore an archived listing.
export async function setOpportunityStatus(form: FormData) {
  const user = await requireCurator();
  const supabase = await createClient();
  const id = String(form.get("id") ?? "");
  const to = String(form.get("to") ?? "") as Status;

  const { data: current, error } = await supabase.from("opportunities").select("status").eq("id", id).single();
  if (error) throw new Error("Listing not found.");
  if (!TRANSITIONS[current.status]?.includes(to)) throw new Error(`Can't change ${current.status} to ${to}.`);

  const { error: updateError } = await supabase.from("opportunities").update({ status: to }).eq("id", id);
  if (updateError) throw new Error(updateError.message);

  await audit(supabase, user, `opportunity.${to === "draft" ? "unpublish" : to}`, { type: "opportunity", id }, {
    from: current.status,
  });
  updateTag(OPPORTUNITIES_TAG);
  redirect(`/admin/opportunities/${id}?saved=${to}`);
}

// "Checked the source today": clears the 30-day re-check flag.
export async function markChecked(form: FormData) {
  const user = await requireCurator();
  const supabase = await createClient();
  const id = String(form.get("id") ?? "");
  const back = String(form.get("back") ?? "/admin/recheck");

  const { error } = await supabase
    .from("opportunities")
    .update({ last_checked_at: new Date().toISOString(), recheck_due: false })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await audit(supabase, user, "opportunity.mark_checked", { type: "opportunity", id });
  updateTag(OPPORTUNITIES_TAG);
  redirect(back.startsWith("/admin") ? back : "/admin/recheck");
}

export async function updateReport(form: FormData) {
  const user = await requireCurator();
  const supabase = await createClient();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!["open", "fixed", "dismissed"].includes(status)) throw new Error("Unknown report status.");

  const { error } = await supabase.from("opportunity_reports").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  await audit(supabase, user, `report.${status}`, { type: "report", id });
  redirect("/admin/reports");
}
