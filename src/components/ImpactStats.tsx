import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";

/**
 * ImpactStats — a premium "By the numbers" band with four animated counters.
 * Self-contained (no Sanity data). Theme-aware via semantic tokens, RTL-aware,
 * and respects reduced-motion (shows final numbers without counting).
 */

type Stat = {
  value: number;
  suffix: string;
  labelEn: string;
  labelAr: string;
};

const STATS: Stat[] = [
  { value: 15, suffix: "+", labelEn: "Years in the field", labelAr: "سنة في الميدان" },
  { value: 500, suffix: "+", labelEn: "Projects delivered", labelAr: "مشروع منجز" },
  { value: 40, suffix: "+", labelEn: "Technology partners", labelAr: "شريك تقني" },
  { value: 99, suffix: "%", labelEn: "Support uptime", labelAr: "جاهزية الدعم" },
];

const ImpactStats: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full"
      aria-label={isRTL ? "أرقامنا" : "By the numbers"}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* ===== HEADER ===== */}
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 max-w-2xl"
        >
          <p className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4">
            {isRTL ? "أرقامنا" : "By the Numbers"}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gradient">
            {isRTL ? "إنجازات تتحدث عن نفسها" : "Impact that speaks for itself"}
          </h2>
        </motion.header>

        {/* ===== STATS GRID ===== */}
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 * index }}
              whileHover={shouldReduceMotion ? {} : { y: -6 }}
              className="glass group relative overflow-hidden rounded-2xl border-hairline p-6 md:p-8 transition-all duration-300 hover:border-[#d6132b]/40 hover:shadow-[0_18px_50px_-16px_rgba(214,19,43,0.5)]"
            >
              {/* accent glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-12 ltr:-right-12 rtl:-left-12 h-32 w-32 rounded-full bg-[#d6132b]/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* number */}
              <div className="flex items-baseline gap-1 text-4xl md:text-6xl font-bold font-display leading-none">
                <span className="text-gradient">
                  {shouldReduceMotion || !inView ? (
                    shouldReduceMotion ? stat.value : 0
                  ) : (
                    <CountUp
                      end={stat.value}
                      duration={2}
                      separator=","
                    />
                  )}
                </span>
                <span className="text-2xl md:text-4xl font-semibold text-[#f12942]">
                  {stat.suffix}
                </span>
              </div>

              {/* accent rule */}
              <span
                aria-hidden
                className="mt-4 md:mt-5 block h-px w-10 bg-gradient-to-r from-[#d6132b] to-[#f12942] transition-all duration-300 group-hover:w-16"
              />

              {/* label */}
              <p className="mt-3 text-sm md:text-base font-medium text-muted">
                {isRTL ? stat.labelAr : stat.labelEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
