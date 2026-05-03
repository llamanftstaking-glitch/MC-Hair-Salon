"use client";
import { useEffect, useState, useCallback } from "react";
import { Tag, Plus, Trash2, RefreshCw, X, ToggleLeft, ToggleRight } from "lucide-react";

type DiscountType = "percent" | "flat";

interface PromoCode {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate?: string;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  code: "",
  discountType: "percent" as DiscountType,
  discountValue: "",
  expiryDate: "",
  maxUses: "",
};

const inputCls =
  "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded";
const labelCls =
  "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold";

function isExpired(code: PromoCode): boolean {
  if (!code.expiryDate) return false;
  return new Date(code.expiryDate) < new Date();
}

function isMaxed(code: PromoCode): boolean {
  return code.maxUses !== undefined && code.usedCount >= code.maxUses;
}

export default function PromoCodesTab() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/promo-codes");
      const data = await res.json();
      setCodes(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Summary ──────────────────────────────────────────────────────────────────
  const totalCodes  = codes.length;
  const activeCodes = codes.filter(c => c.isActive && !isExpired(c) && !isMaxed(c)).length;
  const totalUses   = codes.reduce((s, c) => s + c.usedCount, 0);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function openNew() {
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  async function saveCode() {
    if (!form.code.trim() || !form.discountValue) return;
    setSaving(true);
    try {
      const payload = {
        code:          form.code.trim(),
        discountType:  form.discountType,
        discountValue: parseFloat(form.discountValue) || 0,
        expiryDate:    form.expiryDate || undefined,
        maxUses:       form.maxUses ? parseInt(form.maxUses, 10) : undefined,
      };
      const res = await fetch("/api/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Failed to create promo code");
        return;
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(code: PromoCode) {
    setToggling(t => ({ ...t, [code.id]: true }));
    try {
      await fetch("/api/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: code.id, isActive: !code.isActive }),
      });
      setCodes(cs => cs.map(c => c.id === code.id ? { ...c, isActive: !c.isActive } : c));
    } finally {
      setToggling(t => ({ ...t, [code.id]: false }));
    }
  }

  async function deleteCode(id: string) {
    if (!confirm("Delete this promo code? This cannot be undone.")) return;
    setDeleting(d => ({ ...d, [id]: true }));
    try {
      await fetch("/api/promo-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCodes(cs => cs.filter(c => c.id !== id));
    } finally {
      setDeleting(d => ({ ...d, [id]: false }));
    }
  }

  if (loading) return <div className="text-[var(--mc-text-dim)] py-12 text-center">Loading promo codes…</div>;

  return (
    <div className="space-y-5">
      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Codes",  value: totalCodes,  sub: "all time" },
          { label: "Active",       value: activeCodes, sub: "currently live",  green: true },
          { label: "Total Uses",   value: totalUses,   sub: "redemptions",     accent: true },
        ].map(s => (
          <div key={s.label} className="luxury-card p-3 text-center">
            <div className={`text-xl font-bold ${s.green ? "text-green-400" : s.accent ? "text-[var(--mc-accent)]" : "text-white"}`}>
              {s.value}
            </div>
            <div className="text-xs text-[var(--mc-text-dim)] mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[#444] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Header + actions ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
          Promo Codes
        </h3>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 border border-[var(--mc-border)] text-[#555] px-3 py-1 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all"
          >
            <RefreshCw size={11} /> Refresh
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 gold-gradient-bg text-black px-3 py-1.5 text-xs font-bold rounded"
          >
            <Plus size={12} /> Add Code
          </button>
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────────────────────── */}
      {codes.length === 0 ? (
        <div className="luxury-card p-10 text-center">
          <Tag size={28} className="text-[#333] mx-auto mb-3" />
          <p className="text-[var(--mc-text-dim)] text-sm">No promo codes yet. Add your first code.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {codes.map(code => {
            const expired = isExpired(code);
            const maxed   = isMaxed(code);
            const dead    = expired || maxed || !code.isActive;
            return (
              <div
                key={code.id}
                className={`luxury-card p-3 flex flex-wrap items-center gap-3 transition border ${
                  dead ? "border-[var(--mc-border)] opacity-60" : "border-[var(--mc-border)]"
                }`}
              >
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-sm text-[var(--mc-accent)] tracking-widest">
                      {code.code}
                    </span>
                    {/* Discount badge */}
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                      {code.discountType === "percent"
                        ? `${code.discountValue}% off`
                        : `$${Number(code.discountValue).toFixed(2)} off`}
                    </span>
                    {/* Status badges */}
                    {code.isActive && !expired && !maxed && (
                      <span className="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded">Active</span>
                    )}
                    {!code.isActive && (
                      <span className="text-xs bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded">Inactive</span>
                    )}
                    {expired && (
                      <span className="text-xs bg-amber-900/50 text-amber-300 px-1.5 py-0.5 rounded">Expired</span>
                    )}
                    {maxed && !expired && (
                      <span className="text-xs bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded">Max Uses Reached</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-[var(--mc-text-dim)]">
                    <span>
                      Uses: <span className={maxed ? "text-red-400 font-semibold" : "text-white"}>{code.usedCount}</span>
                      {code.maxUses !== undefined && (
                        <> / {code.maxUses}</>
                      )}
                    </span>
                    {code.expiryDate && (
                      <span className={expired ? "text-amber-400" : ""}>
                        Expires: {new Date(code.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-[#444]">
                      Created: {new Date(code.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleActive(code)}
                    disabled={toggling[code.id]}
                    title={code.isActive ? "Deactivate" : "Activate"}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition disabled:opacity-50 ${
                      code.isActive
                        ? "bg-green-900/40 hover:bg-green-900/70 text-green-300"
                        : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                    }`}
                  >
                    {toggling[code.id]
                      ? "…"
                      : code.isActive
                        ? <><ToggleRight size={13} /> Active</>
                        : <><ToggleLeft size={13} /> Inactive</>
                    }
                  </button>
                  <button
                    onClick={() => deleteCode(code.id)}
                    disabled={deleting[code.id]}
                    className="px-2.5 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-300 rounded text-xs transition disabled:opacity-50"
                  >
                    {deleting[code.id] ? "…" : <Trash2 size={12} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add Code modal ─────────────────────────────────────────────────── */}
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
              <h3 className="font-serif font-bold text-white text-base">Add Promo Code</h3>
              <button onClick={() => setShowModal(false)} className="text-[#555] hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            {/* Code */}
            <div className="space-y-1">
              <label className={labelCls}>Code *</label>
              <input
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. SUMMER20"
                className={inputCls}
              />
            </div>

            {/* Discount type + value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelCls}>Discount Type *</label>
                <select
                  value={form.discountType}
                  onChange={e => setForm(f => ({ ...f, discountType: e.target.value as DiscountType }))}
                  className={inputCls}
                >
                  <option value="percent">Percent (%)</option>
                  <option value="flat">Flat ($)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelCls}>
                  Value * {form.discountType === "percent" ? "(%)" : "($)"}
                </label>
                <input
                  type="number"
                  min="0"
                  step={form.discountType === "percent" ? "1" : "0.01"}
                  max={form.discountType === "percent" ? "100" : undefined}
                  value={form.discountValue}
                  onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                  placeholder={form.discountType === "percent" ? "20" : "10.00"}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Expiry date */}
            <div className="space-y-1">
              <label className={labelCls}>Expiry Date (optional)</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                className={inputCls}
              />
            </div>

            {/* Max uses */}
            <div className="space-y-1">
              <label className={labelCls}>Max Uses (optional)</label>
              <input
                type="number"
                min="1"
                value={form.maxUses}
                onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                placeholder="Leave blank for unlimited"
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
                onClick={saveCode}
                disabled={saving || !form.code.trim() || !form.discountValue}
                className="flex-1 py-2 gold-gradient-bg text-black rounded text-sm font-bold disabled:opacity-50 transition"
              >
                {saving ? "Saving…" : "Add Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
