import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
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
            <div className="flex gap-3">
              {/* Instagram */}
              <a href={SALON_INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-10 h-10 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] hover:border-[var(--mc-accent)] transition-all duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href={SALON_INFO.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-10 h-10 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] hover:border-[var(--mc-accent)] transition-all duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[var(--mc-accent)] uppercase tracking-widest text-xs font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[["Services", "/services"], ["Gallery", "/gallery"], ["Makeup", "/makeup"], ["Weddings", "/weddings"], ["Packages", "/packages"], ["Our Team", "/team"], ["Book Appointment", "/book"], ["Gift Cards", "/gift-card"], ["Contact", "/contact"]].map(([label, href]) => (
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
