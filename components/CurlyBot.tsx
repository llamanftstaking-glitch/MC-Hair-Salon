"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, ChevronDown, MessageSquare, BookOpen } from "lucide-react";

interface Message {
  from: "curly" | "user";
  text: string;
  time: string;
}

const FAQS = [
  {
    q: "Where are you located?",
    a: "We're at 336 East 78th St, New York, NY 10075 — right in the heart of the Upper East Side. Street parking is available nearby.",
  },
  {
    q: "What are your hours?",
    a: "Mon: 10 AM–5 PM · Tue–Thu: 10:30 AM–7:30 PM · Fri–Sat: 10 AM–7 PM · Sun: 11 AM–6 PM",
  },
  {
    q: "How do I book an appointment?",
    a: "You can book online at our Book page (takes 2 minutes!) or call us at (212) 988-5252. Walk-ins are welcome based on availability.",
  },
  {
    q: "What are your prices?",
    a: "Women's Cut from $45 · Men's Cut from $30 · Blowout from $33 · Highlights/Balayage from $120 · Full Color from $85 · Facials from $80 · Eyelash Extensions from $150. Full menu on our Services page.",
  },
  {
    q: "What color products do you use?",
    a: "We use L'Oréal Majerel and Inoa for all color services — professional grade, gentle, and long-lasting.",
  },
  {
    q: "Do you offer eyelash extensions?",
    a: "Yes! Eyelash extensions start from $150. We also offer facials from $80 and makeup application from $75.",
  },
  {
    q: "Do you accept walk-ins?",
    a: "Walk-ins are welcome based on stylist availability. For guaranteed service we recommend booking an appointment online or by phone.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We ask for at least 24 hours notice for cancellations or rescheduling. Just give us a call at (212) 988-5252.",
  },
  {
    q: "Do you offer gift cards?",
    a: "Yes! Gift cards are available — call us at (212) 988-5252 or visit the salon to purchase one for a friend or family member.",
  },
  {
    q: "Who are your stylists?",
    a: "Our team includes Kato (Master Stylist), Megan (Color Specialist), and other talented professionals. You can request a stylist when booking.",
  },
  {
    q: "How long has MC Hair Salon been open?",
    a: "MC Hair Salon & Spa has been serving the Upper East Side since 2011 — over 13 years of excellence!",
  },
  {
    q: "Do you do bridal or special event styling?",
    a: "Absolutely! Updos & Special Event Styling start from $75. We love being part of your big moments — book early!",
  },
];

const RESPONSES: { keys: string[]; text: string }[] = [
  { keys: ["hour", "open", "close", "time", "when", "schedule"], text: "Our hours are:\nMon: 10 AM–5 PM\nTue–Thu: 10:30 AM–7:30 PM\nFri–Sat: 10 AM–7 PM\nSun: 11 AM–6 PM" },
  { keys: ["address", "location", "where", "direction", "find you", "park"], text: "We're at 336 East 78th St, New York, NY 10075 — Upper East Side. Street parking is available on 78th St." },
  { keys: ["book", "appointment", "schedule", "reserve", "availability"], text: "You can book online at our /book page (super easy!) or call us at (212) 988-5252. Walk-ins welcome too, space permitting!" },
  { keys: ["price", "cost", "how much", "rate", "pricing", "fee", "charge"], text: "Some of our popular prices:\n• Women's Cut from $45\n• Men's Cut from $30\n• Blowout from $33\n• Balayage from $120\n• Full Color from $85\n• Facial from $80\nSee the full menu on our Services page!" },
  { keys: ["color", "dye", "product", "brand", "loreal", "majerel", "inoa"], text: "We use L'Oréal Majerel and Inoa for all color services — professional quality, ammonia-free options, and gorgeous results!" },
  { keys: ["lash", "eyelash", "extension", "facial", "spa", "makeup"], text: "Our spa services include Eyelash Extensions from $150, Facials from $80, and Makeup Application from $75. Treat yourself!" },
  { keys: ["walk", "walk-in", "walk in", "no appointment"], text: "Walk-ins are welcome based on availability! For the best experience we recommend booking ahead at /book or calling (212) 988-5252." },
  { keys: ["cancel", "cancellation", "reschedule", "change"], text: "We ask for 24 hours notice to cancel or reschedule. Just give us a ring at (212) 988-5252 and we'll sort it out!" },
  { keys: ["gift", "card", "present", "voucher"], text: "Gift cards are available! Stop by the salon or call (212) 988-5252 to purchase one. Perfect gift for any occasion!" },
  { keys: ["stylist", "kato", "megan", "who", "team", "staff"], text: "Our team includes Kato (Master Stylist), Megan (Color Specialist), and more talented pros. You can request a preferred stylist when booking!" },
  { keys: ["bridal", "wedding", "updo", "event", "special", "prom"], text: "We love special events! Updos & Special Event Styling start from $75. Book early to secure your date!" },
  { keys: ["phone", "call", "contact", "email", "reach"], text: "You can reach us at (212) 988-5252 or email info@mchairsalon.com. We're happy to help!" },
  { keys: ["instagram", "social", "follow", "photo", "gallery"], text: "Follow us on Instagram @mchairsalonspa for daily inspiration and our latest work! ✂️" },
  { keys: ["thank", "thanks", "awesome", "great", "perfect"], text: "You're so welcome! Is there anything else I can help you with? 😊" },
  { keys: ["bye", "goodbye", "see you", "later"], text: "See you soon at MC Hair Salon! Can't wait to take care of you. ✨" },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keys.some(k => lower.includes(k))) return r.text;
  }
  return "Great question! For more details you can visit our Services page, book online at /book, or call us directly at (212) 988-5252. We're always happy to help! 💛";
}

