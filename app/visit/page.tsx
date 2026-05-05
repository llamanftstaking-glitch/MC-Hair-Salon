"use client";

import { useState } from "react";
import {
  MapPin, Train, Car, ParkingSquare, Compass,
  ExternalLink, ChevronRight, Clock, Phone,
} from "lucide-react";
import Link from "next/link";

// ── Tab definitions ────────────────────────────────────────────────────────────

type TabId = "subway" | "bus" | "driving" | "parking" | "newcomers";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "subway",    label: "Subway",    icon: <Train size={15} />       },
  { id: "bus",       label: "Bus",       icon: <Compass size={15} />     },
  { id: "driving",   label: "Driving",   icon: <Car size={15} />         },
  { id: "parking",   label: "Parking",   icon: <ParkingSquare size={15} /> },
  { id: "newcomers", label: "New Here?", icon: <MapPin size={15} />      },
];

// ── Reusable sub-components ────────────────────────────────────────────────────

function RouteCard({
  line, color, from, steps, time,
}: {
  line: string; color: string; from: string; steps: string[]; time: string;
}) {
  return (
    <div className="border border-[#1a1a1a] bg-[#080808] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: color }}
          >
            {line}
          </span>
          <div>
            <p className="text-white font-semibold text-sm">{from}</p>
            <p className="text-[#555] text-xs">to MC Hair Salon & Spa</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[var(--mc-accent)] font-bold text-sm">{time}</p>
          <p className="text-[#444] text-[10px] uppercase tracking-widest">walk</p>
        </div>
      </div>
      <ol className="space-y-2 pl-1">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--mc-muted)]">
            <span className="mt-0.5 w-4 h-4 rounded-full border border-[#333] flex items-center justify-center text-[9px] text-[#555] shrink-0">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function InfoCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="border border-[#1a1a1a] bg-[#080808] p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[var(--mc-accent)]">{icon}</span>
        <p className="text-white font-semibold text-sm">{title}</p>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[var(--mc-muted)] leading-relaxed">
            <ChevronRight size={11} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Tab content ────────────────────────────────────────────────────────────────

function SubwayTab() {
  return (
    <div className="space-y-5">
      <p className="text-[var(--mc-muted)] text-sm leading-relaxed">
        The <strong className="text-white">6 train</strong> is your best bet — the 77th St station puts you
        half a block from the salon. The Q train at 72nd St is a 6-minute walk and equally convenient.
      </p>

      <RouteCard
        line="6" color="#00933C" from="6 Train → 77th St Station"
        time="~2 min"
        steps={[
          "Take the 6 train (Lexington Ave Local) to 77th St – Hunter College.",
          "Exit at the northeast corner of Lex & 77th.",
          "Walk one block east on 77th St to 2nd Ave, then one block north to 78th St.",
          "Turn right — MC Hair Salon & Spa is at 336 East 78th St on the south side of the street.",
        ]}
      />

      <RouteCard
        line="Q" color="#FCCC0A" from="Q Train → 72nd St Station"
        time="~6 min"
        steps={[
          "Take the Q train (2nd Ave Subway) to 72nd St – 2nd Ave.",
          "Exit onto 2nd Ave heading north.",
          "Walk north on 2nd Ave for 6 blocks (about 6 minutes) to 78th St.",
          "Turn right — MC Hair Salon & Spa is mid-block at 336 East 78th St.",
        ]}
      />

      <div className="border border-[var(--mc-accent)]/20 bg-[#0a0800] p-4 text-xs text-[#888] leading-relaxed">
        <strong className="text-[var(--mc-accent)]">Pro tip:</strong> The Q train runs 24/7 along 2nd Ave.
        The 6 train runs frequently during salon hours. Both are a short, flat walk with no stairs to navigate
        after exiting the station.
      </div>
    </div>
  );
}

