// Locally-authored news items (shown alongside CMS news without a Sanity write token).
// To move these into the CMS later, recreate them as `news` documents in Sanity.
import nedapImage from "../assets/news/nedap-education.jpg";
import nedapCard from "../assets/news/nedap-education-card.jpg";

export interface LocalNewsItem {
  slug: string;
  date: string; // ISO date
  image: string; // card/list thumbnail (landscape)
  coverImage: string; // full article cover (larger)
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  body: { en: string; ar: string };
}

export const LOCAL_NEWS: LocalNewsItem[] = [
  {
    slug: "amt-nedap-emerging-partner-education",
    date: "2026-06-03",
    image: nedapCard,
    coverImage: nedapImage,
    title: {
      en: "AMT Named Emerging Partner of Nedap in the Education Sector",
      ar: "AMT شريكٌ ناشئ لشركة Nedap في قطاع التعليم",
    },
    description: {
      en: "Advanced Micro Technologies becomes an Emerging Partner of Nedap in the Educational Sector — a new milestone in delivering innovative technology for education.",
      ar: "شركة الأبعاد المترامية للتقنية (AMT) تصبح شريكًا ناشئًا لشركة Nedap في قطاع التعليم — إنجاز جديد في تقديم حلول تقنية مبتكرة للتعليم.",
    },
    body: {
      en: "We are excited to announce a new milestone in our journey as AMT Advanced Micro Technologies becomes an Emerging Partner of Nedap in the Educational Sector.\n\nThis partnership marks the beginning of a collaboration focused on delivering innovative technology solutions that support educational institutions, enhance operational efficiency, and accelerate digital transformation within the education environment.\n\nWe look forward to creating smarter and more connected educational experiences together with our partners and clients.",
      ar: "يسعدنا أن نعلن عن إنجاز جديد في مسيرتنا، حيث أصبحت AMT (شركة الأبعاد المترامية للتقنية) شريكًا ناشئًا لشركة Nedap في قطاع التعليم.\n\nتمثّل هذه الشراكة بداية تعاون يركّز على تقديم حلول تقنية مبتكرة تدعم المؤسسات التعليمية، وتعزّز الكفاءة التشغيلية، وتسرّع التحوّل الرقمي في بيئة التعليم.\n\nونتطلّع إلى ابتكار تجارب تعليمية أذكى وأكثر تكاملًا، جنبًا إلى جنب مع شركائنا وعملائنا.",
    },
  },
];

export const LOCAL_NEWS_BY_SLUG: Record<string, LocalNewsItem> = Object.fromEntries(
  LOCAL_NEWS.map((n) => [n.slug, n])
);
