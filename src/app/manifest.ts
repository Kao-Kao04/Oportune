import type { MetadataRoute } from "next";

// Makes Oportune installable ("Add to Home Screen"); needed for iPhone push.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oportune",
    short_name: "Oportune",
    description: "Verified scholarships, internships, hackathons, and free courses for college students in the Philippines.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#faf8f3",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
