"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { FogColors } from "@/app/lib/vanta/fogConfig";
import type { FogHandle } from "@/app/lib/vanta/createFog";
import type { FogInteraction } from "@/app/lib/vanta/fogInteraction";
import { fogAllowed, whenVisitorEngages } from "@/app/lib/vanta/fogSupport";

/**
 * Cycle de vie du brouillard Vanta FOG :
 * - rien n'est chargé avant le premier geste du visiteur (ou 5 s après le chargement) ;
 * - Three.js + Vanta arrivent alors par un import dynamique (createFog) ;
 * - pas de brouillard si mouvement réduit, économie de données ou WebGL absent :
 *   le fond CSS de secours reste en place ;
 * - les couleurs changent avec le thème sans recréer la scène.
 * Renvoie le contrôleur d'interaction et `ready` (le canvas est prêt à être affiché).
 */
export function useVantaFog(ref: RefObject<HTMLElement | null>, colors: FogColors | null) {
  const handle = useRef<FogHandle | null>(null);
  const interaction = useRef<FogInteraction | null>(null);
  const colorsRef = useRef(colors);
  const [ready, setReady] = useState(false);
  const themeKnown = colors !== null;

  // Garde la dernière palette sous la main pour l'init asynchrone
  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  // Création : une fois, quand le thème est connu et que le visiteur s'est manifesté
  useEffect(() => {
    if (!themeKnown || handle.current || !fogAllowed()) return;
    let cancelled = false;

    const cancelSchedule = whenVisitorEngages(async () => {
      const { createFog } = await import("@/app/lib/vanta/createFog");
      const el = ref.current;
      if (cancelled || !el || !colorsRef.current) return;

      const fog = createFog(el, colorsRef.current);
      if (!fog) return; // WebGL indisponible : on garde le fond CSS
      handle.current = fog;
      interaction.current = fog.interaction;
      setReady(true);

      // Diagnostic en dev : `__fog.burst(0.5, 0.5)` dans la console lance une onde au centre
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __fog?: FogInteraction | null }).__fog = fog.interaction;
      }
    });

    return () => {
      cancelled = true;
      cancelSchedule();
    };
  }, [themeKnown, ref]);

  // Mise à jour des couleurs au changement de thème
  useEffect(() => {
    if (colors) handle.current?.setColors(colors);
  }, [colors]);

  // Destruction au démontage
  useEffect(() => {
    return () => {
      handle.current?.destroy();
      handle.current = null;
      interaction.current = null;
    };
  }, []);

  return { interaction, ready };
}
