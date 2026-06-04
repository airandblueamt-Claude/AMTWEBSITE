import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sanity, urlFor } from '../sanityClient';
import { localize } from '../utils/localize';
import { LOCAL_NEWS } from '../data/localNews';
import { AppLocale, DEFAULT_LOCALE, isSupportedLocale, withLocale } from '../utils/localeRouting';
import OptimizedImage from './OptimizedImage';
import ScrollRow from './ScrollRow';

interface NewsItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any;
  slug: string;
}

const LatestNews: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const { t } = useTranslation();
  const { locale } = useParams();
  const activeLocale: AppLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
  const isRTL = activeLocale === 'ar';
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    sanity
      .fetch(`
        *[_type == "news"] | order(_createdAt desc){
          "title": title[$locale],
          "description": description[$locale],
          mainImage,
          "slug": slug.current
        }
      `, { locale: activeLocale })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => {
        const mapped = data.map((item) => ({
          title: item.title,
          description: item.description,
          image: item.mainImage,
          slug: item.slug,
        }));
        // Locally-authored items (no Sanity token) appear first.
        const local = LOCAL_NEWS.map((n) => ({
          title: n.title, description: n.description, image: n.image, slug: n.slug,
        }));
        setNewsData([...local, ...mapped]);
      });
  }, [activeLocale]);

  if (!newsData.length) {
    return (
      <p className="text-center py-20 text-muted">
        {t("common.loading")}
      </p>
    );
  }

  return (
    <section className="relative py-20 md:py-28" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase">
            {t("news.eyebrow", "Newsroom")}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gradient">
            {t("news.latestNews")}
          </h2>
        </motion.div>

        {/* Auto-scrolling row of compact news cards */}
        <ScrollRow>
          {newsData.map((item) => (
            <article
              key={item.slug}
              className="group shrink-0 w-[300px] sm:w-[340px] glass rounded-2xl overflow-hidden border border-hairline hover:border-[#d6132b]/40 transition-all duration-500 hover:shadow-[0_28px_70px_-24px_rgba(214,19,43,0.5)] motion-safe:hover:-translate-y-1.5"
            >
              <Link
                to={withLocale(`/news/${item.slug}`, activeLocale)}
                className="flex flex-col w-full"
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden">
                  <OptimizedImage
                    src={typeof item.image === "string"
                      ? item.image
                      : urlFor(item.image).width(680).height(400).url()}
                    alt={`${localize(item.title, activeLocale)} — AMT latest news cover image`}
                    className="w-full h-full object-cover will-change-transform transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-105"
                    width={680}
                    height={400}
                  />
                </div>

                {/* Body */}
                <div className="p-5">
                  <span className="inline-flex items-center gap-2 text-eyebrow text-[10px] tracking-[0.22em] font-semibold uppercase text-[#d6132b]">
                    {t("news.label", "News")}
                  </span>
                  <h3 className="mt-2 text-base font-bold uppercase text-ink line-clamp-2">
                    {localize(item.title, activeLocale)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                    {localize(item.description, activeLocale)}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </ScrollRow>
      </div>
    </section>
  );
};

export default LatestNews;
