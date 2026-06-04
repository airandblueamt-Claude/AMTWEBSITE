// AMT backend — AI assistant API.
// POST /api/chat  -> real Claude when ANTHROPIC_API_KEY is set, else a grounded
// offline responder. CORS-enabled so the Vite frontend can call it in dev.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

// Lock CORS to known origins (configurable via ALLOWED_ORIGINS, comma-separated).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,http://localhost:5174,https://amt-arabia.net,https://www.amt-arabia.net")
  .split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    // allow same-origin / server-to-server (no Origin header) and the allowlist
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
}));
app.use(express.json({ limit: "256kb" }));

// Tiny in-memory per-IP fixed-window rate limiter (no extra deps).
const rlBuckets = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket.remoteAddress || "unknown";
    const now = Date.now();
    let b = rlBuckets.get(ip);
    if (!b || now > b.reset) { b = { count: 0, reset: now + windowMs }; rlBuckets.set(ip, b); }
    b.count++;
    if (b.count > max) {
      const lang = req.body && req.body.lang === "ar" ? "ar" : "en";
      return res.status(429).json({ reply: L("You're sending messages too quickly — please wait a moment.", "ترسل الرسائل بسرعة كبيرة — يرجى الانتظار قليلاً.", lang) });
    }
    next();
  };
}
// Periodically drop stale buckets to bound memory.
setInterval(() => {
  const now = Date.now();
  for (const [ip, b] of rlBuckets) if (now > b.reset) rlBuckets.delete(ip);
}, 5 * 60 * 1000).unref?.();

const PORT = process.env.PORT || 8787;
const WA = "https://wa.me/966554593722";
const EMAIL = "info@amt-arabia.net";
const LEAD_TO = process.env.LEAD_TO || EMAIL;

// Optional email transport for inquiries (configure SMTP_* in backend/.env to enable).
let mailer = null;
if (process.env.SMTP_HOST) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

// ---- AI provider (all OpenAI-compatible except Anthropic) ----
// Pick a FREE one by setting AI_PROVIDER + AI_API_KEY in backend/.env.
const PROVIDERS = {
  groq:       { base: "https://api.groq.com/openai/v1",                 model: "llama-3.3-70b-versatile",            openai: true },
  gemini:     { base: "https://generativelanguage.googleapis.com/v1beta/openai", model: "gemini-2.0-flash",          openai: true },
  openrouter: { base: "https://openrouter.ai/api/v1",                   model: "meta-llama/llama-3.3-70b-instruct:free", openai: true },
  ollama:     { base: "http://localhost:11434/v1",                      model: "llama3.2",                           openai: true, keyless: true },
  anthropic:  { base: "https://api.anthropic.com",                      model: "claude-haiku-4-5-20251001",          openai: false },
};

// Back-compat: ANTHROPIC_API_KEY alone still selects Anthropic.
let PROVIDER = (process.env.AI_PROVIDER || "").trim().toLowerCase();
let API_KEY = (process.env.AI_API_KEY || "").trim();
if (!PROVIDER && process.env.ANTHROPIC_API_KEY) { PROVIDER = "anthropic"; API_KEY = process.env.ANTHROPIC_API_KEY.trim(); }
const CFG = PROVIDERS[PROVIDER] || null;
const MODEL = (process.env.AI_MODEL || process.env.AMT_MODEL || (CFG && CFG.model) || "").trim();
const BASE = (process.env.AI_BASE_URL || (CFG && CFG.base) || "").trim();
const AI_ON = !!CFG && (CFG.keyless || !!API_KEY);

