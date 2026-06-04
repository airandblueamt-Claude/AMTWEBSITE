import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Server, Zap, Layers } from "lucide-react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import { sanity } from "../sanityClient";
import { localize } from "../utils/localize";
import OptimizedImage from "../components/OptimizedImage";

/* ===== ICON MAP ===== */
const ICONS: Record<string, JSX.Element> = {
  server: <Server className="w-7 h-7" />,
  zap: <Zap className="w-7 h-7" />,
  layers: <Layers className="w-7 h-7" />,
};

const DataCenter: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  /* ===== FETCH FROM SANITY ===== */
  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "dataCenterPage" && enabled == true][0]{
          title,
          description,
          heroImage{
            asset->{url}
          },
          introText,
          features[]{
            title,
            description,
            icon,
            alt,
            image{
              asset->{url}
            }
          },
          stats[]{
            label,
            value
          },
          ctaTitle,
          ctaButtonText,
          ctaLink
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full"
      aria-labelledby="data-center-heading"
    >
      {/* ===== HERO ===== */}
      <header className="relative">
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          {data.heroImage?.asset?.url && (
            <OptimizedImage
              src={data.heroImage.asset.url}
              alt={`${localize(data.title, lang)} — data center infrastructure photography`}
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={1080}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060616] via-[#060616]/60 to-[#060616]/40" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-14 md:pb-20">
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[#ff8493] text-xs tracking-[0.2em] font-semibold uppercase mb-4"
              >
                {isRTL ? "مراكز البيانات" : "Data Center"}
              </motion.p>
              <motion.h1
                id="data-center-heading"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-4xl md:text-6xl font-bold leading-tight text-gradient max-w-4xl"
              >
                {localize(data.title, lang)}
              </motion.h1>
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-[#c7c8da]"
              >
                {localize(data.description, lang)}
              </motion.p>
            </div>
          </div>
        </div>
      </header>

      {/* ===== INTRO ===== */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28">
        <motion.p
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl text-base md:text-lg leading-relaxed text-copy"
        >
          {localize(data.introText, lang)}
        </motion.p>
      </div>

      {/* ===== FEATURES ===== */}
      <section
        className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        aria-label="Data center features"
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {data.features?.map((f: any, i: number) => (
          <motion.article
            key={i}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass group rounded-2xl p-7 flex flex-col items-center text-center transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(214,19,43,0.45)]"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#f12942] to-[#d6132b] text-white mb-6 shadow-[0_8px_24px_-8px_rgba(214,19,43,0.6)]">
              {ICONS[f.icon]}
            </div>

            <h2 className="text-lg md:text-xl font-semibold mb-4 text-ink">
              {localize(f.title, lang)}
            </h2>

            <p className="text-sm leading-relaxed text-muted flex-1">
              {localize(f.description, lang)}
            </p>

            {f.image?.asset?.url && (
              <div className="mt-6 w-full rounded-xl overflow-hidden border border-hairline">
                <OptimizedImage
                  src={f.image.asset.url}
                  alt={localize(f.alt, lang)}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                  width={400}
                  height={192}
                />
              </div>
            )}
          </motion.article>
        ))}
      </section>

      {/* ===== STATISTICS ===== */}
      <section className="relative" aria-label="Company statistics">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="glass rounded-2xl py-14 px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.stats?.map((s: any, i: number) => (
              <motion.div
                key={i}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <h3 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  <CountUp end={s.value} duration={2} />+
                </h3>
                <p className="text-sm md:text-base text-muted">{localize(s.label, lang)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="glass rounded-2xl text-center py-16 px-6">
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl font-bold text-gradient mb-8"
          >
            {localize(data.ctaTitle, lang)}
          </motion.h2>

          <motion.a
            href={data.ctaLink}
            aria-label={localize(data.ctaButtonText, lang)}
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow inline-block text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg"
          >
            {localize(data.ctaButtonText, lang)}
          </motion.a>
        </div>
      </section>
    </section>
  );
};

export default DataCenter;
