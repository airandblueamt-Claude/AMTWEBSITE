import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { sanity, urlFor } from "../sanityClient";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OptimizedImage from "../components/OptimizedImage";
import { localize } from "../utils/localize";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

const IpTelephony: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "ipTelephonyPage" && enabled == true][0]{
          "title": title[$locale],
          heroImage,
          "introHighlight": introHighlight[$locale],
          "introText": introText[$locale],
          features,
          "ctaTitle": ctaTitle[$locale],
          "ctaButtonText": ctaButtonText[$locale]
        }
      `, { locale: activeLocale })
      .then(setData)
      .catch(console.error);
  }, [activeLocale]);

  if (!data) return null;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative w-full">

      {/* HERO */}
      <header className="relative">
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <OptimizedImage
            src={urlFor(data.heroImage).width(1920).url()}
            alt={`${localize(data.title, lang)} — IP telephony solutions`}
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060616] via-[#060616]/60 to-[#060616]/40" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-14 md:pb-20">
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[#ff8493] text-xs tracking-[0.2em] font-semibold uppercase mb-4"
              >
                {isRTL ? "هاتفية IP" : "IP Telephony"}
              </motion.p>
              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-4xl md:text-6xl font-bold leading-tight text-gradient max-w-4xl"
              >
                {localize(data.title, lang)}
              </motion.h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        {/* INTRO */}
        <div className="max-w-3xl space-y-5">
          <motion.p
            className="text-xl md:text-2xl font-semibold text-ink"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {localize(data.introHighlight, lang)}
          </motion.p>

          <motion.p
            className="text-base md:text-lg leading-relaxed text-copy"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {localize(data.introText, lang)}
          </motion.p>
        </div>

        {/* FEATURES */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.features?.map((f: any, i: number) => (
            <motion.article
              key={i}
              className="glass group rounded-2xl p-7 ltr:border-l-2 rtl:border-r-2 border-[#d6132b]/60 transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(214,19,43,0.45)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-ink">
                {localize(f.title, lang)}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {localize(f.description, lang)}
              </p>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20">
          <div className="glass rounded-2xl text-center py-16 px-6">
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-gradient mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {localize(data.ctaTitle, lang)}
            </motion.h2>

            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-glow text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg"
              onClick={() => navigate(withLocale("/contact", activeLocale))}
            >
              {localize(data.ctaButtonText, lang)}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IpTelephony;
