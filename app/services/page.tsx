"use client";
import Link from "next/link";
import { Scissors, Wind, Palette, Sparkles, Check, Brush } from "lucide-react";
import { SERVICES } from "@/lib/data";


const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors size={24} />,
  wind: <Wind size={24} />,
  palette: <Palette size={24} />,
  sparkles: <Sparkles size={24} />,
  brush: <Brush size={24} />,
};

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 bg-black text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">What We Offer</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Services & Pricing</h1>
        <p className="text-[var(--mc-muted)] max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
          All prices listed are starting rates. Final pricing may vary based on hair length, density, and complexity.
        </p>
      </section>

      {/* Gold divider */}
      <div className="h-px gold-gradient-bg mx-auto w-24 mb-0" />

      {/* Services */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
          {SERVICES.map((category, ci) => (
            <div key={category.category}>
              {/* Ornamental divider (skip first) */}
              {ci > 0 && (
                <div className="flex items-center gap-4 mb-12 sm:mb-16 -mt-2">
                  <div className="flex-1 h-px bg-[var(--mc-border)]" />
                  <span className="text-[var(--mc-accent)] text-[10px] tracking-[0.4em] opacity-60">✦</span>
                  <div className="flex-1 h-px bg-[var(--mc-border)]" />
                </div>
              )}

              {/* Category header */}
              <div className="flex items-start gap-4 sm:gap-6 mb-8 sm:mb-10">
                <span className="font-serif text-4xl sm:text-5xl font-bold text-[var(--mc-border)] leading-none select-none pt-1 shrink-0">
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 border-b border-[var(--mc-border)] pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[var(--mc-accent)]">{iconMap[category.icon]}</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{category.category}</h2>
                  </div>
                  {"tagline" in category && category.tagline && (
                    <p className="text-[var(--mc-text-dim)] text-xs sm:text-sm mt-1 leading-relaxed max-w-2xl">
                      {String(category.tagline)}
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 sm:space-y-3">
                {category.items.map((item) => (
                  <div key={item.name}
                    className="flex items-center justify-between p-4 sm:p-5 bg-[#080808] border border-[#141414] border-l-2 border-l-transparent group gap-3 transition-all duration-200 hover:border-[var(--mc-accent)]/25 hover:bg-[#0c0c0c] hover:border-l-[var(--mc-accent)]">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-4 h-4 border border-[#2a2a2a] flex items-center justify-center shrink-0 mt-1 group-hover:border-[var(--mc-accent)] transition-colors">
                        <Check size={9} className="text-[#3a3a3a] group-hover:text-[var(--mc-accent)] transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm sm:text-base leading-snug">{item.name}</p>
                        <p className="text-[#444] text-xs mt-0.5 leading-relaxed group-hover:text-[#555] transition-colors">{item.description}</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4 sm:ml-8 text-right">
                      <span className="inline-block gold-gradient font-serif text-lg sm:text-xl font-bold tabular-nums">
                        ${item.price}+
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section className="py-12 sm:py-16 px-6 bg-[var(--mc-surface-dark)] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#555] text-sm mb-8 sm:mb-10 leading-relaxed">
            * Prices are starting rates and may vary based on hair length, density, and service complexity.
            Consultations are always complimentary. L&apos;Oréal Majerel/Inoa color used for all color services.
          </p>
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold px-10 sm:px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block">
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
