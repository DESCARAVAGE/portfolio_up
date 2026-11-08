"use client";

import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { requestFogBurst } from "@/app/lib/fog/fogEvents";

export type ResolvedTheme = "light" | "dark";

/** Durée de l'onde qui révèle le nouveau thème (ms) et sa courbe : démarrage et arrivée en douceur. */
const WAVE_MS = 1000;
const WAVE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
/** Largeur du front de l'onde, en fondu (px) : passée au CSS par --wave-soft (globals.css). */
const WAVE_SOFT = 120;

/** Onde en cours : un second clic la remplace, et seule la dernière fait le ménage. */
let currentWave = 0;

/**
 * Logique de bascule clair / sombre.
 *
 * Règle d'alignement système : si le thème choisi correspond à celui de l'OS,
 * on repasse en mode "system". Ainsi l'app recommence à suivre l'OS
 * (changement auto jour/nuit, etc.) dès que l'user revient sur le thème de son système.
 *
 * Transition : le nouveau thème se propage en cercle depuis le bouton, comme l'onde
 * de choc du brouillard, qui part au même moment du même point. Elle repose sur
 * l'API View Transitions : sans elle, ou avec « réduire les animations », le
 * changement reste instantané.
 */
export function useThemeToggle() {
  const { resolvedTheme, systemTheme, theme, setTheme } = useTheme();

  const current: ResolvedTheme = resolvedTheme === "dark" ? "dark" : "light";
  const isDark = current === "dark";
  const followsSystem = theme === "system";

  const toggle = useCallback(
    (origin?: Element | null) => {
      const next: ResolvedTheme = isDark ? "light" : "dark";
      const apply = () => setTheme(next === systemTheme ? "system" : next);

      const root = document.documentElement;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!origin || reduced || typeof document.startViewTransition !== "function") {
        apply();
        return;
      }

      const rect = origin.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      // Rayon final : distance jusqu'au coin le plus éloigné, plus le fondu du front
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + WAVE_SOFT;

      requestFogBurst(x, y);
      const wave = ++currentWave;
      root.dataset.themeWave = "";
      root.style.setProperty("--wave-soft", `${WAVE_SOFT}px`);
      root.style.setProperty("--wave-x", `${x}px`);
      root.style.setProperty("--wave-y", `${y}px`);
      const transition = document.startViewTransition(() => {
        // La classe est posée tout de suite : la capture « après » doit déjà être dans le nouveau thème
        root.classList.toggle("dark", next === "dark");
        root.style.colorScheme = next;
        flushSync(apply);
      });

      transition.ready
        .then(() => {
          root.animate(
            { "--wave-r": ["0px", `${radius}px`] },
            // fill: "forwards" : l'onde reste pleine jusqu'au retrait de la transition ; sans lui, le rayon
            // retombe à 0 pendant une ou deux images et l'ancien thème réapparaît (flash)
            { duration: WAVE_MS, easing: WAVE_EASE, fill: "forwards", pseudoElement: "::view-transition-new(root)" },
          );
        })
        .catch(() => {});
      transition.finished
        .catch(() => {})
        .finally(() => {
          if (wave !== currentWave) return;
          delete root.dataset.themeWave;
          for (const v of ["--wave-x", "--wave-y", "--wave-soft"]) root.style.removeProperty(v);
        });
    },
    [isDark, systemTheme, setTheme],
  );

  return { current, isDark, followsSystem, toggle };
}
