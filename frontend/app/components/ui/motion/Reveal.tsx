"use client";

import { useMemo, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { REVEAL_VARIANTS, type RevealEffect } from "@/app/lib/motion";

type Props = {
  effect?: RevealEffect;
  delay?: number;
  className?: string;
  /** Part du bloc visible avant de lancer l'animation (0..1). */
  amount?: number;
  children: ReactNode;
};

/** Ajoute un délai à la transition de la variante "show". */
function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants;
  const show = variants.show;
  if (!show || typeof show === "function") return variants;
  return { ...variants, show: { ...show, transition: { ...show.transition, delay } } };
}

/**
 * Fait apparaître son contenu une seule fois, quand il entre à l'écran.
 * Les enfants motion qui déclarent des variantes "hidden"/"show"
 * (ex. le contenu d'une <Surface>) s'animent en même temps.
 */
export default function Reveal({ effect = "fade-up", delay = 0, className, amount = 0.25, children }: Props) {
  const variants = useMemo(() => withDelay(REVEAL_VARIANTS[effect], delay), [effect, delay]);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      style={effect === "lift" ? { transformPerspective: 1200 } : undefined}
    >
      {children}
    </motion.div>
  );
}
