"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { setTheme, getTheme, type Theme } from "@/lib/theme";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Our Team" },
  { href: "/contact", label: "Contact" },
];

const THEMES: { id: Theme; label: string; color: string; ring: string }[] = [
  { id: "bw",    label: "Classic",    color: "#ffffff", ring: "#ffffff" },
  { id: "gold",  label: "Gold",       color: "#C9A84C", ring: "#C9A84C" },
  { id: "light", label: "Light",      color: "#f5f0e8", ring: "#8B6914" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [theme, setThemeState]    = useState<Theme>("bw");

  useEffect(() => {
    setThemeState(getTheme());
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function changeTheme(t: Theme) {
    setTheme(t);
    setThemeState(t);
  }

  const navBg = scrolled
    ? "backdrop-blur-md border-b border-[var(--mc-border)] bg-[var(--mc-bg)]/95"
    : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo — 3 versions, CSS shows correct one */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
            <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" />
            <Image src="/mc-logo-gold.png"  alt="MC Hair Salon" fill className="logo-gold  object-contain" />
            <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" />
          </div>
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
              className="text-sm text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors duration-200 tracking-widest uppercase cursor-pointer"
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

        {/* Right side: theme dots + mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <div className="flex items-center gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                aria-label={`${t.label} theme`}
                title={t.label}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  background: t.color,
                  border: theme === t.id
                    ? `2px solid ${t.ring}`
                    : "2px solid rgba(128,128,128,0.4)",
                  outline: theme === t.id ? `2px solid ${t.ring}` : "none",
                  outlineOffset: 2,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[var(--mc-accent)] cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[var(--mc-bg)]/98 border-t border-[var(--mc-border)] px-6 py-8 flex flex-col gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors uppercase tracking-widest text-sm cursor-pointer"
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
          {/* Theme dots in mobile menu */}
          <div className="flex items-center gap-3 pt-2 border-t border-[var(--mc-border)]">
            <span className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest">Theme</span>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                title={t.label}
                style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: t.color,
                  border: theme === t.id ? `2px solid ${t.ring}` : "2px solid rgba(128,128,128,0.4)",
                  outline: theme === t.id ? `2px solid ${t.ring}` : "none",
                  outlineOffset: 2,
                  cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
