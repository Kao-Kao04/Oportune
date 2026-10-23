import { ImageResponse } from "next/og";

// App icons for the browser tab and the installed app (manifest).
export function generateImageMetadata() {
  return [
    { id: "192", size: { width: 192, height: 192 }, contentType: "image/png" },
    { id: "512", size: { width: 512, height: 512 }, contentType: "image/png" },
  ];
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const size = Number(await id);
  return new ImageResponse(<Mark size={size} />, { width: size, height: size });
}

export function Mark({ size }: { size: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f5257",
        color: "#faf8f3",
        fontSize: size * 0.62,
        fontWeight: 700,
        letterSpacing: -size * 0.02,
      }}
    >
      O
    </div>
  );
}
