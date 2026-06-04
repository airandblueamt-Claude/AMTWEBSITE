import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal single-line card row that continuously auto-scrolls (marquee-style,
 * seamless loop) and pauses on hover/interaction. Left/right arrows give manual
 * control. Auto-scroll is disabled under reduced-motion and on touch devices.
 * `className` is appended to the scroll container (e.g. perspective for tilt cards).
 */
const ScrollRow: React.FC<{ children: React.ReactNode; className?: string; speed?: number }> = ({
  children,
  className = "",
  speed = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const pos = useRef(0); // float scroll position (scrollLeft is integer-rounded in many browsers)
  const resumeTimer = useRef<number | undefined>(undefined);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Forced on for all devices and regardless of OS "reduce motion"
  // (pauses while the user swipes/hovers).
  const auto = true;

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = Math.abs(el.scrollLeft);
    setAtStart(x <= 2);
    setAtEnd(max <= 2 || x >= max - 2);
  }, []);

  // Continuous auto-scroll with seamless loop (children are duplicated below).
  useEffect(() => {
    if (!auto) return;
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        if (paused.current) {
          // Track manual scrolling so auto resumes from where the user left off.
          pos.current = el.scrollLeft;
        } else {
          const half = el.scrollWidth / 2; // children are duplicated -> half == one full set
          pos.current += speed;
          if (half > 0 && pos.current >= half) pos.current -= half;
          el.scrollLeft = pos.current; // driven from the float accumulator
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, speed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const pauseBriefly = () => {
    paused.current = true;
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => { paused.current = false; }, 2500);
  };

  const scroll = (dir: "prev" | "next") => {
    const el = ref.current;
    if (!el) return;
    pauseBriefly();
    const amount = Math.min(el.clientWidth * 0.8, 560);
    el.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  // Re-key the duplicated set so React doesn't warn about duplicate keys.
  const dup = auto
    ? React.Children.map(children, (child, i) =>
        React.isValidElement(child) ? React.cloneElement(child, { key: `dup-${i}` }) : child
      )
    : null;

  const btn =
    "hidden sm:grid place-items-center shrink-0 w-11 h-11 rounded-full glass text-ink shadow-lg shadow-black/20 transition hover:border-[#d6132b]/50 hover:text-[#d6132b] disabled:opacity-0 disabled:pointer-events-none";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <button type="button" aria-label="Scroll left" onClick={() => scroll("prev")}
        disabled={!auto && atStart} className={btn}>
        <ChevronLeft size={20} />
      </button>

      <div
        ref={ref}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
        onPointerDown={pauseBriefly}
        onWheel={pauseBriefly}
        className={`amt-row flex-1 min-w-0 flex gap-6 overflow-x-auto pb-4 ${auto ? "" : "snap-x snap-mandatory"} ${className}`}
      >
        {children}
        {dup}
      </div>

      <button type="button" aria-label="Scroll right" onClick={() => scroll("next")}
        disabled={!auto && atEnd} className={btn}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default ScrollRow;
