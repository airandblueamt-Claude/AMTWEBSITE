import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { sanity } from "../sanityClient";
import { localize } from "../utils/localize";

/* ===== HELPER: YOUTUBE URL → EMBED ===== */
const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v");
    }

    if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    }

    if (!videoId) return undefined;

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0`;
  } catch {
    return undefined;
  }
};

/* ===== VALUE CARD: cursor spotlight + traced orange glow ===== */
interface ValueCardProps {
  index: number;
  valueTitle: string;
  valueDescription: string;
  isActive: boolean;
  isRTL: boolean;
  shouldReduceMotion: boolean | null;
  onEnter: () => void;
  onLeave: () => void;
}

const ValueCard: React.FC<ValueCardProps> = ({
  index,
  valueTitle,
  valueDescription,
  isActive,
  isRTL,
  shouldReduceMotion,
  onEnter,
  onLeave,
}) => {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const cardRef = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (shouldReduceMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: shouldReduceMotion ? 0 : 0.06 * index,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={handleMove}
      whileHover={shouldReduceMotion ? {} : { y: -5 }}
      className="glass group relative overflow-hidden rounded-2xl p-6 transition-[border-color,box-shadow] duration-300 hover:border-[#d6132b]/45 hover:shadow-[0_16px_48px_-14px_var(--glow)]"
    >
      {/* cursor spotlight */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, rgba(241,41,66,0.16), transparent 65%)`,
          }}
        />
      )}
      {/* traced orange top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#f12942] to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />

      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: shouldReduceMotion ? 0 : 0.06 * index + 0.12,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        className="block font-display text-2xl font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(214,19,43,0.55)] transition-all duration-300 group-hover:[-webkit-text-stroke:1px_rgba(214,19,43,0.9)]"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      <h4 className="relative mt-3 text-base font-semibold text-ink md:text-lg">
        {valueTitle}
      </h4>

      <AnimatePresence initial={false}>
        {(isActive || shouldReduceMotion) && valueDescription && (
          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, height: 0, marginTop: 0 }
            }
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative overflow-hidden text-sm leading-relaxed text-muted"
          >
            {valueDescription}
          </motion.p>
        )}
      </AnimatePresence>

      <span className="absolute bottom-4 text-[#d6132b] opacity-0 transition-all duration-300 ltr:right-4 rtl:left-4 group-hover:opacity-100 ltr:group-hover:right-3 rtl:group-hover:left-3">
        {isRTL ? "←" : "→"}
      </span>
    </motion.article>
  );
};

const WhyChooseUs: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [activeValue, setActiveValue] = useState<number | null>(null);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "whyChooseUs" && enabled == true][0]{
          title,
          videoTitle,
          videos[]{
            youtubeUrl
          },
          values[]{
            title,
            description
          }
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data || !data.videos?.length) return null;

  const title = localize(data.title, lang);
  const videoTitle = localize(data.videoTitle, lang);

  const youtubeSrc = getYouTubeEmbedUrl(
    data.videos[currentVideo]?.youtubeUrl
  );

  const nextVideo = () =>
    setCurrentVideo((p: number) =>
      p === data.videos.length - 1 ? 0 : p + 1
    );

  const prevVideo = () =>
    setCurrentVideo((p: number) =>
      p === 0 ? data.videos.length - 1 : p - 1
    );

  const values = data.values ?? [];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full py-20 md:py-28"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* ===== HEADER ===== */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-4">
            {isRTL ? "لماذا نحن" : "Why Choose Us"}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gradient">
            {title}
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ===== VIDEO ===== */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {videoTitle && (
              <h3 className="text-xl md:text-2xl font-semibold text-ink mb-6">
                {videoTitle}
              </h3>
            )}

            <div className="glass group/video relative rounded-2xl overflow-hidden p-1.5 transition-shadow duration-300 hover:shadow-[0_22px_60px_-20px_var(--glow)]">
              {/* subtle orange aura ring */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#d6132b]/0 transition-[box-shadow,--tw-ring-color] duration-300 group-hover/video:ring-[#d6132b]/30"
              />
              <div className="relative rounded-xl overflow-hidden bg-black/60">
                <AnimatePresence mode="wait">
                  {youtubeSrc && (
                    <motion.iframe
                      key={currentVideo}
                      src={youtubeSrc}
                      className="w-full aspect-video block"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </AnimatePresence>

                {data.videos.length > 1 && (
                  <>
                    <button
                      onClick={prevVideo}
                      aria-label="Previous video"
                      className="absolute top-1/2 left-3 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#d6132b] border border-white/15 text-white text-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#f12942] hover:shadow-[0_8px_24px_-6px_var(--glow)]"
                    >
                      {isRTL ? "›" : "‹"}
                    </button>

                    <button
                      onClick={nextVideo}
                      aria-label="Next video"
                      className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#d6132b] border border-white/15 text-white text-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#f12942] hover:shadow-[0_8px_24px_-6px_var(--glow)]"
                    >
                      {isRTL ? "‹" : "›"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {data.videos.length > 1 && (
              <div className="flex gap-2 mt-5">
                {data.videos.map((_: unknown, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentVideo(i)}
                    aria-label={`Go to video ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentVideo
                        ? "w-8 bg-[#f12942] shadow-[0_0_12px_-1px_var(--glow)]"
                        : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* ===== VALUES (BENTO) ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {values.map((item: any, index: number) => (
              <ValueCard
                key={index}
                index={index}
                valueTitle={localize(item.title, lang)}
                valueDescription={localize(item.description, lang)}
                isActive={activeValue === index}
                isRTL={isRTL}
                shouldReduceMotion={shouldReduceMotion}
                onEnter={() => setActiveValue(index)}
                onLeave={() => setActiveValue(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
