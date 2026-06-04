import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const MasterClock: React.FC = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRTL = i18n.language.startsWith("ar");

  const sections = [
    {
      title: t("lowCurrent.masterClock.networkTitle"),
      desc: t("lowCurrent.masterClock.networkDesc"),
    },
    {
      title: t("lowCurrent.masterClock.precisionTitle"),
      desc: t("lowCurrent.masterClock.precisionDesc"),
    },
    {
      title: t("common.ourTrustedPartners"),
      desc: t("lowCurrent.masterClock.partnersDesc"),
    },
  ];

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay },
        };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 text-center">
        {/* ===== CLOCK ICON ===== */}
        <motion.div {...fadeUp(0)} className="text-[#d6132b] mb-8 flex justify-center">
          <AiOutlineClockCircle
            className="text-8xl md:text-9xl drop-shadow-[0_4px_30px_rgba(214,19,43,.5)]"
            aria-hidden="true"
          />
        </motion.div>

        {/* ===== TITLE ===== */}
        <motion.p
          {...fadeUp(0.05)}
          className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4"
        >
          {isRTL ? "أنظمة التوقيت" : "Time Systems"}
        </motion.p>
        <motion.h1
          {...fadeUp(0.1)}
          className="font-display text-4xl md:text-5xl font-extrabold text-gradient"
        >
          {t("lowCurrent.masterClock.title")}
        </motion.h1>

        {/* ===== DESCRIPTION ===== */}
        <motion.p
          {...fadeUp(0.18)}
          className="mt-6 max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-copy"
        >
          {t("lowCurrent.masterClock.description")}
        </motion.p>

        {/* ===== SECTIONS ===== */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          {sections.map((s, idx) => (
            <motion.div
              key={idx}
              {...fadeUp(idx * 0.1)}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="glass rounded-2xl p-8 transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
            >
              <h3 className="text-xl font-semibold text-ink mb-4">{s.title}</h3>
              <p className="text-muted leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MasterClock;
