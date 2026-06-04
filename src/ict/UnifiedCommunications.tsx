import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { sanity, urlFor } from "../sanityClient";
import { localize } from "../utils/localize";
import OptimizedImage from "../components/OptimizedImage";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

const UnifiedCommunications: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "unifiedCommunicationsPage" && enabled == true][0]{
          pageTitle,
          sections[]{
            title,
            text,
            images
          }
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">

        {/* PAGE TITLE */}
        <motion.header
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4">
            {isRTL ? "الاتصالات الموحدة" : "Unified Communications"}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gradient">
            {localize(data.pageTitle, lang)}
          </h1>
        </motion.header>

        <div className="space-y-12 md:space-y-16">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.sections.map((section: any, idx: number) => (
            <motion.article
              key={idx}
              className="glass rounded-2xl p-7 md:p-10 transition-all duration-300 hover:border-[#d6132b]/40"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-5">
                {localize(section.title, lang)}
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-muted whitespace-pre-line">
                {localize(section.text, lang)}
              </p>

              {section.images?.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {section.images.map((img: any, i: number) => (
                    <motion.div
                      key={i}
                      className="rounded-2xl overflow-hidden border border-hairline"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <OptimizedImage
                        src={urlFor(img).width(1200).url()}
                        alt={`${localize(section.title, lang)} — unified communications integration photo`}
                        className="w-full h-64 md:h-80 object-cover"
                        width={1200}
                        height={640}
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <section className="mt-20 border-t border-hairline pt-12 text-center" aria-label="Related unified communications links">
          <h2 className="text-2xl font-bold text-ink mb-6">
            {activeLocale === "ar" ? "روابط ذات صلة" : "Related links"}
          </h2>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/av/meeting-rooms", activeLocale)}>
              {activeLocale === "ar" ? "غرف الاجتماعات" : "Meeting Rooms AV"}
            </Link>
            <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/ict/ip-telephony", activeLocale)}>
              {activeLocale === "ar" ? "هاتفية IP" : "IP Telephony"}
            </Link>
            <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/contact", activeLocale)}>
              {activeLocale === "ar" ? "اطلب استشارة" : "Request a consultation"}
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UnifiedCommunications;