function BusTab() {
  return (
    <div className="space-y-5">
      <p className="text-[var(--mc-muted)] text-sm leading-relaxed">
        Several MTA bus lines stop within a block of the salon, making it easy to reach from
        the West Side, Midtown, and surrounding neighborhoods.
      </p>

      <div className="grid gap-4">
        <InfoCard
          icon={<Train size={15} />}
          title="M79 SBS — Crosstown 79th St (Best from West Side)"
          items={[
            "Runs east–west along 79th St across the park.",
            "Board at 79th St & Broadway (or anywhere along 79th St) and ride to the 2nd Ave stop.",
            "Walk one block south to 78th St and turn left — the salon is mid-block.",
            "Accepts MetroCard and OMNY tap-to-pay.",
          ]}
        />
        <InfoCard
          icon={<Train size={15} />}
          title="M15 / M15-SBS — 1st & 2nd Ave (Best from Midtown or Downtown)"
          items={[
            "The M15 runs up 2nd Ave and down 1st Ave along the entire East Side.",
            "Northbound stop: 2nd Ave & 79th St — one block from the salon.",
            "SBS (Select Bus Service) requires fare payment at the street kiosk before boarding.",
            "Frequent service — usually every 4–8 minutes during salon hours.",
          ]}
        />
        <InfoCard
          icon={<Train size={15} />}
          title="M31 — 57th St / York Ave (From Midtown East)"
          items={[
            "Runs north along York Ave (one block east of 1st Ave).",
            "Alight at York Ave & 78th St and walk two blocks west to the salon.",
            "Good option if you're coming from the 57th St area or Sutton Place.",
          ]}
        />
      </div>

      <div className="border border-[var(--mc-accent)]/20 bg-[#0a0800] p-4 text-xs text-[#888] leading-relaxed">
        <strong className="text-[var(--mc-accent)]">MTA Bus Time:</strong> Download the{" "}
        <strong className="text-white">MYmta</strong> app or visit mta.info to check real-time bus arrivals
        before you head out.
      </div>
    </div>
  );
}

function DrivingTab() {
  return (
    <div className="space-y-5">
      <p className="text-[var(--mc-muted)] text-sm leading-relaxed">
        The salon is located on East 78th St between 1st and 2nd Avenues on Manhattan&apos;s Upper East Side.
        The FDR Drive is the fastest approach from most directions.
      </p>

      <div className="grid gap-4">
        <InfoCard
          icon={<Car size={15} />}
          title="From Midtown / Downtown Manhattan"
          items={[
            "Head east on any crosstown street to 2nd Ave or 1st Ave.",
            "Turn north and continue to 78th St.",
            "Turn east on 78th St — the salon is at 336, between 1st and 2nd Ave.",
            "Alternatively: take the FDR Drive north to Exit 10 (71st–79th St), then head west on 78th St.",
          ]}
        />
        <InfoCard
          icon={<Car size={15} />}
          title="From the West Side / New Jersey (via GWB or Lincoln Tunnel)"
          items={[
            "Cross to Manhattan via GWB, Lincoln Tunnel, or the Henry Hudson Pkwy.",
            "Take the 79th St crosstown (M79 route) east through Central Park.",
            "Continue east on 79th St past Lexington Ave to 2nd Ave.",
            "Turn south one block to 78th St, then east — salon is mid-block.",
          ]}
        />
        <InfoCard
          icon={<Car size={15} />}
          title="From Queens / Long Island (via Queens-Midtown Tunnel)"
          items={[
            "Take the Queens-Midtown Tunnel to 34th St. Head north on 2nd Ave.",
            "Continue north on 2nd Ave all the way to 78th St (about 2 miles, 10–15 min).",
            "Turn right — the salon is at 336 East 78th St on the right side.",
          ]}
        />
        <InfoCard
          icon={<Car size={15} />}
          title="From the Bronx / Upstate (via FDR Drive)"
          items={[
            "Take the FDR Drive south. Use Exit 10 (71st–79th St).",
            "Follow the exit ramp to 79th St heading west.",
            "Turn south on 2nd Ave, then west on 78th St — salon is mid-block on the left.",
          ]}
        />
      </div>

      <a
        href="https://maps.google.com/?q=336+East+78th+St+New+York+NY+10075&mode=driving"
        target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full border border-[var(--mc-accent)]/40 text-[var(--mc-accent)] py-3 text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/5 transition-all cursor-pointer"
      >
        <ExternalLink size={13} /> Open in Google Maps
      </a>
    </div>
  );
}