const KB = {
  name: "Advanced Micro Technologies (AMT)",
  group: "A Member of Alika Holding Group",
  location: "Eastern Province, Saudi Arabia",
  summary:
    "AMT is a Saudi systems integrator delivering enterprise ICT, low-current systems, audio-visual integration, modular data centers, and physical security across the Kingdom — design, deployment, and support end to end.",
  solutions: [
    { key: "ict", en: "ICT Solutions", ar: "حلول تقنية المعلومات", blurb: "Enterprise connectivity, structured cabling, campus & WAN networks, IP telephony.", tags: ["network", "wan", "campus", "cabling", "ip telephony", "voip", "unified communications", "wireless", "ict"] },
    { key: "lowcurrent", en: "Low Current Solutions", ar: "حلول التيار الخفيف", blurb: "Fire alarm, access control, and integrated low-current systems.", tags: ["fire alarm", "access control", "low current", "intrusion", "master clock"] },
    { key: "av", en: "Audio Visual Systems", ar: "أنظمة الصوت والصورة", blurb: "Conference rooms, auditoriums, video walls, digital signage, IPTV, interactive screens.", tags: ["audio visual", "av", "video wall", "digital signage", "iptv", "interactive", "conference", "auditorium", "meeting"] },
    { key: "datacenter", en: "Modular Data Centers", ar: "مراكز بيانات معيارية", blurb: "Pre-engineered, scalable modular data centers with power, cooling, monitoring.", tags: ["data center", "datacenter", "modular", "cooling", "rack", "power"] },
    { key: "security", en: "Physical Security Solutions", ar: "حلول الأمن المادي", blurb: "CCTV & IP video with analytics, access control, command-center integration.", tags: ["cctv", "security", "surveillance", "ip video", "analytics", "vms", "command center", "camera"] },
  ],
};

const L = (en, ar, lang) => (lang === "ar" ? ar : en);

function offline(msg, lang) {
  const t = (msg || "").toLowerCase();
  const wa = { label: L("Chat on WhatsApp", "تواصل عبر واتساب", lang), href: WA };
  const has = (arr) => arr.some((w) => t.includes(w));

  if (has(["hi", "hello", "hey", "مرحب", "السلام", "اهلا", "أهلا", "هاي"]))
    return { reply: L("Hello! 👋 How can I help — a specific system (networks, CCTV, AV, data center, fire & access) or a full project?", "أهلاً! 👋 كيف أساعدك — نظام محدد (شبكات، كاميرات، صوت وصورة، مركز بيانات، إنذار ودخول) أم مشروع كامل؟", lang), quick: [L("Our solutions", "حلولنا", lang), L("Get a quote", "أريد عرض سعر", lang)] };

  if (has(["human", "agent", "sales", "call", "representative", "person", "موظف", "مبيعات", "اتصل", "تواصل", "بشري"]))
    return { reply: L("Of course — our team will be glad to help. Tap below to reach us on WhatsApp.", "بالتأكيد — سيسعد فريقنا بمساعدتك. اضغط بالأسفل للتواصل عبر واتساب.", lang), action: wa };

  if (has(["quote", "price", "cost", "budget", "proposal", "estimate", "سعر", "تكلفة", "عرض", "ميزانية"]))
    return { reply: L("Happy to scope a proposal. Quick details:\n• Which systems? (network / CCTV / AV / data center / fire & access)\n• How many sites or rooms?\n• Rough timeline?\nShare these and I'll route it to our engineers — or reach us on WhatsApp.", "يسعدنا إعداد عرض. تفاصيل سريعة:\n• أي الأنظمة؟ (شبكات / كاميرات / صوت وصورة / مركز بيانات / إنذار ودخول)\n• كم عدد المواقع أو القاعات؟\n• الجدول الزمني؟\nشاركها وسأحوّلها لمهندسينا — أو تواصل عبر واتساب.", lang), action: wa };

  if (has(["where", "location", "about", "who are you", "أين", "اين", "موقع", "من انتم", "من أنتم", "عنكم"]))
    return { reply: L(`${KB.name} (${KB.group}) is based in ${KB.location}. ${KB.summary}`, "شركة الأبعاد المترامية للتقنية (عضو في مجموعة أليكا القابضة)، مقرها المنطقة الشرقية بالسعودية. نصمّم وننفّذ وندعم حلول تقنية المعلومات والتيار الخفيف والصوت والصورة ومراكز البيانات والأمن المادي.", lang), quick: [L("Our solutions", "حلولنا", lang)] };

  let best = null, score = 0;
  for (const s of KB.solutions) {
    const sc = s.tags.filter((tag) => t.includes(tag)).length + (t.includes(s.en.toLowerCase()) ? 2 : 0);
    if (sc > score) { best = s; score = sc; }
  }
  if (best)
    return { reply: L(`${best.en} — ${best.blurb}\n\nWant me to scope this for your site, or connect you with an engineer?`, `${best.ar} — ${best.blurb}\n\nهل ترغب أن أخطّط هذا لموقعك أو أوصلك بمهندس؟`, lang), action: wa, quick: [L("Get a quote", "أريد عرض سعر", lang)] };

  if (has(["solution", "service", "offer", "حلول", "خدمات", "تقدمون"]))
    return { reply: L(`We integrate five pillars:\n${KB.solutions.map((s) => s.en).join(" · ")}.\nWhich fits your project?`, `ندمج خمس ركائز:\n${KB.solutions.map((s) => s.ar).join(" · ")}.\nأيها يناسب مشروعك؟`, lang), quick: KB.solutions.slice(0, 3).map((s) => (lang === "ar" ? s.ar : s.en)) };

  return { reply: L("AMT covers enterprise ICT, low-current (fire & access), audio-visual, modular data centers, and physical security across Saudi Arabia. Tell me about your project and I'll point you to the right solution.", "تغطّي AMT حلول تقنية المعلومات والتيار الخفيف (إنذار ودخول) والصوت والصورة ومراكز البيانات والأمن المادي في السعودية. أخبرني عن مشروعك وسأوجّهك للحل المناسب.", lang), action: wa, quick: [L("Our solutions", "حلولنا", lang), L("Get a quote", "أريد عرض سعر", lang)] };
}

