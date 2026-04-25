import { MetadataRoute } from "next";

const BASE = "https://mchairsalon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Core — highest priority
    { url: BASE,                       lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/book`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.95 },
    { url: `${BASE}/services`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.9  },

    // Revenue pages
    { url: `${BASE}/packages`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.88 },
    { url: `${BASE}/gift-card`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/weddings`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/makeup`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.82 },

    // Discovery / trust
    { url: `${BASE}/gallery`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.80 },
    { url: `${BASE}/team`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/visit`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.72 },
    { url: `${BASE}/contact`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.70 },

    // Loyalty
    { url: `${BASE}/rewards`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },

    // Legal
    { url: `${BASE}/terms`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.30 },
  ];
}
