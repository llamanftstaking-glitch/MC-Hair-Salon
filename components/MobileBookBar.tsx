import Link from "next/link";

export default function MobileBookBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-[var(--mc-border)] bg-black/95 backdrop-blur-sm flex">
      <a
        href="tel:+12129885252"
        className="flex-1 flex items-center justify-center gap-2 py-4 text-[var(--mc-muted)] text-[10px] uppercase tracking-widest font-semibold border-r border-[var(--mc-border)] active:bg-[var(--mc-surface)]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
        Call
      </a>
      <Link
        href="/book"
        className="flex-[2] flex items-center justify-center gap-2 py-4 gold-gradient-bg text-black text-[10px] uppercase tracking-widest font-bold active:opacity-90"
      >
        Book Appointment
      </Link>
    </div>
  );
}
