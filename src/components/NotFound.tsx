import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { normalizeLocale, withLocale } from "../utils/localeRouting";

const NotFound: React.FC = () => {
  const { i18n } = useTranslation();
  const { locale } = useParams();
  const shouldReduceMotion = useReducedMotion();
  const activeLocale = normalizeLocale(locale);
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-[70vh] flex items-center justify-center px-6 md:px-12"
    >
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="flex flex-col items-center text-center"
      >
        <h1 className="text-gradient text-7xl md:text-9xl font-extrabold leading-none">
          404
        </h1>

        <p className="mt-6 text-xl md:text-2xl font-semibold text-ink">
          {isRTL ? "الصفحة غير موجودة" : "Page not found"}
        </p>

        <p className="mt-3 max-w-md text-muted">
          {isRTL
            ? "عذرًا، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها."
            : "Sorry, the page you are looking for doesn't exist or has been moved."}
        </p>

        <Link
          to={withLocale("/", activeLocale)}
          className="btn-glow mt-10 inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold"
        >
          {isRTL ? "العودة إلى الرئيسية" : "Back to home"}
        </Link>
      </motion.div>
    </section>
  );
};

export default NotFound;
