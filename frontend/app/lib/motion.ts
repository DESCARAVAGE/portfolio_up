import type { Transition, Variants } from "motion/react";

/** Courbe commune : départ vif, arrivée douce. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const SPRING_SOFT: Transition = { type: "spring", stiffness: 120, damping: 20, mass: 0.9 };

/** Effets d'apparition disponibles pour <Reveal effect="…">. */
export type RevealEffect = "fade-up" | "slide-left" | "slide-right" | "scale" | "lift";

/**
 * `lift` ne touche PAS à l'opacité : une opacité < 1 sur un parent
 * casse le backdrop-filter du verre pendant l'animation. On l'utilise pour les
 * cartes en verre ; leur contenu fond via la variante CONTENT_FADE.
 */
export const REVEAL_VARIANTS: Record<RevealEffect, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -80 },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT } },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 80 },
    show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE_OUT } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE_OUT } },
  },
  lift: {
    hidden: { y: 90, scale: 0.94, rotateX: 8 },
    show: { y: 0, scale: 1, rotateX: 0, transition: SPRING_SOFT },
  },
};

/** Contenu d'une carte en verre : fond en fondu, hérité du parent. */
export const CONTENT_FADE: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, delay: 0.15, ease: EASE_OUT } },
};

/** Parent qui décale l'apparition de ses enfants. */
export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});
