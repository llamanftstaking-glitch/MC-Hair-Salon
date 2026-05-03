"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, RefreshCw, Scissors, X, GripVertical, Pencil } from "lucide-react";

type ServiceCategory = "Hair" | "Color" | "Treatments" | "Makeup" | "Skin" | "Other";

interface SalonService {
  id: string;
  name: string;
  category: ServiceCategory;
  priceMin: number;
  priceMax: number | null;
  durationMins: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const CATEGORIES: { value: ServiceCategory; label: string; color: string }[] = [
  { value: "Hair",       label: "Hair",       color: "bg-amber-900/50 text-amber-300" },
  { value: "Color",      label: "Color",      color: "bg-pink-900/50 text-pink-300" },
  { value: "Treatments", label: "Treatments", color: "bg-blue-900/50 text-blue-300" },
  { value: "Makeup",     label: "Makeup",     color: "bg-purple-900/50 text-purple-300" },
  { value: "Skin",       label: "Skin",       color: "bg-green-900/50 text-green-300" },
  { value: "Other",      label: "Other",      color: "bg-zinc-700 text-zinc-300" },
];

const CATEGORY_COLOR: Record<ServiceCategory, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.color])
) as Record<ServiceCategory, string>;

const EMPTY_FORM = {
  name: "",
  category: "Hair" as ServiceCategory,
  priceMin: "",
  priceMax: "",
  durationMins: "",
  isActive: true,
  sortOrder: "0",
};

