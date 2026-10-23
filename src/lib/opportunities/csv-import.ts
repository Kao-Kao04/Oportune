import { sourceTrust, type SourceTrust } from "./source-trust";

// Maps data/opportunities.csv rows to `opportunities` fields, following the
// "CSV → opportunities mapping" table in docs/system-design/03-data-model.md.

export type CsvRow = Record<string, string>;

export type OpportunityFields = {
  external_id: string;
  title: string;
  organization: string;
  category_name: string;
  summary: string | null;
  eligibility: string | null;
  requirements: string | null;
  location: string | null;
  delivery_mode: "online" | "in_person" | "hybrid";
  application_opens: string | null;
  application_opens_type: "date" | "open" | "rolling" | "tba";
  deadline: string | null;
  deadline_type: "date" | "rolling" | "tba";
  source_url: string;
  source_trust: SourceTrust;
  confidence: "high" | "medium" | "low";
  needs_check: boolean;
  notes: string | null;
  last_checked_at: string;
};

export type MappedRow =
  | { kind: "ok"; fields: OpportunityFields }
  | { kind: "skipped"; externalId: string; reason: string }
  | { kind: "rejected"; externalId: string; reasons: string[] };

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const DELIVERY_MODES: Record<string, OpportunityFields["delivery_mode"]> = {
  online: "online",
  "in-person": "in_person",
  hybrid: "hybrid",
};

function text(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isRealDate(value: string): boolean {
  if (!DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

export function mapCsvRow(row: CsvRow, categoryNames: Set<string>): MappedRow {
  const externalId = row.id?.trim() ?? "";
  const status = row.status?.trim().toLowerCase();
  if (status === "closed") return { kind: "skipped", externalId, reason: "status is closed" };

  const reasons: string[] = [];
  if (!externalId) reasons.push("missing id");
  if (status !== "ready" && status !== "needs-check") reasons.push(`unknown status "${row.status}"`);

  const title = text(row.title);
  const organization = text(row.organization);
  if (!title) reasons.push("missing title");
  if (!organization) reasons.push("missing organization");

  const category = row.category?.trim() ?? "";
  if (!categoryNames.has(category)) reasons.push(`unknown category "${row.category}"`);

  const deliveryMode = DELIVERY_MODES[row.delivery_mode?.trim().toLowerCase() ?? ""];
  if (!deliveryMode) reasons.push(`unknown delivery_mode "${row.delivery_mode}"`);

  let applicationOpens: string | null = null;
  let applicationOpensType: OpportunityFields["application_opens_type"] = "tba";
  const opens = row.application_opens?.trim() ?? "";
  if (isRealDate(opens)) {
    applicationOpens = opens;
    applicationOpensType = "date";
  } else if (["open", "rolling", "tba"].includes(opens.toLowerCase())) {
    applicationOpensType = opens.toLowerCase() as OpportunityFields["application_opens_type"];
  } else {
    reasons.push(`bad application_opens "${row.application_opens}"`);
  }

  let deadline: string | null = null;
  let deadlineType: OpportunityFields["deadline_type"] = "tba";
  const due = row.deadline?.trim() ?? "";
  if (isRealDate(due)) {
    deadline = due;
    deadlineType = "date";
  } else if (["rolling", "tba"].includes(due.toLowerCase())) {
    deadlineType = due.toLowerCase() as OpportunityFields["deadline_type"];
  } else {
    reasons.push(`bad deadline "${row.deadline}"`);
  }

  const sourceUrl = row.source_url?.trim() ?? "";
  if (!sourceUrl.startsWith("https://")) reasons.push(`source_url must be https: "${sourceUrl}"`);

  const confidence = row.confidence?.trim().toLowerCase();
  if (confidence !== "high" && confidence !== "medium" && confidence !== "low") {
    reasons.push(`bad confidence "${row.confidence}"`);
  }

  const lastChecked = row.last_checked?.trim() ?? "";
  if (!isRealDate(lastChecked)) reasons.push(`bad last_checked "${row.last_checked}"`);

  if (reasons.length > 0) return { kind: "rejected", externalId, reasons };

  return {
    kind: "ok",
    fields: {
      external_id: externalId,
      title: title!,
      organization: organization!,
      category_name: category,
      summary: text(row.summary),
      eligibility: text(row.eligibility),
      requirements: text(row.requirements),
      location: text(row.location),
      delivery_mode: deliveryMode!,
      application_opens: applicationOpens,
      application_opens_type: applicationOpensType,
      deadline,
      deadline_type: deadlineType,
      source_url: sourceUrl,
      // Recomputed from the URL; the CSV's source_trust column is ignored.
      source_trust: sourceTrust(sourceUrl),
      confidence: confidence as OpportunityFields["confidence"],
      needs_check: status === "needs-check",
      notes: text(row.notes),
      // Midnight Philippine time.
      last_checked_at: `${lastChecked}T00:00:00+08:00`,
    },
  };
}

// Minimal RFC 4180 parser: quoted fields, "" escapes, commas and newlines in quotes.
export function parseCsv(input: string): CsvRow[] {
  const source = input.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"' && source[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && source[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header = [], ...body] = rows.filter((r) => r.some((cell) => cell !== ""));
  return body.map((cells) => Object.fromEntries(header.map((h, i) => [h.trim(), cells[i] ?? ""])));
}
