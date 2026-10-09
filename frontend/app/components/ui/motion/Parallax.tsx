"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useMotionFactor } from "@/app/hooks/useMotionFactor";

type Props = {
  /**
   * Vitesse relative au scroll. 0 = normal, > 0 = plus lent (paraît plus loin),
   * < 0 = plus rapide (paraît plus proche). Ex. 0.15, -0.2.
   */
  speed?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Décale verticalement son contenu pendant qu'il traverse l'écran.
 * Des vitesses différentes sur des cartes voisines donnent des plans
 * à des « hauteurs » différentes au-dessus du brouillard.
 * Inactif sur mobile (cartes empilées) et si l'utilisateur réduit les animations.
 */
export default function Parallax({ speed = 0.15, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const k = useMotionFactor({ desktopOnly: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = speed * 240; // px de décalage max de chaque côté
  const raw = useTransform([scrollYProgress, k], ([p, k]: number[]) => (range - 2 * range * p) * k);
  const y = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.6 });

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
