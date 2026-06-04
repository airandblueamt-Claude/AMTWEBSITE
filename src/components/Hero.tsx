import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, MessageSquareText } from "lucide-react";
import CountUp from "react-countup";
import { sanity } from "../sanityClient";
import { localize } from "../utils/localize";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";

const STATS = [
  { value: "15+", en: "Years in the field", ar: "سنة في الميدان" },
  { value: "500+", en: "Projects delivered", ar: "مشروع منجز" },
  { value: "40+", en: "Technology partners", ar: "شريك تقني" },
];

/* Split "500+" -> { end: 500, suffix: "+" } so CountUp can animate the number. */
const parseStat = (raw: string) => {
  const match = raw.match(/^(\d[\d,]*)(.*)$/);
  if (!match) return { end: 0, suffix: raw, prefix: "" };
  return { end: parseInt(match[1].replace(/,/g, ""), 10), suffix: match[2] || "", prefix: "" };
};

/* Magnetic primary CTA: translates a few px toward the cursor on hover, springs back. */
const MagneticButton = ({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled: boolean;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    // Clamp pull so it stays subtle.
    x.set(Math.max(-10, Math.min(10, mx * 0.35)));
    y.set(Math.max(-8, Math.min(8, my * 0.35)));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={disabled ? undefined : { x: sx, y: sy }}
      className="btn-glow group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white"
    >
      {children}
    </motion.button>
  );
};

/* One animated stat — counts up when the hero stats row scrolls into view. */
const StatItem = ({
  raw,
  label,
  animate,
}: {
  raw: string;
  label: string;
  animate: boolean;
}) => {
  const { end, suffix } = useMemo(() => parseStat(raw), [raw]);
  return (
    <div className="text-center">
      <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
        {animate ? (
          // Hero is the first thing on screen — count up as soon as it mounts.
          <CountUp end={end} duration={2} suffix={suffix} />
        ) : (
          // Reduced motion: show the final value immediately, no counting.
          <span>{`${end}${suffix}`}</span>
        )}
      </div>
      <div className="text-muted text-xs sm:text-sm mt-1">{label}</div>
    </div>
  );
};