export default function CurlyBot() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "faq">("chat");
  const [messages, setMessages] = useState<Message[]>([
    { from: "curly", text: "Hey! Curly is here — how can I help you today? ✂️\n\nAsk me anything about our services, hours, pricing, or how to book!", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { from: "user", text, time: now() };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(p => [...p, { from: "curly", text: getBotReply(text), time: now() }]);
    }, 900);
  }

  function handleFaqClick(i: number, answer: string) {
    setOpenFaq(openFaq === i ? null : i);
    if (tab === "chat") {
      setMessages(p => [...p, { from: "curly", text: answer, time: now() }]);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-[#0a1628] shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        aria-label="Open Curly chat"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 2px rgba(184,134,11,0.3)" }}
      >
        {open ? (
          <ChevronDown size={22} className="text-white" />
        ) : (
          <div className="relative">
            <MessageSquare size={24} className="text-white" fill="white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--mc-accent)]" />
          </div>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[90] w-[360px] max-w-[calc(100vw-1.5rem)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ height: 540, boxShadow: "0 8px 40px rgba(0,0,0,0.7)" }}>

          {/* Header */}
          <div className="bg-[#0a1628] px-5 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--mc-accent)]/20 border border-[var(--mc-accent)]/40 flex items-center justify-center text-base">✂️</div>
                <div>
                  <p className="text-white font-semibold text-sm">Curly</p>
                  <p className="text-green-400 text-[10px] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white cursor-pointer transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Tabs */}
            <div className="flex gap-1 mt-3">
              {[{ id: "chat" as const, label: "Messages", icon: <MessageSquare size={13} /> },
                { id: "faq" as const, label: "FAQ", icon: <BookOpen size={13} /> }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    tab === t.id ? "bg-white text-[#0a1628]" : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat tab */}
          {tab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto bg-[#f0f2f5] p-4 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                    {m.from === "curly" && (
                      <div className="w-7 h-7 rounded-full bg-[#0a1628] flex items-center justify-center text-xs shrink-0 mr-2 mt-1">✂️</div>
                    )}
                    <div className={`max-w-[80%] ${m.from === "user" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        m.from === "user"
                          ? "bg-[#0a1628] text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[10px] text-gray-400 px-1">{m.time}</span>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0a1628] flex items-center justify-center text-xs shrink-0">✂️</div>
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-3 flex items-center gap-2 flex-shrink-0">
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Ask Curly anything..."
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 bg-gray-100 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0a1628]/20"
                />
                <button onClick={send} disabled={!input.trim()}
                  className="w-9 h-9 rounded-full bg-[#0a1628] flex items-center justify-center text-white disabled:opacity-30 cursor-pointer hover:bg-[#142036] transition-colors shrink-0">
                  <Send size={15} />
                </button>
              </div>
            </>
          )}

          {/* FAQ tab */}
          {tab === "faq" && (
            <div className="flex-1 overflow-y-auto bg-[#f0f2f5]">
              <div className="p-4 pb-2">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Frequently Asked Questions</p>
              </div>
              <div className="px-3 pb-4 space-y-2">
                {FAQS.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-800 pr-3 leading-snug">{faq.q}</span>
                      <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
