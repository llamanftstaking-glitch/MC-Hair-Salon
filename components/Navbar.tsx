"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LogOut, X } from "lucide-react";
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
  { href: "/book",      label: "Book Appointment" },
  { href: "/visit",     label: "How to Get Here"  },
  { href: "/packages",  label: "Packages"          },
  { href: "/gift-card", label: "Gift Cards"        },
  { href: "/account",   label: "My Account"        },
];

const THEMES: { id: Theme; label: string; color: string; ring: string }[] = [
  { id: "bw",    label: "Classic",  color: "#ffffff", ring: "#ffffff" },
  { id: "gold",  label: "Gold",     color: "#C9A84C", ring: "#C9A84C" },
  { id: "light", label: "Lavender", color: "#a78bfa", ring: "#7c3aed" },
];

interface AuthUser { name: string; email: string }

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setThemeState]  = useState<Theme>("bw");
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname  = usePathname();
  const isHome    = pathname === "/";

  useEffect(() => {
    setThemeState(getTheme());
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data ?? null))
      .catch(() => {});
  }, []);

  // Reveal navbar logo after hero on home page
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Lock body scroll when menu open
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
      {/* ── Announcement bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--mc-surface)] border-b border-[var(--mc-border)]">
        <div className="flex items-center justify-center py-2.5 px-10 relative">
          <p className="text-[11px] tracking-[0.2em] text-[var(--mc-text)] uppercase">
            Upper East Side · New York City ·{" "}
            <a href="tel:+12129885252" className="hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
              (212) 988-5252
            </a>
          </p>
          <Link href="/book"
            className="absolute right-5 text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors text-[11px] tracking-widest uppercase cursor-pointer hidden sm:block">
            Book →
          </Link>
        </div>

        {/* ── Main bar ── */}
        <div className="grid grid-cols-3 items-center h-[60px] px-6 sm:px-10 border-t border-[var(--mc-border)] bg-[var(--mc-bg)]/95 backdrop-blur-md">

          {/* Left */}
          <div className="flex items-center gap-5">
            <Link href="/book"
              className="text-[11px] uppercase tracking-[0.18em] text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer whitespace-nowrap hidden sm:block">
              + Book Now
            </Link>
          </div>

          {/* Center — logo (hidden at top of home page) */}
          <Link href="/" className="flex justify-center cursor-pointer" onClick={() => setMenuOpen(false)}>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12"
              style={{ opacity: isHome && !scrolled ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: isHome && !scrolled ? "none" : "auto" }}>
              <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" priority />
              <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" priority />
            </div>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3 sm:gap-5 justify-end" suppressHydrationWarning>
            {user ? (
              <Link href="/account"
                className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer"
                title={user.name}>
                <User size={17} />
              </Link>
            ) : (
              <Link href="/login"
                className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer"
                title="Sign In">
                <User size={17} />
              </Link>
            )}

            {/* MENU button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 border border-[var(--mc-border)] hover:border-[var(--mc-accent)] transition-colors cursor-pointer group"
              aria-label="Toggle menu"
            >
              <span className="flex flex-col gap-[4px] w-4">
                <span className="block h-px w-full bg-[var(--mc-text)] group-hover:bg-[var(--mc-accent)] transition-colors" />
                <span className="block h-px w-full bg-[var(--mc-text)] group-hover:bg-[var(--mc-accent)] transition-colors" />
                <span className="block h-px w-2/3 bg-[var(--mc-text)] group-hover:bg-[var(--mc-accent)] transition-colors" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--mc-text)] group-hover:text-[var(--mc-accent)] transition-colors hidden sm:block">
                Menu
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Gucci-style slide-in overlay ── always mounted, animated via transform ── */}

      {/* Backdrop — dims + blurs left side */}
      <div
        className="fixed inset-0 z-[60]"
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(3px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Right drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[61] bg-white flex flex-col overflow-y-auto"
        style={{
          width: "min(420px, 100vw)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Panel top — padding to clear navbar height */}
        <div className="pt-[100px] px-10 pb-6 flex-1">

          {/* Primary nav links */}
          <nav className="space-y-1 mb-10">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block font-serif text-[2rem] leading-[1.2] text-gray-900 hover:text-[#B8860B] transition-colors duration-150 cursor-pointer py-2 border-b border-gray-100 last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Secondary links */}
          <div className="space-y-2 mb-10">
            {secondaryLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150 cursor-pointer py-1.5"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mb-8" />

          {/* Auth links */}
          <div className="space-y-2 mb-8" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer py-1">
                  <User size={14} /> {user.name}
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer py-1">
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="block text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer py-1 underline underline-offset-2">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Theme selector */}
          <div className="flex items-center gap-3 pb-6">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 mr-1">Theme</span>
            {THEMES.map(t => (
              <button key={t.id} onClick={() => changeTheme(t.id)} title={t.label}
                style={{ width: 32, height: 32, background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: t.id === "bw" ? "#111" : t.color,
                  display: "block",
                  border: theme === t.id ? `2px solid ${t.id === "bw" ? "#111" : t.ring}` : "1.5px solid rgba(0,0,0,0.15)",
                  outline: theme === t.id ? `2px solid ${t.id === "bw" ? "#111" : t.ring}` : "none",
                  outlineOffset: 2, transition: "all 0.2s",
                }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Close button — fixed top-right, circular */}
      <button
        onClick={() => setMenuOpen(false)}
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
        className="fixed top-5 right-5 z-[62] w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-colors cursor-pointer shadow-lg"
        aria-label="Close menu"
      >
        <X size={18} />
      </button>
    </>
  );
}
