import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { sanity, urlFor } from "../sanityClient";
import { localize } from "../utils/localize";
import OptimizedImage from "./OptimizedImage";

export default function AboutUsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Sanity documents are loosely typed across this codebase.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const shouldReduceMotion = useReducedMotion();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const isRTL = lang === "ar";

  /* ===== INTERSECTION OBSERVER ===== */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [data]);

  /* ===== FETCH FROM SANITY ===== */
  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "aboutPage" && enabled == true][0]{
          heroTitle,
          heroImage,
          whoBadge,
          whoTitle,
          whoText1,
          whoText2,
          whoVideo{
            asset->{url}
          },
          visionText,
          values[]{
            title,
            text,
            icon
          },
          teamTitle,
          teamDescription,
          teamRoles
        }
      `)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay },
        };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full font-sans overflow-x-hidden text-ink"
    >
      <div className="relative z-10">

        {/* HEADER / HERO */}
        <section className="relative min-h-[420px] flex items-center justify-center overflow-hidden px-6">
          {data.heroImage && (
            <OptimizedImage
              src={urlFor(data.heroImage).url()}
              alt={`${localize(data.heroTitle, lang)} — about AMT banner background photography`}
              className="absolute inset-0 w-full h-full object-cover"
              width={1920}
              height={420}
              loading="lazy"
            />
          )}

          {/* dark overlay gradient */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,6,22,.7) 0%, rgba(6,6,22,.55) 40%, rgba(6,6,22,.96) 100%)," +
                "radial-gradient(70% 60% at 50% 40%, transparent, rgba(6,6,22,.6))",
            }}
          />

          <motion.div {...reveal(0)} className="relative z-10 text-center">
            <p className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-5">
              {isRTL ? "من نحن" : "About AMT"}
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold uppercase tracking-[0.12em] text-gradient">
              {localize(data.heroTitle, lang)}
            </h1>
            <div className="mt-6 w-24 h-[2px] bg-[#d6132b]/70 mx-auto rounded-full shadow-[0_0_12px_2px_rgba(214,19,43,.5)]" />
          </motion.div>
        </section>

        {/* WHO WE ARE */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

              <motion.div {...reveal(0)} className="lg:w-1/2 w-full">
                {data.whoVideo?.asset?.url && (
                  <div className="glass rounded-2xl overflow-hidden p-1.5">
                    <video
                      src={data.whoVideo.asset.url}
                      controls
                      className="w-full h-[350px] md:h-[450px] object-cover rounded-xl bg-black/60"
                    />
                  </div>
                )}
              </motion.div>

              <motion.div {...reveal(0.1)} className="lg:w-1/2 w-full">
                <div className="glass rounded-2xl p-8 md:p-12 transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]">
                  <span className="inline-block text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-5">
                    {localize(data.whoBadge, lang)}
                  </span>

                  <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-gradient">
                    {localize(data.whoTitle, lang)}
                  </h2>

                  <p className="text-lg leading-relaxed mb-4 text-copy">
                    {localize(data.whoText1, lang)}
                  </p>

                  <p className="text-lg leading-relaxed text-copy">
                    {localize(data.whoText2, lang)}
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <motion.div {...reveal(0)}>
              <p className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase mb-6">
                {t("about.ourVision")}
              </p>

              <h2 className="font-display text-3xl md:text-5xl font-bold max-w-4xl mx-auto leading-tight text-ink">
                {localize(data.visionText, lang)}
              </h2>
            </motion.div>
          </div>
        </section>

        {/* VALUES */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {data.values?.map((value: any, idx: number) => (
                <motion.div
                  key={idx}
                  {...reveal(0.05 * idx)}
                  className="glass group rounded-2xl p-8 text-center transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
                >
                  {value.icon && (
                    <OptimizedImage
                      src={urlFor(value.icon).url()}
                      alt={`${localize(value.title, lang)} — company value icon`}
                      className="w-10 h-10 mx-auto mb-4 opacity-90"
                      width={40}
                      height={40}
                      loading="lazy"
                    />
                  )}

                  <h3 className="text-lg font-bold mb-3 text-[#f12942]">
                    {localize(value.title, lang)}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted">
                    {localize(value.text, lang)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <motion.div {...reveal(0)}>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient">
                {localize(data.teamTitle, lang)}
              </h2>

              <p className="mt-6 max-w-2xl mx-auto text-muted text-lg">
                {localize(data.teamDescription, lang)}
              </p>
            </motion.div>
          </div>
        </section>

        {/* EXPANDED SEO-FRIENDLY CONTENT */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <details className="glass max-w-5xl mx-auto rounded-2xl">
              <summary className="cursor-pointer list-none px-6 py-4 text-center">
                <span className="btn-glow inline-flex items-center justify-center rounded-full text-white px-7 py-3.5 font-semibold">
                  Read More
                </span>
              </summary>

              <div className="px-6 pb-8 pt-2 text-copy">
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-ink">
                  Enterprise connectivity, security, and smart collaboration
                </h2>
                <p className="text-lg leading-relaxed mb-8">
                  Advanced Micro Technologies (AMT) engineers ICT, low-current, audio-visual, and outside plant programs for organizations that need dependable digital infrastructure—from campus networks to unified communications and modern physical security.
                </p>

                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-ink">
                  ICT foundations: data networks, UC, and hardened security
                </h3>
                <p className="leading-relaxed mb-4">
                  Strong routing, switching, wireless, voice, and security layers keep your teams online and your data protected. Explore how AMT designs, integrates, and supports these systems from design through operations.
                </p>
                <ul className="list-disc pl-6 rtl:pr-6 rtl:pl-0 space-y-2 mb-8 marker:text-[#d6132b]">
                  <li>Data network solutions for resilient campus and WAN connectivity</li>
                  <li>Unified communications and collaboration integration</li>
                  <li>Network security services including access control to apps and endpoints</li>
                </ul>

                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-ink">
                  Low-current systems: CCTV, access control, and life safety
                </h3>
                <p className="leading-relaxed mb-4">
                  Physical security and life-safety platforms work best when video, access, and alerting share a coherent architecture. AMT delivers standards-aware integration so monitoring centers and field teams stay aligned.
                </p>
                <ul className="list-disc pl-6 rtl:pr-6 rtl:pl-0 space-y-2 mb-8 marker:text-[#d6132b]">
                  <li>CCTV and smart video solutions with analytics-ready platforms</li>
                  <li>Access control systems with open integration pathways</li>
                  <li>Fire alarm and detection for safer facilities</li>
                </ul>

                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-ink">
                  Digital workspaces and smart contact paths for stakeholders
                </h3>
                <p className="leading-relaxed mb-8">
                  Modern enterprises need frictionless ways to reach specialists—whether scheduling a consultation, sharing project documents, or aligning scopes across sites. AMT focuses on practical handoffs between your business teams and our integration engineers.
                </p>

                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-ink">
                  Contact AMT to scope your next network, security, or AV rollout
                </h3>

                <h3 className="font-display text-xl md:text-2xl font-bold mt-8 mb-3 text-ink">
                  In-depth service guides (amt-arabia.net)
                </h3>
                <p className="leading-relaxed mb-4">
                  Short technical explainers map how we phrase delivery for CCTV, access, network infrastructure, and smart buildings—then connect to the same portfolios you will see on detailed solution pages.
                </p>
                <ul className="list-disc pl-6 rtl:pr-6 rtl:pl-0 space-y-2 mb-8 marker:text-[#d6132b]">
                  <li>Enterprise CCTV systems and IP video</li>
                  <li>Access control and identity management</li>
                  <li>Network infrastructure and structured cabling</li>
                  <li>Smart building solutions and OT/IT integration</li>
                  <li>Audio visual systems Saudi Arabia — corporate sound &amp; collaboration</li>
                </ul>

                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-ink">
                  Frequently asked questions
                </h3>

                <h4 className="text-lg md:text-xl font-semibold mb-2 text-ink">
                  What types of ICT projects does AMT deliver?
                </h4>
                <p className="leading-relaxed mb-5">
                  AMT designs and integrates data networks, wireless, unified communications, IP telephony, security-centric networking, and data center–related infrastructure for enterprises and campuses—aligned to your standards, vendors, and timelines.
                </p>

                <h4 className="text-lg md:text-xl font-semibold mb-2 text-ink">
                  Do you provide low-current and physical security solutions?
                </h4>
                <p className="leading-relaxed mb-5">
                  Yes. AMT implements CCTV and VMS ecosystems, access control platforms, fire alarm and detection, and synchronized timing systems, with an emphasis on maintainable architectures and vendor-neutral integration where appropriate.
                </p>

                <h4 className="text-lg md:text-xl font-semibold mb-2 text-ink">
                  Can AMT support audio-visual and meeting-room deployments?
                </h4>
                <p className="leading-relaxed mb-5">
                  AMT delivers meeting-room AV, auditoriums and theaters, IPTV and digital signage, interactive displays, and structured video-wall mounting—typically integrated with collaboration platforms such as Microsoft Teams in hybrid environments.
                </p>

                <h4 className="text-lg md:text-xl font-semibold mb-2 text-ink">
                  Which regions does AMT serve?
                </h4>
                <p className="leading-relaxed mb-5">
                  AMT supports customers across the Kingdom of Saudi Arabia and the broader region, with remote coordination available for multinational programs that require consistent engineering documentation and delivery discipline.
                </p>

                <h4 className="text-lg md:text-xl font-semibold mb-2 text-ink">
                  How do I request a consultation or proposal?
                </h4>
                <p className="leading-relaxed">
                  Use the contact page to share your goals, facility locations, timelines, and any RFP materials. The AMT team responds with next steps, clarification questions, and practical scoping guidance for your ICT, security, AV, or OSP initiative.
                </p>
              </div>
            </details>
          </div>
        </section>

      </div>
    </div>
  );
}
