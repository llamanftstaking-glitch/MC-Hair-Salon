"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";

export default function HeroLogo() {
  const [ready, setReady] = useState(false);
  const sweepControls = useAnimation();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* Light sweep repeats every 8s */
  useEffect(() => {
    if (!ready) return;
    let alive = true;
    const loop = async () => {
      await new Promise(r => setTimeout(r, 1800));
      while (alive) {
        await sweepControls.start({ x: "200%", transition: { duration: 1.0, ease: "easeInOut" } });
        sweepControls.set({ x: "-100%" });
        await new Promise(r => setTimeout(r, 8000));
      }
    };
    loop();
    return () => { alive = false; };
  }, [ready, sweepControls]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--mc-bg)]">

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 3.5, ease: "easeOut" }}
        style={{ background: "radial-gradient(ellipse 75% 55% at 50% 38%, var(--mc-hero-glow) 0%, transparent 70%)" }}
      />

      {/* Tight glow that breathes slowly */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "10%", left: "50%", transform: "translateX(-50%)",
          width: 520, height: 520,
          background: "radial-gradient(circle, var(--mc-hero-pulse) 0%, transparent 68%)",
          filter: "blur(55px)",
        }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: [0.3, 0.65, 0.3] } : { opacity: 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* ── LOGO ── */}
      <div className="relative z-10 flex flex-col items-center pt-20">

        {/* Slow breathing wrapper */}
        <motion.div
          animate={ready ? { scale: [1, 1.013, 1] } : {}}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        >
          {/* Entrance — clean, no spin */}
          <motion.div
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
            initial={{ opacity: 0, scale: 0.82, y: 18 }}
            animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >

            {/* ── Single SVG ring — draws clockwise from 12 o'clock ── */}
            <motion.div
              style={{ position: "absolute", inset: -22, borderRadius: "50%", overflow: "visible" }}
              animate={ready ? { rotate: 360 } : {}}
              transition={{ duration: 32, repeat: Infinity, ease: "linear", delay: 3.8 }}
            >
              <svg
                width="100%" height="100%"
                viewBox="0 0 100 100"
                style={{ position: "absolute", inset: 0, overflow: "visible" }}
              >
                {/* Static ring */}
                <motion.circle
                  cx="50" cy="50" r="48.5"
                  fill="none"
                  stroke="rgba(201,168,76,0.38)"
                  strokeWidth="0.55"
                  transform="rotate(-90, 50, 50)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={ready ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 2.6, delay: 1.6, ease: [0.4, 0, 0.2, 1] }}
                />
                {/* Small glowing dot at top of ring */}
                <motion.circle
                  cx="50" cy="1.5"
                  r="1.6"
                  fill="var(--mc-accent)"
                  initial={{ opacity: 0 }}
                  animate={ready ? { opacity: [0, 1, 0.7] } : {}}
                  transition={{ duration: 0.6, delay: 4.2 }}
                  style={{ filter: "drop-shadow(0 0 4px var(--mc-accent))" }}
                />
              </svg>
            </motion.div>

            {/* Subtle glow behind logo */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              animate={{ opacity: [0.45, 0.85, 0.45] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{
                background: "radial-gradient(circle, var(--mc-hero-glow) 0%, transparent 72%)",
                filter: "blur(16px)",
              }}
            />

            {/* Logo images */}
            <div
              className="relative w-full h-full overflow-hidden rounded-full"
              style={{ filter: "brightness(1.12) drop-shadow(0 0 28px rgba(255,255,255,0.2))" }}
            >
              <Image src="/mc-logo-bw.png"    alt="MC Hair Salon & Spa" fill className="logo-bw    object-contain" priority />
              <Image src="/mc-logo-black.png" alt="MC Hair Salon & Spa" fill className="logo-light object-contain" priority />

              {/* Repeating light sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(108deg, transparent 25%, rgba(255,255,255,0.18) 50%, transparent 75%)" }}
                initial={{ x: "-100%" }}
                animate={sweepControls}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="mt-10 h-px"
          initial={{ width: 0, opacity: 0 }}
          animate={ready ? { width: 130, opacity: 1 } : {}}
          transition={{ duration: 1.1, delay: 1.8, ease: "easeOut" }}
          style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }}
        />

        {/* Location */}
        <motion.p
          className="uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-semibold mt-6"
          style={{ color: "var(--mc-accent)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 2.1, ease: "easeOut" }}
        >
          Upper East Side · New York City · Est. 2011
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-center mt-6 leading-tight px-4"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 2.4, ease: "easeOut" }}
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
          transition={{ duration: 0.9, delay: 2.7, ease: "easeOut" }}
        >
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, var(--mc-accent))` }} />
          <p className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.35em]" style={{ color: "var(--mc-muted)" }}>
            Premium Hair & Spa Services
          </p>
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, var(--mc-accent), transparent)` }} />
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 3.0, ease: "easeOut" }}
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 0.4 } : {}}
          transition={{ duration: 1, delay: 3.5 }}
        >
          <motion.div
            className="w-px h-14 origin-top"
            style={{ background: `linear-gradient(to bottom, var(--mc-accent), transparent)` }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
