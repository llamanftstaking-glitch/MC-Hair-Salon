export default function MarqueeStrip() {
  const items = [
    "Hair", "Color", "Balayage", "Blowouts", "Spa",
    "Lash Extensions", "Makeup", "Bridal", "Upper East Side", "Est. 2011",
  ];

  const repeated = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-[var(--mc-border)] py-3 bg-[var(--mc-surface-dark)]"
      aria-hidden="true"
    >
      <div className="flex gap-0 marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-0 shrink-0">
            <span className="text-[var(--mc-accent)] text-[10px] uppercase tracking-[0.35em] font-semibold whitespace-nowrap px-5">
              {item}
            </span>
            <span className="text-[var(--mc-border)] text-xs">·</span>
          </span>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