function systemPrompt(lang) {
  return (
    `You are the AMT Assistant, a warm, concise sales assistant for ${KB.name} (${KB.group}) in ${KB.location}. ` +
    `${KB.summary}\nSolutions: ${KB.solutions.map((s) => `${s.en} (${s.blurb})`).join("; ")}.\n` +
    `WhatsApp ${WA}, email ${EMAIL}. Goal: help visitors find the right solution and move them toward contacting AMT. ` +
    `Be specific and brief (2-4 sentences), ask one qualifying question when useful, discuss only AMT's services. ` +
    `Reply in ${lang === "ar" ? "Arabic" : "English"}.`
  );
}

function trimmedHistory(history, msg) {
  const messages = (history || [])
    .filter((h) => h && (h.role === "user" || h.role === "assistant") && h.content)
    .map((h) => ({ role: h.role, content: String(h.content).slice(0, 2000) }));
  if (!messages.length || messages[messages.length - 1].content !== msg) messages.push({ role: "user", content: msg });
  return messages;
}

function withAction(reply, msg, lang) {
  const out = { reply };
  if (/whatsapp|contact|quote|سعر|واتساب|تواصل/i.test(msg + " " + reply))
    out.action = { label: L("Chat on WhatsApp", "تواصل عبر واتساب", lang), href: WA };
  return out;
}

// OpenAI-compatible: Groq, Gemini, OpenRouter, Ollama, etc.
async function chatOpenAI(msg, lang, history) {
  const messages = [{ role: "system", content: systemPrompt(lang) }, ...trimmedHistory(history, msg)];
  const headers = { "content-type": "application/json" };
  if (API_KEY) headers.authorization = "Bearer " + API_KEY;
  if (PROVIDER === "openrouter") { headers["HTTP-Referer"] = "https://amt-arabia.net"; headers["X-Title"] = "AMT Assistant"; }
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST", headers,
    body: JSON.stringify({ model: MODEL, max_tokens: 400, temperature: 0.4, messages }),
  });
  if (!res.ok) throw new Error(`${PROVIDER} ${res.status}`);
  const data = await res.json();
  const reply = (data.choices?.[0]?.message?.content || "").trim();
  return withAction(reply, msg, lang);
}

// Anthropic native (kept for anyone with Claude credits).
async function chatAnthropic(msg, lang, history) {
  const res = await fetch(`${BASE}/v1/messages`, {
    method: "POST",
    headers: { "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 400, system: systemPrompt(lang), messages: trimmedHistory(history, msg) }),
  });
  if (!res.ok) throw new Error("anthropic " + res.status);
  const data = await res.json();
  const reply = (data.content || []).map((p) => p.text || "").join("").trim();
  return withAction(reply, msg, lang);
}

async function chatAI(msg, lang, history) {
  return CFG.openai ? chatOpenAI(msg, lang, history) : chatAnthropic(msg, lang, history);
}

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, ai: AI_ON ? `${PROVIDER}:${MODEL}` : "offline" }));

