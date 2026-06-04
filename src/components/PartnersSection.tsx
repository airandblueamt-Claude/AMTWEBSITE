import { useEffect, useState } from "react";
import { sanity } from "../sanityClient";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { localize } from "../utils/localize";
import OptimizedImage from "./OptimizedImage";
import ScrollRow from "./ScrollRow";

/* ===== SINGLE LOGO TILE (white backdrop kept for both themes) ===== */
interface TileProps {
  url?: string;
  name: string;
}

const PartnerTile: React.FC<TileProps> = ({ url, name }) => (
  <div className="group relative flex h-28 w-40 sm:w-44 shrink-0 items-center justify-center rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_-18px_var(--glow)] hover:ring-2 hover:ring-[#d6132b]/50">
    {/* orange glow halo */}
    <span
      aria-hidden
      className="pointer-events-none absolute -inset-2 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(214,19,43,0.22),transparent_70%)] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
    />
    <OptimizedImage
      src={url}
      alt={`${name} — technology partner logo`}
      className="relative max-h-14 w-auto max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
      width={160}
      height={80}
      loading="lazy"
    />
  </div>
);

const PartnersSection: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const lang = i18n.language.startsWith("ar") ? "ar" : "en";

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "partnersSection" && enabled == true][0]{
          title,
          partners[]{
            name,
            logo{
              asset->{url}
            }
          }
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data || !data.partners?.length) return null;

  const title = localize(data.title, lang);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const partners: any[] = data.partners;

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="text-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">
            Trusted By
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gradient md:text-4xl">
            {title}
          </h2>
        </motion.div>

        {shouldReduceMotion ? (
          /* ---- REDUCED MOTION: static reveal grid ---- */
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-6">
            {partners.map((partner, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex justify-center"
              >
                <PartnerTile
                  url={partner.logo?.asset?.url}
                  name={localize(partner.name, lang)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          /* ---- SHARED SCROLLROW (auto-scroll, pauses on hover, arrows) ---- */
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ScrollRow>
              {partners.map((partner, idx) => (
                <PartnerTile
                  key={idx}
                  url={partner.logo?.asset?.url}
                  name={localize(partner.name, lang)}
                />
              ))}
            </ScrollRow>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;
