"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "" });

  useEffect(() => {
    if (params.get("tab") === "register") setTab("register");
  }, [params]);

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-[var(--mc-text)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[var(--mc-text-dim)]";
  const labelClass = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const redirectTo = params.get("redirect");
      router.push(redirectTo || (data.customer?.isAdmin ? "/admin" : "/account"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-[var(--mc-bg)] pt-28 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            {tab === "signin" ? "Welcome Back" : "Join MC Hair Salon"}
          </p>
          <h1 className="font-serif text-4xl font-bold text-[var(--mc-text)]">
            {tab === "signin" ? "Sign In" : "Create Account"}
          </h1>
          {tab === "register" && (
            <p className="text-[var(--mc-accent)] text-sm mt-3 font-semibold">
              ✦ New members get 10% off their first visit
            </p>
          )}
          {tab === "signin" && (
            <p className="text-[var(--mc-muted)] text-sm mt-3">Access your appointments, rewards & more</p>
          )}
        </div>

        {/* Tab toggle */}
        <div className="flex border border-[var(--mc-border)] mb-6">
          <button
            onClick={() => { setTab("signin"); setError(""); }}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer ${
              tab === "signin"
                ? "gold-gradient-bg text-black"
                : "text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"
            }`}>
            Sign In
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-3 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer ${
              tab === "register"
                ? "gold-gradient-bg text-black"
                : "text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"
            }`}>
            Create Account
          </button>
        </div>

        {tab === "signin" ? (
          <form onSubmit={handleLogin} className="luxury-card p-8 space-y-5">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" required value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="your@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••" className={`${inputClass} pr-12`} />
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
            <p className="text-center text-[var(--mc-text-dim)] text-xs pt-2">
              New here?{" "}
              <button type="button" onClick={() => { setTab("register"); setError(""); }}
                className="text-[var(--mc-accent)] hover:underline cursor-pointer">
                Create a free account & get 10% off
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="luxury-card p-8 space-y-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" required value={regForm.name}
                onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                placeholder="Jane Smith" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" required value={regForm.email}
                onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                placeholder="your@email.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone <span className="normal-case text-[var(--mc-text-dim)]">(optional)</span></label>
              <input type="tel" value={regForm.phone}
                onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                placeholder="(212) 555-0000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required minLength={8} value={regForm.password}
                  onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="Minimum 8 characters" className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Creating account...</> : "Create Account & Claim 10% Off"}
            </button>
            <GoogleSignInButton mode="signup" />
            <p className="text-center text-[var(--mc-text-dim)] text-xs pt-2">
              Already have an account?{" "}
              <button type="button" onClick={() => { setTab("signin"); setError(""); }}
                className="text-[var(--mc-accent)] hover:underline cursor-pointer">
                Sign in
              </button>
            </p>
            <p className="text-center text-[var(--mc-text-dim)] text-[10px] leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-[var(--mc-accent)] hover:underline">Terms & Conditions</Link>.
              Your 10% discount will be applied at your first appointment.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
