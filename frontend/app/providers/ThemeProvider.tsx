"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Source de vérité du thème.
 * - defaultTheme="system" : au premier chargement, on suit le thème de l'OS.
 * - enableSystem : si l'OS change de thème, l'app suit en direct (tant que l'user est en mode "system").
 * - attribute="class" : ajoute la classe `dark` sur <html> (utilisée par Tailwind).
 * - Le choix de l'user est mémorisé dans localStorage par next-themes.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
