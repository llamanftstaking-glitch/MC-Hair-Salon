"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Scissors } from "lucide-react";

const STORAGE_KEY = "mc-promo-seen";

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only show if not already dismissed this session
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      // Slight delay so the page loads first
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (visible) setMounted(true);
  }, [visible]);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    setTimeout(() => setMounted(false), 400);
  }

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        className="fixed z-50 left-1/2 top-1/2 w-full max-w-md px-4 transition-all duration-400"
        style={{
          transform: visible
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.92)",
          opacity: visible ? 1 : 0,
        }}>
        <div className="relative luxury-card overflow-hidden">

          {/* Gold top stripe */}
          <div className="h-1 w-full gold-gradient-bg" />

          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Close"
            className="absolute top-4 right-4 text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer z-10">
            <X size={18} />
          </button>

          <div className="px-8 pt-8 pb-10 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[var(--mc-accent)]/40 text-[var(--mc-accent)] mb-5">
              <Scissors size={22} />
            </div>

            {/* Badge */}
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-[10px] font-semibold mb-3">
              Exclusive Welcome Offer
            </p>

            {/* Headline */}
            <h2 className="font-serif text-3xl font-bold text-white mb-2 leading-tight">
              Get <span className="gold-gradient">10% Off</span><br />Your First Visit
            </h2>

            <p className="text-[var(--mc-muted)] text-sm leading-relaxed mt-3 mb-7 max-w-xs mx-auto">
              Create a free account and receive an exclusive 10% discount
              on your next appointment at MC Hair Salon & Spa.
            </p>

            {/* CTA */}
            <Link
              href="/login?tab=register"
              onClick={dismiss}
              className="block gold-gradient-bg text-black font-bold px-10 py-4 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer mb-3">
              Create Account & Claim Offer
            </Link>

            <button
              onClick={dismiss}
              className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest hover:text-[var(--mc-text)] transition-colors cursor-pointer">
              No thanks
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
