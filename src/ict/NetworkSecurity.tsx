import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import OptimizedImage from "../components/OptimizedImage";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

const SecurityPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { t, i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const isRTL = i18n.language.startsWith("ar");

  const features = [
    {
      title: t("ict.security.features.nac.title"),
      desc: t("ict.security.features.nac.desc"),
    },
    {
      title: t("ict.security.features.auth.title"),
      desc: t("ict.security.features.auth.desc"),
    },
    {
      title: t("ict.security.features.encryption.title"),
      desc: t("ict.security.features.encryption.desc"),
    },
    {
      title: t("ict.security.features.hardening.title"),
      desc: t("ict.security.features.hardening.desc"),
    },
    {
      title: t("ict.security.features.firewall.title"),
      desc: t("ict.security.features.firewall.desc"),
    },
    {
      title: t("ict.security.features.monitoring.title"),
      desc: t("ict.security.features.monitoring.desc"),
    },
  ];

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative w-full">
      {/* Hero Section */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4"
              >
                {isRTL ? "أمن الشبكات" : "Network Security"}
              </motion.p>
              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-4xl md:text-6xl font-bold leading-tight text-gradient"
              >
                {t("ict.security.title")}
              </motion.h1>
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-copy"
              >
                {t("ict.security.description")}
              </motion.p>
            </div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-hairline"
            >
              <OptimizedImage
                src="/images/security.png"
                alt="Enterprise network security architecture diagram with layered controls"
                className="w-full object-cover"
                width={640}
                height={420}
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {features.map((f, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass group rounded-2xl p-7 transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(214,19,43,0.45)]"
          >
            <span className="text-[#d6132b] text-sm font-semibold font-display">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-xl md:text-2xl font-semibold text-ink mb-3">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
          </motion.article>
        ))}
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <div className="glass rounded-2xl text-center py-16 px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl font-bold text-gradient mb-8"
          >
            {t("ict.security.cta.title")}
          </motion.h2>
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to={withLocale("/contact", activeLocale)}
              className="btn-glow inline-block text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg"
              aria-label="Contact AMT for network security services"
            >
              {t("ict.security.cta.button")}
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28 text-center border-t border-hairline pt-12" aria-label="Related security links">
        <h3 className="text-2xl font-bold text-ink mb-6">
          {activeLocale === "ar" ? "روابط ذات صلة" : "Related links"}
        </h3>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/low-current/access-control", activeLocale)}>
            {activeLocale === "ar" ? "التحكم بالدخول" : "Access Control"}
          </Link>
          <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/ict/data-network", activeLocale)}>
            {activeLocale === "ar" ? "شبكات البيانات" : "Data Network"}
          </Link>
          <Link className="text-[#ff8493] hover:text-[#f12942] transition-colors" to={withLocale("/services/access-control", activeLocale)}>
            {activeLocale === "ar" ? "خدمة التحكم بالدخول" : "Access Control Service"}
          </Link>
        </div>
      </section>
    </section>
  );
};

export default SecurityPage;
