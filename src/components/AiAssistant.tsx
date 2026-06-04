import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageSquare, X, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

type Role = "user" | "bot";
interface Msg { role: Role; text: string; }
interface Action { label: string; href: string; }

const API_BASE = (import.meta.env as Record<string, string | undefined>).VITE_CHAT_API ?? "/api";
const CHAT = API_BASE.endsWith("/api") ? `${API_BASE}/chat` : API_BASE; // back-compat
const LEAD = API_BASE.endsWith("/api") ? `${API_BASE}/lead` : "/api/lead";
const WHATSAPP = "https://wa.me/966554593722";

const COPY = {
  en: {
    title: "AMT Assistant", status: "Online · replies in seconds",
    placeholder: "Ask about our services…",
    greet: "Hi 👋 I'm the AMT assistant. Ask me about ICT, security, audio-visual, data-center, or low-current solutions — or send us your project inquiry and our team will follow up.",
    quick: ["Our solutions", "Get a quote"], inquiry: "📨 Send an inquiry",
    err: "I'm having trouble reaching the server right now. You can reach our team on WhatsApp anytime.",
    aria: "Chat with the AMT assistant",
    formTitle: "Send your inquiry", name: "Your name", contact: "Email or phone",
    message: "Tell us about your project…", send: "Send inquiry", cancel: "Cancel", sending: "Sending…",
    onWhatsApp: "Send on WhatsApp",
  },
  ar: {
    title: "مساعد AMT", status: "متصل · يرد خلال ثوانٍ",
    placeholder: "اسأل عن خدماتنا…",
    greet: "مرحبًا 👋 أنا مساعد AMT. اسألني عن حلول تقنية المعلومات أو الأمن أو الصوت والصورة أو مراكز البيانات أو التيار الخفيف — أو أرسل لنا استفسار مشروعك وسيتواصل فريقنا معك.",
    quick: ["حلولنا", "أريد عرض سعر"], inquiry: "📨 إرسال استفسار",
    err: "أواجه صعوبة في الوصول إلى الخادم حاليًا. يمكنك التواصل مع فريقنا عبر واتساب في أي وقت.",
    aria: "المحادثة مع مساعد AMT",
    formTitle: "أرسل استفسارك", name: "الاسم", contact: "البريد أو الجوال",
    message: "أخبرنا عن مشروعك…", send: "إرسال الاستفسار", cancel: "إلغاء", sending: "جارٍ الإرسال…",
    onWhatsApp: "الإرسال عبر واتساب",
  },
};

