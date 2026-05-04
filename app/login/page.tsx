"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader, Phone } from "lucide-react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [view, setView]     = useState<"signin" | "register">("signin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm,   setRegForm]   = useState({ name: "", email: "", phone: "", password: "", subscribe: true });

  useEffect(() => {
    if (params.get("tab") === "register") setView("register");
  }, [params]);

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-[var(--mc-text)] px-5 py-4 text-base focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[var(--mc-text-dim)]";
  const labelClass = "block text-[var(--mc-text)] text-sm font-semibold mb-2";

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
      setError(err instanceof Error ? err.message : "Sign-in failed. Please check your email and password.");
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
        body: JSON.stringify({ ...regForm, subscribeToNewsletter: regForm.subscribe }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-[var(--mc-bg)] pt-28 pb-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.35em] text-xs font-semibold mb-3">
            MC Hair Salon & Spa
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[var(--mc-text)] mb-3">
            {view === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-[var(--mc-muted)] text-base leading-relaxed">
            {view === "signin"
              ? "Sign in to view your appointments and rewards."
              : "Join us for easy online booking and exclusive rewards."}
          </p>
          {view === "register" && (
            <p className="mt-3 text-[var(--mc-accent)] font-semibold text-sm">
              New members receive 10% off their first visit
            </p>
          )}
        </div>

        <div className="luxury-card p-8 sm:p-10 space-y-6">

          {/* Google — primary, always at the top */}
          <div>
            <p className="text-[var(--mc-text)] text-sm font-semibold text-center mb-4">
              Quickest way to sign in:
            </p>
            <GoogleSignInButton mode={view === "register" ? "signup" : "signin"} />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--mc-border)]" />
            <span className="text-[var(--mc-text-dim)] text-sm">or use your email</span>
            <div className="flex-1 h-px bg-[var(--mc-border)]" />
          </div>

          {/* Sign In form */}
          {view === "signin" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="your@email.com"
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Your password"
                    className={`${inputClass} pr-14`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer p-1"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-red-800/50 bg-red-950/20 px-4 py-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient-bg text-black font-bold py-4 text-base tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <><Loader size={18} className="animate-spin" /> Signing in…</> : "Sign In to My Account"}
              </button>
            </form>
          ) : (
            /* Create Account form */
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className={labelClass}>Your Full Name</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Jane Smith"
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="your@email.com"
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Phone Number <span className="text-[var(--mc-text-dim)] font-normal">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={regForm.phone}
                  onChange={e => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="(212) 555-0000"
                  className={inputClass}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label className={labelClass}>Choose a Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={regForm.password}
                    onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-14`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer p-1"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Subscribe checkbox */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={regForm.subscribe}
                  onChange={e => setRegForm({ ...regForm, subscribe: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[#B8860B] cursor-pointer shrink-0"
                />
                <span className="text-[var(--mc-text-dim)] text-sm leading-snug">
                  Subscribe me to exclusive offers, style tips & updates from MC Hair Salon
                </span>
              </label>

              {error && (
                <div className="border border-red-800/50 bg-red-950/20 px-4 py-3 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient-bg text-black font-bold py-4 text-base tracking-wide hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader size={18} className="animate-spin" /> Creating account…</>
                  : "Create Account & Claim 10% Off"}
              </button>

              <p className="text-center text-[var(--mc-text-dim)] text-xs leading-relaxed">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="text-[var(--mc-accent)] hover:underline">Terms & Conditions</Link>.
                Your 10% discount will be applied at your first appointment.
              </p>
            </form>
          )}

          {/* Switch view */}
          <div className="text-center border-t border-[var(--mc-border)] pt-5">
            {view === "signin" ? (
              <p className="text-[var(--mc-muted)] text-sm">
                New to MC Hair Salon?{" "}
                <button
                  type="button"
                  onClick={() => { setView("register"); setError(""); }}
                  className="text-[var(--mc-accent)] hover:underline font-semibold cursor-pointer"
                >
                  Create a free account — get 10% off
                </button>
              </p>
            ) : (
              <p className="text-[var(--mc-muted)] text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setView("signin"); setError(""); }}
                  className="text-[var(--mc-accent)] hover:underline font-semibold cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Call option — always visible */}
        <div className="mt-6 text-center border border-[var(--mc-border)] py-5 px-6">
          <p className="text-[var(--mc-muted)] text-sm mb-2">Prefer to speak with someone?</p>
          <a
            href="tel:+12129885252"
            className="inline-flex items-center gap-2 text-[var(--mc-accent)] font-semibold text-xl hover:opacity-80 transition-opacity"
          >
            <Phone size={20} />
            (212) 988-5252
          </a>
          <p className="text-[var(--mc-text-dim)] text-xs mt-1">We&apos;re happy to book your appointment by phone.</p>
        </div>

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
