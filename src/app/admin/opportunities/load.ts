import "server-only";
import { todayInManila } from "@/lib/opportunities/dates";
import { createClient } from "@/lib/supabase/server";
import type { FormValues } from "../opportunity-form";

export async function loadCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id, name").order("sort_order");
  if (error) throw error;
  return data;
}

export const emptyValues = (): FormValues => ({
  status: "draft",
  title: "",
  organization: "",
  category_id: "",
  summary: "",
  eligibility: "",
  requirements: "",
  location: "",
  delivery_mode: "online",
  application_opens_type: "tba",
  application_opens: "",
  deadline_type: "date",
  deadline: "",
  source_url: "",
  application_url: "",
  confidence: "high",
  needs_check: false,
  notes: "",
  last_checked: todayInManila(),
});
