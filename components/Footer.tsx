import Link from "next/link";
import { Globe, Share2, Phone, MapPin, Clock } from "lucide-react";
import { SALON_INFO } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[var(--mc-surface-dark)] border-t border-[var(--mc-border)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl gold-gradient font-bold mb-4">MC Hair Salon & Spa</h3>
            <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed mb-6">
              Upper East Side's premier luxury salon since {SALON_INFO.established}. Where elegance meets expertise.
            </p>
            <div className="flex gap-4">
              <a href={SALON_INFO.instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] hover:border-[var(--mc-accent)] transition-all duration-200 cursor-pointer">
                <Globe size={18} />
              </a>
              <a href={SALON_INFO.facebook} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] hover:border-[var(--mc-accent)] transition-all duration-200 cursor-pointer">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[var(--mc-accent)] uppercase tracking-widest text-xs font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[["Services", "/services"], ["Gallery", "/gallery"], ["Our Team", "/team"], ["Book Appointment", "/book"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors text-sm cursor-pointer">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--mc-accent)] uppercase tracking-widest text-xs font-semibold mb-6">Hours</h4>
            <ul className="space-y-2">
              {SALON_INFO.hours.map((h) => (
                <li key={h.day} className="flex justify-between text-sm">
                  <span className="text-[var(--mc-text-dim)]">{h.day}</span>
                  <span className="text-[var(--mc-muted)]">{h.open} – {h.close}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--mc-accent)] uppercase tracking-widest text-xs font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-[var(--mc-text-dim)]">
                <MapPin size={16} className="text-[var(--mc-accent)] shrink-0 mt-0.5" />
                <span>{SALON_INFO.address}</span>
              </li>
              <li className="flex gap-3 text-sm text-[var(--mc-text-dim)]">
                <Phone size={16} className="text-[var(--mc-accent)] shrink-0" />
                <a href={`tel:${SALON_INFO.phone}`} className="hover:text-[var(--mc-accent)] transition-colors cursor-pointer">{SALON_INFO.phone}</a>
              </li>
              <li className="flex gap-3 text-sm text-[var(--mc-text-dim)]">
                <Clock size={16} className="text-[var(--mc-accent)] shrink-0" />
                <span>Walk-ins welcome</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--mc-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--mc-text-dim)] text-xs">© {new Date().getFullYear()} MC Hair Salon & Spa. All rights reserved.</p>
          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 border border-[var(--mc-accent)]/40 text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:bg-[var(--mc-accent)/10] hover:border-[var(--mc-accent)] transition-all duration-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="3" height="11" x="13" y="2" rx="1"/><rect width="3" height="7" x="18" y="6" rx="1"/><rect width="3" height="16" x="8" y="5" rx="1"/><rect width="3" height="11" x="3" y="11" rx="1"/></svg>
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
