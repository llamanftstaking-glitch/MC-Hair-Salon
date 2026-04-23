import { MetadataRoute } from "next";

const SITE_URL = "https://mchairsalon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,                      lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/services`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/book`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/gallery`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/team`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
