import React, { useEffect, useRef, useState } from "react";
import { Star, Award, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { sanity } from "../sanityClient";
import { localize } from "../utils/localize";

const TestimonialsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";

  const sectionRef = useRef<HTMLElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "testimonialsPage" && enabled == true][0]{
          pageTitle,
          subtitle,
          description,
          partners[]{
            name,
            category
          },
          testimonials[]{
            rating,
            quote,
            author,
            position,
            company
          }
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const pageTitle = localize(data.pageTitle, lang);
  const subtitle = localize(data.subtitle, lang);
  const description = localize(data.description, lang);

  return (
    <section
      ref={sectionRef}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* ===== HEADER ===== */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full border border-hairline mb-6">
            <Award className="w-5 h-5 text-[#f12942]" />
            <span className="font-semibold text-eyebrow text-xs tracking-[0.2em] uppercase">{pageTitle}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient mb-6">
            {subtitle}
          </h2>

          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-muted">
            {description}
          </p>
        </motion.header>

        {/* ===== PARTNERS ===== */}
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-20 md:mb-24">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.partners?.map((p: any, i: number) => {
            const name = localize(p.name, lang);
            const category = localize(p.category, lang);

            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl border border-hairline p-4 text-center transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
              >
                <strong className="block text-sm text-ink">{name}</strong>
                <span className="text-xs text-muted">
                  {category}
                </span>
              </motion.li>
            );
          })}
        </ul>

        {/* ===== TESTIMONIALS ===== */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-ink mb-12">
          {pageTitle}
        </h3>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.testimonials?.map((t: any, i: number) => {
            const quote = localize(t.quote, lang);
            const author = localize(t.author, lang);
            const position = localize(t.position, lang);

            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group glass relative rounded-2xl border border-hairline p-8 transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
              >
                <Quote className="w-9 h-9 text-[#d6132b] mb-4 rtl:scale-x-[-1]" fill="currentColor" />

                <div className="flex mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#f12942] fill-current"
                    />
                  ))}
                </div>

                <blockquote className="italic mb-6 text-copy leading-relaxed">
                  {quote}
                </blockquote>

                <footer>
                  <strong className="text-ink">{author}</strong>
                  <p className="text-sm text-muted">{position}</p>
                  <p className="text-xs text-[#f12942] mt-1">
                    {localize(t.company, lang)}
                  </p>
                </footer>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPage;
