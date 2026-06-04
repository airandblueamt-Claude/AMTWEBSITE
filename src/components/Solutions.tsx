import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { sanity } from "../sanityClient";
import { localize } from "../utils/localize";
import OptimizedImage from "./OptimizedImage";
import ScrollRow from "./ScrollRow";

type SolutionsProps = { standalone?: boolean };

/**
 * Premium picture card with a GPU-friendly 3D pointer-tilt, a cursor-following
 * spotlight glow, and a faint image-vs-label parallax for depth.
 * Tilt/parallax are disabled under reduced-motion or on touch (coarse) devices.
 */
const TiltCard: React.FC<{
  imgUrl?: string;
  alt: string;
  title: string;
  idx: number;
  interactive: boolean;
}> = ({ imgUrl, alt, title, idx, interactive }) => {
  // Pointer position normalized to the card, range -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Spring-smoothed rotation toward the cursor.
  const springCfg = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), springCfg);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), springCfg);

  // Faint parallax: image shifts opposite to label for depth.
  const imgX = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), springCfg);
  const imgY = useSpring(useTransform(py, [-0.5, 0.5], [-14, 14]), springCfg);
  const labelX = useSpring(useTransform(px, [-0.5, 0.5], [8, -8]), springCfg);

  // Spotlight position (in %) follows the cursor.
  const glowX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const spotlight = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, rgba(241,41,66,0.28), transparent 70%)`;

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      whileHover={interactive ? { y: -6 } : {}}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={
        interactive
          ? {
              rotateX,
              rotateY,
              transformPerspective: 900,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }
          : undefined
      }
      className="group relative w-full overflow-hidden rounded-[22px] aspect-[3/4] bg-panel ring-1 ring-hairline transition-shadow duration-300 hover:ring-2 hover:ring-[#d6132b]/50 hover:shadow-[0_28px_70px_-24px_rgba(214,19,43,0.6)]"
    >
      {/* picture (with faint parallax) */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={
          interactive ? { x: imgX, y: imgY, scale: 1.06 } : undefined
        }
      >
        <OptimizedImage
          src={imgUrl}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
          width={360}
          height={480}
          loading="lazy"
        />
      </motion.div>

      {/* cinematic gradient + subtle orange wash on hover (over photo — kept dark) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#060616] via-[#060616]/45 to-transparent" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#d6132b]/25 via-transparent to-transparent" />

      {/* cursor-following spotlight glow */}
      {interactive && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
      )}

      {/* label (slight counter-parallax, lifted in 3D) */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 p-5"
        style={
          interactive
            ? { x: labelX, translateZ: 40, transformStyle: "preserve-3d" }
            : undefined
        }
      >
        <span className="block h-[2px] w-8 bg-[#d6132b] mb-3 transition-all duration-300 group-hover:w-14" />
        <h3 className="text-white text-lg font-bold leading-snug">{title}</h3>
      </motion.div>
    </motion.article>
  );
};

const Solutions: React.FC<SolutionsProps> = ({ standalone = false }) => {
  const shouldReduceMotion = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  // Disable tilt/parallax under reduced-motion or on touch (coarse-pointer) devices.
  const isTouch = useRef(false);
  useEffect(() => {
    isTouch.current =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
  }, []);
  const interactive = !shouldReduceMotion && !isTouch.current;

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "solutionsPage" && enabled == true][0]{
          badge,
          title,
          description,
          solutions[]{
            title,
            alt,
            image{
              asset->{url}
            }
          },
          coreTitle,
          coreDescription,
          coreItems[]{
            label,
            image{
              asset->{url}
            }
          }
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  // CMS title is sometimes empty or just "." — fall back to a real heading.
  const rawTitle = String(localize(data.title, lang) || "");
  const headingText =
    rawTitle.replace(/[.\s]/g, "").length > 0
      ? rawTitle
      : lang === "ar" ? "حلولنا وخدماتنا" : "Solutions & Services";

  const galleryItems =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.coreItems?.map((item: any) => ({
      image: item.image?.asset?.url,
      text: localize(item.label, lang),
    })) || [];

  return (
    <>
      {/* ===== INTRO ===== */}
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className="relative py-20 md:py-28"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <header className="max-w-3xl mx-auto text-center">
            {data.badge && (
              <motion.span
                className="block text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {localize(data.badge, lang)}
              </motion.span>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              {standalone ? (
                <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient">
                  {headingText}
                </h1>
              ) : (
                <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient">
                  {headingText}
                </h2>
              )}
            </motion.div>

            <motion.p
              className="mt-6 text-sm sm:text-base md:text-lg text-muted"
              initial={{ opacity: 0, y: 15 }}
              whileInView={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              {localize(data.description, lang)}
            </motion.p>
          </header>

          {/* ===== SOLUTION BOXES (single scrollable row with arrows) ===== */}
          <div className="mt-16">
          <ScrollRow className="[perspective:1200px]">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.solutions?.map((box: any, idx: number) => {
              const rawUrl = box.image?.asset?.url;
              // Crisp, properly-cropped image from the Sanity CDN (OptimizedImage appends auto=format&q).
              const imgUrl = rawUrl ? `${rawUrl}?w=720&h=960&fit=crop&crop=entropy` : undefined;
              return (
                <div key={idx} className="snap-start shrink-0 w-[230px] sm:w-[250px]">
                  <TiltCard
                    idx={idx}
                    imgUrl={imgUrl}
                    alt={localize(box.alt, lang)}
                    title={localize(box.title, lang)}
                    interactive={interactive}
                  />
                </div>
              );
            })}
          </ScrollRow>
          </div>
        </div>
      </section>

      {/* ===== CORE SYSTEMS ===== */}
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className="relative py-20 md:py-28"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <header className="text-center mb-14 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {standalone ? (
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
                  {localize(data.coreTitle, lang)}
                </h2>
              ) : (
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink">
                  {localize(data.coreTitle, lang)}
                </h3>
              )}
            </motion.div>
            <motion.p
              className="mt-4 text-sm sm:text-base text-muted"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {localize(data.coreDescription, lang)}
            </motion.p>
          </header>

          {/* Auto-scrolling gallery of core systems (shared ScrollRow behavior) */}
          <div className="mt-4">
            <ScrollRow className="py-2">
              {galleryItems.map((item: { image?: string; text?: string }, i: number) => (
                <figure
                  key={i}
                  className="group relative shrink-0 w-64 sm:w-72 aspect-[4/5] rounded-2xl overflow-hidden bg-panel ring-1 ring-hairline transition-all duration-500 ease-out will-change-transform hover:z-10 hover:scale-[1.04] hover:ring-2 hover:ring-[#d6132b]/50 hover:shadow-[0_28px_70px_-22px_rgba(214,19,43,0.7)]"
                >
                  <OptimizedImage
                    src={item.image ? `${item.image}?w=600&h=750&fit=crop&crop=entropy` : undefined}
                    alt={item.text || ""}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                    width={288}
                    height={360}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060616] via-[#060616]/40 to-transparent" />
                  {/* soft orange glow bloom on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(241,41,66,0.3),transparent_60%)]" />
                  <figcaption className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <span className="block h-[2px] w-7 bg-[#d6132b] mb-2 transition-all duration-300 group-hover:w-12" />
                    <span className="text-white text-sm font-semibold leading-snug">{item.text}</span>
                  </figcaption>
                </figure>
              ))}
            </ScrollRow>
          </div>
        </div>
      </section>
    </>
  );
};

export default Solutions;
