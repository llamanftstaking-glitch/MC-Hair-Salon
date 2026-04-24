import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Packages",
  description:
    "Pre-purchase MC Hair Salon service packages and save. Blowout bundles, color packages, bridal prep, lash packages, and more — tracked in your account. Upper East Side, NYC.",
  keywords: [
    "hair salon package NYC", "salon package deal Upper East Side",
    "blowout package New York", "color package NYC salon",
    "hair salon bundle deal Manhattan", "bridal prep package NYC",
    "lash extension package Upper East Side",
  ],
  openGraph: {
    title: "Service Packages | MC Hair Salon & Spa",
    description: "Save on your favorite services with pre-purchased bundles. Blowouts, color, lashes, bridal prep and more.",
    url: "https://mchairsalon.com/packages",
  },
  alternates: { canonical: "https://mchairsalon.com/packages" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do hair salon packages expire?",
      acceptedAnswer: { "@type": "Answer", text: "Each package has a validity period of 6 or 12 months from the date of purchase. Unused sessions expire at the end of that period." },
    },
    {
      "@type": "Question",
      name: "Can I share a package with a friend?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — all MC Hair Salon packages are transferable. Let the front desk know and they will apply your session to any guest." },
    },
    {
      "@type": "Question",
      name: "Can I buy multiple packages at the same time?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. You can own multiple packages at the same time and choose which one to apply at each visit." },
    },
    {
      "@type": "Question",
      name: "What happens if I cancel a session from my package?",
      acceptedAnswer: { "@type": "Answer", text: "Standard 24-hour cancellation policy applies. Your session is returned to your package if cancelled in time." },
    },
  ],
};

const packageListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MC Hair Salon Service Packages",
  url: "https://mchairsalon.com/packages",
  itemListElement: [
    { "@type": "ListItem", position: 1, item: { "@type": "Offer", name: "Blowout Bundle",      description: "5 blowout sessions",                     price: "149", priceCurrency: "USD" } },
    { "@type": "ListItem", position: 2, item: { "@type": "Offer", name: "Color Club",           description: "3 full color sessions",                  price: "235", priceCurrency: "USD" } },
    { "@type": "ListItem", position: 3, item: { "@type": "Offer", name: "Glam Pack",            description: "3 makeup application sessions",          price: "199", priceCurrency: "USD" } },
    { "@type": "ListItem", position: 4, item: { "@type": "Offer", name: "Bridal Prep",          description: "Complete bridal beauty plan — 4 sessions", price: "449", priceCurrency: "USD" } },
    { "@type": "ListItem", position: 5, item: { "@type": "Offer", name: "The Full Experience",  description: "Cut + color + blowout + facial",         price: "279", priceCurrency: "USD" } },
    { "@type": "ListItem", position: 6, item: { "@type": "Offer", name: "Lash Love",            description: "Full set + 2 lash fills",                price: "269", priceCurrency: "USD" } },
    { "@type": "ListItem", position: 7, item: { "@type": "Offer", name: "VIP Year",             description: "12 monthly blowouts",                    price: "329", priceCurrency: "USD" } },
    { "@type": "ListItem", position: 8, item: { "@type": "Offer", name: "Wellness Ritual",      description: "3 revitalizing facials",                 price: "210", priceCurrency: "USD" } },
  ],
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packageListSchema) }} />
      {children}
    </>
  );
}
