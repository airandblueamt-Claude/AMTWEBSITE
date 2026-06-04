// AuditoriumsTheaters.tsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

const AuditoriumsTheaters: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  const sections = [
    {
      title: t("av.auditoriums.sections.meetingRooms.title"),
      text: t("av.auditoriums.sections.meetingRooms.text"),
    },
    {
      title: t("av.auditoriums.sections.auditoriums.title"),
      text: t("av.auditoriums.sections.auditoriums.text"),
    },
    {
      title: t("av.auditoriums.sections.digitalSignage.title"),
      text: t("av.auditoriums.sections.digitalSignage.text"),
    },
    {
      title: t("av.auditoriums.sections.advanced.title"),
      text: t("av.auditoriums.sections.advanced.text"),
    },
    {
      title: t("av.auditoriums.sections.videoWall.title"),
      text: t("av.auditoriums.sections.videoWall.text"),
    },
    {
      title: t("av.auditoriums.sections.interactive.title"),
      text: t("av.auditoriums.sections.interactive.text"),
    },
    {
      title: t("av.auditoriums.sections.iptv.title"),
      text: t("av.auditoriums.sections.iptv.text"),
    },
    {
      title: t("av.auditoriums.sections.bgMusic.title"),
      text: t("av.auditoriums.sections.bgMusic.text"),
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45 },
    },
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="w-full text-ink">

      {/* ===== HEADER ===== */}
      <section className="relative py-24 md:py-28 px-6 md:px-12 text-center">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle, rgba(214,19,43,.18), transparent 60%)",
            filter: "blur(24px)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.span
            className="block text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4"
            initial={shouldReduceMotion ? {} : "hidden"}
            animate="visible"
            variants={fadeUp}
          >
            {t("nav.audioVisual", { defaultValue: "Audio Visual Systems" })}
          </motion.span>

          <motion.h1
            className="font-display text-4xl md:text-5xl font-extrabold text-gradient mb-6"
            initial={shouldReduceMotion ? {} : "hidden"}
            animate="visible"
            variants={fadeUp}
          >
            {t("av.auditoriums.title")}
          </motion.h1>

          <motion.p
            className="max-w-3xl mx-auto text-base md:text-lg text-copy leading-relaxed"
            initial={shouldReduceMotion ? {} : "hidden"}
            animate="visible"
            variants={fadeUp}
          >
            {t("av.auditoriums.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* ===== CARDS GRID ===== */}
      <section
        className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28"
        aria-label="Audio Visual Solutions"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((sec, idx) => (
            <motion.article
              key={idx}
              initial={shouldReduceMotion ? {} : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              transition={{ delay: (idx % 3) * 0.08 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              className="
                glass group relative rounded-2xl p-8
                border border-hairline
                transition-all duration-300
                hover:border-[#d6132b]/40
                hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]
                overflow-hidden
              "
            >
              {/* Accent Line */}
              <span
                className="
                  absolute top-0 ltr:left-0 rtl:right-0 h-full w-1
                  bg-gradient-to-b from-[#d6132b] to-[#f12942]
                "
                aria-hidden="true"
              />

              {/* Glow Effect */}
              <span
                className="
                  absolute inset-0
                  bg-gradient-to-br from-[#d6132b]/10 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                "
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-4 text-ink">
                  {sec.title}
                </h2>

                <p className="text-sm leading-relaxed text-muted">
                  {sec.text}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AuditoriumsTheaters;
