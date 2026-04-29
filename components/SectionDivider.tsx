export default function SectionDivider({ bg = "bg-black" }: { bg?: string }) {
  return (
    <div className={`flex items-center gap-4 px-8 sm:px-16 py-0 ${bg}`}>
      <div className="flex-1 h-px bg-[var(--mc-border)]" />
      <span className="text-[var(--mc-accent)] text-[10px] tracking-[0.5em] opacity-40 select-none">✦</span>
      <div className="flex-1 h-px bg-[var(--mc-border)]" />
    </div>
  );
}
