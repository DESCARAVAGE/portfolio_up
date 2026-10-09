"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * reducedMotion="user" : si l'utilisateur a demandé moins d'animations,
 * motion coupe les déplacements (les fondus restent).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
