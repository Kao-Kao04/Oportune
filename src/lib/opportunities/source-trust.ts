export type SourceTrust = "official_gov" | "official_edu" | "other";

// Official-site badge (docs/system-design/04-api-and-logic.md §7.1).
// Reads only the parsed hostname, so lookalikes such as gov.ph.example.com
// or example.com/gov.ph get "other". Non-https URLs never get a badge.
export function sourceTrust(url: string): SourceTrust {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "other";
  }
  if (parsed.protocol !== "https:") return "other";

  const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
  if (host === "gov.ph" || host.endsWith(".gov.ph")) return "official_gov";
  if (host === "edu.ph" || host.endsWith(".edu.ph")) return "official_edu";
  return "other";
}
