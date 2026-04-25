"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, Scissors, Sparkles, Gift, Star, RefreshCw, AlertTriangle } from "lucide-react";

interface ClientData {
  id: string; name: string; email: string; tier: string;
  points: number; visits: number; visitStreak: number; blowoutsEarned: number;
}

const TIER_COLOR: Record<string, string> = {
  Bronze: "#CD7F32", Silver: "#C0C0C0", Gold: "#FFD700", Platinum: "#E8E8E8",
};

function PunchCard({ filled }: { filled: number }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
          i < filled ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]" : "border-[#333]"
        }`}>
          {i < filled
            ? <Check size={14} strokeWidth={3} className="text-black" />
            : <span className="text-[#444] text-xs">{i + 1}</span>
          }
        </div>
      ))}
      <div className="w-9 h-9 rounded-full border-2 border-[var(--mc-accent)]/40 flex items-center justify-center">
        <Scissors size={12} className="text-[var(--mc-accent)]" />
      </div>
    </div>
  );
}

export default function ScanStationPage() {
  const [query,     setQuery]     = useState("");
  const [searching, setSearching] = useState(false);
  const [client,    setClient]    = useState<ClientData | null>(null);
  const [notFound,  setNotFound]  = useState(false);
  const [recording, setRecording] = useState(false);
  const [result,    setResult]    = useState<{ earnedBlowout: boolean; ptsEarned: number; newPoints: number; newTier: string; visitStreak: number; blowoutsEarned: number } | null>(null);
  const [error,     setError]     = useState("");

  const searchClient = async () => {
    if (!query.trim()) return;
    setSearching(true); setNotFound(false); setClient(null); setResult(null); setError("");
    try {
      // Search by loading all rewards data and filtering client-side
      const res  = await fetch("/api/rewards");
      const all  = await res.json() as ClientData[];
      const found = all.find(
        c => c.email.toLowerCase() === query.toLowerCase() ||
             c.name.toLowerCase().includes(query.toLowerCase())
      );
      if (found) {
        // Load fresh data via scan API
        const r2   = await fetch(`/api/scan?id=${found.id}`);
        const data = await r2.json();
        setClient(data);
      } else {
        setNotFound(true);
      }
    } catch { setError("Search failed. Try again."); }
    finally  { setSearching(false); }
  };

  const recordVisit = async (serviceType: "hair" | "other") => {
    if (!client) return;
    setRecording(true); setError("");
    try {
      const res  = await fetch("/api/scan", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ customerId: client.id, serviceType }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data);
      setClient(prev => prev ? { ...prev, points: data.newPoints, tier: data.newTier, visits: prev.visits + 1, visitStreak: data.visitStreak, blowoutsEarned: data.blowoutsEarned } : null);
    } catch { setError("Failed. Try again."); }
    finally  { setRecording(false); }
  };

  const reset = () => { setClient(null); setResult(null); setQuery(""); setNotFound(false); setError(""); };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start pt-20 px-6 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-serif text-2xl font-bold gold-gradient">MC Hair Salon</p>
          <p className="text-[#444] text-xs uppercase tracking-widest mt-1">Staff Scan Station</p>
        </div>

        <AnimatePresence mode="wait">

          {/* ─ SUCCESS ─ */}
          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              {result.earnedBlowout ? (
                <>
                  <div className="w-24 h-24 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-6">
                    <Gift size={44} className="text-black" />
                  </div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2">Reward Unlocked</p>
                  <h2 className="font-serif text-4xl font-bold text-white mb-3">Free Blowout!</h2>
                  <p className="text-[var(--mc-muted)] text-sm mb-6">
                    {client?.name} completed 10 hair services. A complimentary blowout has been added.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-6">
                    <Check size={36} strokeWidth={3} className="text-green-400" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-white mb-2">Visit Recorded</h2>
                  <p className="text-[var(--mc-muted)] text-sm mb-4">+{result.ptsEarned} pts · {client?.name}</p>
                </>
              )}

              {client && (
                <div className="luxury-card p-5 mb-6">
                  <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-3">Updated Punch Card</p>
                  <PunchCard filled={result.visitStreak} />
                  <p className="text-[#555] text-xs text-center mt-3">
                    {result.visitStreak}/10 &nbsp;·&nbsp; {10 - result.visitStreak} more for a free blowout
                  </p>
                </div>
              )}

              <button onClick={reset} className="w-full border border-[#222] text-[#555] py-3 text-xs uppercase tracking-widest hover:border-[#444] transition-colors cursor-pointer flex items-center justify-center gap-2">
                <RefreshCw size={13} /> Next Client
              </button>
            </motion.div>
          )}

          {/* ─ CLIENT FOUND ─ */}
          {!result && client && (
            <motion.div key="client" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="luxury-card p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: TIER_COLOR[client.tier] }}>
                    <span className="font-serif text-xl font-bold" style={{ color: TIER_COLOR[client.tier] }}>
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{client.name}</p>
                    <p className="text-[#555] text-xs">{client.email}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: TIER_COLOR[client.tier] }}>
                      {client.tier} · {client.points.toLocaleString()} pts
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#1a1a1a] pt-4">
                  <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-3 text-center">
                    Punch Card &nbsp;·&nbsp; {client.visitStreak}/10
                  </p>
                  <PunchCard filled={client.visitStreak} />
                  <p className="text-[#444] text-xs text-center mt-3">
                    {client.visitStreak === 9 ? "⚡ Next hair service = FREE blowout!" : `${10 - client.visitStreak} more for a free blowout`}
                  </p>
                </div>
              </div>

              <p className="text-[#555] text-xs uppercase tracking-widest text-center mb-3">Record service</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button onClick={() => recordVisit("hair")} disabled={recording}
                  className="border border-[var(--mc-accent)]/40 bg-[var(--mc-accent)]/5 hover:bg-[var(--mc-accent)]/10 p-5 text-center transition-all cursor-pointer disabled:opacity-50">
                  <Scissors size={26} className="text-[var(--mc-accent)] mx-auto mb-2" />
                  <p className="text-white font-bold text-sm">Hair Service</p>
                  <p className="text-[#555] text-[10px] mt-0.5">Counts toward blowout</p>
                </button>
                <button onClick={() => recordVisit("other")} disabled={recording}
                  className="border border-[#1a1a1a] bg-[#080808] hover:border-[#333] p-5 text-center transition-all cursor-pointer disabled:opacity-50">
                  <Sparkles size={26} className="text-[#666] mx-auto mb-2" />
                  <p className="text-white font-bold text-sm">Other Service</p>
                  <p className="text-[#555] text-[10px] mt-0.5">Spa, makeup, lashes</p>
                </button>
              </div>
              <button onClick={reset} className="w-full text-[#444] text-xs py-2 hover:text-[#666] transition-colors cursor-pointer">
                ← Search different client
              </button>
            </motion.div>
          )}

          {/* ─ SEARCH ─ */}
          {!result && !client && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Client name or email..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchClient()}
                  className="flex-1 bg-[#080808] border border-[#1a1a1a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#333]"
                  autoFocus
                />
                <button onClick={searchClient} disabled={searching}
                  className="gold-gradient-bg text-black font-bold px-5 py-3 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2">
                  {searching ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Search size={16} />}
                </button>
              </div>

              {notFound && (
                <div className="flex items-center gap-2 border border-red-900/40 bg-red-950/20 p-3 text-red-400 text-sm mb-3">
                  <AlertTriangle size={14} /> No client found for &ldquo;{query}&rdquo;
                </div>
              )}

              {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

              <p className="text-[#333] text-xs text-center mt-6">
                Or scan a client&apos;s QR code to go directly to their profile.
              </p>

              <div className="mt-8 border border-[#111] bg-[#080808] p-5 text-center">
                <Star size={20} className="text-[var(--mc-accent)] mx-auto mb-2" />
                <p className="text-white text-sm font-semibold mb-1">Punch Card Rule</p>
                <p className="text-[#555] text-xs leading-relaxed">
                  Every <strong className="text-white">Hair Service</strong> adds one punch.<br />
                  After <strong className="text-white">10 hair services</strong>, the client earns a complimentary blowout — automatically added to their rewards.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
