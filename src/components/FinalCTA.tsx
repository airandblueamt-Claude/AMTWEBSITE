import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

const WHATSAPP = "https://wa.me/966554593722";

const COPY = {
  en: {
    eyebrow: "Let's build it together",
    title: "Ready to scope your next rollout?",
    lead: "Tell us about your network, security, audio-visual, or data-center project — our experts respond fast.",
    primary: "Get in touch",
    whatsapp: "Chat on WhatsApp",
  },
  ar: {
    eyebrow: "لنبنِها معًا",
    title: "جاهز لتخطيط مشروعك القادم؟",
    lead: "أخبرنا عن مشروع الشبكات أو الأمن أو الصوت والصورة أو مراكز البيانات — وخبراؤنا يردّون بسرعة.",
    primary: "تواصل معنا",
    whatsapp: "تواصل عبر واتساب",
  },
};

const FinalCTA: React.FC = () => {
  const { i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const lang: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";
  const c = COPY[lang];

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] glass px-6 sm:px-10 md:px-16 py-14 md:py-20 text-center"
        >
          {/* red glow accents */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(214,19,43,.28), transparent 60%)", filter: "blur(20px)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#f12942] to-transparent" />

          <div className="relative">
            <span className="inline-block text-eyebrow text-xs tracking-[0.22em] font-semibold uppercase">
              {c.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gradient">
              {c.title}
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-copy text-base sm:text-lg">
              {c.lead}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to={withLocale("/contact", activeLocale)}
                className="btn-glow group inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-white"
              >
                {c.primary}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold text-ink hover:border-[#d6132b]/40 transition"
              >
                <FaWhatsapp className="text-[#25d366]" />
                {c.whatsapp}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
