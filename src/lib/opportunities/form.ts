import { sourceTrust } from "./source-trust";
import type { DbFields } from "./import-plan";

// Parses and validates the admin "Edit listing" form.

export type FormFields = Omit<DbFields, "external_id"> & { application_url: string | null };

export type FormResult = { ok: true; fields: FormFields } | { ok: false; errors: Record<string, string> };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function str(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function optional(form: FormData, name: string): string | null {
  return str(form, name) || null;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function parseOpportunityForm(form: FormData, categoryIds: Set<string>): FormResult {
  const errors: Record<string, string> = {};

  const title = str(form, "title");
  const organization = str(form, "organization");
  const categoryId = str(form, "category_id");
  const sourceUrl = str(form, "source_url");
  const applicationUrl = optional(form, "application_url");
  const deliveryMode = str(form, "delivery_mode");
  const deadlineType = str(form, "deadline_type");
  const deadline = str(form, "deadline");
  const opensType = str(form, "application_opens_type");
  const opens = str(form, "application_opens");
  const confidence = str(form, "confidence");
  const lastChecked = str(form, "last_checked");
  const summary = optional(form, "summary");

  if (!title) errors.title = "Title is required.";
  else if (title.length > 200) errors.title = "Keep the title under 200 characters.";
  if (!organization) errors.organization = "Organization is required.";
  if (!categoryIds.has(categoryId)) errors.category_id = "Pick a category.";
  if (!isHttpsUrl(sourceUrl)) errors.source_url = "Use the official https:// link.";
  if (applicationUrl && !isHttpsUrl(applicationUrl)) errors.application_url = "Use an https:// link, or leave empty.";
  if (!["online", "in_person", "hybrid"].includes(deliveryMode)) errors.delivery_mode = "Pick how it's delivered.";
  if (!["date", "rolling", "tba"].includes(deadlineType)) errors.deadline_type = "Pick a deadline type.";
  if (deadlineType === "date" && !DATE.test(deadline)) errors.deadline = "Enter the deadline date.";
  if (!["date", "open", "rolling", "tba"].includes(opensType)) errors.application_opens_type = "Pick when it opens.";
  if (opensType === "date" && !DATE.test(opens)) errors.application_opens = "Enter the opening date.";
  if (!["high", "medium", "low"].includes(confidence)) errors.confidence = "Pick a confidence level.";
  if (!DATE.test(lastChecked)) errors.last_checked = "Enter when you last checked the source.";
  if (summary && summary.length > 300) errors.summary = "Keep the summary under 300 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    fields: {
      title,
      organization,
      category_id: categoryId,
      summary,
      eligibility: optional(form, "eligibility"),
      requirements: optional(form, "requirements"),
      location: optional(form, "location"),
      delivery_mode: deliveryMode as FormFields["delivery_mode"],
      application_opens: opensType === "date" ? opens : null,
      application_opens_type: opensType as FormFields["application_opens_type"],
      deadline: deadlineType === "date" ? deadline : null,
      deadline_type: deadlineType as FormFields["deadline_type"],
      source_url: sourceUrl,
      application_url: applicationUrl,
      source_trust: sourceTrust(sourceUrl),
      confidence: confidence as FormFields["confidence"],
      needs_check: form.get("needs_check") === "on",
      notes: optional(form, "notes"),
      last_checked_at: `${lastChecked}T00:00:00+08:00`,
    },
  };
}
