"use client";

import { useEffect } from "react";
import { useMotionValue, useReducedMotion, type MotionValue } from "motion/react";

/**
 * Coefficient des effets liés au défilement (parallaxe, recul du hero…) :
 * 1 = effet actif, 0 = rien ne bouge.
 *
 * <MotionConfig reducedMotion="user"> ne coupe que les animations, pas les
 * valeurs liées au scroll : on multiplie donc chaque effet par ce coefficient.
 * C'est une MotionValue (et pas un booléen dans le style) pour que le rendu
 * serveur et le premier rendu client soient identiques : pas d'erreur d'hydratation.
 *
 * `desktopOnly` : coupe aussi l'effet sous 768 px (sur mobile, la parallaxe
 * crée des vides et des chevauchements entre cartes empilées).
 */
export function useMotionFactor({ desktopOnly = false } = {}): MotionValue<number> {
  const reduced = useReducedMotion();
  const factor = useMotionValue(1);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 767px)");
    const update = () => factor.set(reduced || (desktopOnly && small.matches) ? 0 : 1);
    update();
    if (!desktopOnly) return;
    small.addEventListener("change", update);
    return () => small.removeEventListener("change", update);
  }, [reduced, desktopOnly, factor]);

  return factor;
}
