// VideoWallMounting.tsx
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

const VideoWallMounting: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  const blocks = [
    {
      title: t("av.videoWall.blocks.precision.title"),
      text: t("av.videoWall.blocks.precision.text"),
    },
    {
      title: t("av.videoWall.blocks.multiAxis.title"),
      text: t("av.videoWall.blocks.multiAxis.text"),
    },
    {
      title: t("av.videoWall.blocks.maintenance.title"),
      text: t("av.videoWall.blocks.maintenance.text"),
    },
    {
      title: t("av.videoWall.blocks.architectural.title"),
      text: t("av.videoWall.blocks.architectural.text"),
    },
    {
      title: t("av.videoWall.blocks.scalable.title"),
      text: t("av.videoWall.blocks.scalable.text"),
    },
  ];

  const cardClass = `
    glass group relative rounded-2xl border border-hairline overflow-hidden
    transition-all duration-300 hover:border-[#d6132b]/40
    hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]
  `;

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="w-full text-ink">

      {/* ===== HEADER ===== */}
      <section className="relative px-6 md:px-12 pt-28 pb-20 max-w-7xl mx-auto">
        <div
          className="absolute -top-24 ltr:-right-20 rtl:-left-20 w-[42rem] h-[42rem] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle, rgba(214,19,43,.18), transparent 60%)",
            filter: "blur(24px)",
          }}
        />
        <div className="relative z-10">
          <motion.span
            initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="block text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4"
          >
            {t("nav.audioVisual", { defaultValue: "Audio Visual Systems" })}
          </motion.span>

          <motion.h1
            initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-gradient"
          >
            {t("av.videoWall.title")}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-2xl text-base md:text-lg text-copy leading-relaxed"
          >
            {t("av.videoWall.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* ===== MODULAR CANVAS ===== */}
      <section className="px-6 md:px-12 pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

          {/* Large block */}
          <motion.article
            className={`col-span-12 md:col-span-7 p-10 ${cardClass}`}
            initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <span
              className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-1 bg-gradient-to-b from-[#d6132b] to-[#f12942]"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 bg-gradient-to-br from-[#d6132b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-ink">
                {blocks[0].title}
              </h2>
              <p className="text-base md:text-lg text-muted leading-relaxed">
                {blocks[0].text}
              </p>
            </div>
          </motion.article>

          {/* Tall block */}
          <motion.article
            className={`col-span-12 md:col-span-5 p-10 ${cardClass}`}
            initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <span
              className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-1 bg-gradient-to-b from-[#d6132b] to-[#f12942]"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 bg-gradient-to-br from-[#d6132b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4 text-ink">
                {blocks[1].title}
              </h2>
              <p className="text-base text-muted leading-relaxed">
                {blocks[1].text}
              </p>
            </div>
          </motion.article>

          {/* Two medium blocks */}
          <motion.article
            className={`col-span-12 md:col-span-4 p-8 ${cardClass}`}
            initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <span
              className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-1 bg-gradient-to-b from-[#d6132b] to-[#f12942]"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 bg-gradient-to-br from-[#d6132b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-3 text-ink">
                {blocks[2].title}
              </h2>
              <p className="text-base text-muted leading-relaxed">
                {blocks[2].text}
              </p>
            </div>
          </motion.article>

          <motion.article
            className={`col-span-12 md:col-span-8 p-8 ${cardClass}`}
            initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <span
              className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-1 bg-gradient-to-b from-[#d6132b] to-[#f12942]"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 bg-gradient-to-br from-[#d6132b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-3 text-ink">
                {blocks[3].title}
              </h2>
              <p className="text-base text-muted leading-relaxed">
                {blocks[3].text}
              </p>
            </div>
          </motion.article>

          {/* Full width footer block */}
          <motion.article
            className={`col-span-12 p-10 ${cardClass}`}
            initial={reduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <span
              className="absolute top-0 ltr:left-0 rtl:right-0 h-full w-1 bg-gradient-to-b from-[#d6132b] to-[#f12942]"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 bg-gradient-to-br from-[#d6132b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-4 text-ink">
                {blocks[4].title}
              </h2>
              <p className="text-base md:text-lg text-muted leading-relaxed">
                {blocks[4].text}
              </p>
            </div>
          </motion.article>

        </div>
      </section>
    </main>
  );
};

export default VideoWallMounting;
