"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar, Users, TrendingUp, Clock, Check, X, Trash2,
  RefreshCw, Mail, Send, Bell, UserCheck, BarChart2, Plus, Loader,
  MessageSquare, MailCheck, Upload, Film, Pencil, User, Settings,
  Building2, Globe, Phone, ChevronRight, ChevronLeft, Image as ImageIcon, Save,
  CreditCard, AlertTriangle, ShieldCheck,
  Gift, Star, Crown, Zap, Minus, Scissors, QrCode, Edit2,
  Download, ToggleLeft, ToggleRight, DollarSign, LayoutGrid,
  CalendarClock, Wrench, Tag, Ticket, Sun, Moon, ChevronDown,
} from "lucide-react";
import type { Booking } from "@/lib/bookings";
import type { ContactMessage } from "@/lib/messages";
import InventoryTab from "./InventoryTab";
import PayrollTab from "./PayrollTab";
import FinanceTab from "./FinanceTab";
import ScheduleTab from "./ScheduleTab";
import ServicesTab from "./ServicesTab";
import GiftCardsTab from "./GiftCardsTab";
import PromoCodesTab from "./PromoCodesTab";
import LiteModeView from "./LiteModeView";
import VibeTab from "./VibeTab";

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab =
  | "reservations"
  | "clients"
  | "rewards"
  | "payroll"
  | "operations"
  | "gift-cards"
  | "marketing"
  | "reports"
  | "settings"
  | "vibe";

interface RewardCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  visits: number;
  totalSpent: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  rewards: { id: string; name: string; pointsCost: number; redeemedAt: string }[];
  createdAt: string;
  visitStreak: number;
  blowoutsEarned: number;
}

interface Subscriber { id: string; email: string; name?: string; subscribedAt: string; active: boolean; }

interface PortfolioItem { src: string; type: "image" | "video"; caption?: string; }

interface StaffMember {
  id: string; name: string; role: string; bio: string;
  specialties: string[]; image: string; portfolio: PortfolioItem[];
  isMakeupArtist?: boolean; order?: number;
}

interface SiteSettings {
  business: { name: string; tagline: string; address: string; phone: string; email: string; instagram: string; facebook: string; };
  hours: { day: string; open: string; close: string; closed?: boolean; }[];
  hero: { headline: string; headlineAccent: string; subheadline: string; };
  theme: { accent: string; accent2: string; bg: string; surface: string; border: string; text: string; muted: string; };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isEnvAdmin: boolean;
  adminEntry: { email: string; addedAt: string; addedBy: string } | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  pending:   "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  confirmed: "text-green-400 border-green-400/30 bg-green-400/10",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
  no_show:   "text-orange-400 border-orange-400/30 bg-orange-400/10",
};

const inputCls = "w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
const labelCls = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

