import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--mc-bg)] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-px w-10 bg-[#C9A84C]" />
        <span className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] font-light">404</span>
        <div className="h-px w-10 bg-[#C9A84C]" />
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Page Not Found</h1>
      <p className="text-[#888] text-sm max-w-xs mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-8 py-3 bg-[#C9A84C] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#FFD700] transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/book"
          className="px-8 py-3 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
        >
          Book Now
        </Link>
      </div>

      <p className="mt-12 text-[#444] text-[11px]">
        336 East 78th St, New York, NY &nbsp;·&nbsp; (212) 988-5252
      </p>
    </main>
  );
}
