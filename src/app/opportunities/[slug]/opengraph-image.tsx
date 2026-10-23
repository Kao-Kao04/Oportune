import { ImageResponse } from "next/og";
import { categoryLabel } from "@/lib/opportunities/categories";
import { deadlineInfo, formatLongDate } from "@/lib/opportunities/dates";
import { getListingBySlug, getToday } from "@/lib/opportunities/queries";

// Link preview for Messenger/Facebook (docs/design/stitch-prompts.md, Prompt 5).
export const alt = "Opportunity on Oportune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [result, today] = await Promise.all([getListingBySlug(slug), getToday()]);
  const listing = result && "listing" in result ? result.listing : null;

  let deadlineLine = "";
  if (listing) {
    const deadline = deadlineInfo(listing, today);
    if (deadline.daysLeft === null) deadlineLine = deadline.detail;
    else if (deadline.tone === "closed") deadlineLine = `Closed ${formatLongDate(listing.deadline!)}`;
    else deadlineLine = `Deadline ${formatLongDate(listing.deadline!)}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#faf8f3",
          color: "#1c1b19",
          padding: "64px 72px",
        }}
      >
        <div style={{ width: 96, height: 8, background: "#0f5257" }} />
        <div style={{ marginTop: 24, fontSize: 30, fontWeight: 700, color: "#0f5257" }}>Oportune</div>
        <div
          style={{
            marginTop: 48,
            fontSize: listing && listing.title.length > 60 ? 56 : 68,
            fontWeight: 700,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          {listing?.title ?? "Opportunities for college students"}
        </div>
        {listing && (
          <div style={{ marginTop: 24, fontSize: 32, color: "#6b675f", display: "flex" }}>
            {`${listing.organization} · ${categoryLabel(listing.categorySlug, listing.categoryName)}`}
          </div>
        )}
        {deadlineLine && (
          <div style={{ marginTop: 20, fontSize: 36, fontWeight: 700, display: "flex" }}>{deadlineLine}</div>
        )}
        <div style={{ marginTop: "auto", fontSize: 26, color: "#6b675f", display: "flex" }}>
          Free for students · Checked by our team
        </div>
      </div>
    ),
    size,
  );
}
