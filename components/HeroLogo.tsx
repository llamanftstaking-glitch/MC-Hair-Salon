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
        <h1 className="font-serif font-bold mt-6 leading-[1.05] px-4">
          <span className="gold-gradient block text-5xl sm:text-6xl md:text-8xl">Every Service.</span>
          <span className="gold-gradient block text-5xl sm:text-6xl md:text-8xl">One Studio.</span>
        </h1>

        {/* Service list */}
        <p className="text-[var(--mc-muted)] text-xs sm:text-sm mt-6 leading-relaxed tracking-widest uppercase max-w-lg">
          Hair · Color · Balayage · Blowouts · Lash Extensions · Facials · Makeup
        </p>

        {/* Social proof */}
        <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mt-3">
          10,000+ Clients · 5-Star Rated · Serving New York Since 2011
        </p>

        {/* Price anchors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {[
            { label: "Cuts", price: "from $20" },
            { label: "Blowouts", price: "from $33" },
            { label: "Color", price: "from $85" },
          ].map((p, i) => (
            <span key={i} className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[var(--mc-border)] text-[var(--mc-text-dim)]">
              {p.label} <span style={{ color: "var(--mc-accent)" }}>{p.price}</span>
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
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
