"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMotionFactor } from "@/app/hooks/useMotionFactor";

/**
 * Trait vertical d'une frise : un rail discret, et par-dessus un trait d'accent
 * qui se trace au fil du défilement (entièrement tracé si mouvement réduit).
 * `className` place les deux traits (position absolue dans le parent).
 */
export default function ScrollLine({ className }: { className: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const k = useMotionFactor();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 });
  const scaleY = useTransform([smooth, k], ([p, k]: number[]) => (k === 0 ? 1 : p));

  return (
    <>
      <span ref={ref} aria-hidden className={`${className} bg-[var(--line)]`} />
      <motion.span
        aria-hidden
        style={{ scaleY, transformOrigin: "50% 0%" }}
        className={`${className} bg-[var(--accent)]`}
      />
    </>
  );
}
