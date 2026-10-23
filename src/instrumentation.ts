import type { Instrumentation } from "next";

// Server errors as one JSON line each, so they're searchable in the host's
// logs (Vercel → Logs). Swap in an error-tracking service (e.g., Sentry)
// here before launch. Only the path is logged: query strings can hold
// sign-in codes and unsubscribe tokens.
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const error = err as Error & { digest?: string };
  console.error(
    JSON.stringify({
      level: "error",
      message: error?.message ?? String(err),
      digest: error?.digest,
      method: request.method,
      path: request.path.split("?")[0],
      routePath: context.routePath,
      routeType: context.routeType,
    }),
  );
};
