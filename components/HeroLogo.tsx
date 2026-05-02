"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const VIDEOS = [
  "/videos/col/v1.mp4",
  "/videos/col/v2.mp4",
  "/videos/col/v3.mp4",
  "/videos/col/v4.mp4",
  "/videos/col/v5.mp4",
  "/videos/col/v6.mp4",
  "/videos/col/v7.mp4",
];

function VideoColumn({ startIdx, swapEvery }: { startIdx: number; swapEvery: number }) {
  const ref0 = useRef<HTMLVideoElement>(null);
  const ref1 = useRef<HTMLVideoElement>(null);
  const slotRef = useRef(0);
  const nextVideoRef = useRef((startIdx + 1) % VIDEOS.length);
  const [slot, setSlot] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const v0 = ref0.current!;
    v0.src = VIDEOS[startIdx % VIDEOS.length];
    v0.load();
    if (!mq.matches) v0.play().catch(() => {});

    const v1 = ref1.current!;
    v1.src = VIDEOS[nextVideoRef.current];
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

      const afterNext = (nextVideoIdx + 1) % VIDEOS.length;
      nextVideoRef.current = afterNext;

      setTimeout(() => {
        const oldVid = curr === 0 ? ref0.current : ref1.current;
        if (!oldVid) return;
        oldVid.pause();
        oldVid.src = VIDEOS[afterNext];
        oldVid.load();
      }, 1000);
    }, swapEvery);

    return () => clearInterval(timer);
  }, [startIdx, swapEvery]);

  const vidStyle = (i: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: slot === i ? 1 : 0,
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

export default function HeroLogo() {
  return (
    <section className="mc-hero relative flex flex-col items-center justify-center overflow-hidden bg-black mt-[88px] min-h-[calc(100vh-88px)] sm:mt-[93px] sm:min-h-[calc(100vh-93px)] max-w-[100vw]">

      {/* ── 3-column video background ── */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 relative border-r border-white/[0.06]">
          <VideoColumn startIdx={0} swapEvery={10000} />
        </div>
        <div className="flex-1 relative">
          <VideoColumn startIdx={2} swapEvery={13000} />
        </div>
        <div className="flex-1 relative border-l border-white/[0.06]">
          <VideoColumn startIdx={4} swapEvery={11000} />
        </div>
      </div>

      {/* ── Gradient overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.30) 30%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none sm:hidden"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 18%, rgba(0,0,0,0.90) 32%, rgba(0,0,0,1) 45%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 38%, var(--mc-hero-glow) 0%, transparent 70%)" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center py-8 sm:py-12 px-4 text-center w-full max-w-full">

        <div className="relative w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72">
          <Image src="/mc-logo-bw.png"    alt="MC Hair Salon & Spa" fill className="logo-bw    object-contain" priority />
          <Image src="/mc-logo-black.png" alt="MC Hair Salon & Spa" fill className="logo-light object-contain" priority />
        </div>

        <div
          className="mt-6 sm:mt-10 h-px w-32"
          style={{ background: "linear-gradient(90deg, transparent, var(--mc-accent), transparent)" }}
        />

        <p className="uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[10px] sm:text-xs font-semibold mt-4 sm:mt-6"
          style={{ color: "var(--mc-accent)" }}>
          Upper East Side · New York City · Est. 2011
        </p>

        <h1 className="font-serif font-bold mt-4 sm:mt-6 leading-[1.25] px-4 w-full">
          <span className="gold-gradient block text-5xl sm:text-6xl md:text-8xl pb-4">Every Service.</span>
          <span className="gold-gradient block text-5xl sm:text-6xl md:text-8xl">One Studio.</span>
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-8 max-w-xl">
          {["Hair", "Color", "Balayage", "Blowouts", "Lash Extensions", "Facials", "Makeup"].map((s, i) => (
            <span key={s} className="flex items-center gap-2 whitespace-nowrap">
              {i > 0 && <span className="text-[var(--mc-border)] text-[10px]">·</span>}
              <span className="text-[var(--mc-muted)] text-[10px] sm:text-xs uppercase tracking-widest">{s}</span>
            </span>
          ))}
        </div>

        <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mt-4">
          10,000+ Clients · 5-Star Rated · Serving New York Since 2011
        </p>

        <div className="mt-6 sm:mt-10 flex items-center gap-3 px-5 py-3 border border-[var(--mc-accent)]/40 bg-[var(--mc-accent)]/5">
          <span className="text-base">🌸</span>
          <p className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--mc-accent)" }}>
            Mother&apos;s Day — Gift a luxury experience.&nbsp;
            <a href="/gift-card" className="underline underline-offset-2 hover:opacity-80 transition-opacity">Send a Gift Card →</a>
          </p>
        </div>

        <div className="flex flex-row gap-3 sm:gap-4 mt-5 sm:mt-6">
          <Link
            href="/book"
            className="gold-gradient-bg text-black font-bold px-6 sm:px-12 py-3 sm:py-4 uppercase tracking-widest text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer text-center"
          >
            Book Now
          </Link>
          <Link
            href="/services"
            className="font-semibold px-6 sm:px-12 py-3 sm:py-4 uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 cursor-pointer text-center"
            style={{ border: "1px solid var(--mc-accent)", color: "var(--mc-accent)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--mc-accent)";
              (e.currentTarget as HTMLElement).style.color = "var(--mc-bg)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--mc-accent)";
            }}
          >
            View Services
          </Link>
        </div>

        <div className="hidden sm:flex mt-8 flex-col items-center opacity-40">
          <div
            className="w-px h-14"
            style={{ background: "linear-gradient(to bottom, var(--mc-accent), transparent)" }}
          />
        </div>

      </div>
    </section>
  );
}
