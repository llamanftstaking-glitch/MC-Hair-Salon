"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  { src: "/hope/IMG_5888.JPEG", label: "Highlights & Blowout", sub: "Luminous dimension, every strand intentional." },
  { src: "/hope/IMG_6359.JPEG", label: "Balayage",             sub: "Sun-kissed depth crafted for your texture." },
  { src: "/hope/IMG_9318.JPG",  label: "Color & Style",        sub: "Tone, cut, and finish — fully transformed." },
];

export default function WorkShowcase() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive(prev => (prev + 1) % SLIDES.length);
        setFading(false);
      }, 600);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function goTo(i: number) {
    if (i === active) return;
    setFading(true);
    setTimeout(() => { setActive(i); setFading(false); }, 600);
  }

  const slide = SLIDES[active];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "75vh", minHeight: 480 }}>
      {/* Images — stacked, cross-fade via opacity */}
      {SLIDES.map((s, i) => (
        <div key={s.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === active ? (fading ? 0 : 1) : 0, zIndex: i === active ? 1 : 0 }}>
          <Image
            src={s.src}
            alt={s.label}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.1) 100%)" }} />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-8 sm:px-16 max-w-4xl">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">Our Work</p>
        <h2
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 transition-opacity duration-500"
          style={{ opacity: fading ? 0 : 1 }}>
          {slide.label}
        </h2>
        <p className="text-[var(--mc-muted)] text-base sm:text-lg mb-8 transition-opacity duration-500" style={{ opacity: fading ? 0 : 1 }}>
          {slide.sub}
        </p>
        <div className="flex items-center gap-6">
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold px-8 py-3.5 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer">
            Book This Look
          </Link>
          {/* Dot indicators */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${i === active ? "bg-[var(--mc-accent)] w-6" : "bg-white/40 hover:bg-white/70"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
