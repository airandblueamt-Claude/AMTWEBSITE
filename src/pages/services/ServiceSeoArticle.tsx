import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import BreadcrumbsNav from "../../components/BreadcrumbsNav";
import { SERVICE_PAGE_FAQS } from "../../content/seoServiceFaqs";
import {
  SEO_SERVICE_PAGES,
  SEO_SERVICE_SUBHEADINGS,
  SERVICE_PATH_BY_ID,
  type ServicePageId,
} from "../../content/seoServicePages";
import { faqJsonLd, getBreadcrumbNavItems, serializeJsonLd } from "../../seo/jsonLd";
import {
  AppLocale,
  DEFAULT_LOCALE,
  getLocaleDirection,
  isSupportedLocale,
  withLocale,
} from "../../utils/localeRouting";

type RelatedLink = { to: string; en: string; ar: string };

const SIBLING_SERVICE_LINKS: Record<ServicePageId, RelatedLink> = {
  "cctv-systems": {
    to: "/services/cctv-systems",
    en: "CCTV systems Saudi Arabia — service guide",
    ar: "أنظمة CCTV في السعودية — دليل الخدمة",
  },
  "access-control": {
    to: "/services/access-control",
    en: "Access control systems Saudi Arabia — enterprise guide",
    ar: "أنظمة التحكم بالدخول في السعودية — دليل المؤسسات",
  },
  "network-infrastructure": {
    to: "/services/network-infrastructure",
    en: "Network infrastructure Saudi Arabia — structured cabling & LAN",
    ar: "البنية التحتية للشبكات في السعودية — كابل وLAN",
  },
  "smart-building-solutions": {
    to: "/services/smart-building-solutions",
    en: "Smart building solutions KSA — OT/IT integration",
    ar: "حلول المباني الذكية في المملكة — تكامل OT/IT",
  },
  "audio-visual-systems": {
    to: "/services/audio-visual-systems",
    en: "Audio visual systems Saudi Arabia — corporate AV & PA",
    ar: "أنظمة الصوت والمرئيات في السعودية — AV وإذاعة للمؤسسات",
  },
};

function siblingServiceLinksExcept(pageId: ServicePageId): RelatedLink[] {
  return (Object.keys(SIBLING_SERVICE_LINKS) as ServicePageId[])
    .filter((id) => id !== pageId)
    .map((id) => SIBLING_SERVICE_LINKS[id]);
}