const AiAssistant: React.FC = () => {
  const { i18n } = useTranslation();
  const lang: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";
  const c = COPY[lang];

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [quick, setQuick] = useState<string[]>([]);
  const [action, setAction] = useState<Action | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [lead, setLead] = useState({ name: "", contact: "", message: "" });
  const [sending, setSending] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const greeted = useRef(false);

  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      setMsgs([{ role: "bot", text: c.greet }]);
      setQuick([...c.quick, c.inquiry]);
    }
  }, [open, c.greet, c.quick, c.inquiry]);

  useEffect(() => {
    greeted.current = false;
    setMsgs([]); setQuick([]); setAction(null); setFormOpen(false);
  }, [lang]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading, formOpen]);

  async function send(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    setInput(""); setQuick([]); setAction(null);
    const history = msgs.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
    setMsgs((m) => [...m, { role: "user", text: message }]);
    setLoading(true);
    try {
      const res = await fetch(CHAT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lang, history: history.slice(-10) }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "bot", text: data.reply || c.err }]);
      if (data.action?.href) setAction(data.action as Action);
      const q = Array.isArray(data.quick) ? data.quick : [];
      setQuick([...q, c.inquiry]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: c.err }]);
      setAction({ label: c.onWhatsApp, href: WHATSAPP });
    } finally { setLoading(false); }
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    // Build the WhatsApp link client-side and open it NOW, inside the click gesture —
    // doing it after the await would get popup-blocked. This is the real delivery path.
    const waText =
      lang === "ar"
        ? `استفسار جديد من ${lead.name} (${lead.contact}):\n${lead.message}`
        : `New inquiry from ${lead.name} (${lead.contact}):\n${lead.message}`;
    const waUrl = `${WHATSAPP}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    setSending(true);
    try {
      const res = await fetch(LEAD, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, lang }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "bot", text: data.reply || c.err }]);
      setAction({ label: c.onWhatsApp, href: data.whatsapp || waUrl });
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: c.err }]);
      setAction({ label: c.onWhatsApp, href: waUrl });
    } finally {
      setSending(false);
      setFormOpen(false);
      setLead({ name: "", contact: "", message: "" });
    }
  }

  const onQuick = (q: string) => (q === c.inquiry ? (setFormOpen(true), setQuick([])) : send(q));
  const side = isRTL ? "left-5" : "right-5";
  const field = "w-full bg-canvas border border-hairline rounded-xl px-3 py-2 text-ink text-sm outline-none focus:border-[#d6132b] focus:ring-2 focus:ring-[#d6132b]/20 placeholder:text-muted";

  return (
    <div className={`fixed bottom-5 ${side} z-[60]`} dir={isRTL ? "rtl" : "ltr"}>
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={`absolute bottom-[76px] ${isRTL ? "left-0" : "right-0"} w-[min(380px,calc(100vw-2.5rem))] h-[min(580px,calc(100vh-7rem))] flex flex-col overflow-hidden rounded-3xl border border-hairline bg-canvas shadow-2xl`}
            role="dialog" aria-label={c.aria}
          >
            {/* header */}
            <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-[#080844] to-[#D6132B]/50 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-white text-[#080844] font-extrabold text-sm shadow">AI</span>
                <div className="leading-tight">
                  <strong className="text-white text-[0.98rem]">{c.title}</strong>
                  <div className="text-[#ffd4d9] text-[0.72rem]">{c.status}</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/80 hover:text-white"><X size={22} /></button>
            </header>

            {/* log */}
            <div ref={logRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[84%] px-3.5 py-2.5 rounded-2xl text-[0.92rem] leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-[#D6132B] text-white rounded-br-md"
                      : "bg-panel text-copy border border-hairline rounded-bl-md"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 px-3.5 py-3 rounded-2xl bg-panel border border-hairline">
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-muted"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1, delay: d * 0.18 }} />
                    ))}
                  </div>
                </div>
              )}
              {action && (
                <a href={action.href} target="_blank" rel="noopener noreferrer"
                  className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25d366]/15 border border-[#25d366]/60 text-[#1fa855] text-[0.88rem] font-semibold hover:bg-[#25d366]/25 transition">
                  <FaWhatsapp /> {action.label}
                </a>
              )}

              {/* inquiry form */}
              {formOpen && (
                <form onSubmit={submitLead} className="mt-1 p-3 rounded-2xl bg-panel border border-hairline flex flex-col gap-2">
                  <strong className="text-ink text-sm">{c.formTitle}</strong>
                  <input className={field} required placeholder={c.name}
                    value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
                  <input className={field} required placeholder={c.contact}
                    value={lead.contact} onChange={(e) => setLead({ ...lead, contact: e.target.value })} />
                  <textarea className={field} required rows={3} placeholder={c.message}
                    value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} />
                  <div className="flex gap-2">
                    <button type="submit" disabled={sending}
                      className="btn-glow flex-1 rounded-xl px-3 py-2 text-white text-sm font-semibold disabled:opacity-60">
                      {sending ? c.sending : c.send}
                    </button>
                    <button type="button" onClick={() => setFormOpen(false)}
                      className="rounded-xl px-3 py-2 text-muted text-sm border border-hairline hover:text-ink">
                      {c.cancel}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* quick replies */}
            {quick.length > 0 && !formOpen && (
              <div className="flex flex-wrap gap-2 px-4 pb-1">
                {quick.map((q) => (
                  <button key={q} onClick={() => onQuick(q)}
                    className="px-3 py-1.5 rounded-full border border-hairline text-copy text-[0.82rem] hover:border-[#d6132b] hover:text-[#d6132b] transition">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form onSubmit={(e) => { e.preventDefault(); void send(); }} className="flex gap-2 p-3 border-t border-hairline">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={c.placeholder}
                className="flex-1 bg-panel border border-hairline rounded-xl px-3.5 py-2.5 text-ink text-[0.92rem] outline-none focus:border-[#d6132b] focus:ring-2 focus:ring-[#d6132b]/20 placeholder:text-muted" />
              <button type="submit" aria-label="Send"
                className="grid place-items-center w-11 rounded-xl bg-[#D6132B] text-white hover:brightness-110 transition disabled:opacity-50" disabled={loading}>
                <Send size={18} className={isRTL ? "-scale-x-100" : ""} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
        aria-label={c.aria}
        className="relative grid place-items-center w-[62px] h-[62px] rounded-full text-white shadow-xl bg-gradient-to-br from-[#D6132B] to-[#080844]"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={26} /></motion.span>
            : <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageSquare size={26} /></motion.span>}
        </AnimatePresence>
        {!open && <span className="absolute inset-0 rounded-full border-2 border-[#D6132B] animate-ping opacity-60" />}
      </motion.button>
    </div>
  );
};

export default AiAssistant;
