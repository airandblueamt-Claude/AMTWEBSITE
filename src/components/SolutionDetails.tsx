import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Server,
  Router,
  ShieldCheck,
  Tv,
  Wifi,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sanity } from "../sanityClient";
import { useTranslation } from "react-i18next";
import { localize } from "../utils/localize";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

/* ===== ICON MAP ===== */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Server,
  Router,
  ShieldCheck,
  Tv,
  Wifi,
  Briefcase,
};

const SolutionDetails: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;

  const lang = i18n.language.startsWith("ar") ? "ar" : "en";

  /* ===== FETCH FROM SANITY ===== */
  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "solutionsDetailsPage" && enabled == true][0]{
          "title": title[$locale],
          "description": description[$locale],
          solutions[]{
            "title": title[$locale],
            icon,
            options[]{
              "name": name[$locale],
              path
            }
          }
        }
      `, { locale: activeLocale })
      .then(setData)
      .catch(console.error);
  }, [activeLocale]);

  if (!data) return null;

  const pageTitle = localize(data.title, lang);
  const pageDescription = localize(data.description, lang);

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative min-h-screen py-20 md:py-28 overflow-hidden"
    >
      {/* ===== CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <header className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient"
          >
            {pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-sm sm:text-base md:text-lg text-muted"
          >
            {pageDescription}
          </motion.p>
        </header>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.solutions.map((item: any, index: number) => {
            const Icon = iconMap[item.icon];
            const isActive = active === index;

            const solutionTitle = localize(item.title, lang);

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClick={() => setActive(isActive ? null : index)}
                className={`group glass relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1
                  ${isActive
                    ? "border-[#d6132b]/60 shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
                    : "border-hairline hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
                  }
                `}
              >
                {/* TOP LINE */}
                <span
                  className={`absolute top-0 left-0 h-1 w-full
                    ${isActive ? "bg-[#d6132b]" : "bg-transparent"}
                  `}
                />

                {/* HEADER */}
                <div className="p-8 flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg transition-colors ${isActive ? "bg-[#d6132b]/15" : "glass"
                      }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-7 h-7 ${isActive
                            ? "text-[#f12942]"
                            : "text-muted"
                          }`}
                      />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold flex-1 text-ink">
                    {solutionTitle}
                  </h3>

                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${isActive
                        ? "rotate-180 text-[#f12942]"
                        : "text-muted"
                      }`}
                  />
                </div>

                {/* EXPAND */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-8 pb-8"
                    >
                      <ul className="space-y-3 pt-2 border-t border-hairline">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {item.options?.map((opt: any, i: number) => {
                          const optionName = localize(opt.name, lang);

                          return (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#d6132b]" />
                              <Link
                                to={withLocale(opt.path, activeLocale)}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-muted hover:text-[#f12942] transition-colors"
                              >
                                {optionName}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionDetails;
