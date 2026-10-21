"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import type { FogColors, FogQuality } from "@/app/lib/fog/fogConfig";
import type { FogHandle } from "@/app/lib/fog/createFog";
import type { FogInteraction } from "@/app/lib/fog/fogInteraction";
import { detectFogTier, rememberOptIn, whenVisitorEngages, type FogTier } from "@/app/lib/fog/fogSupport";

// Le palier ne change pas pendant la visite : rien à écouter
const subscribe = () => () => {};

/**
 * Cycle de vie du brouillard :
 * - le palier est choisi dans le navigateur (fogSupport.detectFogTier) :
 *   3D complète, 3D allégée, 3D proposée par un bouton, ou fond CSS seul ;
 * - rien n'est chargé avant le premier geste du visiteur (ou 5 s après le chargement) ;
 * - le moteur WebGL arrive alors par un import dynamique (createFog, ~5 Ko) ;
 * - si WebGL manque, ou si le système reprend le contexte WebGL, le fond CSS reste ;
 * - les couleurs changent avec le thème sans recréer le moteur.
 * Renvoie le contrôleur d'interaction, `ready` (le canvas est prêt à être affiché),
 * le palier, la qualité en cours et `enable` (activation par le visiteur).
 */
export function useFog(ref: RefObject<HTMLElement | null>, colors: FogColors | null) {
  const handle = useRef<FogHandle | null>(null);
  const interaction = useRef<FogInteraction | null>(null);
  const colorsRef = useRef(colors);
  const [ready, setReady] = useState(false);
  const [quality, setQuality] = useState<FogQuality | null>(null);
  const [optedIn, setOptedIn] = useState(false);
  const themeKnown = colors !== null;

  // null côté serveur et au premier rendu : la page HTML est la même pour tous
  const detected = useSyncExternalStore<FogTier | null>(subscribe, detectFogTier, () => null);
  const tier: FogTier | null = optedIn ? "lite" : detected;

  // Garde la dernière palette sous la main pour l'init asynchrone
  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  // Création : une fois, quand le thème et le palier sont connus
  useEffect(() => {
    if (!themeKnown || handle.current || (tier !== "full" && tier !== "lite")) return;
    let cancelled = false;

    const run = async () => {
      const { createFog } = await import("@/app/lib/fog/createFog");
      const el = ref.current;
      if (cancelled || !el || !colorsRef.current) return;

      const fog = createFog(el, colorsRef.current, {
        quality: tier,
        onQuality: setQuality,
        onLost: () => {
          handle.current = null;
          interaction.current = null;
          setReady(false);
          setQuality(null);
        },
      });
      if (!fog) return; // WebGL indisponible : on garde le fond CSS
      handle.current = fog;
      interaction.current = fog.interaction;
      setReady(true);

      // Diagnostic en dev : `__fog.burst(0.5, 0.5)` dans la console lance une onde au centre
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __fog?: FogInteraction | null }).__fog = fog.interaction;
      }
    };

    // Activée par le visiteur : tout de suite. Sinon, au premier geste.
    let cancelSchedule = () => {};
    if (optedIn) void run();
    else cancelSchedule = whenVisitorEngages(run);

    return () => {
      cancelled = true;
      cancelSchedule();
    };
  }, [themeKnown, tier, optedIn, ref]);

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

  const enable = () => {
    rememberOptIn();
    setOptedIn(true);
  };

  return { interaction, ready, tier, quality, enable };
}
