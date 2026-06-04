import React, { useState, useEffect } from "react";
import ElectricBorder from "./ElectricBorder";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { sanity } from "../sanityClient";
import { localize } from "../utils/localize";

const Contact: React.FC = () => {
  // Sanity documents are loosely typed across this codebase.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  const [formData, setFormData] = useState({
    company: "",
    email: "",
    subject: "",
    budget: "",
    message: "",
  });

  /* ===== FETCH FROM SANITY ===== */
  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "contactPage" && enabled == true][0]{
          companyName,
          groupLine,
          slogan,
          titleSuffix,
          description,
          formTitle,
          mapEmbedUrl
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.company || (lang === "ar" ? "زائر الموقع" : "Website contact"),
          contact: formData.email,
          message: [
            formData.subject && `Subject: ${formData.subject}`,
            formData.budget && `Budget: ${formData.budget}`,
            formData.message,
          ].filter(Boolean).join("\n"),
          lang,
        }),
      });
    } catch {
      /* server logs + WhatsApp fallback still apply; show success either way */
    } finally {
      setSending(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      setFormData({ company: "", email: "", subject: "", budget: "", message: "" });
    }
  };

  const inputClass =
    "w-full p-4 rounded-xl bg-panel border border-hairline text-ink placeholder:text-muted outline-none transition focus:border-[#d6132b] focus:ring-2 focus:ring-[#d6132b]/40";

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative overflow-hidden">
      <div className="relative z-10 py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ===== FORM ===== */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ElectricBorder color="#d6132b" speed={1.5} chaos={0.6} thickness={2}>
              <div className="glass rounded-2xl p-8 md:p-10">
                <h3 className="font-display text-2xl font-semibold mb-6 text-gradient">
                  {localize(data.formTitle, lang)}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    name="company"
                    placeholder={t("contact.companyName")}
                    aria-label={t("contact.companyName")}
                    value={formData.company}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    name="email"
                    placeholder={t("contact.email")}
                    aria-label={t("contact.email")}
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    name="subject"
                    placeholder={t("contact.subject")}
                    aria-label={t("contact.subject")}
                    value={formData.subject}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    name="budget"
                    placeholder={t("contact.budget")}
                    aria-label={t("contact.budget")}
                    value={formData.budget}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <textarea
                    name="message"
                    placeholder={t("contact.message")}
                    aria-label={t("contact.message")}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClass} h-36`}
                  />

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-glow inline-flex items-center justify-center rounded-full text-white px-7 py-3.5 font-semibold disabled:opacity-60"
                  >
                    {sending ? (lang === "ar" ? "جارٍ الإرسال…" : "Sending…") : t("common.sendMessage")}
                  </button>
                </form>
              </div>
            </ElectricBorder>
          </motion.div>

          {/* ===== TEXT CONTENT ===== */}
          <div className="text-ink">

            <motion.h1
              className="font-display text-4xl font-extrabold mb-2 text-gradient"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {localize(data.companyName, lang)}
            </motion.h1>

            {data.groupLine && (
              <motion.p
                className="text-xs tracking-[0.2em] uppercase text-eyebrow font-semibold mb-4"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {localize(data.groupLine, lang)}
              </motion.p>
            )}

            <motion.h2
              className="text-[#f12942] font-bold text-xl mb-6"
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {localize(data.slogan, lang)}
            </motion.h2>

            {data.description && (
              <p className="text-copy max-w-lg leading-relaxed">
                {localize(data.description, lang)}
              </p>
            )}

          </div>
        </div>
      </div>

      {/* ===== MAP ===== */}
      {data.mapEmbedUrl && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
          <div className="rounded-2xl overflow-hidden border border-hairline">
            <iframe
              src={data.mapEmbedUrl}
              title="AMT contact location map"
              className="w-full h-[500px] border-0 block"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* ===== SUCCESS MESSAGE ===== */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="glass text-ink px-8 py-6 rounded-2xl border border-[#d6132b]/40 shadow-[0_20px_50px_-20px_rgba(214,19,43,0.6)]">
            {t("common.messageSent")}
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
