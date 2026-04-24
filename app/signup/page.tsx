"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-[var(--mc-text)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[var(--mc-text-dim)]";
  const labelClass = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-[var(--mc-bg)] pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Perks banner */}
        <div className="luxury-card p-4 mb-6 flex items-center gap-3">
          <Sparkles size={18} className="text-[var(--mc-accent)] shrink-0" />
          <p className="text-[var(--mc-muted)] text-xs leading-relaxed">
            Join MC Rewards and earn points on every visit. Unlock exclusive perks, free services, and member-only offers.
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">Join the Family</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--mc-text)]">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="luxury-card p-8 space-y-5">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input type="text" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="(212) 000-0000" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Password *</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 characters" className={`${inputClass} pr-12`} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirm Password *</label>
            <input type="password" required value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter password" className={inputClass} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2">
            {loading ? <><Loader size={16} className="animate-spin" /> Creating account...</> : "Create Account & Join Rewards"}
          </button>

          <p className="text-center text-[var(--mc-text-dim)] text-sm pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--mc-accent)] hover:underline cursor-pointer">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
}
