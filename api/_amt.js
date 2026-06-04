// Shared AI-assistant logic for the Vercel serverless functions (api/chat.js, api/lead.js).
// Reads provider config from environment variables (set them in the Vercel dashboard).

export const WA = "https://wa.me/966554593722";
export const EMAIL = "info@amt-arabia.net";
export const LEAD_TO = process.env.LEAD_TO || EMAIL;

const PROVIDERS = {
  groq:       { base: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile", openai: true },
  gemini:     { base: "https://generativelanguage.googleapis.com/v1beta/openai", model: "gemini-2.0-flash", openai: true },
  openrouter: { base: "https://openrouter.ai/api/v1", model: "meta-llama/llama-3.3-70b-instruct:free", openai: true },
  ollama:     { base: "http://localhost:11434/v1", model: "llama3.2", openai: true, keyless: true },
  anthropic:  { base: "https://api.anthropic.com", model: "claude-haiku-4-5-20251001", openai: false },
};

let PROVIDER = (process.env.AI_PROVIDER || "").trim().toLowerCase();
let API_KEY = (process.env.AI_API_KEY || "").trim();
if (!PROVIDER && process.env.ANTHROPIC_API_KEY) { PROVIDER = "anthropic"; API_KEY = process.env.ANTHROPIC_API_KEY.trim(); }
const CFG = PROVIDERS[PROVIDER] || null;
const MODEL = (process.env.AI_MODEL || process.env.AMT_MODEL || (CFG && CFG.model) || "").trim();
const BASE = (process.env.AI_BASE_URL || (CFG && CFG.base) || "").trim();
export const AI_ON = !!CFG && (CFG.keyless || !!API_KEY);

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

export const L = (en, ar, lang) => (lang === "ar" ? ar : en);

export function offline(msg, lang) {
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
  return withAction((data.choices?.[0]?.message?.content || "").trim(), msg, lang);
}
async function chatAnthropic(msg, lang, history) {
  const res = await fetch(`${BASE}/v1/messages`, {
    method: "POST",
    headers: { "x-api-key": API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 400, system: systemPrompt(lang), messages: trimmedHistory(history, msg) }),
  });
  if (!res.ok) throw new Error("anthropic " + res.status);
  const data = await res.json();
  return withAction((data.content || []).map((p) => p.text || "").join("").trim(), msg, lang);
}
export async function chatAI(msg, lang, history) {
  return CFG.openai ? chatOpenAI(msg, lang, history) : chatAnthropic(msg, lang, history);
}
