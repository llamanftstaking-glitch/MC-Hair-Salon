import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import PublicShell from "@/components/PublicShell";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";
import CurlyBot from "@/components/CurlyBot";
import PromoPopup from "@/components/PromoPopup";
import { getSettings } from "@/lib/settings";

const SITE_URL = "https://mchairsalon.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hair Salon Upper East Side NYC | MC Hair Salon & Spa",
    template: "%s | MC Hair Salon & Spa",
  },
  description:
    "Upper East Side hair salon & spa since 2011. Expert cuts, balayage, color, lash extensions & facials at 336 E 78th St, NYC. Book online.",
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
        url: "/mc-logo-bw.png",
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
    images: ["/mc-logo-bw.png"],
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings().catch(() => null);
  const t = settings?.theme;
  const customCss = t ? `
    html[data-theme="bw"], html:not([data-theme]) {
      --mc-accent: ${t.accent};
      --mc-accent-2: ${t.accent2};
      --mc-bg: ${t.bg};
      --mc-surface: ${t.surface};
      --mc-card-bg: ${t.surface};
      --mc-border: ${t.border};
      --mc-card-border: ${t.border};
      --mc-text: ${t.text};
      --mc-muted: ${t.muted};
    }
  ` : "";
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`try{var t=localStorage.getItem('mc-theme')||'bw';if(t!=='bw')document.documentElement.setAttribute('data-theme',t);}catch(e){}`}</Script>
        {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}
      </head>
      <body>
        <JsonLd />
        <PublicShell
          navbar={<Navbar />}
          footer={<Footer />}
          mobileBookBar={<MobileBookBar />}
          curlyBot={<CurlyBot />}
          promoPopup={<PromoPopup />}
        >
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
