// Vercel serverless function: POST /api/lead  (inquiry capture)
import { L, WA, LEAD_TO, EMAIL } from "./_amt.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  const b = req.body || {};
  const name = String(b.name || "").trim().slice(0, 120);
  const contact = String(b.contact || "").trim().slice(0, 160);
  const message = String(b.message || "").trim().slice(0, 2000);
  const lang = b.lang === "ar" ? "ar" : "en";
  if (!name || !contact || !message)
    return res.status(400).json({ ok: false, reply: L("Please fill in your name, contact and message.", "يرجى تعبئة الاسم ووسيلة التواصل والرسالة.", lang) });

  const summary = `New website inquiry\n\nName: ${name}\nContact: ${contact}\n\nMessage:\n${message}`;
  let emailed = false;
  if (process.env.SMTP_HOST) {
    try {
      const nodemailer = (await import("nodemailer")).default;
      const t = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      });
      await t.sendMail({
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

  const whatsapp = WA + "?text=" + encodeURIComponent(summary);
  const reply = emailed
    ? L(`Thanks ${name}! ✅ Your inquiry was emailed to our team — we'll reach out at ${contact}. You can also send it on WhatsApp below.`,
        `شكرًا ${name}! ✅ تم إرسال استفسارك إلى فريقنا عبر البريد — سنتواصل معك عبر ${contact}. يمكنك أيضًا إرساله عبر واتساب بالأسفل.`, lang)
    : L(`Thanks ${name}! I've opened WhatsApp with your inquiry pre-filled — just press send and it reaches our team. We'll reply at ${contact}.`,
        `شكرًا ${name}! فتحت لك واتساب ورسالتك جاهزة — فقط اضغط إرسال لتصل إلى فريقنا. سنرد عليك عبر ${contact}.`, lang);
  return res.status(200).json({ ok: true, emailed, whatsapp, reply });
}
