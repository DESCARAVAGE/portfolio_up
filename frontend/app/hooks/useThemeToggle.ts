"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";

export type ResolvedTheme = "light" | "dark";

/**
 * Logique de bascule clair / sombre.
 *
 * Règle d'alignement système : si le thème choisi correspond à celui de l'OS,
 * on repasse en mode "system". Ainsi l'app recommence à suivre l'OS
 * (changement auto jour/nuit, etc.) dès que l'user revient sur le thème de son système.
 */
export function useThemeToggle() {
  const { resolvedTheme, systemTheme, theme, setTheme } = useTheme();

  const current: ResolvedTheme = resolvedTheme === "dark" ? "dark" : "light";
  const isDark = current === "dark";
  const followsSystem = theme === "system";

  const toggle = useCallback(() => {
    const next: ResolvedTheme = isDark ? "light" : "dark";
    setTheme(next === systemTheme ? "system" : next);
  }, [isDark, systemTheme, setTheme]);

  return { current, isDark, followsSystem, toggle };
}
