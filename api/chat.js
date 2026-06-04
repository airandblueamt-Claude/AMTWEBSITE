// Vercel serverless function: POST /api/chat
import { L, offline, chatAI, AI_ON } from "./_amt.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ reply: "Method not allowed" });
  const b = req.body || {};
  const msg = String(b.message || "").trim().slice(0, 1000);
  const lang = b.lang === "ar" ? "ar" : "en";
  const history = b.history || [];
  if (!msg) return res.status(200).json({ reply: L("Please type a message.", "يرجى كتابة رسالة.", lang) });
  if (AI_ON) {
    try {
      return res.status(200).json(await chatAI(msg, lang, history));
    } catch (e) {
      console.warn("AI fallback:", e.message);
      return res.status(200).json(offline(msg, lang));
    }
  }
  return res.status(200).json(offline(msg, lang));
}
