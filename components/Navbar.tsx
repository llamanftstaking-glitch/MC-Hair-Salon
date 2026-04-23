"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/95 backdrop-blur-md border-b border-[#2a2a2a]" : "bg-transparent"
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
              className="text-sm text-[#a89070] hover:text-[#FFD700] transition-colors duration-200 tracking-widest uppercase cursor-pointer"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="gold-gradient-bg text-black text-sm font-bold px-6 py-2.5 tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#C9A84C] cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/98 border-t border-[#2a2a2a] px-6 py-8 flex flex-col gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[#a89070] hover:text-[#FFD700] transition-colors uppercase tracking-widest text-sm cursor-pointer"
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
