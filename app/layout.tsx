import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import JsonLd from "@/components/JsonLd";

const SITE_URL = "https://mchairsalon.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MC Hair Salon & Spa | Upper East Side NYC",
    template: "%s | MC Hair Salon & Spa",
  },
  description:
    "Upper East Side's premier luxury hair salon and spa since 2011. Expert cuts, balayage, color, eyelash extensions, and facials at 336 East 78th St, New York. Book online today.",
  keywords: [
    "hair salon Upper East Side",
    "luxury hair salon NYC",
    "balayage New York",
    "hair color Upper East Side",
    "blowout NYC",
    "eyelash extensions Upper East Side",
    "facial Upper East Side",
    "salon 78th street NYC",
    "MC Hair Salon",
    "hair salon Manhattan",
    "best hair salon Upper East Side",
    "hair highlights NYC",
  ],
  authors: [{ name: "MC Hair Salon & Spa" }],
  creator: "MC Hair Salon & Spa",
  publisher: "MC Hair Salon & Spa",
  category: "Beauty Salon",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MC Hair Salon & Spa",
    title: "MC Hair Salon & Spa | Upper East Side NYC",
    description:
      "Upper East Side luxury salon since 2011. Expert cuts, color, balayage, eyelash extensions & spa services. 336 East 78th St, New York.",
    images: [
      {
        url: "/mc-logo-gold.png",
        width: 1200,
        height: 630,
        alt: "MC Hair Salon & Spa — Upper East Side, New York City",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MC Hair Salon & Spa | Upper East Side NYC",
    description: "Luxury salon & spa on the Upper East Side since 2011. Book your appointment online.",
    images: ["/mc-logo-gold.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`try{var t=localStorage.getItem('mc-theme')||'bw';if(t!=='bw')document.documentElement.setAttribute('data-theme',t);}catch(e){}`}</Script>
      </head>
      <body>
        <JsonLd />
        <SplashScreen />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
