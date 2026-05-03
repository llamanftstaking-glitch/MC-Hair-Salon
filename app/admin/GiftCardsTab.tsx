"use client";
import { useEffect, useState, useCallback } from "react";
import { Gift, Plus, RefreshCw, X, Search } from "lucide-react";

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  recipientName: string;
  recipientEmail?: string;
  senderName: string;
  senderEmail?: string;
  message: string;
  deliveryMethod: "email" | "sms" | "both";
  status: "active" | "redeemed" | "expired" | "void";
  createdAt: string;
  redeemedAt?: string;
  stripeSessionId?: string;
}

const EMPTY_FORM = {
  amount: "",
  recipientName: "",
  recipientEmail: "",
  senderName: "",
};

const inputCls =
  "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded";
const labelCls =
  "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold";

const STATUS_STYLES: Record<string, string> = {
  active:   "bg-green-900/50 text-green-300",
  redeemed: "bg-blue-900/50 text-blue-300",
  expired:  "bg-amber-900/50 text-amber-300",
  void:     "bg-red-900/50 text-red-300",
};

export default function GiftCardsTab() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [voiding, setVoiding] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gift-card");
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const totalCards    = cards.length;
  const activeCards   = cards.filter(c => c.status === "active").length;
  const redeemedCards = cards.filter(c => c.status === "redeemed").length;
  const totalValue    = cards.reduce((s, c) => s + c.amount, 0);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const q = search.toLowerCase().trim();
  const filtered = q
    ? cards.filter(c =>
        c.code.toLowerCase().includes(q) ||
        c.recipientEmail?.toLowerCase().includes(q) ||
        c.senderEmail?.toLowerCase().includes(q) ||
        c.recipientName.toLowerCase().includes(q) ||
        c.senderName.toLowerCase().includes(q)
      )
    : cards;

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function issueCard() {
    if (!form.amount || !form.recipientName || !form.senderName) return;
    setSaving(true);
    try {
      // Manually issued cards bypass Stripe — use the internal token path
      const res = await fetch("/api/gift-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-token": "dev-token",
        },
        body: JSON.stringify({
          action: "create",
          amount: parseFloat(form.amount),
          recipientName: form.recipientName,
          recipientEmail: form.recipientEmail || undefined,
          senderName: form.senderName,
          message: "",
          deliveryMethod: "email",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Failed to issue gift card");
        return;
      }
      setShowModal(false);
      setForm({ ...EMPTY_FORM });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function voidCard(card: GiftCard) {
    if (!confirm(`Void gift card ${card.code}? This cannot be undone.`)) return;
    setVoiding(v => ({ ...v, [card.id]: true }));
    try {
      // PATCH the existing gift-card route — update status to "void"
      await fetch("/api/gift-card", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: card.id, status: "void" }),
      });
      setCards(cs => cs.map(c => c.id === card.id ? { ...c, status: "void" } : c));
    } finally {
      setVoiding(v => ({ ...v, [card.id]: false }));
    }
  }

  if (loading) return <div className="text-[var(--mc-text-dim)] py-12 text-center">Loading gift cards…</div>;

  return (
    <div className="space-y-5">
      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Cards",    value: totalCards,              sub: "all time" },
          { label: "Active",         value: activeCards,             sub: "unredeemed",  green: true },
          { label: "Redeemed",       value: redeemedCards,           sub: "used",        blue: true },
          { label: "Total Issued",   value: `$${totalValue.toFixed(2)}`, sub: "combined value", accent: true },
        ].map(s => (
          <div key={s.label} className="luxury-card p-3 text-center">
            <div className={`text-xl font-bold ${s.green ? "text-green-400" : s.blue ? "text-blue-400" : s.accent ? "text-[var(--mc-accent)]" : "text-white"}`}>
              {s.value}
            </div>
            <div className="text-xs text-[var(--mc-text-dim)] mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[#444] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Header + search + actions ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mr-auto">
          Gift Cards
        </h3>
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search code or email…"
            className="bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white text-xs pl-7 pr-3 py-1.5 focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded w-52"
          />
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 border border-[var(--mc-border)] text-[#555] px-3 py-1 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all"
        >
          <RefreshCw size={11} /> Refresh
        </button>
        <button
          onClick={() => { setForm({ ...EMPTY_FORM }); setShowModal(true); }}
          className="flex items-center gap-1.5 gold-gradient-bg text-black px-3 py-1.5 text-xs font-bold rounded"
        >
          <Plus size={12} /> Issue Card
        </button>
      </div>

      {/* ── Cards list ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="luxury-card p-10 text-center">
          <Gift size={28} className="text-[#333] mx-auto mb-3" />
          <p className="text-[var(--mc-text-dim)] text-sm">
            {q ? "No gift cards match your search." : "No gift cards issued yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(card => (
            <div
              key={card.id}
              className={`luxury-card p-3 flex flex-wrap items-center gap-3 border border-[var(--mc-border)] transition ${
                card.status === "void" ? "opacity-50" : ""
              }`}
            >
              {/* Left: info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-[var(--mc-accent)] tracking-widest">
                    {card.code}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${STATUS_STYLES[card.status] ?? "bg-zinc-700 text-zinc-300"}`}>
                    {card.status}
                  </span>
                  <span className="text-sm font-bold text-white">
                    ${card.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-[var(--mc-text-dim)]">
                  <span>
                    To: <span className="text-white">{card.recipientName}</span>
                    {card.recipientEmail && <span className="text-[#666]"> &lt;{card.recipientEmail}&gt;</span>}
                  </span>
                  <span>
                    From: <span className="text-white">{card.senderName}</span>
                    {card.senderEmail && <span className="text-[#666]"> &lt;{card.senderEmail}&gt;</span>}
                  </span>
                  <span className="text-[#444]">
                    Issued: {new Date(card.createdAt).toLocaleDateString()}
                  </span>
                  {card.redeemedAt && (
                    <span className="text-blue-400">
                      Redeemed: {new Date(card.redeemedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: actions */}
              <div className="flex gap-1.5 shrink-0">
                {card.status === "active" && (
                  <button
                    onClick={() => voidCard(card)}
                    disabled={voiding[card.id]}
                    className="px-2.5 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-300 rounded text-xs font-medium transition disabled:opacity-50"
                  >
                    {voiding[card.id] ? "…" : "Void"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Issue Card modal ───────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] rounded-xl p-6 w-full max-w-md space-y-4 my-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-white text-base">Issue Gift Card</h3>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className={labelCls}>Amount ($) *</label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="50.00"
                className={inputCls}
              />
            </div>

            {/* Recipient name + email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelCls}>Recipient Name *</label>
                <input
                  type="text"
                  value={form.recipientName}
                  onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                  placeholder="Jane Doe"
                  className={inputCls}
                />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Recipient Email</label>
                <input
                  type="email"
                  value={form.recipientEmail}
                  onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))}
                  placeholder="jane@email.com"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Sender name */}
            <div className="space-y-1">
              <label className={labelCls}>Sender Name *</label>
              <input
                type="text"
                value={form.senderName}
                onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))}
                placeholder="MC Hair Salon (manual issue)"
                className={inputCls}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-[var(--mc-border)] text-[var(--mc-text-dim)] hover:text-white hover:border-[#555] rounded text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={issueCard}
                disabled={saving || !form.amount || !form.recipientName || !form.senderName}
                className="flex-1 py-2 gold-gradient-bg text-black rounded text-sm font-bold disabled:opacity-50 transition"
              >
                {saving ? "Issuing…" : "Issue Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
