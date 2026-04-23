"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const isLite = theme === "lite";

  useEffect(() => {
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

  const glowColor = isLite
    ? "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)"
    : "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(180,130,20,0.2) 0%, transparent 70%)";

  const lineColor = isLite
    ? "linear-gradient(90deg, transparent, #7c3aed, transparent)"
    : "linear-gradient(90deg, transparent, #C9A84C, transparent)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed inset-0 z-[9999] flex items-center justify-center ${isLite ? "bg-[#faf8ff]" : "bg-black"}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0, 0.4, 0.2] }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ background: glowColor }}
          />

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

            <motion.div
              className="h-px"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 80, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              style={{ background: lineColor }}
            />

            <motion.p
              className={`uppercase tracking-[0.5em] text-xs ${isLite ? "text-[#7c3aed]" : "text-[#C9A84C]"}`}
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
