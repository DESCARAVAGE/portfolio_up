"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMotionFactor } from "@/app/hooks/useMotionFactor";

/** Opacité de départ : le texte reste lisible même sans défiler. */
const FLOOR = 0.35;

/**
 * Paragraphe dont les mots s'allument un par un au fil du défilement.
 * Le texte complet est dans le HTML (lu tel quel par les lecteurs d'écran et
 * les moteurs de recherche). Tout est allumé si l'utilisateur réduit les animations.
 */
export default function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const k = useMotionFactor();
  // Se termine aux deux tiers de l'écran : le texte est entièrement lisible bien avant de sortir
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.65"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} k={k} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  progress,
  k,
  range,
  children,
}: {
  progress: MotionValue<number>;
  k: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform([progress, k], ([p, k]: number[]) => {
    if (k === 0) return 1;
    const t = Math.min(Math.max((p - range[0]) / (range[1] - range[0]), 0), 1);
    return FLOOR + (1 - FLOOR) * t;
  });
  return (
    <motion.span style={{ opacity }} className="inline-block pr-[0.25em]">
      {children}
    </motion.span>
  );
}
