import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "./supabase/admin";

// Client IP as a salted hash, so raw IPs are never stored.
export async function hashedClientIp(): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const salt = process.env.RATE_LIMIT_IP_SALT;
  if (!salt && process.env.NODE_ENV === "production") throw new Error("RATE_LIMIT_IP_SALT is not set");
  return createHash("sha256").update(`${salt ?? "dev"}:${ip}`).digest("hex").slice(0, 32);
}

// Fixed-window limit backed by the rate_limits table (shared across serverless
// instances). Returns true if the action may go ahead.
export async function allowRequest(key: string, maxHits: number, windowSeconds: number): Promise<boolean> {
  const { data, error } = await createAdminClient().rpc("hit_rate_limit", {
    limit_key: key,
    window_seconds: windowSeconds,
    max_hits: maxHits,
  });
  if (error) throw new Error(`Rate limit check failed: ${error.message}`);
  return data === true;
}

// Cloudflare Turnstile. Skipped when no secret is configured (local dev).
export async function verifyCaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  });
  const body = (await res.json()) as { success?: boolean };
  return body.success === true;
}