export default function ServicesTab() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState<SalonService | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [catFilter, setCatFilter] = useState<ServiceCategory | "all">("all");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Stats ────────────────────────────────────────────────────────────────────
  const totalServices  = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const avgPrice = (() => {
    const active = services.filter(s => s.isActive && s.priceMin > 0);
    if (!active.length) return 0;
    const sum = active.reduce((acc, s) => acc + (s.priceMax != null ? (s.priceMin + s.priceMax) / 2 : s.priceMin), 0);
    return sum / active.length;
  })();
  const categories = [...new Set(services.map(s => s.category))].length;

  // ── Filtered + grouped ───────────────────────────────────────────────────────
  const filtered = services.filter(s => catFilter === "all" || s.category === catFilter);
  const grouped = CATEGORIES.reduce<Record<ServiceCategory, SalonService[]>>((acc, c) => {
    acc[c.value] = filtered.filter(s => s.category === c.value);
    return acc;
  }, {} as Record<ServiceCategory, SalonService[]>);

  // ── Modal helpers ────────────────────────────────────────────────────────────
  function openNew() {
    setEditService(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(s: SalonService) {
    setEditService(s);
    setForm({
      name:        s.name,
      category:    s.category,
      priceMin:    String(s.priceMin),
      priceMax:    s.priceMax != null ? String(s.priceMax) : "",
      durationMins: s.durationMins != null ? String(s.durationMins) : "",
      isActive:    s.isActive,
      sortOrder:   String(s.sortOrder),
    });
    setShowModal(true);
  }

  async function saveService() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        category:    form.category,
        priceMin:    parseFloat(form.priceMin) || 0,
        priceMax:    form.priceMax !== "" ? parseFloat(form.priceMax) : null,
        durationMins: form.durationMins !== "" ? parseInt(form.durationMins, 10) : null,
        isActive:    form.isActive,
        sortOrder:   parseInt(form.sortOrder, 10) || 0,
      };
      if (editService) {
        await fetch("/api/services", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editService.id, ...payload }),
        });
      } else {
        await fetch("/api/services", {
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

  async function deleteService(id: string) {
    if (!confirm("Delete this service permanently?")) return;
    await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function toggleActive(s: SalonService) {
    setToggling(t => ({ ...t, [s.id]: true }));
    try {
      await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, isActive: !s.isActive }),
      });
      setServices(svcs => svcs.map(x => x.id === s.id ? { ...x, isActive: !x.isActive } : x));
    } finally {
      setToggling(t => ({ ...t, [s.id]: false }));
    }
  }

  async function runSeed() {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await fetch("/api/services/seed");
      const data = await res.json();
      setSeedMsg(data.message ?? "Done");
      load();
    } finally {
      setSeeding(false);
    }
  }

  // ── Price display ────────────────────────────────────────────────────────────
  function priceLabel(s: SalonService) {
    if (s.priceMin === 0 && s.priceMax == null) return "—";
    if (s.priceMax == null) return `$${s.priceMin}`;
    return `$${s.priceMin}–$${s.priceMax}`;
  }

  if (loading) return <div className="text-[var(--mc-text-dim)] py-12 text-center">Loading services…</div>;

  return (
    <div className="space-y-5">
      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Services",  value: totalServices,             sub: "in menu" },
          { label: "Active",          value: activeServices,            sub: "shown on site", green: true },
          { label: "Categories",      value: categories,                sub: "unique groups" },
          { label: "Avg Price",       value: `$${avgPrice.toFixed(0)}`, sub: "active services" },
        ].map(s => (
          <div key={s.label} className="luxury-card p-3 text-center">
            <div className={`text-xl font-bold ${s.green ? "text-green-400" : "text-[var(--mc-accent)]"}`}>
              {s.value}
            </div>
            <div className="text-xs text-[var(--mc-text-dim)] mt-0.5">{s.label}</div>
            <div className="text-[10px] text-[#444] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Header + controls ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
          Service Menu
        </h3>
        <div className="flex gap-2 flex-wrap items-center">
          {/* Seed button (only if empty) */}
          {services.length === 0 && (
            <button
              onClick={runSeed}
              disabled={seeding}
              className="flex items-center gap-1.5 border border-amber-600/60 text-amber-400 px-3 py-1 text-xs hover:border-amber-400 transition-all disabled:opacity-50"
            >
              {seeding ? "Seeding…" : "Seed Default Services"}
            </button>
          )}
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
            <Plus size={12} /> Add Service
          </button>
        </div>
      </div>

      {/* Seed message */}
      {seedMsg && (
        <div className="text-xs text-green-400 bg-green-900/20 border border-green-700/40 px-3 py-2 rounded">
          {seedMsg}
        </div>
      )}

      {/* ── Category filter tabs ───────────────────────────────────────────── */}
      <div className="flex gap-1 flex-wrap">
        {[{ value: "all" as const, label: "All" }, ...CATEGORIES].map(c => (
          <button
            key={c.value}
            onClick={() => setCatFilter(c.value)}
            className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold border transition-all ${
              catFilter === c.value
                ? "border-[var(--mc-accent)] text-[var(--mc-accent)]"
                : "border-[var(--mc-border)] text-[#555] hover:text-[var(--mc-text-dim)] hover:border-[#444]"
            }`}
          >
            {c.label}
            {c.value !== "all" && (
              <span className="ml-1 opacity-60">
                ({services.filter(s => s.category === c.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Services list grouped by category ─────────────────────────────── */}
      {services.length === 0 ? (
        <div className="luxury-card p-10 text-center">
          <Scissors size={28} className="text-[#333] mx-auto mb-3" />
          <p className="text-[var(--mc-text-dim)] text-sm mb-4">No services yet.</p>
          <button
            onClick={runSeed}
            disabled={seeding}
            className="gold-gradient-bg text-black px-4 py-2 text-xs font-bold rounded disabled:opacity-50"
          >
            {seeding ? "Seeding…" : "Seed Default Services"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {CATEGORIES.map(cat => {
            const rows = grouped[cat.value];
            if (!rows || rows.length === 0) return null;
            return (
              <div key={cat.value}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${cat.color}`}>
                    {cat.label}
                  </span>
                  <div className="flex-1 border-t border-[var(--mc-border)]" />
                  <span className="text-[10px] text-[#444]">{rows.length} service{rows.length !== 1 ? "s" : ""}</span>
                </div>

                {/* Service rows */}
                <div className="space-y-1.5">
                  {rows.map(svc => (
                    <div
                      key={svc.id}
                      className={`luxury-card px-3 py-2.5 flex flex-wrap items-center gap-3 transition ${
                        !svc.isActive ? "opacity-50" : ""
                      }`}
                    >
                      {/* Drag handle (visual only) */}
                      <GripVertical size={14} className="text-[#333] shrink-0 cursor-grab" />

                      {/* Name + category badge */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold text-sm ${svc.isActive ? "text-white" : "text-[var(--mc-text-dim)] line-through"}`}>
                            {svc.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_COLOR[svc.category]}`}>
                            {svc.category}
                          </span>
                          {!svc.isActive && (
                            <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-0.5 text-xs text-[var(--mc-text-dim)]">
                          <span className="text-[var(--mc-accent)] font-bold">{priceLabel(svc)}</span>
                          {svc.durationMins != null && (
                            <span>{svc.durationMins} min</span>
                          )}
                          {svc.sortOrder > 0 && (
                            <span className="text-[#444]">order: {svc.sortOrder}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                        {/* Active toggle */}
                        <button
                          onClick={() => toggleActive(svc)}
                          disabled={toggling[svc.id]}
                          title={svc.isActive ? "Shown on booking page — click to hide" : "Hidden — click to show"}
                          className={`relative w-9 h-5 rounded-full transition-colors disabled:opacity-40 ${
                            svc.isActive ? "gold-gradient-bg" : "bg-zinc-700"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              svc.isActive ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(svc)}
                          className="px-2.5 py-1 bg-[var(--mc-surface)] hover:bg-zinc-700 border border-[var(--mc-border)] text-white rounded text-xs transition flex items-center gap-1"
                        >
                          <Pencil size={11} /> Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteService(svc.id)}
                          className="px-2.5 py-1 bg-red-900/30 hover:bg-red-900/60 text-red-400 rounded text-xs transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit modal ──────────────────────────────────────────────── */}
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
              <h3 className="font-serif font-bold text-white text-base">
                {editService ? "Edit Service" : "Add New Service"}
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
                Service Name *
              </label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Women's Haircut"
                className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as ServiceCategory }))}
                className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors rounded"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                  Min Price ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.priceMin}
                  onChange={e => setForm(f => ({ ...f, priceMin: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.priceMax}
                  onChange={e => setForm(f => ({ ...f, priceMax: e.target.value }))}
                  placeholder="optional"
                  className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded"
                />
              </div>
            </div>

            {/* Duration + sort order */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={form.durationMins}
                  onChange={e => setForm(f => ({ ...f, durationMins: e.target.value }))}
                  placeholder="optional"
                  className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.sortOrder}
                  onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors rounded"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                  className={`w-9 h-5 rounded-full relative transition-colors ${form.isActive ? "gold-gradient-bg" : "bg-zinc-700"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-[var(--mc-text-dim)]">
                  Show on public booking page
                </span>
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
                onClick={saveService}
                disabled={saving || !form.name.trim()}
                className="flex-1 py-2 gold-gradient-bg text-black rounded text-sm font-bold disabled:opacity-50 transition"
              >
                {saving ? "Saving…" : editService ? "Save Changes" : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
