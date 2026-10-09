"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Fine barre d'accent en haut de page qui suit la progression du scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%", background: "var(--accent)" }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px]"
    />
  );
}
