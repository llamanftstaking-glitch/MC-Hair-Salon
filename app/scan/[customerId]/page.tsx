"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Scissors, Sparkles, Star, Gift, RefreshCw, AlertTriangle } from "lucide-react";

interface ClientData {
  id:             string;
  name:           string;
  email:          string;
  tier:           string;
  points:         number;
  visits:         number;
  visitStreak:    number;
  blowoutsEarned: number;
}

const TIER_COLOR: Record<string, string> = {
  Bronze:   "#CD7F32",
  Silver:   "#C0C0C0",
  Gold:     "#FFD700",
  Platinum: "#E8E8E8",
};

function PunchCard({ filled, total = 10 }: { filled: number; total?: number }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={i < filled ? { scale: [1, 1.15, 1] } : {}}
          transition={{ delay: i * 0.05 }}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
            i < filled
              ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]"
              : "border-[#333] bg-transparent"
          }`}
        >
          {i < filled
            ? <Check size={16} strokeWidth={3} className="text-black" />
            : <span className="text-[#444] text-xs font-bold">{i + 1}</span>
          }
        </motion.div>
      ))}
      {/* Reward circle */}
      <div className="w-10 h-10 rounded-full border-2 border-[var(--mc-accent)]/50 flex items-center justify-center bg-[var(--mc-accent)]/5">
        <Scissors size={14} className="text-[var(--mc-accent)]" />
      </div>
    </div>
  );
}

export default function ScanPage() {
  const { customerId } = useParams<{ customerId: string }>();

  const [client,     setClient]     = useState<ClientData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [recording,  setRecording]  = useState(false);
  const [result,     setResult]     = useState<{
    earnedBlowout: boolean;
    ptsEarned: number;
    newPoints: number;
    newTier: string;
    visitStreak: number;
    blowoutsEarned: number;
  } | null>(null);

  useEffect(() => {
    if (!customerId) return;
    fetch(`/api/scan?id=${customerId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setClient(data);
      })
      .catch(() => setError("Unable to load client data"))
      .finally(() => setLoading(false));
  }, [customerId]);

  const recordVisit = async (serviceType: "hair" | "other") => {
    if (!client) return;
    setRecording(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: client.id, serviceType }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setResult(data);
      setClient(prev => prev ? {
        ...prev,
        points:         data.newPoints,
        tier:           data.newTier,
        visits:         prev.visits + 1,
        visitStreak:    data.visitStreak,
        blowoutsEarned: data.blowoutsEarned,
      } : null);
    } catch {
      setError("Failed to record visit. Try again.");
    } finally {
      setRecording(false);
    }
  };

  const reset = () => setResult(null);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#222] border-t-[var(--mc-accent)] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
        <p className="text-white font-serif text-2xl font-bold mb-2">Client Not Found</p>
        <p className="text-[#555] text-sm">{error}</p>
      </div>
    </div>
  );

  if (!client) return null;

  const tierColor = TIER_COLOR[client.tier] ?? "#B8860B";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">

        {/* Salon header */}
        <div className="text-center mb-8">
          <p className="font-serif text-2xl font-bold gold-gradient">MC Hair Salon</p>
          <p className="text-[#444] text-xs uppercase tracking-widest mt-1">Staff Visit Station</p>
        </div>

        <AnimatePresence mode="wait">

          {/* ── BLOWOUT EARNED celebration ─────────────────────────── */}
          {result?.earnedBlowout && (
            <motion.div
              key="blowout"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-28 h-28 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-6"
              >
                <Gift size={52} className="text-black" />
              </motion.div>
              <p className="text-[var(--mc-accent)] uppercase tracking-widest text-xs font-semibold mb-2">
                Reward Unlocked
              </p>
              <h2 className="font-serif text-4xl font-bold text-white mb-3">
                Free Blowout!
              </h2>
              <p className="text-[var(--mc-muted)] text-sm mb-6">
                {client.name} has completed 10 hair services.<br />
                A complimentary blowout has been added to their account.
              </p>

              <div className="border border-[var(--mc-accent)]/30 bg-[#0a0800] p-5 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Points earned</span>
                  <span className="text-green-400 font-bold">+{result.ptsEarned} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">New balance</span>
                  <span className="text-white font-bold">{result.newPoints.toLocaleString()} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Total blowouts earned</span>
                  <span className="text-[var(--mc-accent)] font-bold">{result.blowoutsEarned}</span>
                </div>
              </div>

              <button onClick={reset}
                className="w-full border border-[#222] text-[#555] py-3 text-xs uppercase tracking-widest hover:border-[#444] transition-colors cursor-pointer flex items-center justify-center gap-2">
                <RefreshCw size={13} /> Done
              </button>
            </motion.div>
          )}

          {/* ── VISIT RECORDED (no blowout) ────────────────────────── */}
          {result && !result.earnedBlowout && (
            <motion.div
              key="recorded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6"
              >
                <Check size={36} strokeWidth={3} className="text-green-400" />
              </motion.div>

              <h2 className="font-serif text-3xl font-bold text-white mb-2">Visit Recorded</h2>
              <p className="text-[var(--mc-muted)] text-sm mb-6">
                +{result.ptsEarned} points added to {client.name}&apos;s account
              </p>

              {/* Updated punch card */}
              <div className="luxury-card p-5 mb-4">
                <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-4">
                  Hair Service Punch Card
                </p>
                <PunchCard filled={result.visitStreak} />
                <p className="text-[#555] text-xs mt-4 text-center">
                  {result.visitStreak}/10 &nbsp;·&nbsp; {10 - result.visitStreak} more for a free blowout
                </p>
              </div>

              <div className="flex justify-between text-sm border border-[#1a1a1a] bg-[#080808] p-4 mb-6">
                <div className="text-center">
                  <p className="font-serif text-xl font-bold text-white">{result.newPoints.toLocaleString()}</p>
                  <p className="text-[#555] text-[10px] uppercase tracking-widest mt-0.5">Points</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-xl font-bold" style={{ color: tierColor }}>{result.newTier}</p>
                  <p className="text-[#555] text-[10px] uppercase tracking-widest mt-0.5">Tier</p>
                </div>
                <div className="text-center">
                  <p className="font-serif text-xl font-bold text-white">{result.blowoutsEarned}</p>
                  <p className="text-[#555] text-[10px] uppercase tracking-widest mt-0.5">Blowouts</p>
                </div>
              </div>

              <button onClick={reset}
                className="w-full border border-[#222] text-[#555] py-3 text-xs uppercase tracking-widest hover:border-[#444] transition-colors cursor-pointer flex items-center justify-center gap-2">
                <RefreshCw size={13} /> Done
              </button>
            </motion.div>
          )}

          {/* ── MAIN — client card + service selection ──────────────── */}
          {!result && (
            <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Client card */}
              <div className="luxury-card p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 shrink-0"
                    style={{ borderColor: tierColor }}>
                    <span className="font-serif text-2xl font-bold" style={{ color: tierColor }}>
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-lg leading-tight">{client.name}</p>
                    <p className="text-[#555] text-xs truncate">{client.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star size={10} style={{ color: tierColor }} />
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: tierColor }}>
                        {client.tier}
                      </span>
                      <span className="text-[#444] text-xs">·</span>
                      <span className="text-[#555] text-xs">{client.points.toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>

                {/* Punch card */}
                <div className="border-t border-[#1a1a1a] pt-4">
                  <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-3 text-center">
                    Hair Service Punch Card &nbsp;·&nbsp; {client.visitStreak}/10
                  </p>
                  <PunchCard filled={client.visitStreak} />
                  <p className="text-[#444] text-xs text-center mt-3">
                    {client.visitStreak === 9
                      ? "⚡ Next hair service earns a FREE blowout!"
                      : `${10 - client.visitStreak} more hair services for a free blowout`
                    }
                  </p>
                </div>

                {client.blowoutsEarned > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Gift size={12} className="text-[var(--mc-accent)]" />
                    <p className="text-[#555] text-xs">
                      {client.blowoutsEarned} complimentary blowout{client.blowoutsEarned > 1 ? "s" : ""} earned lifetime
                    </p>
                  </div>
                )}
              </div>

              {/* Service type selection */}
              <p className="text-[#555] text-xs uppercase tracking-widest text-center mb-4">
                Select service type to record
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => recordVisit("hair")}
                  disabled={recording}
                  className="border border-[var(--mc-accent)]/40 bg-[var(--mc-accent)]/5 hover:bg-[var(--mc-accent)]/10 hover:border-[var(--mc-accent)] p-5 text-center transition-all cursor-pointer disabled:opacity-50 group"
                >
                  <Scissors size={28} className="text-[var(--mc-accent)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-bold text-sm">Hair Service</p>
                  <p className="text-[#555] text-[10px] mt-1">Counts toward blowout</p>
                </button>

                <button
                  onClick={() => recordVisit("other")}
                  disabled={recording}
                  className="border border-[#1a1a1a] bg-[#080808] hover:border-[#333] p-5 text-center transition-all cursor-pointer disabled:opacity-50 group"
                >
                  <Sparkles size={28} className="text-[#555] mx-auto mb-2 group-hover:text-[var(--mc-accent)] transition-colors" />
                  <p className="text-white font-bold text-sm">Other Service</p>
                  <p className="text-[#555] text-[10px] mt-1">Spa, makeup, lashes</p>
                </button>
              </div>

              {recording && (
                <div className="flex items-center justify-center gap-2 text-[#555] text-sm py-4">
                  <div className="w-4 h-4 border-2 border-[#333] border-t-[var(--mc-accent)] rounded-full animate-spin" />
                  Recording visit...
                </div>
              )}

              <p className="text-[#333] text-[10px] text-center mt-4">
                {client.visits} total visits · {client.name.split(" ")[0]}&apos;s loyalty account
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
