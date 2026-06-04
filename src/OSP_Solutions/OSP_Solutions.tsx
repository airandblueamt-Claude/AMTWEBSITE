// src/OSP_Solutions/OSP_Solutions.tsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

const OSP_Solutions: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const isRTL = i18n.language.startsWith("ar");

  const blocks = [
    t("osp.block1"),
    t("osp.block2"),
    t("osp.block3"),
    t("osp.block4"),
  ];

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="overflow-hidden text-copy">

      {/* ===== HERO ===== */}
      <section className="relative px-6 md:px-12 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.p
            initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4"
          >
            {isRTL ? "حلول الشبكات الخارجية" : "Outside Plant Solutions"}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display font-extrabold leading-[1.05] text-4xl md:text-6xl max-w-3xl text-gradient"
          >
            {t("osp.title")}
            <br />
            {t("osp.titleLine2")}
          </motion.h1>
        </div>
      </section>

      {/* ===== CONTENT FLOW ===== */}
      <section className="relative px-6 md:px-12 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {blocks.map((block, i) => (
            <motion.div
              key={i}
              initial={reduceMotion ? {} : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.06 * i }}
              whileHover={reduceMotion ? {} : { y: -4 }}
              className="glass group relative rounded-2xl p-7 md:p-8 transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
            >
              <span className="text-[#d6132b] text-sm font-semibold font-display">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-copy">
                {block}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative px-6 md:px-12 pb-28">
        <motion.div
          initial={reduceMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass max-w-7xl mx-auto rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold leading-tight text-gradient max-w-2xl">
            {t("osp.cta")}
          </h2>

          <button
            onClick={() => navigate(withLocale("/contact", activeLocale))}
            className="btn-glow group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white shrink-0"
            aria-label="Contact AMT for OSP solutions"
          >
            {t("common.contact")}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </button>
        </motion.div>
      </section>

    </main>
  );
};

export default OSP_Solutions;
