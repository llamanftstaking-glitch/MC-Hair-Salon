"use client";
import { useEffect, useState, useCallback } from "react";
import { DollarSign, Plus, Check, Trash2, RefreshCw, AlertTriangle, X } from "lucide-react";

type BillCategory = "rent" | "utilities" | "supplies" | "subscriptions" | "general";

interface Bill {
  id: string;
  name: string;
  category: BillCategory;
  amount: number;
  dueDay: number;
  isPaid: boolean;
  autoPay: boolean;
  notes?: string;
  createdAt: string;
}

const CATEGORIES: { value: BillCategory; label: string }[] = [
  { value: "rent",          label: "Rent" },
  { value: "utilities",     label: "Utilities" },
  { value: "supplies",      label: "Supplies" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "general",       label: "General" },
];

const CATEGORY_COLORS: Record<BillCategory, string> = {
  rent:          "bg-purple-900/50 text-purple-300",
  utilities:     "bg-blue-900/50 text-blue-300",
  supplies:      "bg-green-900/50 text-green-300",
  subscriptions: "bg-amber-900/50 text-amber-300",
  general:       "bg-zinc-700 text-zinc-300",
};

const EMPTY_FORM = {
  name: "",
  category: "general" as BillCategory,
  amount: "",
  dueDay: "1",
  autoPay: false,
  notes: "",
};

function todayDay(): number {
  return new Date().getDate();
}

function isOverdue(bill: Bill): boolean {
  if (bill.isPaid) return false;
  return bill.dueDay < todayDay();
}

