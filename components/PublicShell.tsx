"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";
import CurlyBot from "@/components/CurlyBot";
import PromoPopup from "@/components/PromoPopup";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileBookBar />}
      {!isAdmin && <CurlyBot />}
      {!isAdmin && <PromoPopup />}
    </>
  );
}
