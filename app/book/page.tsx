"use client";
import { useState } from "react";
import { CheckCircle, Loader } from "lucide-react";
import { SERVICES, TEAM } from "@/lib/data";


const times = ["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM",
  "5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM"];

const allServices = SERVICES.flatMap(cat => cat.items.map(item => `${cat.category} – ${item.name}`));

export default function BookPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: "", stylist: "", date: "", time: "", notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Booking failed");
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", service: "", stylist: "", date: "", time: "", notes: "" });
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
  const labelClass = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  return (
    <>
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 bg-black text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Reserve Your Visit</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Book Appointment</h1>
        <p className="text-[var(--mc-muted)] max-w-xl mx-auto leading-relaxed">
          Fill out the form below and we&apos;ll confirm your appointment within 24 hours.
        </p>
      </section>

      <section className="py-16 px-6 bg-black">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <div className="text-center py-20 luxury-card p-12">
              <CheckCircle size={64} className="text-[var(--mc-accent)] mx-auto mb-6" />
              <h2 className="font-serif text-3xl font-bold text-white mb-4">Booking Received!</h2>
              <p className="text-[var(--mc-muted)] leading-relaxed mb-8">
                Thank you! We&apos;ll confirm your appointment within 24 hours via email or phone.
              </p>
              <button onClick={() => setSuccess(false)}
                className="gold-gradient-bg text-black font-bold px-10 py-3 uppercase tracking-widest text-sm hover:opacity-90 cursor-pointer">
                Book Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="luxury-card p-8 md:p-12 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={labelClass}>Full Name *</label>
                  <input id="name" name="name" type="text" required value={form.name}
                    onChange={handleChange} placeholder="Your full name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone *</label>
                  <input id="phone" name="phone" type="tel" required value={form.phone}
                    onChange={handleChange} placeholder="(212) 000-0000" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email *</label>
                <input id="email" name="email" type="email" required value={form.email}
                  onChange={handleChange} placeholder="your@email.com" className={inputClass} />
              </div>

              <div>
                <label htmlFor="service" className={labelClass}>Service *</label>
                <select id="service" name="service" required value={form.service}
                  onChange={handleChange} className={inputClass}>
                  <option value="">Select a service</option>
                  {allServices.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="stylist" className={labelClass}>Preferred Stylist</label>
                <select id="stylist" name="stylist" value={form.stylist}
                  onChange={handleChange} className={inputClass}>
                  <option value="">No preference</option>
                  {TEAM.map(t => <option key={t.name} value={t.name}>{t.name} – {t.role}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className={labelClass}>Date *</label>
                  <input id="date" name="date" type="date" required value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={inputClass} />
                </div>
                <div>
                  <label htmlFor="time" className={labelClass}>Time *</label>
                  <select id="time" name="time" required value={form.time}
                    onChange={handleChange} className={inputClass}>
                    <option value="">Select time</option>
                    {times.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className={labelClass}>Additional Notes</label>
                <textarea id="notes" name="notes" value={form.notes}
                  onChange={handleChange} rows={3} placeholder="Any special requests or notes..."
                  className={`${inputClass} resize-none`} />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer flex items-center justify-center gap-3">
                {loading ? <><Loader size={18} className="animate-spin" /> Processing...</> : "Confirm Booking"}
              </button>

              <p className="text-[#555] text-xs text-center">
                Or call us at <a href="tel:(212) 988-5252" className="text-[var(--mc-accent)] hover:underline cursor-pointer">(212) 988-5252</a>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
