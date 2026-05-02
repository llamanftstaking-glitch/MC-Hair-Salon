"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type Category = "color" | "treatment" | "styling" | "retail" | "supplies" | "tools" | "general";
type TxType = "received" | "used" | "sold" | "adjustment" | "waste";

interface ServiceUsage { service: string; qty: number; }

interface Product {
  id: string; name: string; brand?: string;
  category: Category; sku?: string;
  costPrice: number; retailPrice?: number;
  unit: string; currentStock: number; minStock: number;
  vendor?: string; notes?: string; isActive: boolean;
  createdAt: string; updatedAt: string;
  serviceUsage: ServiceUsage[];
}

interface InventoryTransaction {
  id: string; productId: string; productName: string;
  type: TxType; quantity: number; date: string;
  staffName?: string; bookingId?: string;
  notes?: string; costAtTime?: number; createdAt: string;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "color", label: "Color" },
  { value: "treatment", label: "Treatment" },
  { value: "styling", label: "Styling" },
  { value: "retail", label: "Retail" },
  { value: "supplies", label: "Supplies" },
  { value: "tools", label: "Tools" },
  { value: "general", label: "General" },
];

const TX_TYPE_LABELS: Record<TxType, string> = {
  received: "Received", used: "Used", sold: "Sold",
  adjustment: "Adjusted", waste: "Wasted",
};

const EMPTY_PRODUCT: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
  name: "", brand: "", category: "general", sku: "",
  costPrice: 0, retailPrice: undefined, unit: "each",
  currentStock: 0, minStock: 1, vendor: "", notes: "",
  isActive: true, serviceUsage: [],
};

declare global {
  interface Window {
    BarcodeDetector?: new (opts: { formats: string[] }) => {
      detect(img: ImageBitmapSource): Promise<{ rawValue: string }[]>;
    };
  }
}

