import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your hair or spa appointment at MC Hair Salon & Spa in the Upper East Side. Choose your stylist, service, date, and time. Online booking available 24/7.",
  keywords: [
    "book hair appointment NYC", "salon booking Upper East Side",
    "online hair salon booking Manhattan", "book stylist NYC",
    "hair appointment Upper East Side", "book blowout NYC",
    "book balayage appointment Manhattan",
  ],
  openGraph: {
    title: "Book an Appointment | MC Hair Salon & Spa",
    description: "Schedule your hair or spa appointment online. Choose your stylist and service at our Upper East Side salon.",
    url: "https://mchairsalon.com/book",
  },
  alternates: { canonical: "https://mchairsalon.com/book" },
};

const reserveSchema = {
  "@context": "https://schema.org",
  "@type": "ReserveAction",
  name: "Book an Appointment at MC Hair Salon & Spa",
  target: {
    "@type": "EntryPoint",
    urlTemplate: "https://mchairsalon.com/book",
    actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"],
  },
  result: {
    "@type": "Reservation",
    name: "Hair or Spa Appointment",
    reservationFor: {
      "@type": "LocalBusiness",
      name: "MC Hair Salon & Spa",
      address: {
        "@type": "PostalAddress",
        streetAddress: "336 East 78th St",
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: "10075",
      },
    },
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reserveSchema) }}
      />
      {children}
    </>
  );
}