function ParkingTab() {
  return (
    <div className="space-y-5">
      <p className="text-[var(--mc-muted)] text-sm leading-relaxed">
        Street parking on the Upper East Side can be competitive, but there are reliable options near the salon.
        We recommend arriving 10–15 minutes early to allow time to park.
      </p>

      <div className="grid gap-4">
        <InfoCard
          icon={<ParkingSquare size={15} />}
          title="Street Parking — East 78th St"
          items={[
            "Metered parking is available on both sides of East 78th St between 1st and 2nd Ave.",
            "Meters run Monday–Saturday 8 AM – 7 PM. Sunday and early mornings are often free.",
            "2-hour maximum on most meters. Bring quarters or use the ParkNYC app.",
            "Check signs carefully — alternate-side street cleaning applies on certain days.",
          ]}
        />
        <InfoCard
          icon={<ParkingSquare size={15} />}
          title="Nearby Parking Garages"
          items={[
            "Central Parking — 400 East 77th St (1 block south). Open daily, hourly and daily rates.",
            "Quik Park — 350 East 82nd St (4 blocks north). Good option for longer appointments.",
            "Icon Parking — 1st Ave & 72nd St (6 blocks south). Typically lower hourly rates.",
            "Most garages accept credit cards. Expect $15–$30 for 1–2 hours in this neighborhood.",
          ]}
        />
        <InfoCard
          icon={<ParkingSquare size={15} />}
          title="Smart Parking Tips"
          items={[
            "Use the SpotHero or ParkWhiz apps to reserve a garage spot at a discounted rate in advance.",
            "Weekday mornings before noon tend to have more street spots available.",
            "Saturday afternoons are the busiest — give yourself extra time or book a garage.",
            "The salon is on the south side of 78th St, so approach from 2nd Ave for the easiest drop-off.",
          ]}
        />
      </div>

      <div className="border border-[var(--mc-accent)]/20 bg-[#0a0800] p-4 text-xs text-[#888] leading-relaxed">
        <strong className="text-[var(--mc-accent)]">Rideshare drop-off:</strong> Uber and Lyft drivers can
        pull up directly in front of 336 East 78th St. The entrance is mid-block — no awkward corner stops.
      </div>
    </div>
  );
}