app.post("/api/chat", rateLimit(30, 60_000), async (req, res) => {
  try {
    const msg = String((req.body && req.body.message) || "").trim().slice(0, 1000);
    const lang = req.body && req.body.lang === "ar" ? "ar" : "en";
    const history = (req.body && req.body.history) || [];
    if (!msg) return res.json({ reply: L("Please type a message.", "يرجى كتابة رسالة.", lang) });
    if (AI_ON) {
      try { return res.json(await chatAI(msg, lang, history)); }
      catch (e) { console.warn("AI fallback:", e.message); return res.json(offline(msg, lang)); }
    }
    return res.json(offline(msg, lang));
  } catch {
    return res.status(500).json({ reply: "Server error." });
  }
});

// Inquiry capture — the assistant collects name + contact + message and sends it.
app.post("/api/lead", rateLimit(10, 60_000), async (req, res) => {
  try {
    const b = req.body || {};
    const name = String(b.name || "").trim().slice(0, 120);
    const contact = String(b.contact || "").trim().slice(0, 160);
    const message = String(b.message || "").trim().slice(0, 2000);
    const lang = b.lang === "ar" ? "ar" : "en";
    if (!name || !contact || !message)
      return res.status(400).json({ ok: false, reply: L("Please fill in your name, contact and message.", "يرجى تعبئة الاسم ووسيلة التواصل والرسالة.", lang) });

    const summary = `New website inquiry\n\nName: ${name}\nContact: ${contact}\n\nMessage:\n${message}`;
    let emailed = false;
    if (mailer) {
      try {
        await mailer.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER || EMAIL,
          to: LEAD_TO,
          replyTo: contact.includes("@") ? contact : undefined,
          subject: `AMT website inquiry — ${name}`,
          text: summary,
        });
        emailed = true;
      } catch (e) { console.warn("lead email failed:", e.message); }
    } else {
      console.log("LEAD (no SMTP configured):\n" + summary);
    }
    // Prefilled WhatsApp link so the inquiry actually reaches AMT in one tap.
    const whatsapp = WA + "?text=" + encodeURIComponent(summary);
    // Honest confirmation: only claim it was emailed when SMTP actually sent it.
    const reply = emailed
      ? L(
          `Thanks ${name}! ✅ Your inquiry was emailed to our team — we'll reach out at ${contact}. You can also send it on WhatsApp below.`,
          `شكرًا ${name}! ✅ تم إرسال استفسارك إلى فريقنا عبر البريد — سنتواصل معك عبر ${contact}. يمكنك أيضًا إرساله عبر واتساب بالأسفل.`,
          lang
        )
      : L(
          `Thanks ${name}! I've opened WhatsApp with your inquiry pre-filled — just press send and it reaches our team. We'll reply at ${contact}.`,
          `شكرًا ${name}! فتحت لك واتساب ورسالتك جاهزة — فقط اضغط إرسال لتصل إلى فريقنا. سنرد عليك عبر ${contact}.`,
          lang
        );
    return res.json({ ok: true, emailed, whatsapp, reply });
  } catch {
    return res.status(500).json({ ok: false, reply: "Server error." });
  }
});

// Same-origin Sanity read proxy (mirrors api/sanity.js for local dev via the Vite proxy).
app.post("/api/sanity", async (req, res) => {
  const { query, params } = req.body || {};
  if (!query || typeof query !== "string") return res.status(400).json({ result: null });
  const u = new URL("https://lgtz8nod.apicdn.sanity.io/v2024-01-01/data/query/production");
  u.searchParams.set("query", query);
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) u.searchParams.set("$" + k, JSON.stringify(v));
  }
  try {
    const r = await fetch(u.toString());
    if (!r.ok) return res.status(502).json({ result: null });
    const data = await r.json();
    return res.json({ result: data.result ?? null });
  } catch (e) {
    return res.status(502).json({ result: null, error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`AMT backend on :${PORT} | AI: ${AI_ON ? PROVIDER + " " + MODEL : "offline grounded responder"} | mail: ${mailer ? "on" : "off (WhatsApp handoff)"}`);
});
