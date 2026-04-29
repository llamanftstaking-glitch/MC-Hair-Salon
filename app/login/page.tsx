"use client";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-[var(--mc-text)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[var(--mc-text-dim)]";
  const labelClass = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-[var(--mc-bg)] pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">Welcome Back</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--mc-text)]">Sign In</h1>
          <p className="text-[var(--mc-muted)] text-sm mt-3">Access your appointments, rewards & more</p>
        </div>

        <form onSubmit={handleSubmit} className="luxury-card p-8 space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com" className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" className={`${inputClass} pr-12`}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2">
            {loading ? <><Loader size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
          </button>

          <GoogleSignInButton mode="signin" />

          <p className="text-center text-[var(--mc-text-dim)] text-sm pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--mc-accent)] hover:underline cursor-pointer">Create one</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
