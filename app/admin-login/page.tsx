"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "hello@mchairsalon.com",
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError("Incorrect password.");
        return;
      }
      if (!data.customer?.isAdmin) {
        setError("Access denied.");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="text-center mb-8">
          <p className="font-serif text-2xl font-bold text-white tracking-wide">MC Admin</p>
          <div className="h-px gold-gradient-bg w-16 mx-auto mt-3" />
        </div>

        <div>
          <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
            placeholder="Enter admin password"
            className="w-full bg-[#111] border border-[#2a2a2a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full gold-gradient-bg text-black font-bold py-3 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Verifying…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
