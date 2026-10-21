"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";

const HIDDEN = {
  bottom: (r: string) => `inset(0px 0px 100% 0px round ${r})`,
  right: (r: string) => `inset(0px 100% 0px 0% round ${r})`,
};

type Props = {
  /** Côté d'où le rideau s'ouvre. */
  from?: keyof typeof HIDDEN;
  radius?: string;
  /** Classes du conteneur extérieur (placement dans la mise en page). */
  className?: string;
  /** Classes et style du cadre dévoilé. */
  frameClassName?: string;
  frameStyle?: CSSProperties;
  children: ReactNode;
};

/**
 * Dévoile un visuel par un rideau (clip-path) quand il arrive à l'écran.
 * Le déclencheur est sur le conteneur extérieur : un élément entièrement masqué
 * par son propre clip-path n'est pas considéré « à l'écran » par Chrome.
 * Déclenchement tôt et rideau court : pas de trou vide si l'on défile vite.
 */
export default function Curtain({
  from = "bottom",
  radius = "1.25rem",
  className,
  frameClassName,
  frameStyle,
  children,
}: Props) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className={className}>
      <motion.div
        variants={{
          hidden: { clipPath: HIDDEN[from](radius) },
          show: { clipPath: `inset(0px 0px 0px 0px round ${radius})`, transition: { duration: 0.75, ease: EASE_OUT } },
        }}
        className={frameClassName}
        style={frameStyle}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