export default function InventoryTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"products" | "transactions" | "order">("products");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<Category | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_PRODUCT, serviceUsage: [] as ServiceUsage[] });
  const [showReceive, setShowReceive] = useState<Product | null>(null);
  const [receiveQty, setReceiveQty] = useState("");
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState("");
  const [adjustType, setAdjustType] = useState<TxType>("adjustment");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [all, low, tx] = await Promise.all([
      fetch("/api/inventory").then(r => r.json()),
      fetch("/api/inventory?action=low_stock").then(r => r.json()),
      fetch("/api/inventory?action=transactions").then(r => r.json()),
    ]);
    setProducts(Array.isArray(all) ? all : []);
    setLowStock(Array.isArray(low) ? low : []);
    setTransactions(Array.isArray(tx) ? tx : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Barcode scanning ─────────────────────────────────────────────────────────
  const stopScan = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setScanActive(false);
  }, []);

  const startScan = useCallback(async () => {
    if (!window.BarcodeDetector) { alert("Barcode scanning not supported on this browser. Enter SKU manually."); return; }
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    streamRef.current = stream;
    if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    setScanActive(true);
    const detector = new window.BarcodeDetector!({ formats: ["ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e"] });
    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current) return;
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length > 0) {
          const code = barcodes[0].rawValue;
          stopScan();
          setScanResult(code);
          // Try to find existing product
          const res = await fetch(`/api/inventory?sku=${encodeURIComponent(code)}`);
          if (res.ok) {
            const p: Product = await res.json();
            openEdit(p);
          } else {
            // Pre-fill SKU in new product form
            setForm({ ...EMPTY_PRODUCT, serviceUsage: [], sku: code });
            setEditProduct(null);
            setShowModal(true);
          }
        }
      } catch { /* ignore frame errors */ }
    }, 300);
  }, [stopScan]);

  useEffect(() => () => stopScan(), [stopScan]);

  // ── Product modal ────────────────────────────────────────────────────────────
  function openEdit(p: Product) {
    setEditProduct(p);
    setForm({ ...p, serviceUsage: p.serviceUsage ?? [] });
    setShowModal(true);
  }

  function openNew() {
    setEditProduct(null);
    setForm({ ...EMPTY_PRODUCT, serviceUsage: [] });
    setShowModal(true);
  }

  async function saveProduct() {
    setSaving(true);
    if (editProduct) {
      await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editProduct.id, ...form }),
      });
    } else {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setShowModal(false);
    load();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Deactivate this product?")) return;
    await fetch("/api/inventory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function receiveStock() {
    if (!showReceive || !receiveQty) return;
    setSaving(true);
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adjust", productId: showReceive.id,
        delta: parseFloat(receiveQty), type: "received",
        notes: "Stock received",
      }),
    });
    setSaving(false);
    setShowReceive(null);
    setReceiveQty("");
    load();
  }

  async function doAdjust() {
    if (!adjustProduct || !adjustDelta) return;
    setSaving(true);
    await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adjust", productId: adjustProduct.id,
        delta: parseFloat(adjustDelta), type: adjustType, notes: adjustNotes,
      }),
    });
    setSaving(false);
    setAdjustProduct(null);
    setAdjustDelta("");
    setAdjustNotes("");
    load();
  }

  // ── Service usage rows ───────────────────────────────────────────────────────
  function addServiceUsage() { setForm(f => ({ ...f, serviceUsage: [...f.serviceUsage, { service: "", qty: 1 }] })); }
  function updateServiceUsage(i: number, field: keyof ServiceUsage, val: string | number) {
    setForm(f => {
      const su = [...f.serviceUsage];
      su[i] = { ...su[i], [field]: val };
      return { ...f, serviceUsage: su };
    });
  }
  function removeServiceUsage(i: number) {
    setForm(f => ({ ...f, serviceUsage: f.serviceUsage.filter((_, idx) => idx !== i) }));
  }

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalValue = products.reduce((s, p) => s + p.costPrice * p.currentStock, 0);
  const filtered = products.filter(p =>
    (catFilter === "all" || p.category === catFilter) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  // ── Weekly order (Monday list) ───────────────────────────────────────────────
  const orderItems = lowStock.map(p => ({
    ...p,
    orderQty: Math.max(p.minStock * 2 - p.currentStock, p.minStock),
    estimatedCost: p.costPrice * Math.max(p.minStock * 2 - p.currentStock, p.minStock),
  }));
  const orderTotal = orderItems.reduce((s, p) => s + p.estimatedCost, 0);

  if (loading) return <div className="text-zinc-400 py-12 text-center">Loading inventory…</div>;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: products.length },
          { label: "Low Stock", value: lowStock.length, red: lowStock.length > 0 },
          { label: "Total Value", value: `$${totalValue.toFixed(2)}` },
          { label: "Categories", value: CATEGORIES.length },
        ].map(s => (
          <div key={s.label} className="bg-zinc-800 rounded-lg p-3 text-center">
            <div className={`text-xl font-bold ${s.red ? "text-red-400" : "text-amber-400"}`}>{s.value}</div>
            <div className="text-xs text-zinc-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Low-stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 flex items-start gap-3">
          <span className="text-red-400 text-lg">⚠</span>
          <div>
            <p className="text-red-300 font-semibold text-sm">{lowStock.length} product{lowStock.length > 1 ? "s" : ""} below minimum stock</p>
            <p className="text-red-400 text-xs mt-0.5">{lowStock.map(p => p.name).join(", ")}</p>
          </div>
          <button onClick={() => setView("order")} className="ml-auto text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded">
            View Order
          </button>
        </div>
      )}

      {/* Tab bar + actions */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex bg-zinc-800 rounded-lg p-0.5 gap-0.5">
          {(["products", "transactions", "order"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition ${view === v ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}>
              {v === "order" ? `Order List${lowStock.length > 0 ? ` (${lowStock.length})` : ""}` : v}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          {view === "products" && (
            <>
              <button onClick={startScan}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs font-medium">
                📷 Scan
              </button>
              <button onClick={openNew}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold">
                + Add Product
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scanner overlay */}
      {scanActive && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center gap-4">
          <p className="text-white font-semibold">Point camera at barcode</p>
          <video ref={videoRef} className="w-72 h-48 rounded-lg object-cover border-2 border-amber-400" muted playsInline />
          <button onClick={stopScan} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg">Cancel</button>
        </div>
      )}

      {/* Products view */}
      {view === "products" && (
        <div className="space-y-3">
          {/* Search + filter */}
          <div className="flex flex-wrap gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, brand, SKU…"
              className="flex-1 min-w-40 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500" />
            <select value={catFilter} onChange={e => setCatFilter(e.target.value as Category | "all")}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500">
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Product grid */}
          <div className="space-y-2">
            {filtered.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">No products found.</p>}
            {filtered.map(p => {
              const isLow = p.currentStock <= p.minStock;
              return (
                <div key={p.id} className={`bg-zinc-800 rounded-lg p-3 flex flex-wrap items-center gap-3 ${isLow ? "ring-1 ring-red-600" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white text-sm">{p.name}</span>
                      {p.brand && <span className="text-zinc-400 text-xs">{p.brand}</span>}
                      <span className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded capitalize">{p.category}</span>
                      {isLow && <span className="text-xs bg-red-900 text-red-300 px-1.5 py-0.5 rounded">Low Stock</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-zinc-400">
                      {p.sku && <span>SKU: {p.sku}</span>}
                      <span>Cost: <span className="text-amber-400">${p.costPrice.toFixed(2)}</span></span>
                      {p.retailPrice && <span>Retail: ${p.retailPrice.toFixed(2)}</span>}
                      <span>Stock: <span className={isLow ? "text-red-400 font-bold" : "text-green-400"}>{p.currentStock} {p.unit}</span></span>
                      <span>Min: {p.minStock}</span>
                      {p.vendor && <span>Vendor: {p.vendor}</span>}
                    </div>
                    {p.serviceUsage.length > 0 && (
                      <div className="mt-1 text-xs text-zinc-500">
                        Used in: {p.serviceUsage.map(u => `${u.service} (${u.qty})`).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => { setShowReceive(p); setReceiveQty(""); }}
                      className="px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-xs">+</button>
                    <button onClick={() => { setAdjustProduct(p); setAdjustDelta(""); setAdjustNotes(""); setAdjustType("adjustment"); }}
                      className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs">Adjust</button>
                    <button onClick={() => openEdit(p)}
                      className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs">Edit</button>
                    <button onClick={() => deleteProduct(p.id)}
                      className="px-2 py-1 bg-red-900 hover:bg-red-800 text-red-300 rounded text-xs">×</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transactions view */}
      {view === "transactions" && (
        <div className="space-y-2">
          {transactions.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">No transactions yet.</p>}
          {transactions.map(tx => (
            <div key={tx.id} className="bg-zinc-800 rounded-lg p-3 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-white text-sm">{tx.productName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${
                    tx.type === "received" ? "bg-green-900 text-green-300" :
                    tx.type === "used" || tx.type === "waste" ? "bg-red-900 text-red-300" :
                    tx.type === "sold" ? "bg-blue-900 text-blue-300" : "bg-zinc-700 text-zinc-300"
                  }`}>{TX_TYPE_LABELS[tx.type]}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-zinc-400">
                  <span>{tx.date}</span>
                  <span className={tx.quantity > 0 ? "text-green-400" : "text-red-400"}>
                    {tx.quantity > 0 ? "+" : ""}{tx.quantity}
                  </span>
                  {tx.costAtTime && <span>@${tx.costAtTime.toFixed(2)}</span>}
                  {tx.staffName && <span>{tx.staffName}</span>}
                  {tx.notes && <span className="text-zinc-500">{tx.notes}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly order view */}
      {view === "order" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">Auto-generated reorder list — products at or below minimum stock</p>
            <button onClick={() => {
              const lines = orderItems.map(p =>
                `${p.name}${p.vendor ? ` (${p.vendor})` : ""} — Qty: ${p.orderQty} ${p.unit} — Est. $${p.estimatedCost.toFixed(2)}`
              ).join("\n");
              navigator.clipboard.writeText(`WEEKLY ORDER\n\n${lines}\n\nTotal: $${orderTotal.toFixed(2)}`);
            }} className="text-xs px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded">
              Copy List
            </button>
          </div>
          {orderItems.length === 0 && <p className="text-green-400 text-sm text-center py-8">All products are stocked. No order needed.</p>}
          {orderItems.length > 0 && (
            <>
              <div className="space-y-2">
                {orderItems.map(p => (
                  <div key={p.id} className="bg-zinc-800 rounded-lg p-3 flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white text-sm">{p.name}</span>
                        {p.brand && <span className="text-zinc-400 text-xs">{p.brand}</span>}
                        {p.vendor && <span className="text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded">{p.vendor}</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-zinc-400">
                        {p.sku && <span>SKU: {p.sku}</span>}
                        <span>Current: <span className="text-red-400">{p.currentStock}</span></span>
                        <span>Min: {p.minStock}</span>
                        <span>Order: <span className="text-amber-400 font-bold">{p.orderQty} {p.unit}</span></span>
                        <span>Est. Cost: <span className="text-green-400">${p.estimatedCost.toFixed(2)}</span></span>
                      </div>
                    </div>
                    <button onClick={() => { setShowReceive(p); setReceiveQty(String(p.orderQty)); }}
                      className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-xs font-medium">
                      Receive
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 flex justify-between items-center">
                <span className="text-zinc-300 font-medium">Estimated Total</span>
                <span className="text-amber-400 font-bold text-lg">${orderTotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Receive stock modal */}
      {showReceive && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowReceive(null)}>
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-white">Receive Stock — {showReceive.name}</h3>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Quantity ({showReceive.unit})</label>
              <input type="number" value={receiveQty} onChange={e => setReceiveQty(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowReceive(null)} className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={receiveStock} disabled={saving || !receiveQty}
                className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold disabled:opacity-50">
                {saving ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust stock modal */}
      {adjustProduct && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-4" onClick={() => setAdjustProduct(null)}>
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-white">Adjust Stock — {adjustProduct.name}</h3>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Type</label>
              <select value={adjustType} onChange={e => setAdjustType(e.target.value as TxType)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500">
                {(["adjustment", "waste", "sold", "used"] as TxType[]).map(t => (
                  <option key={t} value={t}>{TX_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Delta (use − for reduction, + for addition)</label>
              <input type="number" value={adjustDelta} onChange={e => setAdjustDelta(e.target.value)} placeholder="-2 or 5"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Notes (optional)</label>
              <input type="text" value={adjustNotes} onChange={e => setAdjustNotes(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAdjustProduct(null)} className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={doAdjust} disabled={saving || !adjustDelta}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-sm font-bold disabled:opacity-50">
                {saving ? "Saving…" : "Apply"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit product modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-lg space-y-4 my-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-white text-lg">{editProduct ? "Edit Product" : "Add Product"}</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-zinc-400">Product Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Brand</label>
                <input value={form.brand ?? ""} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">SKU / Barcode</label>
                <input value={form.sku ?? ""} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Unit</label>
                <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="each, oz, ml…"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Cost Price (COGS) *</label>
                <input type="number" value={form.costPrice} onChange={e => setForm(f => ({ ...f, costPrice: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Retail Price</label>
                <input type="number" value={form.retailPrice ?? ""} onChange={e => setForm(f => ({ ...f, retailPrice: parseFloat(e.target.value) || undefined }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Current Stock</label>
                <input type="number" value={form.currentStock} onChange={e => setForm(f => ({ ...f, currentStock: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Min Stock (alert threshold)</label>
                <input type="number" value={form.minStock} onChange={e => setForm(f => ({ ...f, minStock: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-zinc-400">Vendor / Supplier</label>
                <input value={form.vendor ?? ""} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-zinc-400">Notes</label>
                <textarea value={form.notes ?? ""} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
              </div>
            </div>

            {/* Service usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-zinc-400 font-semibold">Auto-Deduct for Services</label>
                <button onClick={addServiceUsage} className="text-xs text-amber-400 hover:text-amber-300">+ Add Service</button>
              </div>
              {form.serviceUsage.map((su, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={su.service} onChange={e => updateServiceUsage(i, "service", e.target.value)}
                    placeholder="Service name (e.g. Color)"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                  <input type="number" value={su.qty} onChange={e => updateServiceUsage(i, "qty", parseFloat(e.target.value) || 0)}
                    placeholder="Qty"
                    className="w-20 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                  <button onClick={() => removeServiceUsage(i)} className="text-red-400 hover:text-red-300 text-lg leading-none">×</button>
                </div>
              ))}
              {form.serviceUsage.length === 0 && (
                <p className="text-xs text-zinc-600">No services linked — product won&apos;t auto-deduct on booking confirmation.</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm">Cancel</button>
              <button onClick={saveProduct} disabled={saving || !form.name}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-sm font-bold disabled:opacity-50">
                {saving ? "Saving…" : editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
