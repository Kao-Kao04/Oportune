import { ImageResponse } from "next/og";

// Default link preview for pages without their own image.
export const alt = "Oportune: opportunities for college students in the Philippines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ marginTop: 64, fontSize: 72, fontWeight: 700, lineHeight: 1.1, display: "flex" }}>
          Scholarships, internships, hackathons, and free courses
        </div>
        <div style={{ marginTop: 24, fontSize: 34, color: "#6b675f", display: "flex" }}>
          For college students in the Philippines, sorted by deadline
        </div>
        <div style={{ marginTop: "auto", fontSize: 26, color: "#6b675f", display: "flex" }}>
          Free for students · Checked by our team
        </div>
      </div>
    ),
    size,
  );
}
