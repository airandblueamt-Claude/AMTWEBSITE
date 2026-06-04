import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OptimizedImage from './OptimizedImage';

type Project = {
  id: number;
  title: string;
  client: string;
  year: string;
  category: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  results: { metric: string; value: string; description: string }[];
  testimonial: string;
  clientRole: string;
  image: string;
};

const Projects = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  // ✅ FIXED LANGUAGE HANDLING (supports ar-SA, en-US etc.)
  const language = i18n.language.startsWith("ar") ? "ar" : "en";

  const [isVisible, setIsVisible] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveProject(prev => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const projectsEn: Project[] = [
    {
      id: 1,
      title: 'King Faisal University Network',
      client: 'King Faisal University',
      year: '2024',
      category: 'Education / Campus Network',
      description: 'Full communication infrastructure and network solutions for multiple campus buildings with thousands of users.',
      fullDescription: 'AMT provided a full communication infrastructure for many new buildings at KFU...',
      technologies: ['IP/MPLS Networks', 'Voice Switches', 'Wireless LAN'],
      results: [
        { metric: 'Buildings Covered', value: '50+', description: 'Number of buildings integrated' },
        { metric: 'Users Supported', value: 'Thousands', description: 'Across campus' }
      ],
      testimonial: "AMT's implementation has revolutionized our campus communication.",
      clientRole: "IT Director",
      image: '/images/project1.jpg'
    }
  ];

  const projectsAr: Project[] = [
    {
      id: 1,
      title: 'شبكة جامعة الملك فيصل',
      client: 'جامعة الملك فيصل',
      year: '2024',
      category: 'تعليم / شبكة الحرم الجامعي',
      description: 'البنية التحتية الكاملة للاتصالات وحلول الشبكات.',
      fullDescription: 'قدمت AMT بنية تحتية كاملة للاتصالات...',
      technologies: ['شبكات IP/MPLS', 'محولات صوتية', 'شبكة LAN لاسلكية'],
      results: [
        { metric: 'المباني المغطاة', value: '50+', description: 'عدد المباني المدمجة' },
        { metric: 'المستخدمون', value: 'آلاف', description: 'على مستوى الحرم الجامعي' }
      ],
      testimonial: 'تنفيذ AMT أحدث ثورة في اتصالات الحرم الجامعي.',
      clientRole: 'مدير تقنية المعلومات',
      image: '/images/project1.jpg'
    }
  ];

  const projects = language === 'ar' ? projectsAr : projectsEn;

  const nextProject = () => {
    setIsAutoPlaying(false);
    setActiveProject(prev => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setIsAutoPlaying(false);
    setActiveProject(prev => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section
      id="projects"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible && !shouldReduceMotion ? { opacity: 1, y: 0 } : isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="text-eyebrow text-xs tracking-[0.2em] font-semibold uppercase">
            {t("projects.signatureProjects")}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient">
            {t("projects.transformativeTitle")}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group glass rounded-2xl overflow-hidden border border-hairline transition-all duration-300 hover:border-[#d6132b]/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(214,19,43,0.5)]"
        >
          <div className="relative h-96 overflow-hidden">
            <OptimizedImage
              src={projects[activeProject].image}
              alt={`${projects[activeProject].title} — featured project photography for AMT portfolio`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              width={1200}
              height={600}
              priority
            />

            {/* dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060616] via-[#060616]/40 to-transparent" />

            <div className="absolute bottom-6 inset-x-6 z-10 text-white">
              <span className="block h-[2px] w-8 bg-[#d6132b] mb-3" />
              <h3 className="text-2xl sm:text-3xl font-bold">
                {projects[activeProject].title}
              </h3>
              <p className="mt-2 text-[#c7c8da]">{projects[activeProject].description}</p>
            </div>

            <button
              onClick={prevProject}
              type="button"
              aria-label="Previous project"
              className="glass absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full text-white border border-white/10 hover:border-white/30 transition"
            >
              <ChevronLeft className="rtl:rotate-180" />
            </button>

            <button
              onClick={nextProject}
              type="button"
              aria-label="Next project"
              className="glass absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full text-white border border-white/10 hover:border-white/30 transition"
            >
              <ChevronRight className="rtl:rotate-180" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
