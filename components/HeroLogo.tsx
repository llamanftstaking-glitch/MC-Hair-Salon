"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroLogo() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">

      {/* Subtle ambient glow — no shape, just warmth */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(180,130,20,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Very subtle breathing glow pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.08, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          background: "radial-gradient(ellipse 40% 35% at 50% 38%, rgba(255,215,0,0.3) 0%, transparent 60%)",
        }}
      />

      {/* LOGO */}
      <div className="relative z-10 flex flex-col items-center pt-20">
        <motion.div
          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Glow behind logo */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          {/* Logo image with light sweep */}
          <div className="relative w-full h-full overflow-hidden rounded-full">
            <Image
              src="/mc-logo-gold.png"
              alt="MC Hair Salon & Spa"
              fill
              className="object-contain"
              priority
            />

            {/* Single elegant light sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
              }}
              initial={{ x: "-100%" }}
              animate={ready ? { x: "200%" } : { x: "-100%" }}
              transition={{ duration: 1.2, delay: 1.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Gold divider line */}
        <motion.div
          className="mt-10 h-px"
          initial={{ width: 0, opacity: 0 }}
          animate={ready ? { width: 120, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
          style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
        />

        {/* Location tag */}
        <motion.p
          className="text-[#C9A84C] uppercase tracking-[0.5em] text-xs font-semibold mt-6"
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
          <span className="text-white">Meets Luxury</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          className="flex items-center gap-4 mt-5"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 2.2, ease: "easeOut" }}
        >
          <div className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
          <p className="text-[#a89070] text-xs uppercase tracking-[0.35em]">Premium Hair & Spa Services</p>
          <div className="h-px w-10" style={{ background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
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
            className="border border-[#C9A84C] text-[#C9A84C] font-semibold px-12 py-4 uppercase tracking-widest text-sm hover:bg-[#C9A84C] hover:text-black transition-all duration-300 cursor-pointer"
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
            style={{ background: "linear-gradient(to bottom, #C9A84C, transparent)" }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
