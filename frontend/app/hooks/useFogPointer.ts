"use client";

import { useEffect, type RefObject } from "react";
import { FOG_INTERACTION } from "@/app/lib/vanta/fogConfig";
import type { FogInteraction } from "@/app/lib/vanta/fogInteraction";

/** Éléments sur lesquels un clic ne doit PAS déclencher d'onde. */
const INTERACTIVE =
  'a, button, input, textarea, select, label, summary, [role="button"], [contenteditable="true"], [data-no-ripple]';

/**
 * Relie la souris / le tactile au contrôleur d'interaction.
 * - mouvement souris (ou doigt qui glisse) → remous
 * - clic gauche dans le fond → onde
 * - tap tactile (court, sans glisser) → onde ; un scroll n'en déclenche pas
 * Les écouteurs sont sur window car le fond est derrière le contenu (-z-10).
 * Désactivé si l'utilisateur a demandé à réduire les animations.
 */
export function useFogPointer(el: RefObject<HTMLElement | null>, interaction: RefObject<FogInteraction | null>) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      if (process.env.NODE_ENV !== "production") {
        console.info("[VantaFog] interaction désactivée : le système demande de réduire les animations");
      }
      return;
    }

    const toUv = (clientX: number, clientY: number) => {
      const rect = el.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) return null;
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height, // le shader a l'origine en bas
      };
    };

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element && target.closest(INTERACTIVE) !== null;

    const burstAt = (clientX: number, clientY: number) => {
      const p = toUv(clientX, clientY);
      if (p) interaction.current?.burst(p.x, p.y);
    };

    // Taps tactiles en cours, par pointerId
    const taps = new Map<number, { x: number; y: number; t: number }>();

    const onMove = (e: PointerEvent) => {
      const p = toUv(e.clientX, e.clientY);
      if (p) interaction.current?.move(p.x, p.y);
    };

    const onDown = (e: PointerEvent) => {
      if (isInteractive(e.target)) return;
      if (e.pointerType === "mouse") {
        if (e.button === 0) burstAt(e.clientX, e.clientY);
      } else {
        taps.set(e.pointerId, { x: e.clientX, y: e.clientY, t: performance.now() });
      }
    };

    const onUp = (e: PointerEvent) => {
      const tap = taps.get(e.pointerId);
      taps.delete(e.pointerId);
      if (!tap) return;
      const moved = Math.hypot(e.clientX - tap.x, e.clientY - tap.y);
      const duration = performance.now() - tap.t;
      if (moved <= FOG_INTERACTION.tapMaxMove && duration <= FOG_INTERACTION.tapMaxDuration) {
        burstAt(e.clientX, e.clientY);
      }
    };

    const onCancel = (e: PointerEvent) => taps.delete(e.pointerId); // le navigateur a pris la main (scroll)

    const opts = { passive: true } as const;
    window.addEventListener("pointermove", onMove, opts);
    window.addEventListener("pointerdown", onDown, opts);
    window.addEventListener("pointerup", onUp, opts);
    window.addEventListener("pointercancel", onCancel, opts);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [el, interaction]);
}
