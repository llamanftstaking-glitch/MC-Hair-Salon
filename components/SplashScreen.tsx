"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("splashed")) {
      setVisible(false);
      return;
    }
    const show = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("splashed", "1");
      }, 800);
    }, 2200);
    return () => clearTimeout(show);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--mc-bg)]"
      style={{
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.8s ease-in-out",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 50%, var(--mc-hero-glow) 0%, transparent 70%)",
          animation: "splashGlow 2s ease-out forwards",
        }}
      />
      <div className="flex flex-col items-center gap-6">
        <div
          className="relative w-32 h-32"
          style={{ animation: "splashLogo 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
        >
          <Image src="/mc-logo-black.png" alt="MC Hair Salon & Spa" fill className="object-contain" priority />
        </div>
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)",
            animation: "splashLine 0.8s ease-out 0.5s both",
          }}
        />
        <p
          className="text-[var(--mc-accent)] uppercase tracking-[0.5em] text-xs"
          style={{ animation: "splashText 0.6s ease-out 0.8s both" }}
        >
          Hair Salon & Spa
        </p>
      </div>
    </div>
  );
}
