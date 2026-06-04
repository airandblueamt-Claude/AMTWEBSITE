import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sanity } from "../sanityClient";
import { useTranslation } from "react-i18next";
import { localize } from "../utils/localize";
import OptimizedImage from "./OptimizedImage";
import ScrollRow from "./ScrollRow";

const ClientsSection: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  /* ================= FETCH ================= */
  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "clientsSection" && enabled == true][0]{
          title,
          clients[]{
            name,
            position,
            testimonial,
            logo{
              asset->{url}
            }
          }
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  const clients = data?.clients || [];

  /* ================= GUARD ================= */
  if (!data || !clients.length) return null;

  /* ================= RENDER ================= */
  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="py-20 md:py-28"
    >
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
            {isRTL ? "موثوق بنا" : "Trusted By"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gradient">
            {localize(data.title, lang)}
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            {isRTL
              ? "نفخر بشراكتنا مع كبرى الجهات والمؤسسات الرائدة."
              : "Proudly partnering with leading ministries, enterprises and institutions."}
          </p>
        </motion.div>

        {/* ===== CLIENT LOGOS ===== */}
        <ScrollRow>
          {clients
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((client: any, idx: number) => (
              <div
                key={idx}
                className="group relative flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_-18px_var(--glow)] hover:ring-2 hover:ring-[#d6132b]/50 sm:w-44"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(214,19,43,0.22),transparent_70%)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                />
                <OptimizedImage
                  src={client.logo?.asset?.url}
                  alt={`${localize(client.name, lang)} — client organization logo`}
                  className="relative h-28 w-28 object-contain transition-transform duration-300 group-hover:scale-105"
                  width={128}
                  height={128}
                  loading="lazy"
                />
              </div>
            ))}
        </ScrollRow>

      </div>
    </section>
  );
};

export default ClientsSection;
