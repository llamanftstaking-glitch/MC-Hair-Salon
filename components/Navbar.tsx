"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogOut, Palette } from "lucide-react";
import { setTheme, getTheme, type Theme } from "@/lib/theme";

const links = [
  { href: "/",        label: "Home"     },
  { href: "/services", label: "Services" },
  { href: "/gallery",  label: "Gallery"  },
  { href: "/team",     label: "Team"     },
  { href: "/contact",  label: "Contact"  },
];

const THEMES: { id: Theme; label: string; color: string; ring: string }[] = [
  { id: "bw",    label: "Classic",  color: "#ffffff", ring: "#ffffff" },
  { id: "gold",  label: "Gold",     color: "#C9A84C", ring: "#C9A84C" },
  { id: "light", label: "Lavender", color: "#a78bfa", ring: "#7c3aed" },
];

interface AuthUser { name: string; email: string }

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [theme, setThemeState]    = useState<Theme>("bw");
  const [user, setUser]           = useState<AuthUser | null>(null);

  useEffect(() => {
    setThemeState(getTheme());
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data ?? null))
      .catch(() => {});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function changeTheme(t: Theme) { setTheme(t); setThemeState(t); }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[var(--mc-bg)]/95 backdrop-blur-md border-b border-[var(--mc-border)]" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer">
          <div className="relative w-9 h-9">
            <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" />
            <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" />
          </div>
          <span className="hidden lg:block font-serif text-sm font-bold tracking-wide gold-gradient whitespace-nowrap">
            MC Hair Salon & Spa
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-xs text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors tracking-widest uppercase whitespace-nowrap cursor-pointer">
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Auth — desktop */}
          <div className="hidden lg:flex items-center gap-2" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account"
                  className="flex items-center gap-1.5 text-xs text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                  <User size={13} />
                  <span className="uppercase tracking-wider">{user.name.split(" ")[0]}</span>
                </Link>
                <button onClick={handleLogout} title="Sign out"
                  className="text-[var(--mc-text-dim)] hover:text-red-400 transition-colors cursor-pointer p-1">
                  <LogOut size={13} />
                </button>
              </>
            ) : (
              <Link href="/login"
                className="flex items-center gap-1.5 text-xs text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors uppercase tracking-widest cursor-pointer">
                <User size={13} />
                Sign In
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-4 bg-[var(--mc-border)]" />

          {/* Book Now */}
          <Link href="/book"
            className="hidden lg:inline-flex items-center gold-gradient-bg text-black text-[11px] font-bold px-4 py-2 tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
            Book Now
          </Link>

          {/* Theme dots */}
          <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-full border border-[var(--mc-border)] bg-[var(--mc-surface)]/60 backdrop-blur-sm">
            <Palette size={10} className="text-[var(--mc-text-dim)] mr-0.5" />
            {THEMES.map((t) => (
              <button key={t.id} onClick={() => changeTheme(t.id)}
                aria-label={t.label} title={t.label}
                style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <span style={{
                  width: 9, height: 9, borderRadius: "50%", background: t.color, display: "block", flexShrink: 0,
                  border: theme === t.id ? `2px solid ${t.ring}` : "2px solid rgba(128,128,128,0.3)",
                  outline: theme === t.id ? `2px solid ${t.ring}` : "none",
                  outlineOffset: 2, transition: "all 0.2s",
                  boxShadow: theme === t.id ? `0 0 5px ${t.ring}55` : "none",
                }} />
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden text-[var(--mc-accent)] cursor-pointer p-1" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="lg:hidden bg-[var(--mc-bg)] border-t border-[var(--mc-border)] px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-sm text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors uppercase tracking-widest cursor-pointer">
              {l.label}
            </Link>
          ))}

          <div className="border-t border-[var(--mc-border)] pt-4 flex flex-col gap-3" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-sm text-[var(--mc-accent)] uppercase tracking-widest cursor-pointer">
                  <User size={14} /> My Account ({user.name.split(" ")[0]})
                </Link>
                <button onClick={handleLogout}
                  className="text-left text-sm text-[var(--mc-text-dim)] uppercase tracking-widest cursor-pointer hover:text-red-400 transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="text-sm text-[var(--mc-muted)] uppercase tracking-widest cursor-pointer hover:text-[var(--mc-accent)] transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="text-sm text-[var(--mc-muted)] uppercase tracking-widest cursor-pointer hover:text-[var(--mc-accent)] transition-colors">
                  Create Account
                </Link>
              </>
            )}
          </div>

          <Link href="/book" onClick={() => setOpen(false)}
            className="gold-gradient-bg text-black font-bold px-6 py-3.5 text-center tracking-widest uppercase text-sm cursor-pointer">
            Book Now
          </Link>

          <div className="border-t border-[var(--mc-border)] pt-4">
            <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mb-3">Appearance</p>
            <div className="flex items-center gap-1">
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => changeTheme(t.id)} title={t.label}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                  style={{ background: "transparent", border: "none", padding: "6px 10px" }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", background: t.color, display: "block",
                    border: theme === t.id ? `2px solid ${t.ring}` : "2px solid rgba(128,128,128,0.3)",
                    outline: theme === t.id ? `2px solid ${t.ring}` : "none",
                    outlineOffset: 2, transition: "all 0.2s",
                    boxShadow: theme === t.id ? `0 0 8px ${t.ring}66` : "none",
                  }} />
                  <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em",
                    color: theme === t.id ? "var(--mc-accent)" : "var(--mc-text-dim)", transition: "color 0.2s" }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
