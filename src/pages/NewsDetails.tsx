import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { sanity, urlFor } from "../sanityClient";
import { localize } from "../utils/localize";
import OptimizedImage from "../components/OptimizedImage";
import { STATIC_SEO_NEWS_BY_SLUG } from "../content/staticSeoNewsArticles";
import { LOCAL_NEWS_BY_SLUG } from "../data/localNews";
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from "../utils/localeRouting";
import { absoluteUrl, ORG_NAME } from "../seo/siteConfig";
import { serializeJsonLd, type JsonValue } from "../seo/jsonLd";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface NewsDetailsData {
  title: any;
  fullText: any;
  mainImage: any;
  gallery?: any[];
  videoUrl?: string;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Resolve a cover-image URL whether it's a Sanity image ref or a local string path.
function mainImageUrl(img: unknown, w = 1200): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return urlFor(img as any).width(w).url();
}

function staticSeoNewsToDetails(slug: string): NewsDetailsData | null {
  const doc = STATIC_SEO_NEWS_BY_SLUG[slug];
  if (!doc) return null;
  return {
    title: doc.title,
    fullText: doc.body,
    mainImage: undefined,
    gallery: undefined,
    videoUrl: undefined,
  };
}

function plainTextFromPortable(val: unknown, lang: string): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    return val
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((block: any) => {
        if (block?._type === "block" && Array.isArray(block.children)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return block.children.map((c: any) => c?.text ?? "").join("");
        }
        return "";
      })
      .join(" ")
      .trim();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return String(localize(val as any, lang)).replace(/\s+/g, " ").trim();
}

function truncate(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

const NewsDetails: React.FC = () => {
  const { slug, locale: localeParam } = useParams();
  const [news, setNews] = useState<NewsDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ar") ? "ar" : "en";
  const locale: AppLocale = isSupportedLocale(localeParam) ? localeParam : DEFAULT_LOCALE;

  useEffect(() => {
    if (!slug) {
      setNews(null);
      setLoading(false);
      return;
    }

    const staticData = staticSeoNewsToDetails(slug);
    if (staticData) {
      setNews(staticData);
      setLoading(false);
      return;
    }

    const local = LOCAL_NEWS_BY_SLUG[slug];
    if (local) {
      setNews({ title: local.title, fullText: local.body, mainImage: local.coverImage });
      setLoading(false);
      return;
    }

    setLoading(true);
    sanity
      .fetch(
        `
        *[_type == "news" && slug.current == $slug][0]{
          "title": title[$locale],
          "fullText": fullText[$locale],
          mainImage,
          gallery,
          videoUrl
        }
        `,
        { slug, locale: locale || "en" }
      )
      .then((data) => {
        setNews(data ?? null);
        setLoading(false);
      })
      .catch(() => {
        setNews(null);
        setLoading(false);
      });
  }, [slug, locale]);

  const title = news ? String(localize(news.title, lang)).trim() : "";
  const bodyText = news ? plainTextFromPortable(news.fullText, lang) : "";
  const description = useMemo(
    () => truncate(bodyText.replace(/\n/g, " "), 155),
    [bodyText]
  );

  const canonicalPath = `/${locale}/news/${slug ?? ""}`;
  const canonical = absoluteUrl(canonicalPath);

  const articleLd: JsonValue | null = news
    ? (() => {
        const base: Record<string, unknown> = {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: title,
          description: description || title,
          author: { "@type": "Organization", name: ORG_NAME },
          publisher: {
            "@type": "Organization",
            name: ORG_NAME,
            logo: { "@type": "ImageObject", url: absoluteUrl("/amt1.png") },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        };
        if (news.mainImage) {
          base.image = [mainImageUrl(news.mainImage, 1200)];
        }
        return base as JsonValue;
      })()
    : null;

  if (loading) {
    return <p className="text-center py-20 text-muted">{t("common.loading")}</p>;
  }

  if (!news) {
    return (
      <p className="text-center py-20 text-muted">
        {locale === "ar" ? "المقال غير متوفر." : "This article could not be found."}
      </p>
    );
  }

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="max-w-3xl mx-auto py-20 md:py-28 px-6"
    >
      <Helmet>
        <title>{`${truncate(title, 52)} | ${ORG_NAME}`}</title>
        <meta name="description" content={description || title} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description || title} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image:alt" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description || title} />
        {news.mainImage && (
          <>
            <meta
              property="og:image"
              content={mainImageUrl(news.mainImage, 1200)}
            />
            <meta
              name="twitter:image"
              content={mainImageUrl(news.mainImage, 1200)}
            />
          </>
        )}
        {articleLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleLd) }}
          />
        )}
      </Helmet>

      <Link
        to={withLocale("/", locale)}
        className="inline-flex items-center gap-1.5 mb-8 text-[#f12942] hover:text-[#d6132b] text-sm font-semibold tracking-wide transition-colors"
      >
        <span className="rtl:rotate-180" aria-hidden="true">←</span>
        {t("common.backToNews")}
      </Link>

      <h1 className="text-3xl md:text-4xl font-extrabold text-ink mb-8 leading-tight">{title}</h1>

      {news.videoUrl ? (
        <video
          src={news.videoUrl}
          controls
          className="w-full rounded-2xl mb-10 ring-1 ring-hairline"
        />
      ) : news.mainImage ? (
        <OptimizedImage
          src={mainImageUrl(news.mainImage, 1200)}
          alt={`${title} — news feature image`}
          className="rounded-2xl mb-10 w-full h-auto ring-1 ring-hairline"
          width={1200}
          height={675}
          priority
        />
      ) : null}

      <p className="whitespace-pre-line mb-10 text-copy leading-relaxed text-base md:text-lg">{localize(news.fullText, lang)}</p>

      {news.gallery && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {news.gallery.map((img, i) => (
            <OptimizedImage
              key={i}
              src={urlFor(img).width(600).url()}
              alt={`${title} — gallery photo ${i + 1}`}
              className="rounded-xl w-full h-auto object-cover ring-1 ring-hairline"
              width={600}
              height={400}
              loading="lazy"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewsDetails;
