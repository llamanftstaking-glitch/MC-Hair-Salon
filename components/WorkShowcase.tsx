"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    src: "/instagram/mchairsalonspa_1537975181_1876994322903414349_509340228.jpg",
    label: "Half-Up Style",
    sub:   "Effortless elegance — swept back and polished to perfection.",
  },
  {
    src: "/instagram/mchairsalonspa_1568744468_2135105812317486094_509340228.jpg",
    label: "Sleek & Straight",
    sub:   "Glossy, mirror-smooth — precision cut with dimensional color.",
  },
  {
    src: "/instagram/mchairsalonspa_1551895791_1993768864262785123_509340228.jpg",
    label: "Platinum Waves",
    sub:   "Luminous blonde, long and lavish — effortlessly beachy.",
  },
  {
    src: "/instagram/mchairsalonspa_1526678565_1782231439342285913_509340228.jpg",
    label: "Golden Balayage",
    sub:   "Sun-kissed warmth, hand-painted through every strand.",
  },
  {
    src: "/instagram/mchairsalonspa_1597866646_2379400348672402563_509340228.jpg",
    label: "Curly Cut",
    sub:   "Defined, bouncy curls shaped to your natural pattern.",
  },
];

export default function WorkShowcase() {
  const [active, setActive] = useState(0);

  // Single interval — no nested setTimeout, no timer drift
  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="mc-dark-section relative w-full bg-black overflow-hidden" style={{ height: "80vh", minHeight: 560 }}>

      {/* Slides — GPU-composited crossfade via will-change + CSS transition */}
      {SLIDES.map((s, i) => (
        <div key={s.src}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: "opacity 0.9s ease",
            willChange: "opacity",
            transform: "translateZ(0)",
          }}>
          <Image
            src={s.src}
            alt={s.label}
            fill
            priority={i < 2}
            sizes="100vw"
            className="object-contain"
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0) 100%)" }} />
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.55) 100%)" }} />

      {/* Content — key on active so text re-animates on each slide */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-16">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">Our Work</p>
          <div key={active} style={{ animation: "fadeUp 0.55s ease-out both" }}>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">
              {slide.label}
            </h2>
            <p className="text-[var(--mc-muted)] text-base sm:text-lg mb-8">
              {slide.sub}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/book"
              className="gold-gradient-bg text-black font-bold px-8 py-3.5 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer">
              Book This Look
            </Link>
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                    i === active ? "w-8 bg-[var(--mc-accent)]" : "w-3 bg-white/40 hover:bg-white/70"
                  }`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
