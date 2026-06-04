import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import OptimizedImage from "../components/OptimizedImage";

const CCTV: React.FC = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRTL = i18n.language.startsWith("ar");

  const deploymentPoints = [
    t("lowCurrent.cctv.deploymentPoints.point1"),
    t("lowCurrent.cctv.deploymentPoints.point2"),
    t("lowCurrent.cctv.deploymentPoints.point3"),
    t("lowCurrent.cctv.deploymentPoints.point4"),
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        {/* ===== HERO IMAGE ===== */}
        <motion.div
          {...fadeUp(0)}
          className="rounded-2xl overflow-hidden border border-hairline mb-12"
        >
          <OptimizedImage
            src="/images/CCTV_solutions.png"
            alt="CCTV and enterprise video surveillance solutions — AMT security integration"
            className="w-full object-cover"
            width={1280}
            height={600}
            priority
          />
        </motion.div>

        {/* ===== TITLE + INTRO ===== */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.p
            {...fadeUp(0.05)}
            className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4"
          >
            {isRTL ? "أنظمة المراقبة" : "Video Surveillance"}
          </motion.p>
          <motion.h1
            {...fadeUp(0.1)}
            className="font-display text-4xl md:text-5xl font-extrabold text-gradient"
          >
            {t("lowCurrent.cctv.title")}
          </motion.h1>
          <motion.p
            {...fadeUp(0.18)}
            className="mt-6 text-base md:text-lg leading-relaxed text-copy"
          >
            {t("lowCurrent.cctv.description")}
          </motion.p>
        </div>

        {/* ===== DEPLOYMENT ===== */}
        <motion.div
          {...fadeUp(0.1)}
          whileHover={shouldReduceMotion ? {} : { y: -4 }}
          className="glass rounded-2xl p-8 mt-14 transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
        >
          <h2 className="text-2xl font-semibold text-ink text-center mb-6">
            {t("lowCurrent.cctv.deployment")}
          </h2>
          <ul className="space-y-3 max-w-3xl mx-auto">
            {deploymentPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-muted leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6132b]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ===== CLOUD SOLUTIONS ===== */}
        <motion.div
          {...fadeUp(0.1)}
          whileHover={shouldReduceMotion ? {} : { y: -4 }}
          className="glass rounded-2xl p-8 mt-8 transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
        >
          <h2 className="text-2xl font-semibold text-ink text-center mb-4">
            {t("lowCurrent.cctv.cloudTitle")}
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            {t("lowCurrent.cctv.cloudDesc")}
          </p>
        </motion.div>

        {/* ===== VIDEO MANAGEMENT SOFTWARE ===== */}
        <motion.div
          {...fadeUp(0.1)}
          whileHover={shouldReduceMotion ? {} : { y: -4 }}
          className="glass rounded-2xl p-8 mt-8 transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
        >
          <h2 className="text-2xl font-bold text-ink text-center mb-6">
            {t("lowCurrent.cctv.vmsTitle")}
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            {t("lowCurrent.cctv.vmsDesc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CCTV;
