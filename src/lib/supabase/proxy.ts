import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const SIGN_IN_NEXT_COOKIE = "sign_in_next";

// Refreshes the auth session cookie before the page renders, and finishes
// email sign-in links. Called from src/proxy.ts on every matched request.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // Cache-control headers that stop CDNs caching a response with auth cookies.
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Email sign-in links come back with ?code=. Supabase may send them to the
  // Site URL instead of the requested page if that page isn't on its redirect
  // allow-list, so handle the code on any path, then continue to ?next=.
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    const target = request.nextUrl.clone();
    target.searchParams.delete("code");
    // ?next= survives only when the redirect URL is allow-listed; the sign-in
    // action also saves it in a short-lived cookie.
    const next = target.searchParams.get("next") ?? request.cookies.get(SIGN_IN_NEXT_COOKIE)?.value;
    target.searchParams.delete("next");
    let destination: URL = target;
    if (error) {
      destination = new URL("/sign-in?error=link-expired", request.url);
    } else if (next?.startsWith("/") && !next.startsWith("//")) {
      // next may carry its own query string (e.g. /welcome?next=...).
      destination = new URL(next, request.url);
    }
    const redirect = NextResponse.redirect(destination);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    redirect.cookies.delete(SIGN_IN_NEXT_COOKIE);
    return redirect;
  }

  // Don't put code between createServerClient and this call: it triggers the
  // token refresh, and skipping it randomly signs users out.
  await supabase.auth.getClaims();

  return response;
}
