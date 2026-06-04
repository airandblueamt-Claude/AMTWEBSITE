import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import OptimizedImage from "../components/OptimizedImage";

const AccessControl: React.FC = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRTL = i18n.language.startsWith("ar");

  const featureCards = [
    {
      title: t("lowCurrent.accessControl.onguard.title"),
      desc: t("lowCurrent.accessControl.onguard.desc"),
    },
    {
      title: t("lowCurrent.accessControl.openIntegration.title"),
      desc: t("lowCurrent.accessControl.openIntegration.desc"),
    },
    {
      title: t("lowCurrent.accessControl.videoManagement.title"),
      desc: t("lowCurrent.accessControl.videoManagement.desc"),
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
      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/images/num55.png"
            alt="Physical access control and badge reader systems — AMT Lenel integration"
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
            {isRTL ? "التحكم في الوصول" : "Access Control"}
          </motion.p>
          <motion.h1
            {...fadeUp(0.08)}
            className="font-display text-4xl md:text-6xl font-extrabold leading-tight text-gradient"
          >
            {t("lowCurrent.accessControl.title")}
          </motion.h1>
        </div>
      </header>

      {/* ===== INTRO ===== */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <motion.p
          {...fadeUp(0)}
          className="max-w-4xl mx-auto text-center text-base md:text-lg leading-relaxed text-copy"
        >
          {t("lowCurrent.accessControl.description")}
        </motion.p>

        {/* ===== FEATURE CARDS ===== */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCards.map((item, idx) => (
            <motion.div
              key={idx}
              {...fadeUp(idx * 0.1)}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="glass rounded-2xl p-8 transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
            >
              <span className="block text-[#d6132b] text-sm font-semibold font-display mb-3">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-bold text-ink mb-4">{item.title}</h3>
              <p className="text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ===== PARTNERS BAND ===== */}
        <motion.div
          {...fadeUp(0.1)}
          className="glass relative overflow-hidden rounded-2xl p-10 md:p-14 mt-16 text-center"
        >
          <div
            className="absolute -top-24 ltr:-right-20 rtl:-left-20 w-[28rem] h-[28rem] rounded-full pointer-events-none"
            aria-hidden="true"
            style={{
              background: "radial-gradient(circle, rgba(214,19,43,.25), transparent 60%)",
              filter: "blur(20px)",
            }}
          />
          <h3 className="relative text-2xl md:text-3xl font-bold text-gradient mb-6">
            {t("common.ourTrustedPartners")}
          </h3>
          <p className="relative text-base md:text-lg leading-relaxed max-w-4xl mx-auto text-copy">
            {t("lowCurrent.accessControl.partnersDesc")}
          </p>
          <p className="relative text-base md:text-lg leading-relaxed mt-6 max-w-4xl mx-auto font-semibold text-ink">
            {t("lowCurrent.accessControl.partnersContact")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AccessControl;