const Hero = () => {
  // Sanity documents are loosely typed across this codebase.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [hero, setHero] = useState<any>(null);
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";

  /* ===== Pointer capability (disable parallax/magnetic on touch) ===== */
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const interactive = !shouldReduceMotion && finePointer;

  /* ===== Mouse parallax (glow blob + subtle headline drift) ===== */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springCfg = { stiffness: 80, damping: 20, mass: 0.6 };
  const spx = useSpring(px, springCfg);
  const spy = useSpring(py, springCfg);
  // Blob drifts more than the headline for a layered depth feel.
  const blobX: MotionValue<number> = useTransform(spx, (v) => v * 28);
  const blobY: MotionValue<number> = useTransform(spy, (v) => v * 28);
  const headX: MotionValue<number> = useTransform(spx, (v) => v * 8);
  const headY: MotionValue<number> = useTransform(spy, (v) => v * 8);

  const onPointerMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!interactive) return;
    // Normalize cursor to roughly [-1, 1] from viewport center.
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  };

  /* ===== Fetch Hero Data ===== */
  useEffect(() => {
    sanity
      .fetch(
        `*[_type == "homeHero"][0]{
          "companyName": companyName[$locale],
          "groupLine": groupLine[$locale],
          "titlePrefix": titlePrefix[$locale],
          rotatingWords,
          "titleSuffix": titleSuffix[$locale],
          "description": description[$locale],
          "ctaText": ctaText[$locale],
          ctaLink,
          videoFile{ asset->{ url } }
        }`,
        { locale: activeLocale }
      )
      .then(setHero)
      .catch(console.error);
  }, [activeLocale]);

  /* ===== Rotating Words ===== */
  const rotatingWordsRaw = localize(hero?.rotatingWords, lang);
  const rotatingWords = Array.isArray(rotatingWordsRaw)
    ? rotatingWordsRaw.map((w) => localize(w, lang)).filter((w) => typeof w === "string" && w.trim().length > 0)
    : [];

  useEffect(() => {
    if (rotatingWords.length < 2) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % rotatingWords.length), 2600);
    return () => clearInterval(id);
  }, [rotatingWords.length]);

  if (!hero) {
    return (
      <header role="banner" aria-busy="true">
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-6">
          <div className="animate-pulse max-w-xl w-full space-y-6">
            <div className="h-5 glass rounded-full w-1/2 mx-auto" />
            <div className="h-16 glass rounded-2xl w-full" />
            <div className="h-4 glass rounded w-2/3 mx-auto" />
          </div>
          <span className="sr-only">{t("common.loading")}</span>
        </section>
      </header>
    );
  }

  const companyName = localize(hero.companyName, lang);
  const groupLine = localize(hero.groupLine, lang);
  const titlePrefix = localize(hero.titlePrefix, lang);
  const titleSuffix = localize(hero.titleSuffix, lang);
  const description = localize(hero.description, lang);
  const ctaText = localize(hero.ctaText, lang);

  const onPrimary = () => {
    if (!hero.ctaLink) return navigate(withLocale("/solution-details", activeLocale));
    if (hero.ctaLink.startsWith("#")) document.getElementById(hero.ctaLink.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    else navigate(withLocale(hero.ctaLink, activeLocale));
  };

  const stagger = (d: number) =>
    shouldReduceMotion
      ? {}
      : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const } };

  return (
    <header role="banner">
      <section
        onMouseMove={onPointerMove}
        className="relative min-h-[100svh] flex items-center overflow-hidden px-6 md:px-16 pt-28 pb-16"
      >
        {/* ===== VIDEO BACKGROUND ===== */}
        {!shouldReduceMotion && hero.videoFile?.asset?.url && (
          <video
            src={hero.videoFile.asset.url}
            autoPlay muted loop playsInline preload="metadata" poster="/og-image.jpg"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            aria-hidden="true"
          />
        )}
        {/* ===== LAYERED OVERLAY ===== */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,6,22,.55) 0%, rgba(6,6,22,.35) 38%, var(--canvas) 99%)," +
              "radial-gradient(70% 60% at 50% 38%, transparent, rgba(6,6,22,.55))",
          }}
        />

        {/* ===== FAINT ANIMATED SHEEN (theme-aware, off under reduced-motion) ===== */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-screen"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.0, 0.5, 0.0],
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 38%, rgba(241,41,66,.10) 48%, rgba(214,19,43,.06) 52%, transparent 62%)",
              backgroundSize: "220% 100%",
              willChange: "background-position, opacity",
            }}
          />
        )}

        {/* ===== PARALLAX ORANGE GLOW BLOB ===== */}
        <motion.div
          className="absolute -top-24 -right-20 w-[42rem] h-[42rem] rounded-full pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, rgba(214,19,43,.25), transparent 60%)",
            filter: "blur(20px)",
            x: interactive ? blobX : undefined,
            y: interactive ? blobY : undefined,
            willChange: interactive ? "transform" : undefined,
          }}
        />

        {/* ===== CONTENT ===== */}
        <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
          {/* eyebrow */}
          {groupLine && (
            <motion.span
              {...stagger(0)}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-eyebrow"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#d6132b] shadow-[0_0_12px_3px_rgba(214,19,43,.7)]" />
              {groupLine}
            </motion.span>
          )}

          {/* company name (subtle parallax drift) */}
          <motion.h1
            {...stagger(0.08)}
            style={interactive ? { x: headX, y: headY, willChange: "transform" } : undefined}
            className="mt-6 font-display font-extrabold leading-[1.02] text-4xl sm:text-6xl lg:text-7xl text-gradient"
          >
            {companyName}
          </motion.h1>

          {/* slogan with rotating word */}
          {(titlePrefix || titleSuffix || rotatingWords.length > 0) && (
            <motion.h2
              {...stagger(0.16)}
              className="mt-5 font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90 flex flex-wrap items-center justify-center gap-x-3"
            >
              {titlePrefix && <span>{titlePrefix}</span>}
              {rotatingWords.length > 0 && (
                <span className="relative inline-grid">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={index}
                      initial={{ y: "60%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: "-60%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
                      className="col-start-1 row-start-1 font-extrabold text-gradient drop-shadow-[0_4px_30px_rgba(214,19,43,.5)]"
                    >
                      {rotatingWords[index]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              )}
              {titleSuffix && <span>{titleSuffix}</span>}
            </motion.h2>
          )}

          {/* description */}
          {description && (
            <motion.p {...stagger(0.24)} className="mt-6 max-w-2xl mx-auto text-copy text-base sm:text-lg leading-relaxed">
              {description}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div {...stagger(0.32)} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton onClick={onPrimary} disabled={!interactive}>
              {ctaText || (lang === "ar" ? "استكشف الحلول" : "Explore solutions")}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </MagneticButton>
            <button
              onClick={() => navigate(withLocale("/contact", activeLocale))}
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white hover:bg-white/10 transition"
            >
              <MessageSquareText size={18} />
              {lang === "ar" ? "تحدث إلى خبير" : "Talk to an expert"}
            </button>
          </motion.div>

          {/* stats — count up on mount */}
          <motion.div
            {...stagger(0.42)}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
          >
            {STATS.map((s) => (
              <StatItem
                key={s.value}
                raw={s.value}
                label={lang === "ar" ? s.ar : s.en}
                animate={!shouldReduceMotion}
              />
            ))}
          </motion.div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center w-6 h-10 rounded-full border-2 border-hairline pt-2" aria-hidden="true">
          <motion.span
            className="w-1 h-2 rounded-full bg-[#d6132b]"
            animate={shouldReduceMotion ? {} : { y: [0, 10, 0], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </div>
      </section>
    </header>
  );
};

export default Hero;
