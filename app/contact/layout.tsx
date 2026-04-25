import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Hours",
  description:
    "Contact MC Hair Salon & Spa at 336 East 78th St, New York, NY 10075. Call (212) 988-5252, email us, or send a message. Open Monday–Sunday.",
  keywords: [
    "MC Hair Salon contact", "hair salon Upper East Side address",
    "salon phone number NYC", "hair salon hours Upper East Side",
    "336 East 78th Street salon", "MC Hair Salon NYC",
  ],
  openGraph: {
    title: "Contact & Hours | MC Hair Salon & Spa",
    description: "Visit us at 336 East 78th St, New York. Call (212) 988-5252 or send a message. Open 7 days a week.",
    url: "https://mchairsalon.com/contact",
  },
  alternates: { canonical: "https://mchairsalon.com/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
