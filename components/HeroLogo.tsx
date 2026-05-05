"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

// Each column gets its own exclusive video list — no shared videos between concurrent columns.
// Desktop (3 cols): [v1,v4,v7] | [v2,v5] | [v3,v6]
// Mobile  (2 cols): [v1,v3,v5,v7] | [v2,v4,v6]
const COL_VIDEOS: Record<string, string[]> = {
  "d0": ["/videos/col/v1.mp4", "/videos/col/v4.mp4", "/videos/col/v7.mp4"],
  "d1": ["/videos/col/v2.mp4", "/videos/col/v5.mp4"],
  "d2": ["/videos/col/v3.mp4", "/videos/col/v6.mp4"],
  "m0": ["/videos/col/v1.mp4", "/videos/col/v3.mp4", "/videos/col/v5.mp4", "/videos/col/v7.mp4"],
  "m1": ["/videos/col/v2.mp4", "/videos/col/v4.mp4", "/videos/col/v6.mp4"],
};

function VideoColumn({ colKey, swapEvery }: { colKey: string; swapEvery: number }) {
  const videos = COL_VIDEOS[colKey];
  const ref0 = useRef<HTMLVideoElement>(null);
  const ref1 = useRef<HTMLVideoElement>(null);
  const slotRef = useRef(0);
  const nextVideoRef = useRef(1 % videos.length);
  const [slot, setSlot] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const v0 = ref0.current!;
    v0.oncanplay = () => setReady(true);
    v0.src = videos[0];
    v0.load();
    if (!mq.matches) v0.play().catch(() => {});

    const v1 = ref1.current!;
    v1.src = videos[nextVideoRef.current];
    v1.load();

    if (mq.matches) return;

    const timer = setInterval(() => {
      const curr = slotRef.current;
      const next = 1 - curr;
      const nextVideoIdx = nextVideoRef.current;

      const nextVid = next === 0 ? ref0.current! : ref1.current!;
      nextVid.currentTime = 0;
      nextVid.play().catch(() => {});

      slotRef.current = next;
      setSlot(next);

      const afterNext = (nextVideoIdx + 1) % videos.length;
      nextVideoRef.current = afterNext;

      setTimeout(() => {
        const oldVid = curr === 0 ? ref0.current : ref1.current;
        if (!oldVid) return;
        oldVid.pause();
        oldVid.src = videos[afterNext];
        oldVid.load();
      }, 1000);
    }, swapEvery);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colKey, swapEvery]);

  const vidStyle = (i: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: ready ? (slot === i ? 1 : 0) : 0,
    transition: "opacity 0.8s ease",
    willChange: slot === i ? "opacity" : "auto",
  });

  return (
    <div className="relative w-full h-full">
      <video ref={ref0} muted playsInline loop style={vidStyle(0)} />
      <video ref={ref1} muted playsInline loop style={vidStyle(1)} />
    </div>
  );
}

const SERVICES = ["Hair", "Color", "Balayage", "Blowouts", "Lash Extensions", "Facials", "Makeup"];

