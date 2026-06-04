import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import OptimizedImage from "../components/OptimizedImage";

const FireAlarm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRTL = i18n.language.startsWith("ar");

  const functions = [
    t("lowCurrent.fireAlarm.function1"),
    t("lowCurrent.fireAlarm.function2"),
    t("lowCurrent.fireAlarm.function3"),
  ];

  const safetyTips = [
    { title: t("lowCurrent.fireAlarm.tip1Title"), desc: t("lowCurrent.fireAlarm.tip1Desc") },
    { title: t("lowCurrent.fireAlarm.tip2Title"), desc: t("lowCurrent.fireAlarm.tip2Desc") },
    { title: t("lowCurrent.fireAlarm.tip3Title"), desc: t("lowCurrent.fireAlarm.tip3Desc") },
    { title: t("lowCurrent.fireAlarm.tip4Title"), desc: t("lowCurrent.fireAlarm.tip4Desc") },
    { title: t("lowCurrent.fireAlarm.tip5Title"), desc: t("lowCurrent.fireAlarm.tip5Desc") },
    { title: t("lowCurrent.fireAlarm.tip6Title"), desc: t("lowCurrent.fireAlarm.tip6Desc") },
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
      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/images/num22.png"
            alt="Fire alarm system diagram and detection hardware — AMT low-current solutions"
            className="w-full h-full object-cover"
            width={1600}
            height={700}
            priority
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,6,22,.72) 0%, rgba(6,6,22,.55) 40%, rgba(6,6,22,.97) 96%)," +
                "radial-gradient(70% 60% at 50% 38%, transparent, rgba(6,6,22,.65))",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-36 text-center">
          <motion.p
            {...fadeUp(0)}
            className="text-[#ff8493] text-xs tracking-[0.2em] font-semibold uppercase mb-4"
          >
            {isRTL ? "أنظمة التيار المنخفض" : "Low-Current Systems"}
          </motion.p>
          <motion.h1
            {...fadeUp(0.08)}
            className="font-display text-4xl md:text-6xl font-extrabold leading-tight text-gradient"
          >
            {t("lowCurrent.fireAlarm.title")}
          </motion.h1>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-[#c7c8da]"
          >
            {t("lowCurrent.fireAlarm.description")}
          </motion.p>
        </div>
      </header>

      {/* ===== KEY FUNCTIONS ===== */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <motion.h2
          {...fadeUp(0)}
          className="text-2xl md:text-3xl font-bold text-ink text-center mb-12"
        >
          {t("lowCurrent.fireAlarm.keyFunctions")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {functions.map((fn, idx) => (
            <motion.div
              key={idx}
              {...fadeUp(idx * 0.1)}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="glass rounded-2xl p-6 text-copy leading-relaxed transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
            >
              <span className="block text-[#d6132b] text-sm font-semibold font-display mb-3">
                {String(idx + 1).padStart(2, "0")}
              </span>
              {fn}
            </motion.div>
          ))}
        </div>

        {/* ===== SECOND DESCRIPTION ===== */}
        <motion.p
          {...fadeUp(0.1)}
          className="mt-16 max-w-4xl mx-auto text-center text-base md:text-lg leading-relaxed text-muted"
        >
          {t("lowCurrent.fireAlarm.secondDescription")}
        </motion.p>
      </div>

      {/* ===== SAFETY TIPS ===== */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <motion.h2
          {...fadeUp(0)}
          className="text-3xl md:text-4xl font-bold text-gradient text-center mb-12"
        >
          {t("lowCurrent.fireAlarm.safetyTips")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyTips.map((tip, idx) => (
            <motion.div
              key={idx}
              {...fadeUp(idx * 0.08)}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
            >
              <h3 className="text-lg font-semibold text-ink mb-2">{tip.title}</h3>
              <p className="text-muted leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FireAlarm;
