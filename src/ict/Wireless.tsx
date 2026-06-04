import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import OptimizedImage from "../components/OptimizedImage";
import { sanity, urlFor } from "../sanityClient";
import { localize } from "../utils/localize";

const Wireless: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "wirelessPage" && enabled == true][0]{
          pageTitle,
          heroImage,
          sectionTitle,
          introLine1,
          introLine2,
          benefitsTitle,
          benefits
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="relative w-full">

      {/* HERO */}
      <header className="relative">
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <OptimizedImage
            src={urlFor(data.heroImage).width(1920).url()}
            alt={`${localize(data.pageTitle, lang)} — enterprise wireless LAN coverage`}
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060616] via-[#060616]/60 to-[#060616]/40" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-14 md:pb-20">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[#ff8493] text-xs tracking-[0.2em] font-semibold uppercase mb-4"
              >
                {isRTL ? "الشبكات اللاسلكية" : "Wireless Networks"}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="text-4xl md:text-6xl font-bold leading-tight text-gradient max-w-4xl"
              >
                {localize(data.pageTitle, lang)}
              </motion.h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        {/* INTRO */}
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-5">
            {localize(data.sectionTitle, lang)}
          </h2>

          <p className="text-base md:text-lg leading-relaxed text-copy mb-4">
            {localize(data.introLine1, lang)}
          </p>

          <p className="text-base md:text-lg leading-relaxed text-copy">
            {localize(data.introLine2, lang)}
          </p>
        </motion.div>

        {/* BENEFITS */}
        <h3 className="mt-16 mb-8 text-xl md:text-2xl font-semibold text-ink">
          {localize(data.benefitsTitle, lang)}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.benefits.map((b: any, index: number) => (
            <motion.article
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass group rounded-2xl p-6 transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(214,19,43,0.45)]"
            >
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-[#d6132b] ltr:mr-3 rtl:ml-3 shrink-0" />
                <h4 className="text-lg font-semibold text-ink">
                  {localize(b.title, lang)}
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                {localize(b.description, lang)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wireless;