export default function FinanceTab() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editBill, setEditBill] = useState<Bill | null>(null);
  const [toggling, setToggling] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance");
      const data = await res.json();
      setBills(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Summary stats ─────────────────────────────────────────────────────────────
  const totalBills   = bills.reduce((s, b) => s + b.amount, 0);
  const totalPaid    = bills.filter(b => b.isPaid).reduce((s, b) => s + b.amount, 0);
  const totalUnpaid  = bills.filter(b => !b.isPaid).reduce((s, b) => s + b.amount, 0);
  const overdueCount = bills.filter(isOverdue).length;

  // ── Handlers ──────────────────────────────────────────────────────────────────
  function openNew() {
    setEditBill(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(b: Bill) {
    setEditBill(b);
    setForm({
      name:     b.name,
      category: b.category,
      amount:   String(b.amount),
      dueDay:   String(b.dueDay),
      autoPay:  b.autoPay,
      notes:    b.notes ?? "",
    });
    setShowModal(true);
  }

  async function saveBill() {
    if (!form.name.trim() || !form.amount) return;
    setSaving(true);
    try {
      const payload = {
        name:     form.name.trim(),
        category: form.category,
        amount:   parseFloat(form.amount) || 0,
        dueDay:   parseInt(form.dueDay, 10) || 1,
        autoPay:  form.autoPay,
        notes:    form.notes.trim() || undefined,
      };
      if (editBill) {
        await fetch("/api/finance", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editBill.id, ...payload }),
        });
      } else {
        await fetch("/api/finance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function togglePaid(bill: Bill) {
    setToggling(t => ({ ...t, [bill.id]: true }));
    try {
      await fetch("/api/finance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bill.id, isPaid: !bill.isPaid }),
      });
      setBills(bs => bs.map(b => b.id === bill.id ? { ...b, isPaid: !b.isPaid } : b));
    } finally {
      setToggling(t => ({ ...t, [bill.id]: false }));
    }
  }

  async function deleteBill(id: string) {
    if (!confirm("Delete this bill?")) return;
    await fetch("/api/finance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  if (loading) return <div className="text-[var(--mc-text-dim)] py-12 text-center">Loading bills…</div>;

  return (
    <div className="space-y-5">
      {/* ── Summary cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Bills",  value: `$${totalBills.toFixed(2)}`,  sub: `${bills.length} bill${bills.length !== 1 ? "s" : ""}`, accent: false },
          { label: "Paid",         value: `$${totalPaid.toFixed(2)}`,   sub: `${bills.filter(b => b.isPaid).length} paid`,  accent: false, green: true },
          { label: "Unpaid",       value: `$${totalUnpaid.toFixed(2)}`, sub: `${bills.filter(b => !b.isPaid).length} unpaid`, accent: false, amber: true },
          { label: "Overdue",      value: overdueCount,                  sub: "past due date", red: overdueCount > 0 },
        ].map(s => (
          <div key={s.label} className="luxury-card p-3 text-center">
            <div className={`text-xl font-bold ${s.red ? "text-red-400" : s.green ? "text-green-400" : s.amber ? "text-amber-400" : "text-[var(--mc-accent)]"}`}>
              {s.value}
            </div>
            <div className="text-xs text-[var(--mc-text-dim)] mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[#444] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Overdue alert ────────────────────────────────────────────────────── */}
      {overdueCount > 0 && (
        <div className="bg-red-900/20 border border-red-700/60 rounded-lg p-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-red-300 font-semibold text-sm">
              {overdueCount} overdue bill{overdueCount > 1 ? "s" : ""}
            </p>
            <p className="text-red-400/70 text-xs mt-0.5">
              {bills.filter(isOverdue).map(b => b.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* ── Header + Add button ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
          Recurring Bills
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
            <Plus size={12} /> Add Bill
          </button>
        </div>
      </div>

      {/* ── Bills list ───────────────────────────────────────────────────────── */}
      {bills.length === 0 ? (
        <div className="luxury-card p-10 text-center">
          <DollarSign size={28} className="text-[#333] mx-auto mb-3" />
          <p className="text-[var(--mc-text-dim)] text-sm">No bills yet. Add your first recurring bill.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bills.map(bill => {
            const overdue = isOverdue(bill);
            return (
              <div
                key={bill.id}
                className={`luxury-card p-3 flex flex-wrap items-center gap-3 transition ${
                  overdue ? "border border-red-600/70" : "border border-[var(--mc-border)]"
                } ${bill.isPaid ? "opacity-60" : ""}`}
              >
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-semibold text-sm ${bill.isPaid ? "line-through text-[var(--mc-text-dim)]" : "text-white"}`}>
                      {bill.name}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${CATEGORY_COLORS[bill.category]}`}>
                      {bill.category}
                    </span>
                    {overdue && (
                      <span className="text-xs bg-red-900/60 text-red-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle size={10} /> Overdue
                      </span>
                    )}
                    {bill.isPaid && (
                      <span className="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Check size={10} /> Paid
                      </span>
                    )}
                    {bill.autoPay && (
                      <span className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded">
                        Auto-Pay
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-[var(--mc-text-dim)]">
                    <span className="text-[var(--mc-accent)] font-bold">${bill.amount.toFixed(2)}</span>
                    <span>Due: day {bill.dueDay}</span>
                    {bill.notes && <span className="text-[#444] italic truncate max-w-xs">{bill.notes}</span>}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex gap-1.5 shrink-0 flex-wrap">
                  <button
                    onClick={() => togglePaid(bill)}
                    disabled={toggling[bill.id]}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition disabled:opacity-50 ${
                      bill.isPaid
                        ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                        : "bg-green-700 hover:bg-green-600 text-white"
                    }`}
                  >
                    {toggling[bill.id] ? "…" : bill.isPaid ? "Unmark" : "Mark Paid"}
                  </button>
                  <button
                    onClick={() => openEdit(bill)}
                    className="px-2.5 py-1 bg-[var(--mc-surface)] hover:bg-zinc-700 border border-[var(--mc-border)] text-white rounded text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBill(bill.id)}
                    className="px-2.5 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-300 rounded text-xs transition"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit modal ─────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] rounded-xl p-6 w-full max-w-md space-y-4 my-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-white text-base">
                {editBill ? "Edit Bill" : "Add New Bill"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#555] hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                Bill Name *
              </label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Rent, Electricity, Salon Software"
                className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded"
              />
            </div>

            {/* Category + Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as BillCategory }))}
                  className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors rounded"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors rounded"
                />
              </div>
            </div>

            {/* Due Day */}
            <div className="space-y-1">
              <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                Due Day of Month (1–31)
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={form.dueDay}
                onChange={e => setForm(f => ({ ...f, dueDay: e.target.value }))}
                className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors rounded"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                placeholder="Account #, vendor info, etc."
                className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setForm(f => ({ ...f, autoPay: !f.autoPay }))}
                  className={`w-9 h-5 rounded-full relative transition-colors ${form.autoPay ? "gold-gradient-bg" : "bg-zinc-700"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.autoPay ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-[var(--mc-text-dim)]">Auto-Pay</span>
              </label>
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
                onClick={saveBill}
                disabled={saving || !form.name.trim() || !form.amount}
                className="flex-1 py-2 gold-gradient-bg text-black rounded text-sm font-bold disabled:opacity-50 transition"
              >
                {saving ? "Saving…" : editBill ? "Save Changes" : "Add Bill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