// ── Vendors Panel ──────────────────────────────────────────────────────────────
function VendorsPanel() {
  const [vendors, setVendors] = useState<{ id: string; name: string; category: string; contact: string; phone: string; email: string; notes: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem("mc-vendors") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState({ name: "", category: "", contact: "", phone: "", email: "", notes: "" });
  const [adding, setAdding] = useState(false);

  const save = (list: typeof vendors) => {
    setVendors(list);
    localStorage.setItem("mc-vendors", JSON.stringify(list));
  };
  const add = () => {
    if (!form.name) return;
    save([...vendors, { ...form, id: Date.now().toString() }]);
    setForm({ name: "", category: "", contact: "", phone: "", email: "", notes: "" });
    setAdding(false);
  };
  const remove = (id: string) => save(vendors.filter(v => v.id !== id));

  const CATEGORIES = ["Products & Color", "Cleaning & Maintenance", "Equipment", "Software & Tech", "Furniture", "Other"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-white font-semibold text-lg flex items-center gap-2"><Building2 size={18} className="text-[var(--mc-accent)]" /> Vendors & Suppliers</p>
          <p className="text-[#555] text-sm mt-1">Contacts for products, maintenance, equipment, and services</p>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer transition-opacity">
          <Plus size={14} /> Add Vendor
        </button>
      </div>

      {adding && (
        <div className="luxury-card p-6 mb-6 border border-[var(--mc-accent)]/20">
          <p className="text-white font-semibold mb-4">New Vendor</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: "name", label: "Company Name", placeholder: "e.g. Wella Professional" },
              { key: "contact", label: "Contact Person", placeholder: "e.g. Sarah Johnson" },
              { key: "phone", label: "Phone", placeholder: "(212) 555-0000" },
              { key: "email", label: "Email", placeholder: "sales@vendor.com" },
            ] as const).map(f => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input type="text" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className={inputCls} placeholder={f.placeholder} />
              </div>
            ))}
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className={inputCls + " cursor-pointer"}>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <input type="text" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={inputCls} placeholder="Account #, delivery schedule, etc." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={add} className="gold-gradient-bg text-black font-bold px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer">Save Vendor</button>
            <button onClick={() => setAdding(false)} className="px-6 py-2.5 border border-[var(--mc-border)] text-[#555] text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {vendors.length === 0 && !adding ? (
        <div className="text-center py-20 luxury-card"><Building2 size={48} className="text-[#333] mx-auto mb-4" /><p className="text-[#555]">No vendors added yet</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map(v => (
            <div key={v.id} className="luxury-card p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-white font-semibold">{v.name}</p>
                  {v.category && <span className="text-[10px] px-2 py-0.5 border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] uppercase tracking-wider">{v.category}</span>}
                </div>
                <button onClick={() => remove(v.id)} className="text-[#555] hover:text-red-400 transition-colors cursor-pointer shrink-0"><Trash2 size={14} /></button>
              </div>
              {v.contact && <p className="text-[var(--mc-muted)] text-xs mt-2"><span className="text-[#555]">Contact:</span> {v.contact}</p>}
              {v.phone   && <p className="text-[var(--mc-muted)] text-xs"><a href={`tel:${v.phone}`} className="hover:text-[var(--mc-accent)] transition-colors">{v.phone}</a></p>}
              {v.email   && <p className="text-[var(--mc-muted)] text-xs"><a href={`mailto:${v.email}`} className="hover:text-[var(--mc-accent)] transition-colors">{v.email}</a></p>}
              {v.notes   && <p className="text-[#555] text-xs mt-2 border-t border-[var(--mc-border)] pt-2">{v.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Daily Tasks Panel ───────────────────────────────────────────────────────────
function DailyTasksPanel() {
  type Task = { id: string; text: string; category: "opening" | "closing" | "weekly" | "monthly"; done: boolean };
  const DEFAULTS: Task[] = [
    { id: "1",  text: "Wipe down all stations and mirrors",         category: "opening",  done: false },
    { id: "2",  text: "Sanitize tools and combs",                   category: "opening",  done: false },
    { id: "3",  text: "Check supply levels (color, shampoo, etc.)", category: "opening",  done: false },
    { id: "4",  text: "Sweep and mop floors",                       category: "closing",  done: false },
    { id: "5",  text: "Empty trash and clean sinks",                category: "closing",  done: false },
    { id: "6",  text: "Turn off all electrical equipment",          category: "closing",  done: false },
    { id: "7",  text: "Lock up retail display",                     category: "closing",  done: false },
    { id: "8",  text: "Deep clean shampoo bowls",                   category: "weekly",   done: false },
    { id: "9",  text: "Restock retail shelves",                     category: "weekly",   done: false },
    { id: "10", text: "Review upcoming appointments",               category: "weekly",   done: false },
    { id: "11", text: "Place product orders",                       category: "monthly",  done: false },
    { id: "12", text: "Review payroll and hours",                   category: "monthly",  done: false },
  ];
  const [tasks, setTasks] = useState<Task[]>(() => {
    try { const s = localStorage.getItem("mc-tasks"); return s ? JSON.parse(s) : DEFAULTS; } catch { return DEFAULTS; }
  });
  const [newTask, setNewTask] = useState("");
  const [newCat, setNewCat] = useState<Task["category"]>("opening");

  const save = (list: Task[]) => { setTasks(list); localStorage.setItem("mc-tasks", JSON.stringify(list)); };
  const toggle = (id: string) => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const addTask = () => {
    if (!newTask.trim()) return;
    save([...tasks, { id: Date.now().toString(), text: newTask.trim(), category: newCat, done: false }]);
    setNewTask("");
  };
  const removeTask = (id: string) => save(tasks.filter(t => t.id !== id));
  const resetAll = () => save(tasks.map(t => ({ ...t, done: false })));

  const CATS: { id: Task["category"]; label: string; color: string }[] = [
    { id: "opening",  label: "Opening",  color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
    { id: "closing",  label: "Closing",  color: "text-purple-400 border-purple-400/30 bg-purple-400/10" },
    { id: "weekly",   label: "Weekly",   color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
    { id: "monthly",  label: "Monthly",  color: "text-green-400 border-green-400/30 bg-green-400/10" },
  ];

  const done = tasks.filter(t => t.done).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-white font-semibold text-lg flex items-center gap-2"><Check size={18} className="text-[var(--mc-accent)]" /> Daily Tasks & Checklists</p>
          <p className="text-[#555] text-sm mt-1">{done} / {tasks.length} completed today</p>
        </div>
        <button onClick={resetAll} className="px-4 py-2 border border-[var(--mc-border)] text-[#555] text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
          Reset All
        </button>
      </div>

      {/* Add task */}
      <div className="luxury-card p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className={labelCls}>New Task</label>
          <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            className={inputCls} placeholder="Add a task…" />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select value={newCat} onChange={e => setNewCat(e.target.value as Task["category"])} className={inputCls + " cursor-pointer w-36"}>
            {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <button onClick={addTask} className="gold-gradient-bg text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer h-[42px]">
          Add
        </button>
      </div>

      {/* Tasks by category */}
      {CATS.map(cat => {
        const catTasks = tasks.filter(t => t.category === cat.id);
        if (!catTasks.length) return null;
        return (
          <div key={cat.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] px-2 py-0.5 border uppercase tracking-wider font-semibold ${cat.color}`}>{cat.label}</span>
              <span className="text-[#444] text-xs">{catTasks.filter(t=>t.done).length}/{catTasks.length}</span>
            </div>
            <div className="space-y-2">
              {catTasks.map(task => (
                <div key={task.id} className="luxury-card px-4 py-3 flex items-center gap-3">
                  <button onClick={() => toggle(task.id)}
                    className={`w-5 h-5 border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                      task.done ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]" : "border-[var(--mc-border)] hover:border-[var(--mc-accent)]"
                    }`}>
                    {task.done && <Check size={11} className="text-black" />}
                  </button>
                  <span className={`flex-1 text-sm transition-all ${task.done ? "line-through text-[#444]" : "text-[var(--mc-muted)]"}`}>{task.text}</span>
                  <button onClick={() => removeTask(task.id)} className="text-[#333] hover:text-red-400 transition-colors cursor-pointer shrink-0"><X size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Expense Reports Panel ───────────────────────────────────────────────────────
function ExpenseReportsPanel() {
  type Expense = { id: string; date: string; amount: number; category: string; description: string; vendor: string; };
  const EXP_CATS = ["Supplies & Color", "Equipment", "Utilities", "Rent & Lease", "Marketing", "Payroll", "Repairs", "Insurance", "Software & Tech", "Other"];
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try { return JSON.parse(localStorage.getItem("mc-expenses") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState<Omit<Expense,"id">>({ date: new Date().toISOString().split("T")[0], amount: 0, category: "Supplies & Color", description: "", vendor: "" });
  const [adding, setAdding] = useState(false);
  const [rangeStart, setRangeStart] = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().split("T")[0]; });
  const [rangeEnd,   setRangeEnd]   = useState(() => new Date().toISOString().split("T")[0]);

  const save = (list: Expense[]) => { setExpenses(list); localStorage.setItem("mc-expenses", JSON.stringify(list)); };
  const add = () => {
    if (!form.description || form.amount <= 0) return;
    save([...expenses, { ...form, id: Date.now().toString() }]);
    setForm({ date: new Date().toISOString().split("T")[0], amount: 0, category: "Supplies & Color", description: "", vendor: "" });
    setAdding(false);
  };
  const remove = (id: string) => { if (confirm("Delete this expense?")) save(expenses.filter(e => e.id !== id)); };

  const inRange = expenses.filter(e => e.date >= rangeStart && e.date <= rangeEnd).sort((a,b) => b.date.localeCompare(a.date));
  const total = inRange.reduce((s, e) => s + e.amount, 0);
  const byCategory: Record<string, number> = {};
  inRange.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const topCats = Object.entries(byCategory).sort((a,b) => b[1]-a[1]);

  const exportCSV = () => {
    const rows = [["Date","Category","Description","Vendor","Amount"], ...inRange.map(e => [e.date,e.category,e.description,e.vendor,`$${e.amount.toFixed(2)}`])];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download = "expenses.csv"; a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-white font-semibold text-lg flex items-center gap-2"><DollarSign size={18} className="text-[var(--mc-accent)]" /> Expense Reports</p>
          <p className="text-[#555] text-sm mt-1">Track and categorize all salon expenses</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportCSV} className="flex items-center gap-1.5 border border-[var(--mc-border)] text-[#555] px-4 py-2 text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer transition-opacity">
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      {/* Date range filter */}
      <div className="luxury-card p-4 mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className={labelCls}>From</label>
          <input type="date" value={rangeStart} onChange={e => setRangeStart(e.target.value)} className={`${inputCls} w-44 cursor-pointer`} />
        </div>
        <div>
          <label className={labelCls}>To</label>
          <input type="date" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} className={`${inputCls} w-44 cursor-pointer`} />
        </div>
        <div className="border border-[var(--mc-accent)]/30 px-5 py-2 bg-[var(--mc-accent)]/5">
          <p className="text-[10px] text-[#555] uppercase tracking-widest">Total in Range</p>
          <p className="text-[var(--mc-accent)] font-bold text-xl">${total.toLocaleString("en-US",{minimumFractionDigits:2})}</p>
        </div>
      </div>

      {adding && (
        <div className="luxury-card p-6 mb-6 border border-[var(--mc-accent)]/20">
          <p className="text-white font-semibold mb-4">New Expense</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className={labelCls}>Date</label><input type="date" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} className={`${inputCls} cursor-pointer`} /></div>
            <div><label className={labelCls}>Amount ($)</label><input type="number" min="0" step="0.01" value={form.amount || ""} onChange={e => setForm(p=>({...p,amount:parseFloat(e.target.value)||0}))} className={inputCls} placeholder="0.00" /></div>
            <div><label className={labelCls}>Category</label><select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} className={`${inputCls} cursor-pointer`}>{EXP_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={labelCls}>Description</label><input type="text" value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} className={inputCls} placeholder="What was purchased" /></div>
            <div><label className={labelCls}>Vendor</label><input type="text" value={form.vendor} onChange={e => setForm(p=>({...p,vendor:e.target.value}))} className={inputCls} placeholder="Who was paid" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={add} className="gold-gradient-bg text-black font-bold px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer">Save Expense</button>
            <button onClick={() => setAdding(false)} className="px-6 py-2.5 border border-[var(--mc-border)] text-[#555] text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* Category breakdown */}
      {topCats.length > 0 && (
        <div className="luxury-card p-5 mb-6">
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-4">Breakdown by Category</p>
          <div className="space-y-2">
            {topCats.map(([cat, amt]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-[var(--mc-muted)] text-sm w-44 shrink-0 truncate">{cat}</span>
                <div className="flex-1 bg-[var(--mc-surface-dark)] h-2 relative">
                  <div className="absolute inset-y-0 left-0 gold-gradient-bg" style={{ width: `${Math.round((amt/total)*100)}%` }} />
                </div>
                <span className="text-white text-sm font-semibold w-20 text-right shrink-0">${amt.toFixed(2)}</span>
                <span className="text-[#555] text-xs w-10 text-right shrink-0">{Math.round((amt/total)*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {inRange.length === 0 ? (
        <div className="text-center py-16 luxury-card"><DollarSign size={40} className="text-[#333] mx-auto mb-3" /><p className="text-[#555] text-sm">No expenses in this date range</p></div>
      ) : (
        <div className="space-y-2">
          {inRange.map(e => (
            <div key={e.id} className="luxury-card px-5 py-3 flex items-center gap-4 flex-wrap">
              <span className="text-[#555] text-xs w-24 shrink-0">{new Date(e.date+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
              <span className="text-[var(--mc-accent)] font-bold text-sm w-20 shrink-0">${e.amount.toFixed(2)}</span>
              <span className="text-[10px] border border-[var(--mc-border)] text-[#555] px-2 py-0.5 uppercase tracking-wider shrink-0">{e.category}</span>
              <span className="text-[var(--mc-muted)] text-sm flex-1 min-w-0 truncate">{e.description}</span>
              {e.vendor && <span className="text-[#555] text-xs shrink-0">{e.vendor}</span>}
              <button onClick={() => remove(e.id)} className="text-[#333] hover:text-red-400 transition-colors cursor-pointer shrink-0"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Maintenance Log Panel ───────────────────────────────────────────────────────
function MaintenanceLogPanel() {
  type MEntry = { id: string; equipment: string; issue: string; reportedDate: string; resolvedDate: string; cost: number; technician: string; status: "pending" | "in-progress" | "resolved"; notes: string; };
  const EQUIPMENT = ["Salon Chair #1","Salon Chair #2","Salon Chair #3","Salon Chair #4","Shampoo Bowl #1","Shampoo Bowl #2","Hair Dryer #1","Hair Dryer #2","Steamer","Color Processor","Flat Iron Station","Reception Desk","HVAC / AC","Plumbing","Electrical","Other"];
  const [entries, setEntries] = useState<MEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem("mc-maintenance") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState<Omit<MEntry,"id">>({ equipment: "Salon Chair #1", issue: "", reportedDate: new Date().toISOString().split("T")[0], resolvedDate: "", cost: 0, technician: "", status: "pending", notes: "" });
  const [adding, setAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all"|"pending"|"in-progress"|"resolved">("all");

  const save = (list: MEntry[]) => { setEntries(list); localStorage.setItem("mc-maintenance", JSON.stringify(list)); };
  const add = () => {
    if (!form.issue) return;
    save([{ ...form, id: Date.now().toString() }, ...entries]);
    setForm({ equipment: "Salon Chair #1", issue: "", reportedDate: new Date().toISOString().split("T")[0], resolvedDate: "", cost: 0, technician: "", status: "pending", notes: "" });
    setAdding(false);
  };
  const updateStatus = (id: string, status: MEntry["status"]) => save(entries.map(e => e.id === id ? { ...e, status, resolvedDate: status === "resolved" ? new Date().toISOString().split("T")[0] : e.resolvedDate } : e));
  const remove = (id: string) => { if (confirm("Delete this log entry?")) save(entries.filter(e => e.id !== id)); };

  const STATUS_STYLE: Record<string, string> = {
    pending:      "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    "in-progress":"text-blue-400 border-blue-400/30 bg-blue-400/10",
    resolved:     "text-green-400 border-green-400/30 bg-green-400/10",
  };
  const STATUS_BORDER: Record<string, string> = {
    pending: "border-l-yellow-400", "in-progress": "border-l-blue-400", resolved: "border-l-green-400",
  };

  const filtered = statusFilter === "all" ? entries : entries.filter(e => e.status === statusFilter);
  const openCount = entries.filter(e => e.status !== "resolved").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-white font-semibold text-lg flex items-center gap-2"><Wrench size={18} className="text-[var(--mc-accent)]" /> Maintenance Log</p>
          <p className="text-[#555] text-sm mt-1">{openCount} open issue{openCount !== 1 ? "s" : ""} · {entries.filter(e=>e.status==="resolved").length} resolved</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer transition-opacity">
          <Plus size={14} /> Log Issue
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto scrollbar-none">
        {(["all","pending","in-progress","resolved"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`shrink-0 px-3 py-1.5 text-[10px] uppercase tracking-widest cursor-pointer transition-all whitespace-nowrap ${
              statusFilter === s ? "gold-gradient-bg text-black font-bold" : "border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)]"
            }`}>
            {s} {s === "all" ? `(${entries.length})` : `(${entries.filter(e=>e.status===s).length})`}
          </button>
        ))}
      </div>

      {adding && (
        <div className="luxury-card p-6 mb-6 border border-[var(--mc-accent)]/20">
          <p className="text-white font-semibold mb-4">New Maintenance Entry</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className={labelCls}>Equipment</label><select value={form.equipment} onChange={e=>setForm(p=>({...p,equipment:e.target.value}))} className={`${inputCls} cursor-pointer`}>{EQUIPMENT.map(eq=><option key={eq} value={eq}>{eq}</option>)}</select></div>
            <div className="sm:col-span-2"><label className={labelCls}>Issue / Task</label><input type="text" value={form.issue} onChange={e=>setForm(p=>({...p,issue:e.target.value}))} className={inputCls} placeholder="Describe the problem or maintenance task" /></div>
            <div><label className={labelCls}>Reported Date</label><input type="date" value={form.reportedDate} onChange={e=>setForm(p=>({...p,reportedDate:e.target.value}))} className={`${inputCls} cursor-pointer`} /></div>
            <div><label className={labelCls}>Status</label><select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as MEntry["status"]}))} className={`${inputCls} cursor-pointer`}><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option></select></div>
            <div><label className={labelCls}>Technician / Vendor</label><input type="text" value={form.technician} onChange={e=>setForm(p=>({...p,technician:e.target.value}))} className={inputCls} placeholder="Who is handling it" /></div>
            <div><label className={labelCls}>Repair Cost ($)</label><input type="number" min="0" step="0.01" value={form.cost||""} onChange={e=>setForm(p=>({...p,cost:parseFloat(e.target.value)||0}))} className={inputCls} placeholder="0.00" /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Notes</label><input type="text" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} className={inputCls} placeholder="Parts needed, follow-up actions, warranty info…" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={add} className="gold-gradient-bg text-black font-bold px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer">Save Entry</button>
            <button onClick={() => setAdding(false)} className="px-6 py-2.5 border border-[var(--mc-border)] text-[#555] text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 luxury-card"><Wrench size={40} className="text-[#333] mx-auto mb-3" /><p className="text-[#555] text-sm">No entries</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(e => (
            <div key={e.id} className={`luxury-card border-l-4 ${STATUS_BORDER[e.status] ?? "border-l-[var(--mc-border)]"} p-5`}>
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-white font-semibold text-sm">{e.equipment}</p>
                    <span className={`text-[10px] px-2 py-0.5 border uppercase tracking-wider font-semibold ${STATUS_STYLE[e.status]}`}>{e.status}</span>
                    {e.cost > 0 && <span className="text-[var(--mc-accent)] text-xs font-semibold">${e.cost.toFixed(2)}</span>}
                  </div>
                  <p className="text-[var(--mc-muted)] text-sm">{e.issue}</p>
                  {e.technician && <p className="text-[#555] text-xs mt-1">Technician: {e.technician}</p>}
                  {e.notes && <p className="text-[#444] text-xs mt-1">{e.notes}</p>}
                  <p className="text-[#444] text-xs mt-2">Reported: {e.reportedDate}{e.resolvedDate ? ` · Resolved: ${e.resolvedDate}` : ""}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {e.status !== "resolved" && (
                    <button onClick={() => updateStatus(e.id, e.status === "pending" ? "in-progress" : "resolved")}
                      className="px-3 py-1.5 border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] text-xs uppercase tracking-wider hover:bg-[var(--mc-accent)]/10 transition-colors cursor-pointer whitespace-nowrap">
                      {e.status === "pending" ? "→ In Progress" : "→ Resolved"}
                    </button>
                  )}
                  <button onClick={() => remove(e.id)} className="text-[#555] hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Supply Orders Panel ─────────────────────────────────────────────────────────
function SupplyOrdersPanel() {
  type SupplyItem = { id: string; name: string; category: string; unit: string; currentStock: number; reorderThreshold: number; vendor: string; lastOrdered: string; status: "ok" | "low" | "ordered" | "received"; notes: string; };
  const SUPPLY_CATS = ["Hair Color", "Shampoo & Conditioner", "Styling Products", "Tools & Equipment", "Disposables", "Retail Products", "Cleaning Supplies", "Office Supplies", "Other"];
  const [items, setItems] = useState<SupplyItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("mc-supplies") || "[]"); } catch { return []; }
  });
  const [form, setForm] = useState<Omit<SupplyItem,"id"|"status">>({ name: "", category: "Hair Color", unit: "units", currentStock: 0, reorderThreshold: 5, vendor: "", lastOrdered: "", notes: "" });
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<"all"|"low"|"ordered">("all");

  const save = (list: SupplyItem[]) => { setItems(list); localStorage.setItem("mc-supplies", JSON.stringify(list)); };
  const computeStatus = (item: Omit<SupplyItem,"status">): SupplyItem["status"] => {
    if (item.currentStock <= 0) return "low";
    if (item.currentStock <= item.reorderThreshold) return "low";
    return "ok";
  };
  const add = () => {
    if (!form.name) return;
    const newItem: SupplyItem = { ...form, id: Date.now().toString(), status: computeStatus({ ...form, id: "" }) };
    save([...items, newItem]);
    setForm({ name: "", category: "Hair Color", unit: "units", currentStock: 0, reorderThreshold: 5, vendor: "", lastOrdered: "", notes: "" });
    setAdding(false);
  };
  const updateStock = (id: string, delta: number) => save(items.map(i => {
    if (i.id !== id) return i;
    const updated = { ...i, currentStock: Math.max(0, i.currentStock + delta) };
    return { ...updated, status: computeStatus(updated) };
  }));
  const markOrdered = (id: string) => save(items.map(i => i.id === id ? { ...i, status: "ordered", lastOrdered: new Date().toISOString().split("T")[0] } : i));
  const markReceived = (id: string, qty: number) => save(items.map(i => {
    if (i.id !== id) return i;
    const updated = { ...i, currentStock: i.currentStock + qty, status: computeStatus({...i, currentStock: i.currentStock + qty}) as SupplyItem["status"] };
    return updated;
  }));
  const remove = (id: string) => { if (confirm("Remove this item?")) save(items.filter(i => i.id !== id)); };

  const STATUS_STYLE: Record<string, string> = {
    ok:       "text-green-400 border-green-400/30 bg-green-400/10",
    low:      "text-red-400 border-red-400/30 bg-red-400/10",
    ordered:  "text-blue-400 border-blue-400/30 bg-blue-400/10",
    received: "text-green-400 border-green-400/30 bg-green-400/10",
  };
  const STATUS_BORDER: Record<string, string> = {
    ok: "border-l-green-400", low: "border-l-red-400", ordered: "border-l-blue-400", received: "border-l-green-400",
  };

  const lowCount = items.filter(i => i.status === "low").length;
  const orderedCount = items.filter(i => i.status === "ordered").length;
  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-white font-semibold text-lg flex items-center gap-2"><Tag size={18} className="text-[var(--mc-accent)]" /> Supply Orders</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {lowCount > 0 && <span className="text-red-400 text-xs font-semibold flex items-center gap-1"><AlertTriangle size={11} /> {lowCount} item{lowCount!==1?"s":""} low/out</span>}
            {orderedCount > 0 && <span className="text-blue-400 text-xs">{orderedCount} order{orderedCount!==1?"s":""} pending</span>}
            {lowCount === 0 && orderedCount === 0 && <span className="text-[#555] text-xs">{items.length} items tracked</span>}
          </div>
        </div>
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer transition-opacity">
          <Plus size={14} /> Add Item
        </button>
      </div>

      {/* Low stock alert banner */}
      {lowCount > 0 && (
        <div className="mb-5 p-4 border border-red-400/30 bg-red-400/5 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0" />
          <p className="text-red-400 text-sm font-semibold">{lowCount} item{lowCount!==1?"s":""} at or below reorder threshold — place orders soon</p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-6">
        {(["all","low","ordered"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest cursor-pointer transition-all ${
              filter === f ? "gold-gradient-bg text-black font-bold" : "border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)]"
            }`}>
            {f === "all" ? `All (${items.length})` : f === "low" ? `Low Stock (${lowCount})` : `Ordered (${orderedCount})`}
          </button>
        ))}
      </div>

      {adding && (
        <div className="luxury-card p-6 mb-6 border border-[var(--mc-accent)]/20">
          <p className="text-white font-semibold mb-4">Add Supply Item</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className={labelCls}>Item Name</label><input type="text" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className={inputCls} placeholder="e.g. Wella Koleston 7/0" /></div>
            <div><label className={labelCls}>Category</label><select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className={`${inputCls} cursor-pointer`}>{SUPPLY_CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={labelCls}>Unit</label><input type="text" value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))} className={inputCls} placeholder="bottles, boxes, tubes…" /></div>
            <div><label className={labelCls}>Current Stock</label><input type="number" min="0" value={form.currentStock} onChange={e=>setForm(p=>({...p,currentStock:parseInt(e.target.value)||0}))} className={inputCls} /></div>
            <div><label className={labelCls}>Reorder When Below</label><input type="number" min="0" value={form.reorderThreshold} onChange={e=>setForm(p=>({...p,reorderThreshold:parseInt(e.target.value)||0}))} className={inputCls} /></div>
            <div><label className={labelCls}>Vendor</label><input type="text" value={form.vendor} onChange={e=>setForm(p=>({...p,vendor:e.target.value}))} className={inputCls} placeholder="Supplier name" /></div>
            <div className="sm:col-span-2"><label className={labelCls}>Notes</label><input type="text" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} className={inputCls} placeholder="SKU, size, color formula notes…" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={add} className="gold-gradient-bg text-black font-bold px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer">Add Item</button>
            <button onClick={() => setAdding(false)} className="px-6 py-2.5 border border-[var(--mc-border)] text-[#555] text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 luxury-card"><Tag size={40} className="text-[#333] mx-auto mb-3" /><p className="text-[#555] text-sm">{filter === "low" ? "No low-stock items" : filter === "ordered" ? "No pending orders" : "No supply items added yet"}</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className={`luxury-card border-l-4 ${STATUS_BORDER[item.status]} p-5`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-white font-semibold text-sm">{item.name}</p>
                    <span className={`text-[10px] px-2 py-0.5 border uppercase tracking-wider font-semibold ${STATUS_STYLE[item.status]}`}>{item.status.toUpperCase()}</span>
                    <span className="text-[10px] border border-[var(--mc-border)] text-[#555] px-2 py-0.5">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateStock(item.id, -1)} className="w-7 h-7 border border-[var(--mc-border)] text-[#555] flex items-center justify-center hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] cursor-pointer transition-all"><Minus size={11} /></button>
                      <span className={`text-lg font-bold w-12 text-center ${item.currentStock <= item.reorderThreshold ? "text-red-400" : "text-white"}`}>{item.currentStock}</span>
                      <button onClick={() => updateStock(item.id, 1)} className="w-7 h-7 border border-[var(--mc-border)] text-[#555] flex items-center justify-center hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] cursor-pointer transition-all"><Plus size={11} /></button>
                      <span className="text-[#555] text-xs">{item.unit}</span>
                    </div>
                    <span className="text-[#555] text-xs">Reorder at: {item.reorderThreshold}</span>
                    {item.vendor && <span className="text-[#555] text-xs">Vendor: {item.vendor}</span>}
                    {item.lastOrdered && <span className="text-[#555] text-xs">Last ordered: {item.lastOrdered}</span>}
                  </div>
                  {item.notes && <p className="text-[#444] text-xs mt-1">{item.notes}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "low" && (
                    <button onClick={() => markOrdered(item.id)} className="px-3 py-1.5 border border-blue-400/30 text-blue-400 text-xs uppercase tracking-wider hover:bg-blue-400/10 transition-colors cursor-pointer whitespace-nowrap">
                      Mark Ordered
                    </button>
                  )}
                  {item.status === "ordered" && (
                    <button onClick={() => { const qty = parseInt(prompt("How many units received?") || "0"); if (qty > 0) markReceived(item.id, qty); }}
                      className="px-3 py-1.5 border border-green-400/30 text-green-400 text-xs uppercase tracking-wider hover:bg-green-400/10 transition-colors cursor-pointer whitespace-nowrap">
                      Mark Received
                    </button>
                  )}
                  <button onClick={() => remove(item.id)} className="text-[#555] hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  // ── Existing state ──────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("reservations");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "no_show">("all");
  const [emailStatus, setEmailStatus] = useState<Record<string, string>>({});
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent?: number; failed?: number; error?: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // ── Staff state ─────────────────────────────────────────────────────────────
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState<Partial<StaffMember>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [savingStaff, setSavingStaff] = useState(false);
  const [staffSaved, setStaffSaved] = useState(false);
  const editPanelRef = useRef<HTMLDivElement>(null);

  // ── Settings state ──────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [payrollTab,   setPayrollTab]   = useState<"staff" | "schedule" | "payroll">("staff");
  const [opsTab,       setOpsTab]       = useState<"bills" | "services" | "inventory" | "vendors" | "tasks" | "expenses" | "maintenance" | "orders">("bills");
  const [settingsTab,  setSettingsTab]  = useState<"business" | "hours" | "hero" | "theme" | "pages" | "users">("business");
  const [marketingTab, setMarketingTab] = useState<"newsletter" | "messages" | "automation" | "promos">("newsletter");
  const [reportsTab,   setReportsTab]   = useState<"analytics">("analytics");
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"today" | "week" | "month" | "year">("month");

  // ── Automation toggle state ──────────────────────────────────────────────────
  const [automation, setAutomation] = useState({ appointmentReminder: false, reEngagement: false, birthdayOffer: false });
  const [savingAutomation, setSavingAutomation] = useState(false);

  // ── Rewards state ────────────────────────────────────────────────────────────
  const [rewardsData,    setRewardsData]    = useState<RewardCustomer[]>([]);
  const [adjustTarget,   setAdjustTarget]   = useState<string | null>(null);
  const [adjustAmount,   setAdjustAmount]   = useState("");
  const [adjustMode,     setAdjustMode]     = useState<"add" | "subtract">("add");
  const [adjustReason,   setAdjustReason]   = useState("");
  const [adjusting,      setAdjusting]      = useState(false);
  const [adjustSuccess,  setAdjustSuccess]  = useState<string | null>(null);

  // ── Users/admin state ────────────────────────────────────────────────────────
  const [adminUsers,       setAdminUsers]       = useState<AdminUser[]>([]);
  const [adminGrantEmail,  setAdminGrantEmail]  = useState("");
  const [adminGrantLoading, setAdminGrantLoading] = useState(false);
  const [usersLoading,     setUsersLoading]     = useState(false);

  // ── Lite mode ────────────────────────────────────────────────────────────────
  const [liteMode, setLiteMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("mc-admin-lite");
    return saved === "false" ? false : true; // default always true unless explicitly set false
  });
  const toggleLiteMode = (val: boolean) => {
    setLiteMode(val);
    localStorage.setItem("mc-admin-lite", String(val));
  };

  // ── Clients search ──────────────────────────────────────────────────────────
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientEmail, setSelectedClientEmail] = useState<string | null>(null);

  // ── Admin theme ──────────────────────────────────────────────────────────────
  const [adminDark, setAdminDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("mc-admin-dark") === "true";
  });
  const toggleAdminDark = (val: boolean) => {
    setAdminDark(val);
    localStorage.setItem("mc-admin-dark", String(val));
  };

  // ── Reservations view/edit state ─────────────────────────────────────────────
  const [viewMode,       setViewMode]       = useState<"list" | "weekly" | "daily" | "monthly">("daily");
  const [weekOffset,     setWeekOffset]     = useState(0);
  const [dailyDate,      setDailyDate]      = useState<string>(new Date().toISOString().split("T")[0]);
  const [editBookingId,  setEditBookingId]  = useState<string | null>(null);
  const [editForm,       setEditForm]       = useState<Partial<Booking>>({});
  const [editLoading,    setEditLoading]    = useState(false);

  // ── Create booking state (admin walk-in / phone) ─────────────────────────────
  const [createBookingOpen, setCreateBookingOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", phone: "", service: "", stylist: "", date: new Date().toISOString().split("T")[0], time: "", notes: "" });
  const [createLoading, setCreateLoading] = useState(false);

  // ── Fetch functions ─────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch { /* non-fatal */ }
    finally { setLoading(false); }
  }, []);
  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch { /* non-fatal */ }
  }, []);
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch { /* non-fatal */ }
  }, []);
  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch { /* non-fatal */ }
  }, []);
  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    const DEFAULT_THEME = { accent: "#C9A84C", accent2: "#FFD700", bg: "#000000", surface: "#0f0f0f", border: "#2a2a2a", text: "#f5f0e8", muted: "#a89070" };
    const merged = { ...data, theme: { ...DEFAULT_THEME, ...(data.theme ?? {}) } };
    setSettings(merged); setSettingsForm(merged);
  }, []);

  const fetchRewards = useCallback(async () => {
    try { const res = await fetch("/api/rewards"); setRewardsData(await res.json()); }
    catch { /* non-fatal */ }
  }, []);

  const fetchAdminUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) { const data = await res.json(); setAdminUsers(data.users); }
    } finally { setUsersLoading(false); }
  }, []);

  const fetchAutomation = useCallback(async () => {
    try {
      const res = await fetch("/api/marketing/automation");
      if (res.ok) { setAutomation(await res.json()); }
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => {
    fetchBookings(); fetchSubscribers(); fetchMessages(); fetchStaff(); fetchSettings(); fetchRewards(); fetchAdminUsers(); fetchAutomation();
  }, [fetchBookings, fetchSubscribers, fetchMessages, fetchStaff, fetchSettings, fetchRewards, fetchAdminUsers, fetchAutomation]);

  // ── Booking handlers ────────────────────────────────────────────────────────
  const [noshowLoading, setNoshowLoading] = useState<Record<string, boolean>>({});
  const [noshowResult,  setNoshowResult]  = useState<Record<string, "charged" | "error">>({});

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setEmailStatus(p => ({ ...p, [id]: status === "confirmed" ? "sent" : status === "cancelled" ? "cancelled" : p[id] }));
    fetchBookings();
  };
  const resendConfirmationEmail = async (bookingId: string) => {
    setEmailStatus(p => ({ ...p, [bookingId]: "sending" }));
    try {
      const res = await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "confirm_booking", bookingId }) });
      const data = await res.json();
      setEmailStatus(p => ({ ...p, [bookingId]: data.success ? "sent" : "failed" }));
    } catch { setEmailStatus(p => ({ ...p, [bookingId]: "failed" })); }
  };

  const startEditBooking = (booking: Booking) => {
    setEditBookingId(booking.id);
    setEditForm({
      service: booking.service,
      stylist:  booking.stylist,
      date:     booking.date,
      time:     booking.time,
      status:   booking.status,
      notes:    booking.notes ?? "",
    });
  };

  const saveEditedBooking = async () => {
    if (!editBookingId) return;
    setEditLoading(true);
    await fetch("/api/bookings", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: editBookingId, ...editForm }),
    });
    setEditLoading(false);
    setEditBookingId(null);
    fetchBookings();
  };
  const chargeNoShow = async (id: string) => {
    if (!confirm("Charge the 30% cancellation fee to the card on file?")) return;
    setNoshowLoading(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch("/api/stripe/charge-noshow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setNoshowResult(p => ({ ...p, [id]: "charged" }));
        fetchBookings();
      } else {
        alert(data.error ?? "Charge failed");
        setNoshowResult(p => ({ ...p, [id]: "error" }));
      }
    } catch { setNoshowResult(p => ({ ...p, [id]: "error" })); }
    finally   { setNoshowLoading(p => ({ ...p, [id]: false })); }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await fetch("/api/bookings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchBookings();
  };

  // ── Rewards handlers ─────────────────────────────────────────────────────────
  const applyPointAdjustment = async (customerId: string) => {
    const amount = parseInt(adjustAmount, 10);
    if (!amount || isNaN(amount)) return;
    const delta = adjustMode === "add" ? amount : -amount;
    setAdjusting(true);
    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, delta, reason: adjustReason }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdjustSuccess(`Points updated — new balance: ${data.points.toLocaleString()} (${data.tier})`);
        setAdjustTarget(null);
        setAdjustAmount("");
        setAdjustReason("");
        fetchRewards();
        setTimeout(() => setAdjustSuccess(null), 4000);
      }
    } finally { setAdjusting(false); }
  };

  // ── Message handlers ────────────────────────────────────────────────────────
  const markMessageRead = async (id: string) => {
    await fetch("/api/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchMessages();
  };
  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/contact", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchMessages();
  };

  // ── Newsletter handlers ─────────────────────────────────────────────────────
  const addManualSubscriber = async () => {
    if (!newEmail) return;
    setAddingSubscriber(true);
    await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "subscribe", email: newEmail, name: newName }) });
    setNewEmail(""); setNewName(""); setAddingSubscriber(false); fetchSubscribers();
  };
  const removeSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    await fetch("/api/newsletter", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchSubscribers();
  };
  const sendNewsletter = async () => {
    if (!newsletter.subject || !newsletter.message) return;
    setSending(true); setSendResult(null);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "send", ...newsletter }) });
      setSendResult(await res.json());
    } catch { setSendResult({ error: "Failed to send" }); }
    setSending(false);
  };

  // ── Staff handlers ──────────────────────────────────────────────────────────
  const startEditStaff = (member: StaffMember) => {
    setEditingStaff(member.id);
    setStaffForm({ ...member });
    setTimeout(() => editPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handlePhotoUpload = async (staffId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(staffId);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "staff");
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      await fetch("/api/staff", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: staffId, image: data.url }) });
      if (editingStaff === staffId) setStaffForm(f => ({ ...f, image: data.url }));
      fetchStaff();
    }
    setUploadingPhoto(null);
    e.target.value = "";
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingPortfolio(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "portfolio");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        const type = file.type.startsWith("video") ? "video" as const : "image" as const;
        setStaffForm(f => ({ ...f, portfolio: [...(f.portfolio || []), { src: data.url, type }] }));
      }
    }
    setUploadingPortfolio(false);
    e.target.value = "";
  };

  const removePortfolioItem = (index: number) => {
    setStaffForm(f => ({ ...f, portfolio: (f.portfolio || []).filter((_, i) => i !== index) }));
  };

  const saveStaffEdits = async () => {
    if (!editingStaff || !staffForm) return;
    setSavingStaff(true);
    await fetch("/api/staff", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingStaff, ...staffForm }) });
    setSavingStaff(false); setStaffSaved(true);
    setTimeout(() => setStaffSaved(false), 3000);
    fetchStaff();
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Remove this team member permanently?")) return;
    await fetch("/api/staff", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (editingStaff === id) { setEditingStaff(null); setStaffForm({}); }
    fetchStaff();
  };

  const createNewStaff = async () => {
    const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "New Team Member", role: "Stylist", bio: "", specialties: [], image: "", portfolio: [] }) });
    const created = await res.json();
    fetchStaff();
    startEditStaff(created);
  };

  // ── Admin users handlers ─────────────────────────────────────────────────────
  const handleAdminToggle = async (email: string, action: "grant" | "revoke") => {
    await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, action }) });
    fetchAdminUsers();
  };
  const handleAdminGrant = async (email: string) => {
    if (!email) return;
    setAdminGrantLoading(true);
    await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, action: "grant" }) });
    setAdminGrantEmail("");
    setAdminGrantLoading(false);
    fetchAdminUsers();
  };

  // ── Settings handlers ───────────────────────────────────────────────────────
  const saveSettings = async () => {
    if (!settingsForm) return;
    setSavingSettings(true);
    const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settingsForm) });
    const data = await res.json();
    setSettings(data); setSettingsForm(data);
    setSavingSettings(false); setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // ── Automation handlers ─────────────────────────────────────────────────────
  const toggleAutomation = async (key: keyof typeof automation) => {
    const updated = { ...automation, [key]: !automation[key] };
    setAutomation(updated);
    setSavingAutomation(true);
    try {
      await fetch("/api/marketing/automation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    } catch { /* non-fatal */ }
    setSavingAutomation(false);
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filtered         = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const pending          = bookings.filter(b => b.status === "pending").length;
  const confirmed        = bookings.filter(b => b.status === "confirmed").length;
  const uniqueClients    = [...new Map(bookings.map(b => [b.email, b])).values()];
  const activeSubscribers = subscribers.filter(s => s.active).length;
  const unreadMessages   = messages.filter(m => !m.read).length;

  const clientMap: Record<string, Booking[]> = {};
  bookings.forEach(b => { if (!clientMap[b.email]) clientMap[b.email] = []; clientMap[b.email].push(b); });

  const serviceCount: Record<string, number> = {};
  bookings.forEach(b => { const s = b.service.split("–")[1]?.trim() || b.service; serviceCount[s] = (serviceCount[s] || 0) + 1; });
  const topServices = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const stylistCount: Record<string, number> = {};
  bookings.forEach(b => { if (b.stylist) stylistCount[b.stylist] = (stylistCount[b.stylist] || 0) + 1; });

  // ── Analytics period helpers ─────────────────────────────────────────────────
  const getPeriodBookings = () => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    return bookings.filter(b => {
      if (analyticsPeriod === "today") return b.date === todayStr;
      if (analyticsPeriod === "week") {
        const d = new Date(b.date + "T00:00:00");
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 6); weekAgo.setHours(0,0,0,0);
        return d >= weekAgo;
      }
      if (analyticsPeriod === "month") {
        return b.date.startsWith(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`);
      }
      if (analyticsPeriod === "year") {
        return b.date.startsWith(`${now.getFullYear()}`);
      }
      return true;
    });
  };
  const periodBookings = getPeriodBookings();
  const periodRevenue = periodBookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + (b.servicePrice ?? 0), 0);
  const periodNoShows = periodBookings.filter(b => b.status === "no_show").length;
  const periodNoShowRate = periodBookings.length > 0 ? Math.round((periodNoShows / periodBookings.length) * 100) : 0;
  const periodConfirmed = periodBookings.filter(b => b.status === "confirmed").length;

  // Retention: clients with 2+ bookings in all time / total unique clients
  const retentionEmailsWithMultiple = Object.values(clientMap).filter(visits => visits.length >= 2).length;
  const retentionRate = uniqueClients.length > 0 ? Math.round((retentionEmailsWithMultiple / uniqueClients.length) * 100) : 0;

  // Per-stylist for the period
  const periodStylistMap: Record<string, { count: number; revenue: number }> = {};
  periodBookings.forEach(b => {
    const s = b.stylist || "Unassigned";
    if (!periodStylistMap[s]) periodStylistMap[s] = { count: 0, revenue: 0 };
    periodStylistMap[s].count++;
    if (b.status === "confirmed") periodStylistMap[s].revenue += (b.servicePrice ?? 0);
  });
  const periodTopServices: Record<string, number> = {};
  periodBookings.forEach(b => { const s = b.service.split("–")[1]?.trim() || b.service; periodTopServices[s] = (periodTopServices[s] || 0) + 1; });
  const periodTopServicesSorted = Object.entries(periodTopServices).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Re-engagement: clients whose last booking was 60+ days ago
  const sixtyDaysAgo = new Date(); sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const reEngagementCount = Object.values(clientMap).filter(visits => {
    const last = visits.map(v => new Date(v.date + "T00:00:00")).sort((a, b) => b.getTime() - a.getTime())[0];
    return last && last < sixtyDaysAgo;
  }).length;

  const exportCSV = () => {
    const rows = [
      ["ID", "Client", "Email", "Service", "Stylist", "Date", "Time", "Price", "Status"],
      ...periodBookings.map(b => [
        b.id, b.name, b.email, b.service, b.stylist, b.date, b.time,
        b.servicePrice != null ? `$${b.servicePrice}` : "",
        b.status,
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `mc-salon-bookings-${analyticsPeriod}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "reservations", label: "Reservations", icon: <Calendar size={15} /> },
    { id: "clients",      label: "Clients",      icon: <Users size={15} /> },
    { id: "rewards",      label: "Rewards",      icon: <Gift size={15} /> },
    { id: "payroll",      label: "Payroll & Staff", icon: <UserCheck size={15} /> },
    { id: "operations",   label: "Operations",   icon: <Wrench size={15} /> },
    { id: "gift-cards",   label: "Gift Cards",   icon: <Gift size={15} /> },
    { id: "marketing",    label: "Marketing",    icon: <Mail size={15} />, badge: unreadMessages },
    { id: "vibe",         label: "Vibe",         icon: <Zap size={15} /> },
    { id: "reports",      label: "Reports",      icon: <BarChart2 size={15} /> },
    { id: "settings",     label: "Settings",     icon: <Settings size={15} /> },
  ];

  // ── Shared booking form constants ────────────────────────────────────────────
  const SERVICES_LIST = [
    "Women's Haircut","Men's Haircut","Kids' Haircut","Curly Cut",
    "Blowout / Blow Dry","Updo & Special Event Styling",
    "Balayage","Highlights","Baby Lights","Hair Color","Color Correction",
    "Keratin Treatment","Hair Botox Treatment","Relaxer",
    "Bridal Makeup","Makeup Application","Eyebrow & Lip Wax",
    "Other (specify in notes)",
  ];
  const STYLISTS_LIST_ALL = ["Maria","Meagan","Sally","Kato","Juany","Dhariana"];
  const TIME_SLOTS_LIST = [
    "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
    "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
    "6:00 PM","6:30 PM","7:00 PM",
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${adminDark ? "admin-dark" : "admin-light"}`}>
      {/* Top bar — single non-wrapping row on all screen sizes */}
      <div className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)]">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 min-w-0">
          <h1 className="font-serif text-sm font-bold gold-gradient shrink-0">MC Admin</h1>
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-none min-w-0">
            {[
              { icon: <Calendar size={12} />, label: "Bookings", value: bookings.length },
              { icon: <Clock size={12} />,    label: "Pending",  value: pending },
              { icon: <MessageSquare size={12} />, label: "Msgs", value: unreadMessages },
              { icon: <Bell size={12} />,     label: "Subs",     value: activeSubscribers },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1 border border-[var(--admin-border)] px-2 py-1 shrink-0">
                <span className="text-[var(--mc-accent)]">{s.icon}</span>
                <span className="text-[var(--admin-text)] text-xs font-bold">{s.value}</span>
                <span className="text-[var(--admin-muted)] text-[10px] uppercase tracking-wider hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
          {/* Light/Dark toggle */}
          <button onClick={() => toggleAdminDark(!adminDark)}
            title={adminDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="shrink-0 w-8 h-8 flex items-center justify-center border border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
            {adminDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={() => toggleLiteMode(!liteMode)}
            title={liteMode ? "Switch to Full Admin" : "Switch to Lite Mode"}
            className="shrink-0 px-2 h-8 flex items-center gap-1 border border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer text-[10px] uppercase tracking-wider whitespace-nowrap">
            {liteMode ? <><LayoutGrid size={12} /> Full</> : <><ToggleLeft size={12} /> Lite</>}
          </button>
          <button onClick={() => { fetchBookings(); fetchSubscribers(); fetchMessages(); fetchStaff(); fetchSettings(); fetchRewards(); fetchAdminUsers(); fetchAutomation(); }}
            className="shrink-0 w-8 h-8 flex items-center justify-center border border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer"
            title="Refresh">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* ── LITE MODE ─────────────────────────────────────────────────────── */}
      {liteMode && (
        <LiteModeView
          bookings={bookings}
          loading={loading}
          pending={pending}
          updateStatus={updateStatus}
          resendEmail={resendConfirmationEmail}
          chargeNoShow={chargeNoShow}
          startEdit={startEditBooking}
          deleteBooking={deleteBooking}
          noshowLoading={noshowLoading}
          noshowResult={noshowResult}
          emailStatus={emailStatus}
          openCreate={() => setCreateBookingOpen(true)}
          uniqueClients={uniqueClients}
          clientMap={clientMap}
          onFullMode={() => toggleLiteMode(false)}
        />
      )}

      {/* ── FULL ADMIN ────────────────────────────────────────────────────── */}
      {!liteMode && <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5">
        {/* Tabs — scrollable on narrow screens */}
        <div className="flex mb-6 border-b border-[var(--mc-border)] overflow-x-auto scrollbar-none">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" : "border-transparent text-[#555] hover:text-[var(--mc-muted)]"
              }`}>
              {t.icon} {t.label}
              {t.badge && t.badge > 0 ? (
                <span className="bg-[var(--mc-accent)] text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shrink-0">{t.badge}</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── RESERVATIONS ─────────────────────────────────────────────────── */}
        {tab === "reservations" && (
          <div>
            {/* Toolbar: filters (scrollable) + view toggle */}
            <div className="flex items-center gap-2 mb-4 min-w-0">
              {/* Status filters — horizontal scroll on mobile */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1 min-w-0">
                {(["all", "pending", "confirmed", "cancelled", "no_show"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`shrink-0 px-3 py-1.5 text-[10px] uppercase tracking-widest cursor-pointer transition-all whitespace-nowrap ${
                      filter === f ? "gold-gradient-bg text-black font-bold" : "border border-[var(--mc-border)] text-[var(--mc-text-dim)] hover:border-[var(--mc-accent)]"
                    }`}>
                    {f} ({f === "all" ? bookings.length : bookings.filter(b => b.status === f).length})
                  </button>
                ))}
              </div>
              {/* View toggle — labeled buttons */}
              <div className="flex gap-1 shrink-0">
                {([
                  { id: "daily",   label: "Daily" },
                  { id: "weekly",  label: "Weekly" },
                  { id: "monthly", label: "Monthly" },
                  { id: "list",    label: "List" },
                ] as const).map(v => (
                  <button key={v.id} onClick={() => setViewMode(v.id)}
                    className={`px-3 h-8 text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-all whitespace-nowrap ${
                      viewMode === v.id ? "gold-gradient-bg text-black" : "border border-[var(--admin-border)] text-[var(--admin-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
                    }`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="text-center py-20 text-[#555]">Loading...</div>
            ) : viewMode === "weekly" ? (
              (() => {
                const today = new Date();
                const monday = new Date(today);
                monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);
                const weekDays = Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(monday);
                  d.setDate(monday.getDate() + i);
                  return d;
                });
                const weekStart = weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const weekEnd   = weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <div>
                    {/* Week navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button onClick={() => setWeekOffset(o => o - 1)} className="flex items-center gap-1 border border-[var(--mc-border)] text-[#555] px-3 py-1.5 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                        <ChevronLeft size={12} /> Prev
                      </button>
                      <div className="text-center">
                        <p className="text-white text-sm font-semibold">{weekStart} – {weekEnd}</p>
                        <button onClick={() => setWeekOffset(0)} className="text-[#444] text-xs hover:text-[var(--mc-accent)] transition-colors cursor-pointer">Today</button>
                      </div>
                      <button onClick={() => setWeekOffset(o => o + 1)} className="flex items-center gap-1 border border-[var(--mc-border)] text-[#555] px-3 py-1.5 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                        Next <ChevronRight size={12} />
                      </button>
                    </div>
                    {/* 7-day grid */}
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-7 gap-2 min-w-[700px]">
                        {weekDays.map(day => {
                          const iso = day.toISOString().split("T")[0];
                          const isToday = iso === new Date().toISOString().split("T")[0];
                          const dayBookings = bookings
                            .filter(b => b.date === iso)
                            .filter(b => filter === "all" || b.status === filter)
                            .sort((a, b) => a.time.localeCompare(b.time));
                          return (
                            <div key={iso} className={`border ${isToday ? "border-[var(--mc-accent)]/40" : "border-[#1a1a1a]"} bg-[#080808] min-h-[180px]`}>
                              <div className={`px-2 py-1.5 border-b ${isToday ? "border-[var(--mc-accent)]/40 bg-[#0a0800]" : "border-[#1a1a1a]"}`}>
                                <p className={`text-xs font-bold uppercase tracking-widest ${isToday ? "text-[var(--mc-accent)]" : "text-[#555]"}`}>
                                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                                </p>
                                <p className={`text-sm font-semibold ${isToday ? "text-white" : "text-[#444]"}`}>
                                  {day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </p>
                              </div>
                              <div className="p-1.5 space-y-1.5">
                                {dayBookings.length === 0 ? (
                                  <p className="text-[#2a2a2a] text-[10px] text-center py-2">—</p>
                                ) : dayBookings.map(b => (
                                  <button key={b.id} onClick={() => startEditBooking(b)}
                                    className={`w-full text-left p-1.5 border cursor-pointer transition-all hover:opacity-80 ${statusColors[b.status]}`}>
                                    <p className="text-[10px] font-bold">{b.time}</p>
                                    <p className="text-[10px] truncate font-semibold">{b.name.split(" ")[0]}</p>
                                    <p className="text-[10px] truncate opacity-70">{b.service.split("(")[0].split("–")[0].trim()}</p>
                                    {b.stylist && <p className="text-[10px] opacity-60">{b.stylist}</p>}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-[#444] text-xs mt-3 text-center">Click any reservation to edit</p>
                  </div>
                );
              })()
            ) : viewMode === "daily" ? (() => {
              const STYLIST_COLS = [...STYLISTS_LIST_ALL, "Unassigned"];
              const dayBookings = bookings
                .filter(b => b.date === dailyDate)
                .filter(b => filter === "all" || b.status === filter);
              const isToday = dailyDate === new Date().toISOString().split("T")[0];
              const dateObj = new Date(dailyDate + "T12:00:00");
              const dateLabel = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
              const prevDay = () => { const d = new Date(dailyDate + "T12:00:00"); d.setDate(d.getDate() - 1); setDailyDate(d.toISOString().split("T")[0]); };
              const nextDay = () => { const d = new Date(dailyDate + "T12:00:00"); d.setDate(d.getDate() + 1); setDailyDate(d.toISOString().split("T")[0]); };
              const openCreate = (time: string, stylist: string) => {
                setCreateForm(f => ({ ...f, date: dailyDate, time, stylist }));
                setCreateBookingOpen(true);
              };
              return (
                <div>
                  {/* Day nav — single compact row on all screen sizes */}
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={prevDay}
                      className="w-8 h-8 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer shrink-0">
                      <ChevronLeft size={14} />
                    </button>
                    <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
                      <p className={`text-xs font-semibold truncate ${isToday ? "text-[var(--mc-accent)]" : "text-white"}`}>{dateLabel}</p>
                      <button onClick={() => setDailyDate(new Date().toISOString().split("T")[0])}
                        className="shrink-0 text-[#444] text-[10px] uppercase tracking-wider hover:text-[var(--mc-accent)] transition-colors cursor-pointer hidden sm:block">
                        Today
                      </button>
                      <input type="date" value={dailyDate} onChange={e => setDailyDate(e.target.value)}
                        className="shrink-0 bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white text-[10px] px-1.5 py-1 focus:outline-none focus:border-[var(--mc-accent)] cursor-pointer w-[110px]"
                        style={{ colorScheme: "dark" }} />
                    </div>
                    <button onClick={nextDay}
                      className="w-8 h-8 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer shrink-0">
                      <ChevronRight size={14} />
                    </button>
                    <button onClick={() => { setCreateForm(f => ({ ...f, date: dailyDate, time: "", stylist: "" })); setCreateBookingOpen(true); }}
                      className="shrink-0 flex items-center gap-1 gold-gradient-bg text-black text-[10px] font-bold px-2.5 py-1.5 uppercase tracking-wider cursor-pointer hover:opacity-90 transition-opacity">
                      <Plus size={11} /> <span className="hidden sm:inline">New </span>Booking
                    </button>
                  </div>

                  {/* DaySmart-style grid */}
                  <div className="overflow-x-auto border border-[#1a1a1a]">
                    <div style={{ minWidth: `${80 + STYLIST_COLS.length * 130}px` }}>
                      {/* Header */}
                      <div className="grid border-b border-[#1a1a1a] bg-[#080808]" style={{ gridTemplateColumns: `80px repeat(${STYLIST_COLS.length}, 1fr)` }}>
                        <div className="border-r border-[#1a1a1a] py-2.5" />
                        {STYLIST_COLS.map(col => {
                          const colCount = dayBookings.filter(b => col === "Unassigned" ? !b.stylist : b.stylist === col).length;
                          return (
                            <div key={col} className="border-r border-[#1a1a1a] py-2.5 px-2 text-center last:border-r-0">
                              <p className={`text-xs font-bold uppercase tracking-widest ${col === "Unassigned" ? "text-[#333]" : "text-[var(--mc-accent)]"}`}>{col}</p>
                              {colCount > 0 && <p className="text-[10px] text-[#555] mt-0.5">{colCount} appt{colCount !== 1 ? "s" : ""}</p>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Time rows */}
                      {TIME_SLOTS_LIST.map((slot, si) => (
                        <div key={slot} className={`grid border-b ${si % 2 === 0 ? "border-[#181818]" : "border-[#111]"}`} style={{ gridTemplateColumns: `80px repeat(${STYLIST_COLS.length}, 1fr)` }}>
                          <div className="border-r border-[#1a1a1a] px-2 py-2 flex items-center">
                            <span className={`text-[10px] whitespace-nowrap ${slot.endsWith("00 AM") || slot.endsWith("00 PM") ? "text-[#555] font-semibold" : "text-[#2a2a2a]"}`}>{slot}</span>
                          </div>
                          {STYLIST_COLS.map(col => {
                            const cellBookings = dayBookings.filter(b =>
                              b.time === slot && (col === "Unassigned" ? !b.stylist : b.stylist === col)
                            );
                            return (
                              <div key={col}
                                className="border-r border-[#111] min-h-[48px] p-1 last:border-r-0 cursor-pointer hover:bg-[var(--mc-accent)]/[0.03] transition-colors group"
                                onClick={() => { if (!cellBookings.length) openCreate(slot, col === "Unassigned" ? "" : col); }}
                              >
                                {cellBookings.length === 0 && (
                                  <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={10} className="text-[var(--mc-accent)]/40" />
                                  </div>
                                )}
                                {cellBookings.map(b => (
                                  <button key={b.id}
                                    onClick={e => { e.stopPropagation(); startEditBooking(b); }}
                                    className={`w-full text-left px-2 py-1.5 border cursor-pointer hover:opacity-80 transition-opacity mb-0.5 ${statusColors[b.status]}`}>
                                    <p className="text-[10px] font-bold truncate">{b.name.split(" ")[0]}</p>
                                    <p className="text-[10px] opacity-70 truncate">{b.service.split("(")[0].split("–")[0].trim()}</p>
                                  </button>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[#333] text-[10px] mt-2 text-center">Click any empty cell to create a booking · Click a booking chip to edit</p>
                </div>
              );
            })()
            : filtered.length === 0 ? (
              <div className="text-center py-20 luxury-card"><Calendar size={48} className="text-[#333] mx-auto mb-4" /><p className="text-[#555]">No bookings found</p></div>
            ) : (
              <div className="space-y-3">
                {filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
                  <div key={booking.id} className="luxury-card p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="text-white font-semibold">{booking.name}</p>
                          <span className={`text-xs px-2 py-0.5 border uppercase tracking-wider ${statusColors[booking.status]}`}>{booking.status}</span>
                          <span className="text-[#333] text-xs font-mono">{booking.id}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm mb-2">
                          <span className="text-[var(--mc-text-dim)] truncate">{booking.email}</span>
                          <span className="text-[var(--mc-text-dim)]">{booking.phone}</span>
                          <span className="text-[var(--mc-accent)] font-medium">{booking.date} · {booking.time}</span>
                          <span className="text-[var(--mc-muted)]">{booking.stylist || "No preference"}</span>
                        </div>
                        <p className="text-[#555] text-sm">
                          {booking.services && booking.services.length > 1
                            ? booking.services.map(s => s.name).join(" · ")
                            : booking.service}
                        </p>
                        {booking.notes && <p className="text-[var(--mc-text-dim)] text-xs mt-1 italic">"{booking.notes}"</p>}
                        {/* Card on file */}
                        {booking.stripePaymentMethodId && (
                          <div className="flex items-center gap-2 mt-2">
                            <CreditCard size={12} className={noshowResult[booking.id] === "charged" ? "text-orange-400" : "text-[#555]"} />
                            <span className="text-[10px] uppercase tracking-wider text-[#555]">
                              {booking.cardBrand ? `${booking.cardBrand.charAt(0).toUpperCase()}${booking.cardBrand.slice(1)} ` : "Card "}
                              {booking.cardLast4 ? `·· ${booking.cardLast4}` : "on file"}
                            </span>
                            {noshowResult[booking.id] === "charged" && (
                              <span className="text-[10px] text-orange-400 uppercase tracking-wider">Fee charged</span>
                            )}
                          </div>
                        )}
                        {emailStatus[booking.id] && (
                          <p className={`text-xs mt-2 ${emailStatus[booking.id] === "sent" ? "text-green-400" : emailStatus[booking.id] === "sending" ? "text-yellow-400" : "text-red-400"}`}>
                            {emailStatus[booking.id] === "sending" ? "Sending email…" : emailStatus[booking.id] === "sent" ? "✓ Confirmation sent" : "✗ Email failed"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {booking.status !== "confirmed" && (
                          <button onClick={() => updateStatus(booking.id, "confirmed")}
                            className="w-9 h-9 flex items-center justify-center border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer" title="Confirm">
                            <Check size={16} />
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button onClick={() => resendConfirmationEmail(booking.id)}
                            className="w-9 h-9 flex items-center justify-center border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/10 transition-colors cursor-pointer" title="Resend email">
                            <Send size={14} />
                          </button>
                        )}
                        {booking.status === "pending" && (
                          <button onClick={() => updateStatus(booking.id, "cancelled")}
                            className="w-9 h-9 flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                            <X size={16} />
                          </button>
                        )}
                        {/* No-show charge button — shows when card is on file and booking is not already charged */}
                        {booking.stripePaymentMethodId && booking.status !== "cancelled" && booking.status !== "no_show" && !noshowResult[booking.id] && (
                          <button
                            onClick={() => chargeNoShow(booking.id)}
                            disabled={noshowLoading[booking.id]}
                            title="Charge 30% cancellation fee"
                            className="h-9 px-3 flex items-center gap-1.5 border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                          >
                            {noshowLoading[booking.id] ? (
                              <Loader size={12} className="animate-spin" />
                            ) : (
                              <AlertTriangle size={13} />
                            )}
                            Cancel Fee
                          </button>
                        )}
                        <button onClick={() => startEditBooking(booking)} title="Edit reservation"
                          className="w-9 h-9 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteBooking(booking.id)}
                          className="w-9 h-9 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Edit booking modal */}
            {editBookingId && (() => {
              const STYLISTS_LIST = ["", ...STYLISTS_LIST_ALL];
              const booking = bookings.find(b => b.id === editBookingId);
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setEditBookingId(null)}>
                  <div className="luxury-card w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-white">Edit Reservation</h3>
                        {booking && <p className="text-[#555] text-xs mt-0.5">{booking.name} · {booking.id}</p>}
                      </div>
                      <button onClick={() => setEditBookingId(null)} className="w-8 h-8 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:text-white transition-colors cursor-pointer">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Status */}
                      <div>
                        <label className={labelCls}>Status</label>
                        <select value={editForm.status ?? ""} onChange={e => setEditForm(f => ({ ...f, status: e.target.value as Booking["status"] }))}
                          className={inputCls}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no_show">No Show</option>
                        </select>
                      </div>

                      {/* Service */}
                      <div>
                        <label className={labelCls}>Service</label>
                        <select value={editForm.service ?? ""} onChange={e => setEditForm(f => ({ ...f, service: e.target.value }))}
                          className={inputCls}>
                          {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Stylist */}
                      <div>
                        <label className={labelCls}>Stylist</label>
                        <select value={editForm.stylist ?? ""} onChange={e => setEditForm(f => ({ ...f, stylist: e.target.value }))}
                          className={inputCls}>
                          <option value="">No preference</option>
                          {STYLISTS_LIST.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className={labelCls}>Date</label>
                        <input type="date" value={editForm.date ?? ""} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))}
                          className={inputCls} style={{ colorScheme: "dark" }} />
                      </div>

                      {/* Time */}
                      <div>
                        <label className={labelCls}>Time</label>
                        <select value={editForm.time ?? ""} onChange={e => setEditForm(f => ({ ...f, time: e.target.value }))}
                          className={inputCls}>
                          {TIME_SLOTS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className={labelCls}>Notes</label>
                        <textarea value={editForm.notes ?? ""} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                          rows={2} className={`${inputCls} resize-none`} placeholder="Optional notes" />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button onClick={saveEditedBooking} disabled={editLoading}
                        className="flex-1 gold-gradient-bg text-black font-bold py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                        {editLoading ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                      </button>
                      <button onClick={() => setEditBookingId(null)}
                        className="px-5 border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Create Booking Modal ─────────────────────────────────────── */}
            {createBookingOpen && (() => {
              const submitCreate = async () => {
                if (!createForm.name || !createForm.email || !createForm.phone || !createForm.service || !createForm.date || !createForm.time) return;
                setCreateLoading(true);
                try {
                  const res = await fetch("/api/bookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(createForm),
                  });
                  if (res.ok) {
                    const created = await res.json();
                    await fetch("/api/bookings", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: created.id, status: "confirmed" }),
                    });
                    setCreateBookingOpen(false);
                    setCreateForm({ name: "", email: "", phone: "", service: "", stylist: "", date: dailyDate, time: "", notes: "" });
                    fetchBookings();
                  }
                } finally { setCreateLoading(false); }
              };
              const canSubmit = !!(createForm.name && createForm.email && createForm.phone && createForm.service && createForm.date && createForm.time);
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setCreateBookingOpen(false)}>
                  <div className="luxury-card w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-white">New Booking</h3>
                        <p className="text-[#555] text-xs mt-0.5">Walk-in or phone booking — auto-confirmed</p>
                      </div>
                      <button onClick={() => setCreateBookingOpen(false)} className="w-8 h-8 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:text-white transition-colors cursor-pointer">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Client Name</label>
                        <input type="text" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                          className={inputCls} placeholder="Full name" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Email</label>
                          <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                            className={inputCls} placeholder="email@example.com" />
                        </div>
                        <div>
                          <label className={labelCls}>Phone</label>
                          <input type="tel" value={createForm.phone} onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))}
                            className={inputCls} placeholder="(212) 555-0000" />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Service</label>
                        <select value={createForm.service} onChange={e => setCreateForm(f => ({ ...f, service: e.target.value }))} className={inputCls}>
                          <option value="">Select service…</option>
                          {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Stylist</label>
                        <select value={createForm.stylist} onChange={e => setCreateForm(f => ({ ...f, stylist: e.target.value }))} className={inputCls}>
                          <option value="">No preference</option>
                          {STYLISTS_LIST_ALL.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Date</label>
                          <input type="date" value={createForm.date} onChange={e => setCreateForm(f => ({ ...f, date: e.target.value }))}
                            className={inputCls} style={{ colorScheme: "dark" }} />
                        </div>
                        <div>
                          <label className={labelCls}>Time</label>
                          <select value={createForm.time} onChange={e => setCreateForm(f => ({ ...f, time: e.target.value }))} className={inputCls}>
                            <option value="">Select time…</option>
                            {TIME_SLOTS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Notes</label>
                        <textarea value={createForm.notes} onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))}
                          rows={2} className={`${inputCls} resize-none`} placeholder="Walk-in, phone booking, special requests…" />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button onClick={submitCreate} disabled={createLoading || !canSubmit}
                        className="flex-1 gold-gradient-bg text-black font-bold py-3 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                        {createLoading ? <><Loader size={14} className="animate-spin" /> Creating…</> : <><Plus size={14} /> Create &amp; Confirm</>}
                      </button>
                      <button onClick={() => setCreateBookingOpen(false)}
                        className="px-5 border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── GIFT CARDS ───────────────────────────────────────────────────── */}
        {tab === "gift-cards" && <GiftCardsTab />}

        {/* ── VIBE ─────────────────────────────────────────────────────────── */}
        {tab === "vibe" && <VibeTab />}

        {/* ── PAYROLL & STAFF ──────────────────────────────────────────────── */}
        {tab === "payroll" && (
          <div>
            {/* Sub-tab nav */}
            <div className="flex gap-0 mb-8 border-b border-[var(--mc-border)] overflow-x-auto scrollbar-none">
              {([
                { id: "staff",    label: "Staff Profiles" },
                { id: "schedule", label: "Schedule" },
                { id: "payroll",  label: "Payroll & Rates" },
              ] as const).map(s => (
                <button key={s.id} onClick={() => setPayrollTab(s.id)}
                  className={`px-6 py-3 text-sm uppercase tracking-widest cursor-pointer border-b-2 -mb-px transition-all whitespace-nowrap ${
                    payrollTab === s.id ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" : "border-transparent text-[#555] hover:text-[var(--mc-muted)]"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
            {payrollTab === "schedule" && <ScheduleTab />}
            {payrollTab === "payroll"  && <PayrollTab />}
          </div>
        )}

        {/* ── OPERATIONS ───────────────────────────────────────────────────── */}
        {tab === "operations" && (
          <div>
            <div className="flex gap-0 mb-8 border-b border-[var(--mc-border)] overflow-x-auto scrollbar-none">
              {([
                { id: "bills",       label: "Bills" },
                { id: "expenses",    label: "Expense Reports" },
                { id: "services",    label: "Services" },
                { id: "inventory",   label: "Inventory" },
                { id: "orders",      label: "Supply Orders" },
                { id: "vendors",     label: "Vendors" },
                { id: "maintenance", label: "Maintenance" },
                { id: "tasks",       label: "Daily Tasks" },
              ] as const).map(s => (
                <button key={s.id} onClick={() => setOpsTab(s.id)}
                  className={`px-5 py-3 text-sm uppercase tracking-widest cursor-pointer border-b-2 -mb-px transition-all whitespace-nowrap ${
                    opsTab === s.id ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" : "border-transparent text-[#555] hover:text-[var(--mc-muted)]"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
            {opsTab === "bills"       && <FinanceTab />}
            {opsTab === "expenses"    && <ExpenseReportsPanel />}
            {opsTab === "services"    && <ServicesTab />}
            {opsTab === "inventory"   && <InventoryTab />}
            {opsTab === "orders"      && <SupplyOrdersPanel />}
            {opsTab === "vendors"     && <VendorsPanel />}
            {opsTab === "maintenance" && <MaintenanceLogPanel />}
            {opsTab === "tasks"       && <DailyTasksPanel />}
          </div>
        )}

        {/* ── MARKETING (Newsletter + Messages + Automation + Promos) ─────── */}
        {tab === "marketing" && (
          <div className="space-y-4">
            {/* Sub-tab bar */}
            <div className="flex bg-[var(--mc-surface-dark)] rounded-lg p-0.5 gap-0.5 w-fit border border-[var(--mc-border)]">
              <button onClick={() => setMarketingTab("newsletter")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer ${marketingTab === "newsletter" ? "gold-gradient-bg text-black" : "text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"}`}>
                Newsletter
              </button>
              <button onClick={() => setMarketingTab("messages")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer ${marketingTab === "messages" ? "gold-gradient-bg text-black" : "text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"}`}>
                {`Messages${unreadMessages > 0 ? ` (${unreadMessages})` : ""}`}
              </button>
              <button onClick={() => setMarketingTab("automation")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer ${marketingTab === "automation" ? "gold-gradient-bg text-black" : "text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"}`}>
                Automation
              </button>
              <button onClick={() => setMarketingTab("promos")}
                className={`px-4 py-1.5 rounded text-xs font-medium transition cursor-pointer ${marketingTab === "promos" ? "gold-gradient-bg text-black" : "text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"}`}>
                Promo Codes
              </button>
            </div>
            {marketingTab === "messages" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2">
                  <MessageSquare size={18} className="text-[var(--mc-accent)]" /> Help Desk
                </p>
                <p className="text-[#555] text-sm mt-1">{messages.length} total · {unreadMessages} unread</p>
              </div>
              <button onClick={fetchMessages} className="flex items-center gap-2 border border-[var(--mc-border)] text-[var(--mc-text-dim)] px-4 py-2 text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            {messages.length === 0 ? (
              <div className="text-center py-20 luxury-card"><MessageSquare size={48} className="text-[#333] mx-auto mb-4" /><p className="text-[#555]">No messages yet</p></div>
            ) : (
              <div className="space-y-3">
                {[...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(msg => (
                  <div key={msg.id} className={`luxury-card p-5 border-l-2 ${msg.read ? "border-l-[var(--mc-border)] opacity-70" : "border-l-[var(--mc-accent)]"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-white font-semibold">{msg.name}</p>
                          {!msg.read && <span className="text-[10px] px-2 py-0.5 bg-[var(--mc-accent)]/15 border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] uppercase tracking-wider">New</span>}
                        </div>
                        <p className="text-[var(--mc-text-dim)] text-sm mb-1"><a href={`mailto:${msg.email}`} className="hover:text-[var(--mc-accent)] transition-colors">{msg.email}</a></p>
                        <p className="text-[#333] text-xs mb-3">{new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        <div className="bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] p-4 text-[var(--mc-muted)] text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!msg.read && (
                          <button onClick={() => markMessageRead(msg.id)} title="Mark as read"
                            className="w-9 h-9 flex items-center justify-center border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer">
                            <MailCheck size={16} />
                          </button>
                        )}
                        <a href={`mailto:${msg.email}?subject=Re: Your message to MC Hair Salon`}
                          className="w-9 h-9 flex items-center justify-center border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/10 transition-colors cursor-pointer" title="Reply">
                          <Send size={14} />
                        </a>
                        <button onClick={() => deleteMessage(msg.id)}
                          className="w-9 h-9 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
            {marketingTab === "newsletter" && (
          <div className="space-y-6">
            <div className="luxury-card p-6">
              <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2"><Send size={18} className="text-[var(--mc-accent)]" /> Compose Newsletter</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Subject</label>
                  <input type="text" value={newsletter.subject} onChange={e => setNewsletter(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Spring Specials at MC Salon" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Message</label>
                  <textarea rows={10} value={newsletter.message} onChange={e => setNewsletter(p => ({ ...p, message: e.target.value }))} placeholder="Write your newsletter here…" className={`${inputCls} resize-none`} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[#555] text-xs">Sending to <span className="text-[var(--mc-accent)]">{activeSubscribers}</span> subscriber{activeSubscribers !== 1 ? "s" : ""}</p>
                  <button onClick={sendNewsletter} disabled={sending || !newsletter.subject || !newsletter.message || activeSubscribers === 0}
                    className="gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer flex items-center gap-2 transition-opacity">
                    {sending ? <><Loader size={14} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send Now</>}
                  </button>
                </div>
                {sendResult && (
                  <div className={`p-4 border text-sm ${sendResult.error ? "border-red-500/30 text-red-400 bg-red-500/5" : "border-green-500/30 text-green-400 bg-green-500/5"}`}>
                    {sendResult.error ? `✗ ${sendResult.error}` : `✓ Sent to ${sendResult.sent} subscribers${sendResult.failed ? ` · ${sendResult.failed} failed` : ""}`}
                  </div>
                )}
              </div>
            </div>
            <div className="luxury-card p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Plus size={16} className="text-[var(--mc-accent)]" /> Add Subscriber</h3>
              <div className="flex flex-col gap-3">
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (optional)" className={inputCls} />
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" className={inputCls} />
                <button onClick={addManualSubscriber} disabled={!newEmail || addingSubscriber}
                  className="gold-gradient-bg text-black font-bold py-2.5 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer">
                  {addingSubscriber ? "Adding…" : "Add Subscriber"}
                </button>
              </div>
            </div>
            <div className="luxury-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold flex items-center gap-2"><Users size={16} className="text-[var(--mc-accent)]" /> Subscribers <span className="text-[var(--mc-accent)] text-sm font-normal">({activeSubscribers} active)</span></h3>
              </div>
              {subscribers.length === 0 ? (
                <div className="text-center py-12"><Mail size={40} className="text-[#333] mx-auto mb-3" /><p className="text-[#555] text-sm">No subscribers yet</p></div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {subscribers.map(sub => (
                    <div key={sub.id} className={`flex items-center justify-between p-3 border ${sub.active ? "border-[var(--mc-border)]" : "border-[var(--mc-border)] opacity-40"}`}>
                      <div>
                        {sub.name && <p className="text-white text-sm font-medium">{sub.name}</p>}
                        <p className="text-[var(--mc-text-dim)] text-sm">{sub.email}</p>
                        <p className="text-[#333] text-xs mt-0.5">{new Date(sub.subscribedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 border ${sub.active ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-[#555] border-[var(--mc-border)]"}`}>{sub.active ? "active" : "off"}</span>
                        <button onClick={() => removeSubscriber(sub.id)} className="w-7 h-7 flex items-center justify-center text-[var(--mc-text-dim)] hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
            )}
            {marketingTab === "automation" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-lg flex items-center gap-2">
                    <Zap size={18} className="text-[var(--mc-accent)]" /> Email Automation
                  </p>
                  {savingAutomation && <span className="text-[#555] text-xs">Saving…</span>}
                </div>

                {/* Appointment Reminder */}
                <div className="luxury-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold mb-1 flex items-center gap-2">
                        <Bell size={16} className="text-[var(--mc-accent)]" /> Appointment Reminder
                      </p>
                      <p className="text-[var(--mc-text-dim)] text-sm">Send reminder email 24h before each confirmed appointment</p>
                      <p className="text-[#555] text-xs mt-2">Last sent: 3 reminders this week</p>
                    </div>
                    <button onClick={() => toggleAutomation("appointmentReminder")}
                      className="shrink-0 transition-colors cursor-pointer"
                      aria-label="Toggle appointment reminder">
                      {automation.appointmentReminder
                        ? <ToggleRight size={36} className="text-[var(--mc-accent)]" />
                        : <ToggleLeft size={36} className="text-[#444]" />}
                    </button>
                  </div>
                  <div className={`mt-3 text-xs px-3 py-1.5 border w-fit ${automation.appointmentReminder ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-[#555] border-[var(--mc-border)]"}`}>
                    {automation.appointmentReminder ? "Active" : "Off"}
                  </div>
                </div>

                {/* Re-engagement */}
                <div className="luxury-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold mb-1 flex items-center gap-2">
                        <RefreshCw size={16} className="text-[var(--mc-accent)]" /> Re-engagement
                      </p>
                      <p className="text-[var(--mc-text-dim)] text-sm">Email clients not seen in 60 days with a special offer</p>
                      <p className="text-[#555] text-xs mt-2">
                        <span className="text-[var(--mc-accent)] font-semibold">{reEngagementCount}</span> client{reEngagementCount !== 1 ? "s" : ""} eligible right now
                      </p>
                    </div>
                    <button onClick={() => toggleAutomation("reEngagement")}
                      className="shrink-0 transition-colors cursor-pointer"
                      aria-label="Toggle re-engagement">
                      {automation.reEngagement
                        ? <ToggleRight size={36} className="text-[var(--mc-accent)]" />
                        : <ToggleLeft size={36} className="text-[#444]" />}
                    </button>
                  </div>
                  <div className={`mt-3 text-xs px-3 py-1.5 border w-fit ${automation.reEngagement ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-[#555] border-[var(--mc-border)]"}`}>
                    {automation.reEngagement ? "Active" : "Off"}
                  </div>
                </div>

                {/* Birthday Offer */}
                <div className="luxury-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold mb-1 flex items-center gap-2">
                        <Star size={16} className="text-[var(--mc-accent)]" /> Birthday Offer
                      </p>
                      <p className="text-[var(--mc-text-dim)] text-sm">Send a birthday discount on the client&apos;s birthday month</p>
                      <p className="text-[#555] text-xs mt-2 flex items-center gap-1">
                        <AlertTriangle size={11} /> Requires birthday on file
                      </p>
                    </div>
                    <button onClick={() => toggleAutomation("birthdayOffer")}
                      className="shrink-0 transition-colors cursor-pointer"
                      aria-label="Toggle birthday offer">
                      {automation.birthdayOffer
                        ? <ToggleRight size={36} className="text-[var(--mc-accent)]" />
                        : <ToggleLeft size={36} className="text-[#444]" />}
                    </button>
                  </div>
                  <div className={`mt-3 text-xs px-3 py-1.5 border w-fit ${automation.birthdayOffer ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-[#555] border-[var(--mc-border)]"}`}>
                    {automation.birthdayOffer ? "Active" : "Off"}
                  </div>
                </div>
              </div>
            )}
            {marketingTab === "promos" && <PromoCodesTab />}
          </div>
        )}

        {/* ── CLIENTS ──────────────────────────────────────────────────────── */}
        {tab === "clients" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-[#555] text-sm">{uniqueClients.length} unique client{uniqueClients.length !== 1 ? "s" : ""}</p>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={e => setClientSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] w-72"
                />
              </div>
            </div>
            {uniqueClients.length === 0 ? (
              <div className="text-center py-20 luxury-card"><Users size={48} className="text-[#333] mx-auto mb-4" /><p className="text-[#555]">No clients yet</p></div>
            ) : (
              <div className="space-y-4">
                {uniqueClients
                  .filter(client => {
                    if (!clientSearch) return true;
                    const q = clientSearch.toLowerCase();
                    return client.name.toLowerCase().includes(q) || client.email.toLowerCase().includes(q);
                  })
                  .sort((a, b) => {
                    const spendA = (clientMap[a.email] || []).filter(v => v.status === "confirmed").reduce((s, v) => s + (v.servicePrice ?? 0), 0);
                    const spendB = (clientMap[b.email] || []).filter(v => v.status === "confirmed").reduce((s, v) => s + (v.servicePrice ?? 0), 0);
                    return spendB - spendA;
                  })
                  .map(client => {
                  const visits   = clientMap[client.email] || [];
                  const lastVisit = visits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                  const totalSpend = visits.filter(v => v.status === "confirmed").reduce((s, v) => s + (v.servicePrice ?? 0), 0);
                  return (
                    <div key={client.email} className="luxury-card p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="text-white font-semibold text-lg">{client.name}</p>
                          <p className="text-[var(--mc-text-dim)] text-sm">{client.email}</p>
                          <p className="text-[var(--mc-text-dim)] text-sm">{client.phone}</p>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                          <div>
                            <p className="font-serif text-3xl gold-gradient font-bold">{visits.length}</p>
                            <p className="text-[#555] text-xs">appointment{visits.length !== 1 ? "s" : ""}</p>
                          </div>
                          {totalSpend > 0 && (
                            <div>
                              <p className="font-serif text-xl text-green-400 font-bold">${totalSpend.toFixed(0)}</p>
                              <p className="text-[#555] text-xs">total spent</p>
                            </div>
                          )}
                          <span className={`text-xs px-2 py-0.5 border inline-block ${statusColors[lastVisit?.status || "pending"]}`}>Last: {lastVisit?.status}</span>
                        </div>
                      </div>
                      <div className="border-t border-[var(--mc-border)] pt-4 space-y-2">
                        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Appointment History</p>
                        {visits.map(v => (
                          <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                            <div>
                              <span className="text-[var(--mc-muted)]">{v.date} at {v.time}</span>
                              <span className="text-[var(--mc-text-dim)] mx-2">·</span>
                              <span className="text-[var(--mc-text-dim)]">{v.service.split("–")[1]?.trim() || v.service}</span>
                              {v.stylist && <><span className="text-[var(--mc-text-dim)] mx-2">·</span><span className="text-[#555]">{v.stylist}</span></>}
                            </div>
                            <span className={`text-xs px-2 py-0.5 border ${statusColors[v.status]}`}>{v.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── REPORTS ───────────────────────────────────────────────────────── */}
        {tab === "reports" && (
          <div className="space-y-6">
            {/* Period selector + Export */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex bg-[var(--mc-surface-dark)] rounded-lg p-0.5 gap-0.5 border border-[var(--mc-border)]">
                {([
                  { id: "today", label: "Today" },
                  { id: "week",  label: "This Week" },
                  { id: "month", label: "This Month" },
                  { id: "year",  label: "This Year" },
                ] as const).map(p => (
                  <button key={p.id} onClick={() => setAnalyticsPeriod(p.id)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${analyticsPeriod === p.id ? "gold-gradient-bg text-black" : "text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              <button onClick={exportCSV}
                className="flex items-center gap-1.5 border border-[var(--mc-border)] text-[var(--mc-text-dim)] px-3 py-1.5 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                <Download size={13} /> Export CSV
              </button>
            </div>

            {/* Top row stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: <TrendingUp size={20} />, label: "Revenue",           value: `$${periodRevenue.toLocaleString()}`, sub: "Confirmed bookings" },
                { icon: <Check size={20} />,      label: "Confirmation Rate", value: `${periodBookings.length > 0 ? Math.round((periodConfirmed / periodBookings.length) * 100) : 0}%`, sub: `${periodConfirmed} of ${periodBookings.length}` },
                { icon: <X size={20} />,          label: "No-Show Rate",      value: `${periodNoShowRate}%`, sub: `${periodNoShows} no-shows` },
                { icon: <Users size={20} />,      label: "Client Retention",  value: `${retentionRate}%`, sub: "Clients with 2+ visits" },
              ].map(s => (
                <div key={s.label} className="luxury-card p-5">
                  <div className="text-[var(--mc-accent)] mb-3">{s.icon}</div>
                  <p className="font-serif text-3xl font-bold gold-gradient">{s.value}</p>
                  <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{s.label}</p>
                  <p className="text-[#333] text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Top Services + Per-Stylist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="luxury-card p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><BarChart2 size={16} className="text-[var(--mc-accent)]" /> Top Services</h3>
                {periodTopServicesSorted.length === 0 ? <p className="text-[#555] text-sm">No data for this period</p> : (
                  <div className="space-y-4">
                    {periodTopServicesSorted.map(([name, count]) => (
                      <div key={name}>
                        <div className="flex justify-between text-sm mb-1.5"><span className="text-[var(--mc-muted)] truncate mr-4">{name}</span><span className="text-[var(--mc-accent)] shrink-0">{count}</span></div>
                        <div className="h-1.5 bg-[var(--mc-surface-2)] rounded-full"><div className="h-full gold-gradient-bg rounded-full" style={{ width: `${periodBookings.length > 0 ? (count / periodBookings.length) * 100 : 0}%` }} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="luxury-card p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Users size={16} className="text-[var(--mc-accent)]" /> By Stylist</h3>
                {Object.keys(periodStylistMap).length === 0 ? <p className="text-[#555] text-sm">No data for this period</p> : (
                  <div className="space-y-4">
                    {Object.entries(periodStylistMap).sort((a, b) => b[1].count - a[1].count).map(([stylist, data]) => (
                      <div key={stylist}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-[var(--mc-muted)]">{stylist}</span>
                          <span className="text-[var(--mc-accent)] shrink-0 flex items-center gap-2">
                            <span>{data.count} appt</span>
                            {data.revenue > 0 && <span className="text-[#666]">·</span>}
                            {data.revenue > 0 && <span className="text-green-400">${data.revenue.toLocaleString()}</span>}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[var(--mc-surface-2)] rounded-full"><div className="h-full gold-gradient-bg rounded-full" style={{ width: `${periodBookings.length > 0 ? (data.count / periodBookings.length) * 100 : 0}%` }} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ── STAFF PROFILES (under Payroll tab) ───────────────────────────── */}
        {tab === "payroll" && payrollTab === "staff" && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2"><UserCheck size={18} className="text-[var(--mc-accent)]" /> Team Management</p>
                <p className="text-[#555] text-sm mt-1">{staff.length} team member{staff.length !== 1 ? "s" : ""} · Click a card to edit</p>
              </div>
              <button onClick={createNewStaff}
                className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer transition-opacity">
                <Plus size={14} /> Add Member
              </button>
            </div>

            {/* Staff cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {staff.map(member => (
                <div key={member.id}
                  className={`luxury-card overflow-hidden transition-all duration-200 ${editingStaff === member.id ? "ring-1 ring-[var(--mc-accent)]" : "hover:-translate-y-0.5"}`}>
                  {/* Photo with upload overlay */}
                  <div className="relative h-52 bg-[var(--mc-surface-dark)]">
                    {member.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={48} className="text-[#333]" />
                      </div>
                    )}
                    {/* Upload overlay */}
                    <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      {uploadingPhoto === member.id ? (
                        <Loader size={24} className="text-white animate-spin" />
                      ) : (
                        <>
                          <Upload size={22} className="text-white" />
                          <span className="text-white text-xs uppercase tracking-wider">Change Photo</span>
                          <span className="text-white/50 text-[10px]">JPG, PNG, WEBP, MP4</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*,video/mp4,video/mov,video/webm"
                        onChange={e => handlePhotoUpload(member.id, e)} />
                    </label>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-semibold text-lg leading-tight">{member.name}</p>
                        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-wider mt-0.5">{member.role}</p>
                      </div>
                      {member.isMakeupArtist && (
                        <span className="text-[10px] px-2 py-0.5 border border-[var(--mc-accent)]/40 text-[var(--mc-accent)] uppercase tracking-wider shrink-0 ml-2">MUA</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.specialties.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 border border-[var(--mc-border)] text-[#555]">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => editingStaff === member.id ? (setEditingStaff(null), setStaffForm({})) : startEditStaff(member)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          editingStaff === member.id
                            ? "bg-[var(--mc-accent)]/10 border border-[var(--mc-accent)] text-[var(--mc-accent)]"
                            : "border border-[var(--mc-border)] text-[var(--mc-text-dim)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
                        }`}>
                        <Pencil size={11} /> {editingStaff === member.id ? "Close" : "Edit Profile"}
                      </button>
                      <button onClick={() => handleDeleteStaff(member.id)}
                        className="w-9 h-9 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit panel */}
            {editingStaff && staffForm.id && (
              <div ref={editPanelRef} className="luxury-card p-7 border border-[var(--mc-accent)]/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Pencil size={16} className="text-[var(--mc-accent)]" /> Editing: {staffForm.name}
                  </h3>
                  {staffSaved && <span className="text-green-400 text-sm flex items-center gap-1"><Check size={13} /> Saved!</span>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: profile fields */}
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input type="text" value={staffForm.name || ""} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Role / Title</label>
                      <input type="text" value={staffForm.role || ""} onChange={e => setStaffForm(f => ({ ...f, role: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Bio</label>
                      <textarea rows={5} value={staffForm.bio || ""} onChange={e => setStaffForm(f => ({ ...f, bio: e.target.value }))} className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className={labelCls}>Specialties (comma-separated)</label>
                      <input type="text" value={(staffForm.specialties || []).join(", ")}
                        onChange={e => setStaffForm(f => ({ ...f, specialties: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                        className={inputCls} placeholder="Balayage, Precision Cuts, Color" />
                    </div>
                    <div>
                      <label className={labelCls}>Display Order</label>
                      <input type="number" min={0} value={staffForm.order ?? 0} onChange={e => setStaffForm(f => ({ ...f, order: Number(e.target.value) }))} className={inputCls} />
                    </div>
                    <div className="flex items-center gap-4 pt-1">
                      <label className="text-[var(--mc-muted)] text-sm">Makeup Artist</label>
                      <button
                        onClick={() => setStaffForm(f => ({ ...f, isMakeupArtist: !f.isMakeupArtist }))}
                        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${staffForm.isMakeupArtist ? "bg-[var(--mc-accent)]" : "bg-[var(--mc-surface-dark)] border border-[var(--mc-border)]"}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${staffForm.isMakeupArtist ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Right: portfolio */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={labelCls + " mb-0"}>Portfolio Media</label>
                      <span className="text-[#555] text-xs">{(staffForm.portfolio || []).length} item{(staffForm.portfolio || []).length !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-[#555] text-xs mb-4">Upload photos & videos. Supports JPG, PNG, WEBP, MP4, MOV — any size.</p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {(staffForm.portfolio || []).map((media, i) => (
                        <div key={i} className="relative aspect-square bg-[var(--mc-surface-dark)] group overflow-hidden">
                          {media.type === "video" ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <Film size={24} className="text-[var(--mc-accent)]" />
                              <span className="text-[10px] text-[#555]">Video</span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={media.src} alt={media.caption || "Portfolio"} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => removePortfolioItem(i)}
                              className="w-8 h-8 bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                              <Trash2 size={14} className="text-white" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Upload cell */}
                      <label className="aspect-square border border-dashed border-[var(--mc-border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/5 transition-all">
                        {uploadingPortfolio ? (
                          <Loader size={22} className="text-[var(--mc-accent)] animate-spin" />
                        ) : (
                          <>
                            <Upload size={20} className="text-[#555] mb-1" />
                            <span className="text-[10px] text-[#555] text-center">Add Photos<br/>or Videos</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*,video/*" multiple
                          onChange={handlePortfolioUpload} />
                      </label>
                    </div>

                    {/* Current profile photo preview */}
                    {staffForm.image && (
                      <div>
                        <label className={labelCls}>Profile Photo</label>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={staffForm.image} alt="Profile" className="w-16 h-16 object-cover border border-[var(--mc-border)]" />
                          <div>
                            <p className="text-[var(--mc-muted)] text-xs mb-1">{staffForm.image.split("/").pop()}</p>
                            <label className="flex items-center gap-1.5 text-xs text-[var(--mc-accent)] cursor-pointer hover:underline">
                              <Upload size={11} /> Replace photo
                              <input type="file" className="hidden" accept="image/*,video/mp4,video/mov,video/webm"
                                onChange={e => handlePhotoUpload(editingStaff, e)} />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save / Cancel */}
                <div className="flex items-center gap-3 pt-6 border-t border-[var(--mc-border)] mt-6">
                  <button onClick={saveStaffEdits} disabled={savingStaff}
                    className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                    {savingStaff ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                  </button>
                  <button onClick={() => { setEditingStaff(null); setStaffForm({}); }}
                    className="px-6 py-3 border border-[var(--mc-border)] text-[var(--mc-text-dim)] text-sm uppercase tracking-wider hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── REWARDS ──────────────────────────────────────────────────────── */}
        {tab === "rewards" && (() => {
          const sorted       = [...rewardsData].sort((a, b) => b.points - a.points);
          const totalPoints  = rewardsData.reduce((s, c) => s + c.points, 0);
          const totalRedeem  = rewardsData.reduce((s, c) => s + c.rewards.length, 0);
          const tierCount    = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 } as Record<string, number>;
          rewardsData.forEach(c => { tierCount[c.tier] = (tierCount[c.tier] || 0) + 1; });

          const TIER_META: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
            Bronze:   { color: "#CD7F32", bg: "bg-[#CD7F32]/10",  border: "border-[#CD7F32]/30", icon: <Star size={13} />   },
            Silver:   { color: "#C0C0C0", bg: "bg-[#C0C0C0]/10",  border: "border-[#C0C0C0]/30", icon: <Star size={13} />   },
            Gold:     { color: "#FFD700", bg: "bg-[#FFD700]/10",   border: "border-[#FFD700]/30", icon: <Crown size={13} />  },
            Platinum: { color: "#E8E8E8", bg: "bg-[#E8E8E8]/10",  border: "border-[#E8E8E8]/30", icon: <Zap size={13} />    },
          };

          return (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <p className="text-white font-semibold text-lg flex items-center gap-2">
                    <Gift size={18} className="text-[var(--mc-accent)]" /> MC Rewards Program
                  </p>
                  <p className="text-[#555] text-sm mt-1">
                    {rewardsData.length} members &nbsp;·&nbsp; {totalPoints.toLocaleString()} points issued &nbsp;·&nbsp; {totalRedeem} rewards redeemed
                  </p>
                </div>
                <button onClick={fetchRewards}
                  className="flex items-center gap-2 border border-[var(--mc-border)] text-[var(--mc-text-dim)] px-4 py-2 text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {/* Success toast */}
              {adjustSuccess && (
                <div className="mb-4 flex items-center gap-2 border border-green-500/30 bg-green-950/20 px-4 py-3 text-green-400 text-sm">
                  <Check size={15} /> {adjustSuccess}
                </div>
              )}

              {/* Scan station quick-access */}
              <div className="border border-[var(--mc-accent)]/30 bg-[#0a0800] p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-1 flex items-center gap-2">
                    <Scissors size={13} /> On-Site Scan Station
                  </p>
                  <p className="text-[var(--mc-muted)] text-sm">
                    Open on any salon device to look up clients and record visits manually.
                    Clients can also show their QR code to jump straight to their profile.
                  </p>
                </div>
                <a href="/scan" target="_blank" rel="noopener noreferrer"
                  className="shrink-0 gold-gradient-bg text-black font-bold px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
                  Open Station ↗
                </a>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Members",      value: rewardsData.length,                                                    icon: <Users size={18} />    },
                  { label: "Points Issued",       value: totalPoints.toLocaleString(),                                          icon: <Star size={18} />     },
                  { label: "Blowouts Earned",     value: rewardsData.reduce((s, c) => s + (c.blowoutsEarned ?? 0), 0),          icon: <Scissors size={18} /> },
                  { label: "Rewards Redeemed",    value: totalRedeem,                                                           icon: <Gift size={18} />     },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="luxury-card p-5">
                    <div className="text-[var(--mc-accent)] mb-3">{icon}</div>
                    <p className="font-serif text-2xl font-bold text-white">{value}</p>
                    <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Tier breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {(["Bronze", "Silver", "Gold", "Platinum"] as const).map((tier) => {
                  const meta = TIER_META[tier];
                  const count = tierCount[tier] || 0;
                  const pct = rewardsData.length ? Math.round((count / rewardsData.length) * 100) : 0;
                  return (
                    <div key={tier} className={`border ${meta.border} ${meta.bg} p-4`}>
                      <div className="flex items-center gap-2 mb-2" style={{ color: meta.color }}>
                        {meta.icon}
                        <span className="text-xs uppercase tracking-widest font-bold">{tier}</span>
                      </div>
                      <p className="font-serif text-3xl font-bold text-white">{count}</p>
                      <p className="text-[#555] text-xs mt-1">{pct}% of members</p>
                      <div className="mt-3 h-1 bg-[#111]">
                        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Member leaderboard */}
              <div>
                <p className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={15} className="text-[var(--mc-accent)]" /> Member Leaderboard
                </p>

                {sorted.length === 0 ? (
                  <div className="text-center py-20 luxury-card">
                    <Gift size={40} className="text-[#333] mx-auto mb-4" />
                    <p className="text-[#555]">No members yet. Clients who sign up will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sorted.map((customer, idx) => {
                      const meta      = TIER_META[customer.tier];
                      const isOpen    = adjustTarget === customer.id;
                      const maxPoints = 2000;
                      const barPct    = Math.min(100, Math.round((customer.points / maxPoints) * 100));

                      return (
                        <div key={customer.id} className="luxury-card overflow-hidden">
                          {/* Main row */}
                          <div className="p-4 flex items-center gap-4 flex-wrap">
                            {/* Rank */}
                            <span className="text-[#333] font-mono text-sm w-7 shrink-0 text-center">
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                            </span>

                            {/* Name + email */}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm truncate">{customer.name}</p>
                              <p className="text-[#555] text-xs truncate">{customer.email}</p>
                            </div>

                            {/* Tier badge */}
                            <span className={`text-[10px] px-2.5 py-1 border uppercase tracking-widest font-bold shrink-0 ${meta.border} ${meta.bg}`}
                              style={{ color: meta.color }}>
                              {customer.tier}
                            </span>

                            {/* Points + bar */}
                            <div className="w-32 shrink-0 hidden sm:block">
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-white font-semibold">{customer.points.toLocaleString()} pts</span>
                                <span className="text-[#444]">{customer.visits} visits</span>
                              </div>
                              <div className="h-1.5 bg-[#111]">
                                <div className="h-full transition-all" style={{ width: `${barPct}%`, backgroundColor: meta.color }} />
                              </div>
                            </div>

                            {/* Punch card mini-progress */}
                            <div className="items-center gap-1 hidden md:flex shrink-0">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i < (customer.visitStreak ?? 0) ? "bg-[var(--mc-accent)]" : "bg-[#1a1a1a]"}`} />
                              ))}
                              <span className="text-[#444] text-[10px] ml-1">{customer.visitStreak ?? 0}/10</span>
                            </div>

                            {/* Blowouts earned */}
                            {(customer.blowoutsEarned ?? 0) > 0 && (
                              <div className="items-center gap-1 hidden lg:flex shrink-0">
                                <Scissors size={11} className="text-[var(--mc-accent)]" />
                                <span className="text-[var(--mc-accent)] text-xs">{customer.blowoutsEarned}</span>
                              </div>
                            )}

                            {/* QR link */}
                            <a href={`/scan/${customer.id}`} target="_blank" rel="noopener noreferrer"
                              title="Open scan page"
                              className="w-8 h-8 shrink-0 border border-[#222] flex items-center justify-center text-[#444] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                              <QrCode size={13} />
                            </a>

                            {/* Joined */}
                            <span className="text-[#444] text-xs shrink-0 hidden lg:block">
                              {new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </span>

                            {/* Adjust button */}
                            <button
                              onClick={() => {
                                setAdjustTarget(isOpen ? null : customer.id);
                                setAdjustAmount("");
                                setAdjustMode("add");
                                setAdjustReason("");
                              }}
                              className={`shrink-0 h-8 px-3 border text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isOpen
                                  ? "border-[var(--mc-accent)] text-[var(--mc-accent)] bg-[var(--mc-accent)]/10"
                                  : "border-[#222] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
                              }`}
                            >
                              <Star size={11} /> Adjust
                            </button>
                          </div>

                          {/* Inline adjustment panel */}
                          {isOpen && (
                            <div className="border-t border-[#1a1a1a] bg-[#060606] p-4">
                              <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">
                                Adjust Points for {customer.name}
                              </p>
                              <div className="flex flex-wrap items-end gap-3">
                                {/* Add / Subtract toggle */}
                                <div className="flex border border-[#222]">
                                  <button
                                    onClick={() => setAdjustMode("add")}
                                    className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                      adjustMode === "add" ? "bg-green-500/20 text-green-400 border-r border-[#222]" : "text-[#555] border-r border-[#222]"
                                    }`}
                                  >
                                    <Plus size={11} /> Add
                                  </button>
                                  <button
                                    onClick={() => setAdjustMode("subtract")}
                                    className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                      adjustMode === "subtract" ? "bg-red-500/20 text-red-400" : "text-[#555]"
                                    }`}
                                  >
                                    <Minus size={11} /> Deduct
                                  </button>
                                </div>

                                {/* Amount */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-[#444] text-[10px] uppercase tracking-widest">Points</label>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 100"
                                    value={adjustAmount}
                                    onChange={(e) => setAdjustAmount(e.target.value)}
                                    className="w-28 bg-[#0a0a0a] border border-[#222] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors"
                                  />
                                </div>

                                {/* Reason */}
                                <div className="flex flex-col gap-1 flex-1 min-w-40">
                                  <label className="text-[#444] text-[10px] uppercase tracking-widest">Reason (optional)</label>
                                  <input
                                    type="text"
                                    placeholder="Birthday bonus, service adjustment..."
                                    value={adjustReason}
                                    onChange={(e) => setAdjustReason(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#222] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors"
                                  />
                                </div>

                                {/* Apply */}
                                <button
                                  onClick={() => applyPointAdjustment(customer.id)}
                                  disabled={!adjustAmount || adjusting}
                                  className="gold-gradient-bg text-black font-bold px-5 py-2 text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer flex items-center gap-2 transition-opacity"
                                >
                                  {adjusting ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
                                  Apply
                                </button>
                                <button
                                  onClick={() => setAdjustTarget(null)}
                                  className="border border-[#222] text-[#555] px-4 py-2 text-xs hover:border-[#444] transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>

                              {/* Preview */}
                              {adjustAmount && (
                                <p className="text-[#555] text-xs mt-3">
                                  Current: <span className="text-white">{customer.points.toLocaleString()} pts</span>
                                  {" → "}
                                  New:{" "}
                                  <span className={adjustMode === "add" ? "text-green-400" : "text-red-400"}>
                                    {Math.max(0, customer.points + (adjustMode === "add" ? parseInt(adjustAmount || "0") : -parseInt(adjustAmount || "0"))).toLocaleString()} pts
                                  </span>
                                </p>
                              )}

                              {/* Redemption history */}
                              {customer.rewards.length > 0 && (
                                <div className="mt-4 border-t border-[#111] pt-3">
                                  <p className="text-[#444] text-[10px] uppercase tracking-widest mb-2">Redemption History</p>
                                  <div className="space-y-1.5">
                                    {customer.rewards.slice(0, 5).map((r) => (
                                      <div key={r.id} className="flex justify-between text-xs">
                                        <span className="text-[#777]">{r.name}</span>
                                        <span className="text-[var(--mc-accent)]">−{r.pointsCost} pts &nbsp;·&nbsp; {new Date(r.redeemedAt).toLocaleDateString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {/* ── SETTINGS ─────────────────────────────────────────────────────── */}
        {tab === "settings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2"><Settings size={18} className="text-[var(--mc-accent)]" /> Site Settings</p>
                <p className="text-[#555] text-sm mt-1">Full control over your site — content, colors, hours, and more</p>
              </div>
              {settingsSaved && <span className="text-green-400 text-sm flex items-center gap-1"><Check size={13} /> Saved!</span>}
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-0 mb-8 border-b border-[var(--mc-border)] overflow-x-auto scrollbar-none">
              {(["business", "hours", "hero", "theme", "pages", "users"] as const).map(s => (
                <button key={s} onClick={() => setSettingsTab(s)}
                  className={`px-5 py-3 text-sm uppercase tracking-widest cursor-pointer border-b-2 -mb-px transition-all whitespace-nowrap ${
                    settingsTab === s ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" : "border-transparent text-[#555] hover:text-[var(--mc-muted)]"
                  }`}>
                  {s === "business" ? "Business Info"
                    : s === "hours" ? "Hours"
                    : s === "hero" ? "Homepage"
                    : s === "theme" ? "Theme & Colors"
                    : s === "pages" ? "Pages & Content"
                    : "Users & Access"}
                </button>
              ))}
            </div>

            {/* Business Info */}
            {settingsTab === "business" && settingsForm && (
              <div className="luxury-card p-7 max-w-2xl">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Building2 size={16} className="text-[var(--mc-accent)]" /> Business Information</h3>
                <div className="space-y-5">
                  {([
                    { label: "Salon Name",     key: "name",      hint: "Appears in header, email, and meta tags" },
                    { label: "Tagline",        key: "tagline",   hint: "Short description shown under the name" },
                    { label: "Street Address", key: "address",   hint: "Shown on contact page and footer" },
                    { label: "Phone",          key: "phone",     hint: "Clickable tel: link on mobile" },
                    { label: "Email",          key: "email",     hint: "Public-facing contact email" },
                    { label: "Instagram URL",  key: "instagram", hint: "Full URL including https://" },
                    { label: "Facebook URL",   key: "facebook",  hint: "Full URL including https://" },
                  ] as { label: string; key: keyof typeof settingsForm.business; hint: string }[]).map(f => (
                    <div key={f.key}>
                      <label className={labelCls}>{f.label}</label>
                      <input type="text"
                        value={settingsForm.business[f.key] || ""}
                        onChange={e => setSettingsForm(p => p ? ({ ...p, business: { ...p.business, [f.key]: e.target.value } }) : p)}
                        className={inputCls} />
                      <p className="text-[#444] text-xs mt-1">{f.hint}</p>
                    </div>
                  ))}
                  <button onClick={saveSettings} disabled={savingSettings}
                    className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity mt-2">
                    {savingSettings ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Business Info</>}
                  </button>
                </div>
              </div>
            )}

            {/* Hours */}
            {settingsTab === "hours" && settingsForm && (
              <div className="luxury-card p-7 max-w-xl">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><Clock size={16} className="text-[var(--mc-accent)]" /> Operating Hours</h3>
                <p className="text-[#555] text-sm mb-6">Use any format: "10:00 AM", "10am", "Closed"</p>
                <div className="space-y-3">
                  {settingsForm.hours.map((h, i) => (
                    <div key={h.day} className="flex items-center gap-3">
                      <span className="text-[var(--mc-muted)] text-sm w-28 shrink-0 font-medium">{h.day}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <input type="text" value={h.open}
                          onChange={e => {
                            const hours = [...settingsForm.hours];
                            hours[i] = { ...hours[i], open: e.target.value };
                            setSettingsForm(p => p ? ({ ...p, hours }) : p);
                          }}
                          placeholder="Open" className={`${inputCls} flex-1`} />
                        <span className="text-[#555] shrink-0">—</span>
                        <input type="text" value={h.close}
                          onChange={e => {
                            const hours = [...settingsForm.hours];
                            hours[i] = { ...hours[i], close: e.target.value };
                            setSettingsForm(p => p ? ({ ...p, hours }) : p);
                          }}
                          placeholder="Close" className={`${inputCls} flex-1`} />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={saveSettings} disabled={savingSettings}
                  className="mt-6 flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                  {savingSettings ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Hours</>}
                </button>
              </div>
            )}

            {/* Homepage */}
            {settingsTab === "hero" && settingsForm && (
              <div className="luxury-card p-7 max-w-2xl">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><Globe size={16} className="text-[var(--mc-accent)]" /> Homepage Content</h3>
                <p className="text-[#555] text-sm mb-6">Controls the main hero section on the home page</p>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Main Headline</label>
                    <input type="text" value={settingsForm.hero.headline}
                      onChange={e => setSettingsForm(p => p ? ({ ...p, hero: { ...p.hero, headline: e.target.value } }) : p)}
                      className={inputCls} placeholder="e.g. Upper East Side's" />
                    <p className="text-[#444] text-xs mt-1">First line of the hero heading (plain white text)</p>
                  </div>
                  <div>
                    <label className={labelCls}>Headline Accent (Gold Text)</label>
                    <input type="text" value={settingsForm.hero.headlineAccent}
                      onChange={e => setSettingsForm(p => p ? ({ ...p, hero: { ...p.hero, headlineAccent: e.target.value } }) : p)}
                      className={inputCls} placeholder="e.g. Premier Hair Salon" />
                    <p className="text-[#444] text-xs mt-1">Second line rendered in gold gradient</p>
                  </div>
                  <div>
                    <label className={labelCls}>Subheadline</label>
                    <textarea rows={3} value={settingsForm.hero.subheadline}
                      onChange={e => setSettingsForm(p => p ? ({ ...p, hero: { ...p.hero, subheadline: e.target.value } }) : p)}
                      className={`${inputCls} resize-none`} />
                    <p className="text-[#444] text-xs mt-1">Paragraph text below the heading</p>
                  </div>
                  {/* Live preview */}
                  <div className="border border-[var(--mc-border)] p-6 bg-black text-center">
                    <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest mb-2">Preview</p>
                    <h2 className="font-serif text-2xl font-bold text-white">{settingsForm.hero.headline}</h2>
                    <h2 className="font-serif text-2xl font-bold gold-gradient">{settingsForm.hero.headlineAccent}</h2>
                    <p className="text-[var(--mc-muted)] text-sm mt-3 leading-relaxed">{settingsForm.hero.subheadline}</p>
                  </div>
                  <button onClick={saveSettings} disabled={savingSettings}
                    className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                    {savingSettings ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Homepage</>}
                  </button>
                </div>
              </div>
            )}

            {/* ── THEME & COLORS ──────────────────────────────────────────── */}
            {settingsTab === "theme" && settingsForm && (
              <div className="max-w-2xl space-y-6">
                <div className="luxury-card p-7">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Zap size={16} className="text-[var(--mc-accent)]" /> Theme & Brand Colors
                  </h3>
                  <p className="text-[#555] text-sm mb-6">Changes apply site-wide instantly. Default theme is gold on black.</p>
                  <div className="space-y-5">
                    {([
                      { label: "Primary Accent Color",    key: "accent",  hint: "Main brand color — buttons, highlights, gold by default (#C9A84C)" },
                      { label: "Secondary Accent Color",  key: "accent2", hint: "Shimmer / gradient end color (#FFD700)" },
                      { label: "Page Background",         key: "bg",      hint: "Main background color (#000000)" },
                      { label: "Card / Surface Color",    key: "surface", hint: "Background of cards and panels (#0f0f0f)" },
                      { label: "Border Color",            key: "border",  hint: "Dividers and card borders (#2a2a2a)" },
                      { label: "Primary Text Color",      key: "text",    hint: "Headings and primary copy (#f5f0e8)" },
                      { label: "Muted Text Color",        key: "muted",   hint: "Subtext and secondary copy (#a89070)" },
                    ] as { label: string; key: keyof SiteSettings["theme"]; hint: string }[]).map(f => (
                      <div key={f.key}>
                        <label className={labelCls}>{f.label}</label>
                        <div className="flex items-center gap-3">
                          <input type="color"
                            value={settingsForm.theme?.[f.key] ?? "#000000"}
                            onChange={e => setSettingsForm(p => p ? ({
                              ...p,
                              theme: { ...(p.theme ?? {}), [f.key]: e.target.value }
                            } as SiteSettings) : p)}
                            className="w-12 h-10 cursor-pointer border border-[var(--mc-border)] bg-transparent p-0.5 shrink-0"
                          />
                          <input type="text"
                            value={settingsForm.theme?.[f.key] ?? ""}
                            onChange={e => setSettingsForm(p => p ? ({
                              ...p,
                              theme: { ...(p.theme ?? {}), [f.key]: e.target.value }
                            } as SiteSettings) : p)}
                            className={`${inputCls} font-mono`}
                            placeholder="#000000"
                          />
                        </div>
                        <p className="text-[#444] text-xs mt-1">{f.hint}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 border border-[var(--mc-border)] bg-[var(--mc-surface-dark)] flex items-center gap-4 flex-wrap">
                    <div className="text-xs text-[#555] uppercase tracking-widest">Preview</div>
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full" style={{ background: settingsForm.theme?.accent ?? "#C9A84C" }} />
                      <div className="w-8 h-8 border" style={{ background: settingsForm.theme?.surface ?? "#0f0f0f", borderColor: settingsForm.theme?.border ?? "#2a2a2a" }} />
                      <span className="text-sm font-semibold" style={{ color: settingsForm.theme?.accent ?? "#C9A84C" }}>MC Hair Salon</span>
                      <span className="text-sm" style={{ color: settingsForm.theme?.muted ?? "#a89070" }}>Upper East Side</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 flex-wrap">
                    <button onClick={saveSettings} disabled={savingSettings}
                      className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                      {savingSettings ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Colors</>}
                    </button>
                    <button onClick={() => setSettingsForm(p => p ? ({ ...p, theme: { accent: "#C9A84C", accent2: "#FFD700", bg: "#000000", surface: "#0f0f0f", border: "#2a2a2a", text: "#f5f0e8", muted: "#a89070" } }) : p)}
                      className="px-6 py-3 border border-[var(--mc-border)] text-[#555] text-sm uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                      Reset to Gold Default
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── PAGES & CONTENT ─────────────────────────────────────────── */}
            {settingsTab === "pages" && settingsForm && (
              <div className="max-w-2xl space-y-4">
                <div className="luxury-card p-5">
                  <h3 className="text-white font-semibold mb-1 flex items-center gap-2"><Globe size={16} className="text-[var(--mc-accent)]" /> Pages & Content</h3>
                  <p className="text-[#555] text-sm mb-6">Jump to the section that controls each page.</p>
                  {[
                    { label: "Homepage Hero Text",       sub: "Headline, accent line, and paragraph",          action: () => setSettingsTab("hero") },
                    { label: "Business Info & Contact",  sub: "Salon name, phone, email, social links",        action: () => setSettingsTab("business") },
                    { label: "Operating Hours",          sub: "Daily open/close times",                        action: () => setSettingsTab("hours") },
                    { label: "Theme & Brand Colors",     sub: "Accent, background, text, border colors",       action: () => setSettingsTab("theme") },
                    { label: "Staff Profiles & Bio",     sub: "Photos, bios, roles, portfolio — in Payroll tab", action: () => { setTab("payroll"); setPayrollTab("staff"); } },
                    { label: "Services Catalog",         sub: "Pricing and service descriptions",               action: () => { setTab("operations"); setOpsTab("services"); } },
                    { label: "Users & Admin Access",     sub: "Grant or revoke admin permissions",             action: () => setSettingsTab("users") },
                  ].map(item => (
                    <button key={item.label} onClick={item.action}
                      className="w-full flex items-center justify-between px-5 py-4 border border-[var(--mc-border)] hover:border-[var(--mc-accent)] transition-all group cursor-pointer mb-2">
                      <div className="text-left">
                        <p className="text-white text-sm font-semibold group-hover:text-[var(--mc-accent)] transition-colors">{item.label}</p>
                        <p className="text-[#555] text-xs mt-0.5">{item.sub}</p>
                      </div>
                      <ChevronRight size={16} className="text-[#555] group-hover:text-[var(--mc-accent)] transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── USERS (inside Settings > Users) ──────────────────────────────── */}
        {tab === "settings" && settingsTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[var(--mc-accent)]" /> Admin Access
                </p>
                <p className="text-[#555] text-sm mt-1">
                  {adminUsers.filter(u => u.isAdmin).length} admin{adminUsers.filter(u => u.isAdmin).length !== 1 ? "s" : ""} · {adminUsers.length} registered users
                </p>
              </div>
            </div>

            {/* Grant by email */}
            <div className="luxury-card p-6 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Plus size={16} className="text-[var(--mc-accent)]" /> Grant Admin by Email
              </h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={adminGrantEmail}
                  onChange={e => setAdminGrantEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdminGrant(adminGrantEmail)}
                  placeholder="Email address"
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={() => handleAdminGrant(adminGrantEmail)}
                  disabled={!adminGrantEmail || adminGrantLoading}
                  className="gold-gradient-bg text-black font-bold px-6 py-2 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer shrink-0 transition-opacity"
                >
                  {adminGrantLoading ? "Granting…" : "Grant"}
                </button>
              </div>
              <p className="text-[#444] text-xs mt-2">User must log out and back in for changes to take effect.</p>
            </div>

            {/* Users list */}
            {usersLoading ? (
              <div className="text-center py-20 text-[#555]">Loading…</div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-20 luxury-card">
                <Users size={48} className="text-[#333] mx-auto mb-4" />
                <p className="text-[#555]">No registered users yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...adminUsers].sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin)).map(user => (
                  <div key={user.id} className={`luxury-card p-4 flex items-center justify-between gap-4 flex-wrap border-l-2 ${user.isAdmin ? "border-l-[var(--mc-accent)]" : "border-l-transparent"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-white font-semibold text-sm">{user.name}</p>
                        {user.isAdmin && (
                          <span className="text-[10px] px-2 py-0.5 bg-[var(--mc-accent)]/15 border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={10} /> Admin
                          </span>
                        )}
                        {user.isEnvAdmin && (
                          <span className="text-[10px] px-2 py-0.5 border border-[#555]/40 text-[#555] uppercase tracking-wider" title="Set via ADMIN_EMAIL env var">ENV</span>
                        )}
                      </div>
                      <p className="text-[#555] text-xs">{user.email}</p>
                      {user.adminEntry && (
                        <p className="text-[#333] text-[10px] mt-0.5">
                          Added by {user.adminEntry.addedBy} · {new Date(user.adminEntry.addedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {user.isEnvAdmin ? (
                      <span className="text-[#444] text-xs shrink-0">env-protected</span>
                    ) : (
                      <button
                        onClick={() => handleAdminToggle(user.email, user.isAdmin ? "revoke" : "grant")}
                        className={`shrink-0 px-4 py-1.5 border text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                          user.isAdmin
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {user.isAdmin ? "Revoke" : "Grant"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>}

    </div>
  );
}
