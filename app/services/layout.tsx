import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Full service menu at MC Hair Salon & Spa — women's and men's cuts, balayage, highlights, full color, blowouts, eyelash extensions, facials, and makeup. Upper East Side, NYC. Prices from $20.",
  keywords: [
    "hair salon services NYC", "balayage Upper East Side", "highlights Manhattan",
    "blowout NYC", "women's haircut Upper East Side", "men's haircut NYC",
    "eyelash extensions Upper East Side", "facial Upper East Side",
    "hair color Manhattan", "corrective color NYC", "hair treatment salon",
    "makeup application NYC",
  ],
  openGraph: {
    title: "Services & Pricing | MC Hair Salon & Spa",
    description: "Full service menu: cuts, balayage, color, blowouts, eyelash extensions, facials & makeup. Upper East Side, NYC.",
    url: "https://mchairsalon.com/services",
  },
  alternates: { canonical: "https://mchairsalon.com/services" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MC Hair Salon & Spa — Service Menu",
  url: "https://mchairsalon.com/services",
  numberOfItems: 18,
  itemListElement: [
    { "@type": "ListItem", position: 1,  item: { "@type": "Service", name: "Women's Cut & Style",           offers: { "@type": "Offer", price: "45",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 2,  item: { "@type": "Service", name: "Men's Clip & Cut",              offers: { "@type": "Offer", price: "30",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 3,  item: { "@type": "Service", name: "Children's Cut (under 7)",     offers: { "@type": "Offer", price: "20",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 4,  item: { "@type": "Service", name: "Blow Out & Style",              offers: { "@type": "Offer", price: "33",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 5,  item: { "@type": "Service", name: "Highlights / Balayage",        offers: { "@type": "Offer", price: "120", priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 6,  item: { "@type": "Service", name: "Full Color (L'Oréal)",         offers: { "@type": "Offer", price: "85",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 7,  item: { "@type": "Service", name: "Corrective Color",             offers: { "@type": "Offer", price: "200", priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 8,  item: { "@type": "Service", name: "Updo & Special Event Styling", offers: { "@type": "Offer", price: "75",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 9,  item: { "@type": "Service", name: "Eyelash Extensions",           offers: { "@type": "Offer", price: "150", priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 10, item: { "@type": "Service", name: "Facial",                       offers: { "@type": "Offer", price: "80",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 11, item: { "@type": "Service", name: "Makeup Application",           offers: { "@type": "Offer", price: "75",  priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
    { "@type": "ListItem", position: 12, item: { "@type": "Service", name: "Bridal Makeup",                offers: { "@type": "Offer", price: "200", priceCurrency: "USD", priceSpecification: { priceType: "MinimumAnnotatedPrice" } } } },
  ],
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
