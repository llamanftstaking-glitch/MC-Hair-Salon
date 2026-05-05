"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-px w-10 bg-[#C9A84C]" />
        <span className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] font-light">Error</span>
        <div className="h-px w-10 bg-[#C9A84C]" />
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl text-white mb-4">Something Went Wrong</h1>
      <p className="text-[#888] text-sm max-w-xs mb-10 leading-relaxed">
        An unexpected error occurred. Please try again or contact us if the issue persists.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-8 py-3 bg-[#C9A84C] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#FFD700] transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-8 py-3 border border-white/20 text-white text-xs uppercase tracking-widest font-semibold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
        >
          Go Home
        </Link>
      </div>

      <p className="mt-12 text-[#444] text-[11px]">
        336 East 78th St, New York, NY &nbsp;·&nbsp; (212) 988-5252
      </p>
    </main>
  );
}
