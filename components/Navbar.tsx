"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, LogOut } from "lucide-react";
import { setTheme, getTheme, type Theme } from "@/lib/theme";

const leftLinks  = [
  { href: "/",         label: "Home"     },
  { href: "/services", label: "Services" },
  { href: "/gallery",  label: "Gallery"  },
];
const rightLinks = [
  { href: "/team",    label: "Team"    },
  { href: "/contact", label: "Contact" },
];

const THEMES: { id: Theme; color: string; ring: string }[] = [
  { id: "bw",    color: "#ffffff", ring: "#ffffff" },
  { id: "gold",  color: "#C9A84C", ring: "#C9A84C" },
  { id: "light", color: "#a78bfa", ring: "#7c3aed" },
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

  const linkClass = "text-[11px] uppercase tracking-[0.14em] text-[var(--mc-muted)] hover:text-[var(--mc-accent)] transition-colors duration-200 whitespace-nowrap cursor-pointer";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[var(--mc-bg)]/95 backdrop-blur-md border-b border-[var(--mc-border)]" : "bg-transparent"
    }`}>

      {/* ── Desktop ── */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-[68px] max-w-7xl mx-auto px-8">

        {/* Left links */}
        <div className="flex items-center gap-7 justify-end">
          {leftLinks.map(l => (
            <Link key={l.href} href={l.href} className={linkClass}>{l.label}</Link>
          ))}
        </div>

        {/* Center logo */}
        <Link href="/" className="flex items-center justify-center px-8 cursor-pointer">
          <div className="relative w-11 h-11">
            <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" />
            <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" />
          </div>
        </Link>

        {/* Right links + actions */}
        <div className="flex items-center gap-7 justify-start">
          {rightLinks.map(l => (
            <Link key={l.href} href={l.href} className={linkClass}>{l.label}</Link>
          ))}

          {/* Divider */}
          <div className="w-px h-3.5 bg-[var(--mc-border)]" />

          {/* Auth */}
          <div className="flex items-center gap-3" suppressHydrationWarning>
            {user ? (
              <>
                <Link href="/account" className={`flex items-center gap-1.5 ${linkClass}`}>
                  <User size={12} />{user.name.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} title="Sign out"
                  className="text-[var(--mc-text-dim)] hover:text-red-400 transition-colors cursor-pointer">
                  <LogOut size={12} />
                </button>
              </>
            ) : (
              <Link href="/login" className={`flex items-center gap-1.5 ${linkClass}`}>
                <User size={12} />Sign In
              </Link>
            )}
          </div>

          {/* Book Now */}
          <Link href="/book"
            className="text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-2 gold-gradient-bg text-black hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
            Book Now
          </Link>

          {/* Theme dots — minimal, no container */}
          <div className="flex items-center gap-2">
            {THEMES.map(t => (
              <button key={t.id} onClick={() => changeTheme(t.id)} title={t.id}
                style={{ width: 28, height: 28, background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", background: t.color, display: "block",
                  border: theme === t.id ? `2px solid ${t.ring}` : "1.5px solid rgba(128,128,128,0.3)",
                  outline: theme === t.id ? `1.5px solid ${t.ring}` : "none",
                  outlineOffset: 2, transition: "all 0.2s",
                }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile header ── */}
      <div className="lg:hidden flex items-center justify-between h-16 px-5">
        <Link href="/" className="relative w-9 h-9 cursor-pointer flex-shrink-0">
          <Image src="/mc-logo-bw.png"    alt="MC Hair Salon" fill className="logo-bw    object-contain" />
          <Image src="/mc-logo-black.png" alt="MC Hair Salon" fill className="logo-light object-contain" />
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/book"
            className="text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 gold-gradient-bg text-black cursor-pointer">
            Book Now
          </Link>
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu"
            className="text-[var(--mc-accent)] cursor-pointer p-1">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="lg:hidden bg-[var(--mc-bg)] border-t border-[var(--mc-border)] px-5 py-6 flex flex-col gap-5">
          {[...leftLinks, ...rightLinks].map(l => (
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
                  className="text-sm text-[var(--mc-muted)] uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="text-sm text-[var(--mc-muted)] uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Theme */}
          <div className="border-t border-[var(--mc-border)] pt-4">
            <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mb-3">Appearance</p>
            <div className="flex items-center gap-1">
              {THEMES.map(t => (
                <button key={t.id} onClick={() => changeTheme(t.id)} title={t.id}
                  style={{ background: "transparent", border: "none", padding: "8px 12px", cursor: "pointer" }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", background: t.color, display: "block",
                    border: theme === t.id ? `2px solid ${t.ring}` : "1.5px solid rgba(128,128,128,0.3)",
                    outline: theme === t.id ? `2px solid ${t.ring}` : "none",
                    outlineOffset: 2, transition: "all 0.2s",
                    boxShadow: theme === t.id ? `0 0 8px ${t.ring}55` : "none",
                  }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
