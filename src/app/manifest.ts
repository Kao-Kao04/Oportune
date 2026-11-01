import type { MetadataRoute } from "next";

// Makes Oportune installable ("Add to Home Screen"); needed for iPhone push.
// share_target puts Oportune in Android's share menu: sharing a post from
// Facebook, Instagram, X, or LinkedIn opens /submit with its link and text.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oportune",
    short_name: "Oportune",
    description: "Never miss a deadline. Student opportunities in the Philippines, each checked by a person against its source.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#faf8f3",
    share_target: {
      action: "/submit",
      method: "get",
      params: { title: "title", text: "text", url: "url" },
    },
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