export default function HeroLogo() {
  return (
    <section className="mc-hero relative flex flex-col items-center md:justify-center overflow-hidden bg-[var(--mc-bg)] mt-[88px] min-h-[calc(100vh-88px)] sm:mt-[93px] sm:min-h-[calc(100vh-93px)] max-w-[100vw]">

      {/* ══════════════ DESKTOP: 3-column full-height bg ══════════════ */}
      <div className="absolute inset-0 hidden md:flex" aria-hidden="true">
        <div className="flex-1 relative border-r border-white/[0.06]">
          <VideoColumn colKey="d0" swapEvery={10000} />
        </div>
        <div className="flex-1 relative">
          <VideoColumn colKey="d1" swapEvery={13000} />
        </div>
        <div className="flex-1 relative border-l border-white/[0.06]">
          <VideoColumn colKey="d2" swapEvery={11000} />
        </div>
      </div>

      {/* Desktop gradient overlays */}
      <div className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.80) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none hidden md:block"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 38%, var(--mc-hero-glow) 0%, transparent 70%)" }} />

      {/* Desktop content */}
      <div className="relative z-10 hidden md:flex flex-col items-center py-12 px-4 text-center w-full max-w-full">
        <div className="relative w-72 h-72">
          <Image src="/mc-logo-bw.png"    alt="MC Hair Salon & Spa" fill className="logo-bw    object-contain" priority />
          <Image src="/mc-logo-black.png" alt="" fill className="logo-light object-contain" priority />
        </div>
        <div className="mt-10 h-px w-32"
          style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }} />
        <p className="uppercase tracking-[0.5em] text-xs font-semibold mt-6" style={{ color: "var(--mc-accent)" }}>
          Upper East Side · New York City · Est. 2011
        </p>
        <h1 className="font-serif font-bold mt-6 leading-[1.25] px-4 w-full">
          <span className="gold-gradient block text-6xl md:text-8xl pb-4">Every Service.</span>
          <span className="gold-gradient block text-6xl md:text-8xl">One Studio.</span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-8 max-w-xl"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
          {SERVICES.map((s, i) => (
            <span key={s} className="flex items-center gap-2 whitespace-nowrap">
              {i > 0 && <span className="text-white/30 text-[10px]">·</span>}
              <span className="text-white/70 text-xs uppercase tracking-widest">{s}</span>
            </span>
          ))}
        </div>
        <p className="text-white/50 text-[10px] uppercase tracking-widest mt-4"
          style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
          10,000+ Clients · 5-Star Rated · Serving New York Since 2011
        </p>
        <div className="mt-10 flex items-center gap-3 px-5 py-3 border border-[var(--mc-accent)]/40 bg-[var(--mc-accent)]/5">
          <span className="text-base">🌸</span>
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--mc-accent)" }}>
            Mother&apos;s Day — Gift a luxury experience.&nbsp;
            <a href="/gift-card" className="underline underline-offset-2 hover:opacity-80 transition-opacity">Send a Gift Card →</a>
          </p>
        </div>
        <div className="flex flex-row gap-4 mt-6">
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer text-center">
            Book Now
          </Link>
          <Link href="/services"
            className="font-semibold px-12 py-4 uppercase tracking-widest text-sm transition-all duration-300 cursor-pointer text-center"
            style={{ border: "1px solid var(--mc-accent)", color: "var(--mc-accent)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--mc-accent)"; (e.currentTarget as HTMLElement).style.color = "var(--mc-bg)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--mc-accent)"; }}
          >
            View Services
          </Link>
        </div>
        <div className="flex mt-8 flex-col items-center opacity-40">
          <div className="w-px h-14" style={{ background: "linear-gradient(to bottom, var(--mc-accent), transparent)" }} />
        </div>
      </div>

      {/* ══════════════ MOBILE: 2-column video zone (top) ══════════════ */}
      <div className="md:hidden relative w-full flex shrink-0" style={{ height: "min(46vh, 280px)" }}>
        <div className="flex-1 relative" aria-hidden="true">
          <VideoColumn colKey="m0" swapEvery={10000} />
        </div>
        <div className="flex-1 relative border-l border-white/[0.06]" aria-hidden="true">
          <VideoColumn colKey="m1" swapEvery={12000} />
        </div>
        {/* Fade videos to black at bottom */}
        <div className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.88) 82%, rgba(0,0,0,1) 100%)" }} />
        {/* Logo centered over the 2 columns */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pb-6">
          <div className="relative w-36 h-36">
            <Image src="/mc-logo-bw.png"    alt="MC Hair Salon & Spa" fill className="logo-bw    object-contain" priority />
            <Image src="/mc-logo-black.png" alt="" fill className="logo-light object-contain" priority />
          </div>
          <div className="mt-5 h-px w-28"
            style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }} />
        </div>
      </div>

      {/* Mobile text content (pure black bg from section) */}
      <div className="md:hidden relative z-10 flex flex-col items-center px-4 pb-8 text-center w-full max-w-full">
        <p className="uppercase tracking-[0.3em] text-[10px] font-semibold mt-5" style={{ color: "var(--mc-accent)" }}>
          Upper East Side · New York City · Est. 2011
        </p>
        <h1 className="font-serif font-bold mt-4 leading-[1.25] px-2 w-full">
          <span className="gold-gradient block text-5xl pb-3">Every Service.</span>
          <span className="gold-gradient block text-5xl">One Studio.</span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-6 max-w-sm">
          {SERVICES.map((s, i) => (
            <span key={s} className="flex items-center gap-2 whitespace-nowrap">
              {i > 0 && <span className="text-[var(--mc-border)] text-[10px]">·</span>}
              <span className="text-[var(--mc-muted)] text-[10px] uppercase tracking-widest">{s}</span>
            </span>
          ))}
        </div>
        <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mt-3">
          10,000+ Clients · 5-Star Rated · Serving New York Since 2011
        </p>
        <div className="mt-5 flex items-center gap-3 px-4 py-3 border border-[var(--mc-accent)]/40 bg-[var(--mc-accent)]/5 w-full">
          <span className="text-base shrink-0">🌸</span>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-left" style={{ color: "var(--mc-accent)" }}>
            Mother&apos;s Day — Gift a luxury experience.&nbsp;
            <a href="/gift-card" className="underline underline-offset-2 hover:opacity-80 transition-opacity">Send a Gift Card →</a>
          </p>
        </div>
        <div className="flex flex-row gap-3 mt-5 w-full">
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold flex-1 py-3 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer text-center">
            Book Now
          </Link>
          <Link href="/services"
            className="font-semibold flex-1 py-3 uppercase tracking-widest text-xs transition-all duration-300 cursor-pointer text-center"
            style={{ border: "1px solid var(--mc-accent)", color: "var(--mc-accent)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--mc-accent)"; (e.currentTarget as HTMLElement).style.color = "var(--mc-bg)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--mc-accent)"; }}
          >
            View Services
          </Link>
        </div>
      </div>

    </section>
  );
}
