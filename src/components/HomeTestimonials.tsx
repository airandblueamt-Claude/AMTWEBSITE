import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { sanity } from "../sanityClient";
import { localize } from "../utils/localize";
import ScrollRow from "./ScrollRow";

/* eslint-disable @typescript-eslint/no-explicit-any */

const QUERY = `
  *[_type == "clientsSection" && enabled == true][0]{
    clients[defined(testimonial)]{
      name,
      position,
      testimonial,
      "logo": logo.asset->url
    }
  }
`;

const HomeTestimonials: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const { i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  useEffect(() => {
    sanity
      .fetch(QUERY)
      .then((data: any) => setClients(data?.clients || []))
      .catch(console.error);
  }, []);

  if (!clients.length) return null;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-14 md:mb-16"
        >
          <span className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4">
            {isRTL ? "آراء العملاء" : "Testimonials"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">
            {isRTL ? "ماذا يقول عملاؤنا" : "What our clients say"}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            {isRTL
              ? "شهادات حقيقية من الجهات والمؤسسات التي وثقت بنا."
              : "Real stories from the organizations and institutions that trust us."}
          </p>
        </motion.div>

        {/* ===== TESTIMONIAL CARDS ===== */}
        <ScrollRow>
          {clients.map((client: any, idx: number) => {
            const quote = localize(client.testimonial, lang);
            if (!quote) return null;

            return (
              <motion.figure
                key={idx}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 28 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: shouldReduceMotion ? 0 : Math.min(idx * 0.08, 0.4),
                  ease: [0.22, 0.61, 0.36, 1],
                }}
                className="glass group relative flex flex-col snap-start shrink-0 w-[300px] sm:w-[340px] rounded-2xl border border-hairline p-7 md:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d6132b]/40 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
              >
                <Quote
                  size={40}
                  aria-hidden
                  className={`mb-5 shrink-0 text-[#d6132b] ${isRTL ? "scale-x-[-1]" : ""}`}
                />

                <blockquote className="flex-1 text-copy leading-relaxed">
                  {quote}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-4">
                  {client.logo && (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-2 ring-1 ring-black/5">
                      <img
                        src={client.logo}
                        alt={`${localize(client.name, lang)} logo`}
                        className="h-full w-full object-contain"
                        width={48}
                        height={48}
                        loading="lazy"
                      />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">
                      {localize(client.name, lang)}
                    </span>
                    <span className="block truncate text-sm text-muted">
                      {localize(client.position, lang)}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            );
          })}
        </ScrollRow>
      </div>
    </section>
  );
};

export default HomeTestimonials;
