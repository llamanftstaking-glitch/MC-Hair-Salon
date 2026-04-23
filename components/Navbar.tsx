"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Our Team" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const isLite = theme === "lite";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isLite
            ? "bg-white/95 backdrop-blur-md border-b border-[#ddd6fe] shadow-sm"
            : "bg-black/95 backdrop-blur-md border-b border-[#2a2a2a]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <Image
            src="/mc-logo-black.png"
            alt="MC Hair Salon & Spa"
            width={52}
            height={52}
            className="object-contain"
          />
          <span className="hidden sm:block font-serif text-base gold-gradient font-bold tracking-wide">
            MC Hair Salon & Spa
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors duration-200 tracking-widest uppercase cursor-pointer ${
                isLite
                  ? "text-[#6d5b98] hover:text-[#7c3aed]"
                  : "text-[#a89070] hover:text-[#FFD700]"
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle lite mode"
            className={`w-9 h-9 flex items-center justify-center border transition-all duration-200 cursor-pointer ${
              isLite
                ? "border-[#ddd6fe] text-[#7c3aed] hover:bg-[#ede9fe]"
                : "border-[#2a2a2a] text-[#C9A84C] hover:border-[#C9A84C]"
            }`}
          >
            {isLite ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <Link
            href="/book"
            className="gold-gradient-bg text-black text-sm font-bold px-6 py-2.5 tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle lite mode"
            className={`w-9 h-9 flex items-center justify-center border transition-all cursor-pointer ${
              isLite
                ? "border-[#ddd6fe] text-[#7c3aed]"
                : "border-[#2a2a2a] text-[#C9A84C]"
            }`}
          >
            {isLite ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <button
            className={`cursor-pointer ${isLite ? "text-[#7c3aed]" : "text-[#C9A84C]"}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className={`md:hidden border-t px-6 py-8 flex flex-col gap-6 ${
            isLite
              ? "bg-white/99 border-[#ddd6fe]"
              : "bg-black/98 border-[#2a2a2a]"
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`transition-colors uppercase tracking-widest text-sm cursor-pointer ${
                isLite
                  ? "text-[#6d5b98] hover:text-[#7c3aed]"
                  : "text-[#a89070] hover:text-[#FFD700]"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="gold-gradient-bg text-black font-bold px-6 py-4 text-center tracking-widest uppercase text-sm cursor-pointer"
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