function NewcomersTab() {
  return (
    <div className="space-y-5">
      <p className="text-[var(--mc-muted)] text-sm leading-relaxed">
        First time visiting the Upper East Side? Here&apos;s everything you need to feel at home
        before, during, and after your appointment.
      </p>

      <div className="grid gap-4">
        <InfoCard
          icon={<MapPin size={15} />}
          title="Finding the Salon"
          items={[
            "The address is 336 East 78th St — \"East\" means east of 5th Ave (the park side). We're between 1st and 2nd Avenues.",
            "Manhattan's avenues run north–south; streets run east–west. Numbers increase as you go north.",
            "The building entrance is mid-block on the south side of 78th St. Look for our signage.",
            "If you reach 1st Ave or 2nd Ave, you've gone too far — turn around and walk toward the middle of the block.",
          ]}
        />
        <InfoCard
          icon={<Compass size={15} />}
          title="Neighborhood Landmarks"
          items={[
            "We're 3 blocks from the Metropolitan Museum of Art (The Met) on 5th Ave.",
            "Lenox Hill Hospital is nearby on 77th St — a useful landmark if giving directions to a friend.",
            "Fairway Market on 86th & 2nd is the nearest grocery store (8 blocks north).",
            "The 6 train at 77th St & Lexington Ave is the closest subway — exit and walk east.",
          ]}
        />
        <InfoCard
          icon={<Clock size={15} />}
          title="Before Your Appointment"
          items={[
            "Arrive 5–10 minutes early, especially if parking. We'll have you checked in quickly.",
            "Wear a button-down or zip-up top if possible — it makes hair and spa services much easier.",
            "For color services, avoid wearing your best shirt. Some color may transfer during service.",
            "Bring any inspiration photos on your phone — stylists love reference images.",
          ]}
        />
        <InfoCard
          icon={<Phone size={15} />}
          title="Running Late or Need Help?"
          items={[
            "Call us at (212) 988-5252 and we'll hold your spot for up to 10 minutes.",
            "If you're more than 15 minutes late we may need to shorten or reschedule your service.",
            "Walk-ins are welcome when space allows — call ahead to check availability.",
            "Accessible entry is available — please call us to arrange assistance if needed.",
          ]}
        />
      </div>

      <div className="border border-[#1a1a1a] bg-[#080808] p-5">
        <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-4">Salon Hours</p>
        <div className="space-y-2">
          {[
            ["Monday",             "9:30 AM – 4:00 PM",  "By Appointment Only"],
            ["Tuesday – Thursday", "10:30 AM – 7:30 PM", ""],
            ["Friday",             "10:00 AM – 7:00 PM", ""],
            ["Saturday",           "10:00 AM – 7:00 PM", ""],
            ["Sunday",             "11:00 AM – 6:00 PM", ""],
          ].map(([day, hours, note]) => (
            <div key={day} className="flex justify-between text-sm gap-4">
              <span className="text-[#555] shrink-0">{day}</span>
              <span className="text-right">
                <span className="text-white">{hours}</span>
                {note && <span className="block text-[var(--mc-accent)] text-[10px] uppercase tracking-widest mt-0.5">{note}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<TabId, React.ReactNode> = {
  subway:    <SubwayTab />,
  bus:       <BusTab />,
  driving:   <DrivingTab />,
  parking:   <ParkingTab />,
  newcomers: <NewcomersTab />,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VisitPage() {
  const [activeTab, setActiveTab] = useState<TabId>("subway");

  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-10 px-6 bg-[var(--mc-bg)] text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Find Us</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          How to Get Here
        </h1>
        <p className="text-[var(--mc-muted)] text-sm max-w-md mx-auto">
          336 East 78th St · Upper East Side · New York, NY 10075
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-[#555] uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><Train size={12} className="text-[var(--mc-accent)]" /> 6 · Q Trains</span>
          <span className="flex items-center gap-1.5"><Car size={12} className="text-[var(--mc-accent)]" /> FDR Drive access</span>
          <span className="flex items-center gap-1.5"><ParkingSquare size={12} className="text-[var(--mc-accent)]" /> Nearby garages</span>
        </div>
      </section>

      {/* Map */}
      <section className="relative h-[360px] sm:h-[440px] bg-[#080808]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.4826707!2d-73.9533!3d40.7726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258b38f3aaaab%3A0x1234!2s336+E+78th+St%2C+New+York%2C+NY+10075!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%" height="100%"
          style={{ border: 0, filter: "grayscale(100%) invert(85%) contrast(75%)" }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title="MC Hair Salon & Spa — 336 East 78th St, New York"
        />
        {/* Pin overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-end justify-end p-4 sm:p-6">
          <a
            href="https://maps.google.com/?q=336+East+78th+St+New+York+NY+10075"
            target="_blank" rel="noopener noreferrer"
            className="pointer-events-auto flex items-center gap-2 bg-black/90 border border-[var(--mc-accent)]/40 text-[var(--mc-accent)] px-4 py-2.5 text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] transition-all cursor-pointer backdrop-blur-sm"
          >
            <ExternalLink size={12} /> Open in Maps
          </a>
        </div>
      </section>

      {/* Directions tabs */}
      <section className="py-16 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-3xl mx-auto">

          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto pb-1 mb-8 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  activeTab === tab.id
                    ? "border-[var(--mc-accent)] text-[var(--mc-accent)] bg-[var(--mc-accent)]/5"
                    : "border-[#1a1a1a] text-[#555] hover:border-[#333] hover:text-[#888]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div key={activeTab} style={{ animation: "fadeUp 0.18s ease-out both" }}>
            {TAB_CONTENT[activeTab]}
          </div>

        </div>
      </section>

      {/* Bottom CTA strip */}
      <section className="border-t border-[#111] bg-[#080808] py-10 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-semibold mb-1">Ready to book your appointment?</p>
            <p className="text-[#555] text-sm">Walk-ins welcome · Call ahead to confirm availability</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:+12129885252"
              className="flex items-center gap-2 border border-[#222] text-[#888] px-5 py-3 text-xs uppercase tracking-widest hover:border-[#444] hover:text-white transition-all cursor-pointer">
              <Phone size={13} /> Call Us
            </a>
            <Link href="/book"
              className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-6 py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
              Book Now <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