const PAGE_EXTRAS: Record<ServicePageId, RelatedLink[]> = {
  "cctv-systems": [
    { to: "/low-current/cctv", en: "CCTV integration (low-current portfolio)", ar: "تكامل CCTV — محفظة التيار الخفيف" },
    { to: "/ict/network-security", en: "Network security for IP video transport", ar: "أمن الشبكات لنقل الفيديو" },
    { to: "/news/cctv-systems-saudi-arabia-high-intent-guide", en: "Article: CCTV systems Saudi Arabia buyer guide", ar: "مقال: دليل مشتري أنظمة CCTV في السعودية" },
    { to: "/news/campus-network-readiness-ksa-before-cctv-ucs", en: "Article: campus network readiness before CCTV", ar: "مقال: جاهزية الشبكة قبل CCTV" },
    { to: "/solution-details", en: "All solution areas", ar: "جميع مجالات الحلول" },
    { to: "/contact", en: "Request a consultation", ar: "اطلب استشارة" },
  ],
  "access-control": [
    { to: "/low-current/access-control", en: "Access control deployments (low-current)", ar: "تنفيذ التحكم بالدخول" },
    { to: "/ict/data-network", en: "Structured data networks", ar: "شبكات بيانات منظمة" },
    { to: "/news/access-control-systems-saudi-enterprises-checklist", en: "Article: access control systems Saudi checklist", ar: "مقال: قائمة أنظمة التحكم بالدخول للمؤسسات" },
    { to: "/news/cctv-systems-saudi-arabia-high-intent-guide", en: "Article: CCTV & physical security alignment", ar: "مقال: مواءمة CCTV والأمن المادي" },
    { to: "/contact", en: "Contact AMT Arabia", ar: "اتصل بإيه إم تي العربية" },
  ],
  "network-infrastructure": [
    { to: "/ict/data-network", en: "Data network solutions", ar: "حلول شبكة البيانات" },
    { to: "/ict/wireless", en: "Wireless & Wi-Fi", ar: "الشبكات اللاسلكية" },
    { to: "/ict/network-security", en: "Network security", ar: "أمن الشبكات" },
    { to: "/news/campus-network-readiness-ksa-before-cctv-ucs", en: "Article: campus LAN readiness in KSA", ar: "مقال: جاهزية LAN للحرم في المملكة" },
    { to: "/news/corporate-audio-systems-ksa-pa-av-integration", en: "Article: AV integration & cabling discipline", ar: "مقال: تكامل AV وانضباط الكابل" },
    { to: "/contact", en: "Talk to our engineers", ar: "تحدث إلى مهندسينا" },
  ],
  "smart-building-solutions": [
    { to: "/solution-details", en: "Browse AMT portfolios", ar: "تصفّح محافظ إيه إم تي" },
    { to: "/projects", en: "Projects & delivery track record", ar: "المشاريع وسجل التنفيذ" },
    { to: "/news/smart-building-solutions-ksa-pilot-to-scale", en: "Article: smart building solutions KSA — scale", ar: "مقال: حلول المباني الذكية والتوسع" },
    { to: "/news/campus-network-readiness-ksa-before-cctv-ucs", en: "Article: network readiness for smart estates", ar: "مقال: جاهزية الشبكة للحرم الذكي" },
    { to: "/contact", en: "Plan your smart building roadmap", ar: "خطط لخارطة مبنى ذكي" },
  ],
  "audio-visual-systems": [
    { to: "/av/meeting-rooms", en: "Meeting room AV solutions", ar: "حلول صوتيات غرف الاجتماعات" },
    { to: "/av/auditoriums", en: "Auditoriums & theaters", ar: "المسارح والقاعات الكبرى" },
    { to: "/ict/unified-communications", en: "Unified communications & Teams rooms", ar: "الاتصالات الموحدة وغرف Teams" },
    { to: "/news/corporate-audio-systems-ksa-pa-av-integration", en: "Article: corporate audio system KSA", ar: "مقال: نظام الصوت المؤسسي في المملكة" },
    { to: "/news/campus-network-readiness-ksa-before-cctv-ucs", en: "Article: LAN readiness for AV multicast", ar: "مقال: جاهزية LAN لبث AV" },
    { to: "/contact", en: "Book an AV discovery session", ar: "احجز جلسة اكتشاف AV" },
  ],
};

const SITE_WIDE: RelatedLink[] = [
  { to: "/about", en: "About AMT Arabia", ar: "من نحن" },
  { to: "/services", en: "Services overview", ar: "نظرة عامة على الخدمات" },
  { to: "/projects", en: "Projects", ar: "المشاريع" },
];

const ctaBoxClass = "glass rounded-xl p-6 md:p-8";

