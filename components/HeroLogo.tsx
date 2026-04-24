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

  /* Repeat the light sweep every 6 seconds after the first pass */
  useEffect(() => {
    if (!ready) return;
    let mounted = true;
    const run = async () => {
      await new Promise(r => setTimeout(r, 2000)); // wait for spin to finish
      while (mounted) {
        await sweepControls.start({ x: "200%", transition: { duration: 1.1, ease: "easeInOut" } });
        await sweepControls.set({ x: "-100%" });
        await new Promise(r => setTimeout(r, 6000));
      }
    };
    run();
    return () => { mounted = false; };
  }, [ready, sweepControls]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--mc-bg)]">

      {/* Wide ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 3, ease: "easeOut" }}
        style={{ background: "radial-gradient(ellipse 90% 65% at 50% 38%, var(--mc-hero-glow) 0%, transparent 68%)" }}
      />

      {/* Tight inner halo — pulses */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "12%", left: "50%", transform: "translateX(-50%)",
          width: 480, height: 480,
          background: "radial-gradient(circle, var(--mc-hero-pulse) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: [0.35, 0.75, 0.35] } : { opacity: 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
      />

      {/* LOGO block */}
      <div className="relative z-10 flex flex-col items-center pt-20">

        {/* Float wrapper — starts bobbing after entrance completes */}
        <motion.div
          animate={ready ? { y: [0, -12, 0] } : { y: 0 }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.4, repeatType: "mirror" }}
        >
          {/* Spin + scale entrance */}
          <motion.div
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
            initial={{ opacity: 0, scale: 0.15, rotate: 720 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ type: "spring", damping: 18, stiffness: 70, mass: 1.1, delay: 0.1 }}
          >
            {/* ── Decorative rotating rings ───────────────────────────────────── */}
            {/* Outermost — slow clockwise */}
            <motion.div
              style={{
                position: "absolute", inset: -28, borderRadius: "50%",
                border: "1px dashed rgba(201,168,76,0.28)",
              }}
              animate={ready ? { rotate: 360 } : {}}
              transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 2.2 }}
            />
            {/* Middle — counter-clockwise */}
            <motion.div
              style={{
                position: "absolute", inset: -16, borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.18)",
              }}
              animate={ready ? { rotate: -360 } : {}}
              transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2.2 }}
            />
            {/* Inner tight ring — clockwise, faster */}
            <motion.div
              style={{
                position: "absolute", inset: -7, borderRadius: "50%",
                border: "0.5px solid rgba(201,168,76,0.12)",
              }}
              animate={ready ? { rotate: 360 } : {}}
              transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 2.2 }}
            />

            {/* Orbiting accent dot */}
            <motion.div
              style={{ position: "absolute", inset: -16, borderRadius: "50%" }}
              animate={ready ? { rotate: 360 } : {}}
              transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2.2 }}
            >
              <span style={{
                position: "absolute", width: 6, height: 6, borderRadius: "50%",
                background: "var(--mc-accent)", top: -3, left: "calc(50% - 3px)",
                boxShadow: "0 0 10px 2px var(--mc-accent)",
              }} />
            </motion.div>
            {/* Counter orbiting dot */}
            <motion.div
              style={{ position: "absolute", inset: -16, borderRadius: "50%" }}
              animate={ready ? { rotate: -360 } : {}}
              transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2.2 }}
            >
              <span style={{
                position: "absolute", width: 4, height: 4, borderRadius: "50%",
                background: "var(--mc-accent)", bottom: -2, left: "calc(50% - 2px)",
                boxShadow: "0 0 8px 2px var(--mc-accent)", opacity: 0.7,
              }} />
            </motion.div>

            {/* ── Glow ring behind logo ──────────────────────────────────────── */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{
                background: "radial-gradient(circle, var(--mc-hero-glow) 0%, transparent 70%)",
                filter: "blur(18px)",
              }}
            />

            {/* ── Logo images ───────────────────────────────────────────────── */}
            <div className="relative w-full h-full overflow-hidden rounded-full"
              style={{ filter: "brightness(1.15) drop-shadow(0 0 24px rgba(255,255,255,0.25))" }}>
              <Image src="/mc-logo-bw.png"    alt="MC Hair Salon & Spa" fill className="logo-bw    object-contain" priority />
              <Image src="/mc-logo-black.png" alt="MC Hair Salon & Spa" fill className="logo-light object-contain" priority />

              {/* Repeating light sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.22) 50%, transparent 75%)" }}
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
          animate={ready ? { width: 140, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 2.0, ease: "easeOut" }}
          style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }}
        />

        {/* Location tag */}
        <motion.p
          className="uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-semibold mt-6"
          style={{ color: "var(--mc-accent)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 2.2, ease: "easeOut" }}
        >
          Upper East Side · New York City · Est. 2011
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-center mt-6 leading-tight px-4"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 2.5, ease: "easeOut" }}
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
          transition={{ duration: 0.9, delay: 2.8, ease: "easeOut" }}
        >
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, var(--mc-accent))` }} />
          <p className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.35em]" style={{ color: "var(--mc-muted)" }}>
            Premium Hair & Spa Services
          </p>
          <div className="h-px w-10" style={{ background: `linear-gradient(90deg, var(--mc-accent), transparent)` }} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 3.1, ease: "easeOut" }}
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
          animate={ready ? { opacity: 0.45 } : {}}
          transition={{ duration: 1, delay: 3.6 }}
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
