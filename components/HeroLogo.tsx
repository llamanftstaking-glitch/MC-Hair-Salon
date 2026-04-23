"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

export default function HeroLogo() {
  const [ready, setReady] = useState(false);
  const { theme } = useTheme();
  const isLite = theme === "lite";

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  const ambientGlow = isLite
    ? "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(124,58,237,0.10) 0%, transparent 70%)"
    : "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(180,130,20,0.14) 0%, transparent 70%)";

  const pulseGlow = isLite
    ? "radial-gradient(ellipse 40% 35% at 50% 38%, rgba(167,139,250,0.25) 0%, transparent 60%)"
    : "radial-gradient(ellipse 40% 35% at 50% 38%, rgba(255,215,0,0.3) 0%, transparent 60%)";

  const logoGlow = isLite
    ? "radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)"
    : "radial-gradient(circle, rgba(201,168,76,0.25) 0%, transparent 70%)";

  const lineColor = isLite
    ? "linear-gradient(90deg, transparent, #7c3aed, transparent)"
    : "linear-gradient(90deg, transparent, #C9A84C, transparent)";

  const lineColorLeft = isLite
    ? "linear-gradient(90deg, transparent, #7c3aed)"
    : "linear-gradient(90deg, transparent, #C9A84C)";

  const lineColorRight = isLite
    ? "linear-gradient(90deg, #7c3aed, transparent)"
    : "linear-gradient(90deg, #C9A84C, transparent)";

  const heroBg = isLite ? "#faf8ff" : "#000000";

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: heroBg }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{ background: ambientGlow }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.08, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ background: pulseGlow }}
      />

      <div className="relative z-10 flex flex-col items-center pt-20">
        <motion.div
          className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: logoGlow, filter: "blur(20px)" }}
          />

          <div className="relative w-full h-full overflow-hidden rounded-full">
            <Image
              src="/mc-logo-gold.png"
              alt="MC Hair Salon & Spa"
              fill
              className="object-contain"
              priority
            />
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)" }}
              initial={{ x: "-100%" }}
              animate={ready ? { x: "200%" } : { x: "-100%" }}
              transition={{ duration: 1.2, delay: 1.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-10 h-px"
          initial={{ width: 0, opacity: 0 }}
          animate={ready ? { width: 120, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
          style={{ background: lineColor }}
        />

        <motion.p
          className={`uppercase tracking-[0.5em] text-xs font-semibold mt-6 ${isLite ? "text-[#7c3aed]" : "text-[#C9A84C]"}`}
          initial={{ opacity: 0, y: 8 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.6, ease: "easeOut" }}
        >
          Upper East Side · New York City · Est. 2011
        </motion.p>

        <motion.h1
          className="font-serif text-5xl md:text-7xl font-bold text-center mt-6 leading-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.9, ease: "easeOut" }}
        >
          <span className="shimmer-text">Where Beauty</span>
          <br />
          <span style={{ color: isLite ? "#1e1b4b" : "#ffffff" }}>Meets Luxury</span>
        </motion.h1>

        <motion.div
          className="flex items-center gap-4 mt-5"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 2.2, ease: "easeOut" }}
        >
          <div className="h-px w-10" style={{ background: lineColorLeft }} />
          <p className={`text-xs uppercase tracking-[0.35em] ${isLite ? "text-[#6d5b98]" : "text-[#a89070]"}`}>
            Premium Hair & Spa Services
          </p>
          <div className="h-px w-10" style={{ background: lineColorRight }} />
        </motion.div>

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
            className={`font-semibold px-12 py-4 uppercase tracking-widest text-sm transition-all duration-300 cursor-pointer border ${
              isLite
                ? "border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white"
                : "border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black"
            }`}
          >
            View Services
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 0.5 } : {}}
          transition={{ duration: 1, delay: 3 }}
        >
          <motion.div
            className="w-px h-14 origin-top"
            style={{ background: `linear-gradient(to bottom, ${isLite ? "#7c3aed" : "#C9A84C"}, transparent)` }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
