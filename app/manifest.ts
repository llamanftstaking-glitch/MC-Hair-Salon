import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "MC Hair Salon & Spa",
    short_name:       "MC Salon",
    description:      "Upper East Side's premier luxury hair salon and spa. Precision cuts, color, balayage, and spa services since 2011.",
    start_url:        "/",
    display:          "standalone",
    background_color: "#000000",
    theme_color:      "#B8860B",
    categories:       ["beauty", "lifestyle", "health"],
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [],
  };
}
