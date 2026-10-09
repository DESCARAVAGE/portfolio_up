import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import { FOG_OPTIONS, type FogColors } from "@/app/lib/vanta/fogConfig";
import { patchFogEffect } from "@/app/lib/vanta/fogShader";
import { FogInteraction } from "@/app/lib/vanta/fogInteraction";

/**
 * Tout ce qui a besoin de Three.js est dans CE fichier, et ce fichier n'est
 * importé que dynamiquement (voir useVantaFog). Three.js (~150 Ko compressés)
 * sort ainsi du JavaScript chargé à l'ouverture de la page.
 */

type VantaEffect = {
  scene?: THREE.Scene;
  onUpdate?: () => void;
  destroy: () => void;
  setOptions: (opts: Partial<FogColors>) => void;
};

export type FogHandle = {
  /** Contrôleur des remous et des ondes (null si le patch du shader a échoué). */
  interaction: FogInteraction | null;
  setColors: (colors: FogColors) => void;
  destroy: () => void;
};

/**
 * Crée le brouillard dans `el`. Renvoie null si WebGL est indisponible :
 * le fond CSS de secours reste alors affiché, sans erreur dans la console.
 */
export function createFog(el: HTMLElement, colors: FogColors): FogHandle | null {
  let fx: VantaEffect;
  try {
    // Vanta lève une exception si le contexte WebGL ne peut pas être créé
    fx = FOG({ el, THREE, ...FOG_OPTIONS, ...colors }) as VantaEffect;
  } catch {
    return null;
  }
  // Vanta a pu échouer plus loin (shader refusé…) : il n'y a alors pas de scène
  if (!fx?.scene) {
    try {
      fx?.destroy();
    } catch {
      /* rien à nettoyer */
    }
    return null;
  }

  const uniforms = patchFogEffect(fx.scene);
  const interaction = uniforms ? new FogInteraction(uniforms) : null;
  if (interaction) fx.onUpdate = () => interaction.update(); // appelé par Vanta à chaque frame

  return {
    interaction,
    setColors: (c) => fx.setOptions(c),
    destroy: () => fx.destroy(),
  };
}
