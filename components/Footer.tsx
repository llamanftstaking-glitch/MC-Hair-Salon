import Link from "next/link";
import { Phone, MapPin, Clock } from "lucide-react";
import { getSalonInfo } from "@/lib/settings";

export default async function Footer() {
  const SALON_INFO = await getSalonInfo();
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
              {/* Yelp */}
              <a href="https://www.yelp.com/biz/mc-hair-salon-and-spa-new-york?osq=MC+Hair+Salon+%26+Spa" target="_blank" rel="noopener noreferrer" aria-label="Yelp"
                className="w-10 h-10 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] hover:border-[var(--mc-accent)] transition-all duration-200 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.16 12.594l-4.995 1.452c-.53.153-.96-.493-.61-.948l3.037-3.948c.352-.458 1.008-.249 1.166.288.43 1.438.34 2.432.402 3.156zM12.15 8.781l1.51-4.959c.16-.527-.367-.996-.877-.788C11.099 3.667 9.7 4.637 8.745 5.6c-.424.427-.212 1.058.334 1.195l4.04 1.079c.351.094.699-.168.8-.521l.231-.572zM11.285 14.515c.346-.411.004-.972-.495-1.112L5.76 11.94c-.523-.147-.952.372-.793.884.4 1.281 1.107 2.463 1.986 3.394.397.42 1.03.296 1.268-.23l1.94-4.107c.1-.21.06-.445-.096-.6l-.78-.766zM12.75 15.68l-1.998 4.8c-.21.506.27 1.009.787.847 1.378-.433 2.7-1.27 3.735-2.34.454-.469.29-1.183-.338-1.39l-1.64-.55c-.22-.073-.463-.018-.617.15l-.549.483zM12.422 12.82c.082.518.55.87 1.072.795l5.04-.724c.536-.077.784-.7.446-1.124-.874-1.088-2.01-1.96-3.23-2.51-.54-.243-1.13.095-1.207.685l-.483 3.879c-.025.2.023.401.148.558l.214.441z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[var(--mc-accent)] uppercase tracking-widest text-xs font-semibold mb-6">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[["Services", "/services"], ["Gallery", "/gallery"], ["Makeup", "/makeup"], ["Weddings", "/weddings"], ["Packages", "/packages"], ["Our Team", "/team"], ["About Us", "/about"], ["Journal", "/blog"], ["Rewards", "/rewards"], ["How to Get Here", "/visit"], ["Book", "/book"], ["Gift Cards", "/gift-card"], ["Contact", "/contact"]].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors text-xs sm:text-sm cursor-pointer">{label}</Link>
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

        {/* WeddingWire + The Knot strip */}
        <div className="border-t border-[var(--mc-border)] py-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 bg-[var(--mc-surface-dark)]">
          <p className="text-[var(--mc-text-dim)] text-[9px] uppercase tracking-[0.4em] shrink-0">Official Vendor On</p>
          <a href="https://www.weddingwire.com/biz/mc-hair-salon-and-spa/a3991b6360a5145a.html"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 group cursor-pointer">
            <span className="text-white font-bold text-sm tracking-tight group-hover:text-[var(--mc-accent)] transition-colors">WeddingWire</span>
            <div className="flex gap-0.5">
              {[0,1,2,3,4].map(i => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
          </a>
          <div className="w-px h-5 bg-[#222] hidden sm:block" />
          <a href="https://www.weddingwire.com/biz/mc-hair-salon-and-spa/a3991b6360a5145a.html"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 group cursor-pointer">
            <span className="text-white font-bold text-sm tracking-tight group-hover:text-[var(--mc-accent)] transition-colors">The Knot</span>
            <div className="flex gap-0.5">
              {[0,1,2,3,4].map(i => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
          </a>
        </div>

        <div className="border-t border-[var(--mc-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-[var(--mc-text-dim)] text-xs">© {new Date().getFullYear()} MC Hair Salon & Spa. All rights reserved.</p>
            <Link href="/terms" className="text-[var(--mc-text-dim)] text-xs hover:text-[var(--mc-accent)] transition-colors uppercase tracking-widest">Terms & Conditions</Link>
          </div>
          {/* LGBTQ+ Friendly badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded-sm overflow-hidden shrink-0" aria-hidden="true">
              <div className="h-[14.28%] w-full bg-[#FF0018]" />
              <div className="h-[14.28%] w-full bg-[#FF6600]" />
              <div className="h-[14.28%] w-full bg-[#FFDD00]" />
              <div className="h-[14.28%] w-full bg-[#008026]" />
              <div className="h-[14.28%] w-full bg-[#004DFF]" />
              <div className="h-[14.28%] w-full bg-[#750787]" />
              <div className="h-[14.28%] w-full bg-[#750787]" />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">LGBTQ+</p>
              <p className="text-[var(--mc-text-dim)] text-xs leading-tight">Friendly</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
