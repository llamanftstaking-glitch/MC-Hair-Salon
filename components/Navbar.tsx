"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LogOut, X, Phone } from "lucide-react";
import { setTheme, getTheme, type Theme } from "@/lib/theme";

const navLinks = [
  { href: "/",         label: "Home"        },
  { href: "/services", label: "Services"    },
  { href: "/gallery",  label: "Gallery"     },
  { href: "/makeup",   label: "Makeup"      },
  { href: "/weddings", label: "Weddings"    },
  { href: "/team",     label: "Our Team"    },
  { href: "/rewards",  label: "Rewards"     },
  { href: "/contact",  label: "Contact"     },
];

const secondaryLinks = [
  { href: "/about",     label: "About Us"         },
  { href: "/blog",      label: "Journal"          },
  { href: "/packages",  label: "Packages"         },
  { href: "/gift-card", label: "Gift Cards"       },
  { href: "/visit",     label: "How to Get Here"  },
  { href: "/account",   label: "My Account"       },
];

const THEMES: { id: Theme; label: string; color: string; ring: string }[] = [
  { id: "bw",   label: "Classic", color: "#ffffff", ring: "#ffffff" },
  { id: "gold", label: "Gold",    color: "#C9A84C", ring: "#C9A84C" },
];

interface AuthUser { name: string; email: string }

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setThemeState]  = useState<Theme>("bw");
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome   = pathname === "/";

  useEffect(() => {
    setThemeState(getTheme());
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data ?? null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function changeTheme(t: Theme) { setTheme(t); setThemeState(t); }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <>
      {/* ── Top bar ── */}
      <div className="mc-navbar fixed top-0 left-0 right-0 z-50 bg-[var(--mc-surface)] border-b border-[var(--mc-border)]">

        {/* Announcement strip */}
        <div className="flex items-center justify-center py-2 px-4 sm:px-10 relative">
          {/* Mobile: phone only */}
          <a href="tel:+12129885252"
            className="lg:hidden flex items-center gap-1.5 text-xs tracking-[0.15em] text-[var(--mc-text)] uppercase">
            <Phone size={12} className="text-[var(--mc-accent)]" />
            (212) 988-5252
          </a>
          {/* Desktop: full tagline */}
          <p className="hidden lg:block text-[11px] tracking-[0.2em] text-[var(--mc-text)] uppercase">
            Upper East Side · New York City ·{" "}
            <a href="tel:+12129885252" className="hover:text-[var(--mc-accent)] transition-colors">
              (212) 988-5252
            </a>
          </p>
        </div>

        {/* ── MOBILE main bar (< lg) ── */}
        <div className="lg:hidden grid grid-cols-3 items-center h-[56px] px-4 border-t border-[var(--mc-border)] bg-[var(--mc-bg)]/95">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link href="/book"
              className="text-[10px] uppercase tracking-[0.15em] text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer whitespace-nowrap">
              + Book
            </Link>
          </div>

          {/* Center — logo */}
          <Link href="/" className="flex justify-center cursor-pointer" onClick={() => setMenuOpen(false)}>
            <div
              className="relative w-9 h-9"
              style={{
                opacity: isHome && !scrolled ? 0 : 1,
                transition: "opacity 0.4s ease",
                pointerEvents: isHome && !scrolled ? "none" : "auto",
              }}
            >
              <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" priority />
              <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" priority />
            </div>
          </Link>

          {/* Right — user + hamburger */}
          <div className="flex items-center gap-2 justify-end" suppressHydrationWarning>
            {user ? (
              <Link href="/account" className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer p-1" title={user.name}>
                <User size={17} />
              </Link>
            ) : (
              <Link href="/login" className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer p-1" title="Sign In">
                <User size={17} />
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-[var(--mc-border)] hover:border-[var(--mc-accent)] transition-colors cursor-pointer group min-h-0"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="flex flex-col gap-[5px] w-4">
                <span className="block h-px w-full bg-[var(--mc-text)] group-hover:bg-[var(--mc-accent)] transition-colors" />
                <span className="block h-px w-full bg-[var(--mc-text)] group-hover:bg-[var(--mc-accent)] transition-colors" />
                <span className="block h-px w-2/3 bg-[var(--mc-text)] group-hover:bg-[var(--mc-accent)] transition-colors" />
              </span>
            </button>
          </div>
        </div>

        {/* ── DESKTOP main bar (lg+) ── */}
        <div className="hidden lg:flex items-center h-[60px] px-10 border-t border-[var(--mc-border)] bg-[var(--mc-bg)]/95 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 cursor-pointer mr-2">
            <div
              className="relative w-11 h-11"
              style={{
                opacity: isHome && !scrolled ? 0 : 1,
                transition: "opacity 0.4s ease",
                pointerEvents: isHome && !scrolled ? "none" : "auto",
              }}
            >
              <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" priority />
              <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" priority />
            </div>
          </Link>

          {/* Inline nav links */}
          <nav className="flex items-center gap-1 flex-1" aria-label="Main navigation">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  pathname === l.href
                    ? "text-[var(--mc-accent)]"
                    : "text-[var(--mc-muted)] hover:text-[var(--mc-accent)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right — Book CTA + user */}
          <div className="flex items-center gap-4 shrink-0" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account"
                  className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] uppercase tracking-widest"
                  title={user.name}>
                  <User size={14} />
                  <span className="hidden xl:block max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </Link>
                <button onClick={handleLogout}
                  className="text-[var(--mc-muted)] hover:text-red-400 transition-colors cursor-pointer"
                  title="Sign Out">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <Link href="/login"
                className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer text-[11px] uppercase tracking-widest"
                title="Sign In">
                <User size={16} />
              </Link>
            )}

            <Link href="/book"
              className="px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-black cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ background: "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #C9A84C 100%)" }}>
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* ── Backdrop (mobile only) ── */}
      <div
        className="lg:hidden fixed inset-0 z-[60]"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          visibility: menuOpen ? "visible" : "hidden",
          transition: menuOpen
            ? "opacity 0.3s ease, visibility 0s 0s"
            : "opacity 0.3s ease, visibility 0s 0.3s",
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Slide-in drawer (mobile only) ── */}
      <div
        className="lg:hidden fixed top-0 right-0 bottom-0 z-[61] bg-white flex flex-col"
        style={{
          width: "min(400px, 100vw)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Close row */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <span className="font-serif text-sm text-gray-400 tracking-widest uppercase">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6"
          style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>

          {/* Book Now CTA */}
          <Link
            href="/book"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-full py-4 mb-8 text-xs font-bold uppercase tracking-widest text-black cursor-pointer"
            style={{ background: "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #C9A84C 100%)" }}
          >
            Book Appointment
          </Link>

          {/* Primary nav */}
          <nav aria-label="Main navigation">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block font-serif leading-none text-gray-900 hover:text-[#B8860B] transition-colors duration-150 cursor-pointer py-2.5 border-b border-gray-100 last:border-0 ${
                  pathname === l.href ? "text-[#B8860B]" : ""
                }`}
                style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Secondary links */}
          <div className="mt-8 mb-6 space-y-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">More</p>
            {secondaryLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center py-2.5 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150 cursor-pointer border-b border-gray-50 last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="h-px bg-gray-100 mb-6" />

          {/* Auth */}
          <div className="space-y-1 mb-6" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                  <User size={14} /> {user.name}
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 py-2.5 text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer w-full min-h-0">
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer underline underline-offset-2">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}
                  className="py-2.5 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Theme selector */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Theme</span>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => changeTheme(t.id)}
                title={t.label}
                className="w-8 h-8 flex items-center justify-center cursor-pointer min-h-0"
                aria-label={`Switch to ${t.label} theme`}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: t.id === "bw" ? "#111" : t.color,
                  display: "block",
                  border: theme === t.id ? `2px solid ${t.id === "bw" ? "#111" : t.ring}` : "1.5px solid rgba(0,0,0,0.15)",
                  outline: theme === t.id ? `2px solid ${t.id === "bw" ? "#111" : t.ring}` : "none",
                  outlineOffset: 2,
                  transition: "all 0.2s",
                }} />
              </button>
            ))}
          </div>

          {/* Salon info */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Visit Us</p>
            <p className="text-xs text-gray-500">336 East 78th St · Upper East Side</p>
            <a href="tel:+12129885252" className="block text-xs text-gray-500 hover:text-[#B8860B] transition-colors">
              (212) 988-5252
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
