"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogOut, Palette } from "lucide-react";
import { setTheme, getTheme, type Theme } from "@/lib/theme";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Our Team" },
  { href: "/contact", label: "Contact" },
];

const THEMES: { id: Theme; label: string; color: string; ring: string }[] = [
  { id: "bw",    label: "Classic",  color: "#ffffff", ring: "#ffffff" },
  { id: "gold",  label: "Gold",     color: "#C9A84C", ring: "#C9A84C" },
  { id: "light", label: "Lavender", color: "#a78bfa", ring: "#7c3aed" },
];

interface AuthUser { name: string; email: string }

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [theme, setThemeState]  = useState<Theme>("bw");
  const [user, setUser]         = useState<AuthUser | null>(null);

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

  const navBg = scrolled
    ? "backdrop-blur-md border-b border-[var(--mc-border)] bg-[var(--mc-bg)]/95"
    : "bg-transparent";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
            <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" />
            <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" />
          </div>
          <span className="hidden sm:block font-serif text-base gold-gradient font-bold tracking-wide">
            MC Hair Salon & Spa
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-sm text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors duration-200 tracking-widest uppercase cursor-pointer">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side: auth + Book Now + theme + mobile toggle */}
        <div className="flex items-center gap-3">

          {/* Auth buttons — desktop only */}
          <div className="hidden md:flex items-center gap-2" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account"
                  className="flex items-center gap-2 text-xs text-[var(--mc-muted)] hover:text-[var(--mc-accent)] uppercase tracking-widest transition-colors cursor-pointer">
                  <User size={14} />
                  {user.name.split(" ")[0]}
                </Link>
                <button onClick={handleLogout}
                  className="text-[var(--mc-text-dim)] hover:text-red-400 transition-colors cursor-pointer"
                  title="Sign out">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="text-xs text-[var(--mc-muted)] hover:text-[var(--mc-accent)] uppercase tracking-widest transition-colors cursor-pointer">
                  Sign In
                </Link>
                <span className="text-[var(--mc-border)] select-none">|</span>
                <Link href="/signup"
                  className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-[var(--mc-accent)] text-[var(--mc-accent)] hover:bg-[var(--mc-accent)] hover:text-[var(--mc-bg)] transition-all duration-200 cursor-pointer">
                  Create Account
                </Link>
              </>
            )}
          </div>

          <Link href="/book"
            className="hidden md:inline-flex gold-gradient-bg text-black text-xs font-bold px-5 py-2.5 tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer">
            Book Now
          </Link>

          {/* Theme selector — elevated pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--mc-border)] bg-[var(--mc-surface)]/60 backdrop-blur-sm">
            <Palette size={11} className="text-[var(--mc-text-dim)]" />
            {THEMES.map((t) => (
              <button key={t.id} onClick={() => changeTheme(t.id)}
                aria-label={`${t.label} theme`} title={t.label}
                style={{ width: 44, height: 44, background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0, display: "block",
                  border: theme === t.id ? `2px solid ${t.ring}` : "2px solid rgba(128,128,128,0.35)",
                  outline: theme === t.id ? `2px solid ${t.ring}` : "none",
                  outlineOffset: 2, transition: "all 0.2s",
                  boxShadow: theme === t.id ? `0 0 6px ${t.ring}66` : "none",
                }} />
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-[var(--mc-accent)] cursor-pointer"
            onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[var(--mc-bg)]/98 border-t border-[var(--mc-border)] px-6 py-8 flex flex-col gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors uppercase tracking-widest text-sm cursor-pointer">
              {l.label}
            </Link>
          ))}

          {/* Auth in mobile menu */}
          <div className="flex flex-col gap-3 pt-2 border-t border-[var(--mc-border)]" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account" onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-[var(--mc-accent)] text-sm uppercase tracking-widest cursor-pointer">
                  <User size={15} /> My Account ({user.name.split(" ")[0]})
                </Link>
                <button onClick={handleLogout}
                  className="text-left text-[var(--mc-text-dim)] text-sm uppercase tracking-widest cursor-pointer hover:text-red-400 transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="text-[var(--mc-muted)] text-sm uppercase tracking-widest cursor-pointer hover:text-[var(--mc-accent)] transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="gold-gradient-bg text-black font-bold px-6 py-3 text-center tracking-widest uppercase text-sm cursor-pointer">
                  Create Account
                </Link>
              </>
            )}
          </div>

          <Link href="/book" onClick={() => setOpen(false)}
            className="gold-gradient-bg text-black font-bold px-6 py-4 text-center tracking-widest uppercase text-sm cursor-pointer">
            Book Now
          </Link>

          {/* Theme selector — mobile */}
          <div className="pt-2 border-t border-[var(--mc-border)]">
            <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-[0.3em] mb-3">Appearance</p>
            <div className="flex items-center gap-2">
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => changeTheme(t.id)} title={t.label}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                  style={{ background: "transparent", border: "none", padding: "8px 10px" }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%", background: t.color, flexShrink: 0, display: "block",
                    border: theme === t.id ? `2px solid ${t.ring}` : "2px solid rgba(128,128,128,0.35)",
                    outline: theme === t.id ? `2px solid ${t.ring}` : "none",
                    outlineOffset: 2, transition: "all 0.2s",
                    boxShadow: theme === t.id ? `0 0 8px ${t.ring}66` : "none",
                  }} />
                  <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: theme === t.id ? "var(--mc-accent)" : "var(--mc-text-dim)", transition: "color 0.2s" }}>
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
