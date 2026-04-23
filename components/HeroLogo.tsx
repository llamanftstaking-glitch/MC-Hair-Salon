"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroLogo() {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--mc-bg)]">

      {/* Ambient glow — updates per theme via CSS var */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, var(--mc-hero-glow) 0%, transparent 70%)" }}
      />

      {/* Breathing pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.08, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ background: "radial-gradient(ellipse 40% 35% at 50% 38%, var(--mc-hero-pulse) 0%, transparent 60%)" }}
      />

      {/* LOGO */}
      <div className="relative z-10 flex flex-col items-center pt-20">
        <motion.div
          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Glow ring behind logo */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(circle, var(--mc-hero-glow) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Two logos — white for dark themes, black for lavender */}
          <div className="relative w-full h-full overflow-hidden rounded-full">
            <Image src="/mc-logo-bw.png"    alt="MC Hair Salon & Spa" fill className="logo-bw    object-contain" priority />
            <Image src="/mc-logo-black.png" alt="MC Hair Salon & Spa" fill className="logo-light object-contain" priority />

            {/* Light sweep animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)" }}
              initial={{ x: "-100%" }}
              animate={ready ? { x: "200%" } : { x: "-100%" }}
              transition={{ duration: 1.2, delay: 1.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Divider line */}
        <motion.div
          className="mt-10 h-px"
          initial={{ width: 0, opacity: 0 }}
          animate={ready ? { width: 120, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
          style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }}
        />

        {/* Location tag */}
        <motion.p
          className="uppercase tracking-[0.5em] text-xs font-semibold mt-6"
          style={{ color: "var(--mc-accent)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.6, ease: "easeOut" }}
        >
          Upper East Side · New York City · Est. 2011
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="font-serif text-5xl md:text-7xl font-bold text-center mt-6 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.9, ease: "easeOut" }}
        >
          <span className="shimmer-text">Where Beauty</span>
          <br />
          <span style={{ color: "var(--mc-text)" }}>Meets Luxury</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          className="flex items-center gap-4 mt-5"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 2.2, ease: "easeOut" }}
        >
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, var(--mc-accent))` }} />
          <p className="text-xs uppercase tracking-[0.35em]" style={{ color: "var(--mc-muted)" }}>
            Premium Hair & Spa Services
          </p>
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, var(--mc-accent), transparent)` }} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 2.5, ease: "easeOut" }}
        >
          <Link
            href="/book"
            className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            Book Appointment
          </Link>
          <Link
            href="/services"
            className="font-semibold px-12 py-4 uppercase tracking-widest text-sm transition-all duration-300 cursor-pointer"
            style={{
              border: "1px solid var(--mc-accent)",
              color: "var(--mc-accent)",
            }}
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 0.5 } : {}}
          transition={{ duration: 1, delay: 3 }}
        >
          <motion.div
            className="w-px h-14 origin-top"
            style={{ background: `linear-gradient(to bottom, var(--mc-accent), transparent)` }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
