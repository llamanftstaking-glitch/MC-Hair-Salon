"use client";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  mobileBookBar: React.ReactNode;
  curlyBot: React.ReactNode;
  promoPopup: React.ReactNode;
}

export default function PublicShell({ children, navbar, footer, mobileBookBar, curlyBot, promoPopup }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && navbar}
      <main>{children}</main>
      {!isAdmin && footer}
      {!isAdmin && mobileBookBar}
      {!isAdmin && curlyBot}
      {!isAdmin && promoPopup}
    </>
  );
}
