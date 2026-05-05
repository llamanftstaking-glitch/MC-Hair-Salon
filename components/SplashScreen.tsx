"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("splashed")) {
      setVisible(false);
      return;
    }
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("splashed", "1");
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--mc-bg)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0, 0.4, 0.2] }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              background: "radial-gradient(ellipse 50% 40% at 50% 50%, var(--mc-hero-glow) 0%, transparent 70%)",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative w-32 h-32">
              <Image
                src="/mc-logo-black.png"
                alt="MC Hair Salon & Spa"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Animated gold line */}
            <motion.div
              className="h-px"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }}
            />

            <motion.p
              className="text-[var(--mc-accent)] uppercase tracking-[0.5em] text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Hair Salon & Spa
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
