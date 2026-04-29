"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroLogo() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--mc-bg)]">

      {/* Subtle static glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 38%, var(--mc-hero-glow) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-20 px-4 text-center">

        {/* Logo */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72">
          <Image src="/mc-logo-bw.png"    alt="MC Hair Salon & Spa" fill className="logo-bw    object-contain" priority />
          <Image src="/mc-logo-black.png" alt="MC Hair Salon & Spa" fill className="logo-light object-contain" priority />
        </div>

        {/* Divider */}
        <div
          className="mt-10 h-px w-32"
          style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }}
        />

        {/* Location */}
        <p className="uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-semibold mt-6"
          style={{ color: "var(--mc-accent)" }}>
          Upper East Side · New York City · Est. 2011
        </p>

        {/* Headline — both lines share the same gradient, no half-shimmer bug */}
        <h1 className="font-serif font-bold mt-6 leading-[1.25] px-4 overflow-visible">
          <span className="gold-gradient block text-5xl sm:text-6xl md:text-8xl pb-4">Every Service.</span>
          <span className="gold-gradient block text-5xl sm:text-6xl md:text-8xl">One Studio.</span>
        </h1>

        {/* Service list */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-8 max-w-xl">
          {["Hair", "Color", "Balayage", "Blowouts", "Lash Extensions", "Facials", "Makeup"].map((s, i) => (
            <span key={s} className="flex items-center gap-2 whitespace-nowrap">
              {i > 0 && <span className="text-[var(--mc-border)] text-[10px]">·</span>}
              <span className="text-[var(--mc-muted)] text-[10px] sm:text-xs uppercase tracking-widest">{s}</span>
            </span>
          ))}
        </div>

        {/* Social proof */}
        <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mt-4">
          10,000+ Clients · 5-Star Rated · Serving New York Since 2011
        </p>

        {/* Mother's Day banner */}
        <div className="mt-10 flex items-center gap-3 px-5 py-3 border border-[var(--mc-accent)]/40 bg-[var(--mc-accent)]/5">
          <span className="text-base">🌸</span>
          <p className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--mc-accent)" }}>
            Mother&apos;s Day — Gift a luxury experience.&nbsp;
            <a href="/gift-card" className="underline underline-offset-2 hover:opacity-80 transition-opacity">Send a Gift Card →</a>
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            href="/book"
            className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer text-center"
          >
            Book Appointment
          </Link>
          <Link
            href="/services"
            className="font-semibold px-12 py-4 uppercase tracking-widest text-sm transition-all duration-300 cursor-pointer text-center"
            style={{ border: "1px solid var(--mc-accent)", color: "var(--mc-accent)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--mc-accent)";
              (e.currentTarget as HTMLElement).style.color = "var(--mc-bg)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--mc-accent)";
            }}
          >
            View Services
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center opacity-40">
          <div
            className="w-px h-14"
            style={{ background: "linear-gradient(to bottom, var(--mc-accent), transparent)" }}
          />
        </div>

      </div>
    </section>
  );
}
