import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse MC Hair Salon & Spa's photo gallery — stunning color transformations, precision cuts, balayage, updos, and spa results from our Upper East Side salon.",
  keywords: [
    "hair salon gallery NYC", "balayage before after", "hair color transformation",
    "Upper East Side salon photos", "blowout results NYC", "bridal hair NYC",
    "hair highlights photos Manhattan",
  ],
  openGraph: {
    title: "Gallery | MC Hair Salon & Spa",
    description: "Color transformations, cuts, balayage, updos and spa results from NYC's Upper East Side.",
    url: "https://mchairsalon.com/gallery",
  },
  alternates: { canonical: "https://mchairsalon.com/gallery" },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
