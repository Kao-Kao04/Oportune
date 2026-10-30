import { connection, type NextRequest } from "next/server";
import { buildIcs, hasCalendarDate } from "@/lib/opportunities/calendar";
import { getListingBySlug } from "@/lib/opportunities/queries";

// Downloads the deadline as a calendar file (.ics) that phones open in their
// calendar app.
export async function GET(request: NextRequest, ctx: RouteContext<"/opportunities/[slug]/calendar">) {
  await connection();
  const { slug } = await ctx.params;
  const result = await getListingBySlug(slug);
  if (!result || !("listing" in result) || !hasCalendarDate(result.listing)) {
    return new Response("No deadline date for this listing", { status: 404 });
  }

  const { listing } = result;
  const base = process.env.APP_BASE_URL ?? request.nextUrl.origin;
  const ics = buildIcs(listing, `${base}/opportunities/${listing.slug}`);
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${listing.slug.slice(0, 60)}-deadline.ics"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