const ServiceSeoArticle: FC<{ pageId: ServicePageId }> = ({ pageId }) => {
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const dir = getLocaleDirection(activeLocale);
  const to = (path: string) => withLocale(path, activeLocale);
  const copy = SEO_SERVICE_PAGES[pageId][activeLocale];
  const h2s = SEO_SERVICE_SUBHEADINGS[pageId][activeLocale];
  const faqs = SERVICE_PAGE_FAQS[pageId][activeLocale];
  const faqLd = faqJsonLd(faqs.map(({ q, a }) => ({ question: q, answer: a })));

  const pathWithoutLocale = SERVICE_PATH_BY_ID[pageId];
  const crumbs = getBreadcrumbNavItems(pathWithoutLocale, activeLocale);

  const relatedLinks = [
    ...siblingServiceLinksExcept(pageId),
    ...PAGE_EXTRAS[pageId],
    ...SITE_WIDE,
  ];

  return (
    <>
      <Helmet>
        {faqLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }}
          />
        ) : null}
      </Helmet>
      <main
        className="bg-canvas text-copy pt-24 pb-28 px-6 md:px-20"
        dir={dir}
        lang={activeLocale}
      >
        <article className="max-w-3xl mx-auto">
          <BreadcrumbsNav items={crumbs} locale={activeLocale} />

          <h1 className="text-gradient font-display text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
            {copy.h1}
          </h1>

          <p className="text-lg leading-relaxed text-copy">{copy.introLead}</p>

          <ul className="mt-6 list-disc ps-6 space-y-2 text-copy leading-relaxed marker:text-[#d6132b]">
            {copy.outcomeBullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <p className="mt-8 text-lg leading-relaxed text-copy">{copy.paragraphs[0]}</p>

          {h2s.map((h2, i) => (
            <section key={`${pageId}-sec-${i}`} className="mt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-ink">{h2}</h2>
              <p className="mt-4 text-lg leading-relaxed text-copy">{copy.paragraphs[i + 1]}</p>
            </section>
          ))}

          <section className={`mt-14 ${ctaBoxClass}`} aria-labelledby={`${pageId}-mid-cta`}>
            <h2 id={`${pageId}-mid-cta`} className="text-xl md:text-2xl font-bold text-ink">
              {copy.midCta.title}
            </h2>
            <p className="mt-3 text-copy leading-relaxed">{copy.midCta.body}</p>
            <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                to={to("/contact")}
                className="btn-glow inline-flex justify-center rounded-lg px-5 py-3 text-white font-semibold"
              >
                {copy.midCta.primaryCta}
              </Link>
              {copy.midCta.secondaryLink ? (
                <Link
                  to={to(copy.midCta.secondaryLink.to)}
                  className="glass inline-flex justify-center rounded-lg px-5 py-3 text-[#f12942] font-semibold transition-colors"
                >
                  {activeLocale === "ar"
                    ? copy.midCta.secondaryLink.ar
                    : copy.midCta.secondaryLink.en}
                </Link>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-muted">{copy.midCta.secondaryLine}</p>
          </section>

          <section
            className="mt-16"
            aria-labelledby={`${pageId}-faq-heading`}
            id="faq"
          >
            <h2 id={`${pageId}-faq-heading`} className="text-2xl md:text-3xl font-bold text-ink">
              {activeLocale === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}
            </h2>
            <div className="mt-6 space-y-3">
              {faqs.map((item, i) => (
                <details
                  key={`${pageId}-faq-${i}`}
                  className="group glass rounded-lg"
                >
                  <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden flex justify-between gap-2 items-start">
                    <span>{item.q}</span>
                    <span className="text-[#d6132b] shrink-0 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="px-4 pb-4 pt-0 text-copy leading-relaxed border-t border-hairline">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section
            className={`mt-16 ${ctaBoxClass}`}
            aria-labelledby={`${pageId}-bottom-cta`}
          >
            <h2 id={`${pageId}-bottom-cta`} className="text-xl md:text-2xl font-bold text-ink">
              {copy.bottomCta.title}
            </h2>
            <p className="mt-3 text-copy leading-relaxed">{copy.bottomCta.body}</p>
            <Link
              to={to("/contact")}
              className="btn-glow mt-6 inline-flex rounded-lg px-5 py-3 text-white font-semibold"
            >
              {copy.bottomCta.primaryCta}
            </Link>
          </section>

          <nav
            className="mt-16 pt-10 border-t border-hairline"
            aria-label={activeLocale === "ar" ? "روابط ذات صلة" : "Related services"}
          >
            <h3 className="text-lg font-semibold text-ink mb-4">
              {activeLocale === "ar" ? "روابط ذات صلة" : "Related services & site links"}
            </h3>
            <ul className="space-y-3">
              {relatedLinks.map((item) => (
                <li key={item.to}>
                  <Link to={to(item.to)} className="text-[#d6132b] font-medium hover:text-[#f12942] hover:underline">
                    {activeLocale === "ar" ? item.ar : item.en}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={to("/")} className="text-[#d6132b] font-medium hover:text-[#f12942] hover:underline">
                  {activeLocale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Back to home"}
                </Link>
              </li>
            </ul>
          </nav>
        </article>
      </main>
    </>
  );
};

export default ServiceSeoArticle;
