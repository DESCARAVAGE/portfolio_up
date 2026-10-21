"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionFactor } from "@/app/hooks/useMotionFactor";

/**
 * Fait entrer son contenu par la droite au rythme du défilement
 * (immobile si l'utilisateur réduit les animations).
 */
export default function ScrollSlide({
  from = 35,
  className,
  children,
}: {
  from?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const k = useMotionFactor();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 0.6"] });
  const x = useTransform([scrollYProgress, k], ([p, k]: number[]) => `${from * (1 - p) * k}%`);

  return (
    <motion.div ref={ref} style={{ x }} className={className}>
      {children}
    </motion.div>
  );
}
