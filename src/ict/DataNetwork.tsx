import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { sanity, urlFor } from "../sanityClient";
import { localize } from "../utils/localize";
import OptimizedImage from "../components/OptimizedImage";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

interface Section {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  desc1: string;
  desc2?: string;
}

interface DataNetworkData {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroImage: any;
  description: string;
  sections: Section[];
}

const DataNetwork: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [data, setData] = useState<DataNetworkData | null>(null);
  const { t, i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  /* ===== FETCH FROM SANITY ===== */
  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "dataNetworkPage" && enabled == true][0]{
          title,
          heroImage,
          description,
          sections[]{
            title,
            image,
            desc1,
            desc2
          }
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="py-32 text-center text-muted">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative w-full">

      {/* ===== HERO ===== */}
      <header className="relative">
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          {data.heroImage && (
            <OptimizedImage
              src={urlFor(data.heroImage).width(1920).url()}
              alt={`${localize(data.title, lang)} — enterprise data network hero visual`}
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
                {isRTL ? "البنية التحتية للشبكات" : "Network Infrastructure"}
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
        {/* ===== MAIN DESCRIPTION ===== */}
        <motion.p
          className="text-base md:text-lg leading-relaxed text-copy max-w-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {localize(data.description, lang)}
        </motion.p>

        {/* ===== SECTIONS ===== */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.sections?.map((section, index) => (
            <motion.article
              key={index}
              className="glass group rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(214,19,43,0.45)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {section.image && (
                <div className="relative w-28 h-28 mb-6 rounded-2xl overflow-hidden ring-1 ring-white/10">
                  <OptimizedImage
                    src={urlFor(section.image).width(300).height(300).url()}
                    alt={localize(section.title, lang)}
                    className="w-full h-full object-cover"
                    width={112}
                    height={112}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060616]/70 to-transparent" />
                </div>
              )}

              <h2 className="text-lg md:text-xl font-semibold mb-3 text-ink">
                {localize(section.title, lang)}
              </h2>

              <p className="text-sm leading-relaxed text-muted mb-2">
                {localize(section.desc1, lang)}
              </p>

              {section.desc2 && (
                <p className="text-sm leading-relaxed text-muted">
                  {localize(section.desc2, lang)}
                </p>
              )}
            </motion.article>
          ))}
        </div>

        <section className="mt-20 border-t border-hairline pt-12 text-center" aria-label="Related data network links">
          <h2 className="text-2xl font-bold text-ink mb-6">
            {activeLocale === "ar" ? "روابط ذات صلة" : "Related links"}
          </h2>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/ict/network-security", activeLocale)}>
              {activeLocale === "ar" ? "أمن الشبكات" : "Network Security"}
            </Link>
            <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/ict/wireless", activeLocale)}>
              {activeLocale === "ar" ? "الشبكات اللاسلكية" : "Wireless"}
            </Link>
            <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/services/network-infrastructure", activeLocale)}>
              {activeLocale === "ar" ? "خدمة البنية التحتية للشبكات" : "Network Infrastructure Service"}
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};

export default DataNetwork;
