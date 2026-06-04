import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useTranslation } from "react-i18next";

/**
 * ScrollProgress — a thin fixed bar at the very top of the page whose width
 * reflects overall scroll progress. Theme-independent orange gradient,
 * RTL-aware transform origin.
 */
const ScrollProgress: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: isRTL ? "right" : "left",
      }}
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-gradient-to-r from-[#d6132b] to-[#f12942]"
    />
  );
};

export default ScrollProgress;
