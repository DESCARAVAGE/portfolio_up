import type { ResolvedTheme } from "@/app/hooks/useThemeToggle";

export type FogColors = {
  highlightColor: number;
  midtoneColor: number;
  lowlightColor: number;
  baseColor: number;
};

/** Palettes par thème. Le clair reprend les valeurs du configurateur Vanta. */
export const FOG_PALETTES: Record<ResolvedTheme, FogColors> = {
  light: {
    highlightColor: 0xfafafa,
    midtoneColor: 0x020202,
    lowlightColor: 0xfafafa,
    baseColor: 0xffffff,
  },
  // Inverse du clair (0xffffff - couleur)
  dark: {
    highlightColor: 0x050505,
    midtoneColor: 0xfdfdfd,
    lowlightColor: 0x050505,
    baseColor: 0x000000,
  },
};

/**
 * Niveaux de qualité du rendu, du plus riche au plus léger.
 * Le brouillard est flou et lent : moins de pixels et moins d'images se voient peu.
 * - full : ordinateur (souris, grand écran) ;
 * - lite : téléphone et tablette tactile, ou 3D activée à la main ;
 * - low  : appareil qui peine, détecté pendant le rendu (voir FOG_PROBE).
 */
export type FogQuality = "full" | "lite" | "low";

export const FOG_QUALITY: Record<FogQuality, { scale: number; fps: number }> = {
  /** scale : le canvas est N fois moins dense que l'écran, puis étiré par le navigateur. */
  full: { scale: 2, fps: 60 },
  lite: { scale: 4, fps: 30 },
  low: { scale: 6, fps: 24 },
};

/** Ordre de repli quand l'appareil peine. */
export const FOG_QUALITY_STEPS: readonly FogQuality[] = ["full", "lite", "low"];

export const FOG_RENDER = {
  /** Plafond de pixels du canvas, pour les très grands écrans. */
  maxPixels: 1_000_000,
  /** Vitesse de l'animation (1 = celle de l'effet d'origine). */
  speed: 1,
} as const;

/**
 * Mesure en direct : après le démarrage, on chronomètre les images.
 * Si l'intervalle médian dépasse `slowFactor` fois celui visé, on descend d'un niveau
 * et on remesure. On ne coupe jamais le brouillard pour lenteur (seulement
 * si le système reprend le contexte WebGL).
 */
export const FOG_PROBE = {
  /** On laisse passer les premières images (compilation du shader, chargement de la page). */
  warmupMs: 600,
  /** Durée de la mesure. */
  windowMs: 2000,
  slowFactor: 1.5,
} as const;

/**
 * Réglages de l'interaction (distances en "hauteurs d'écran" : 1 = toute la hauteur).
 * C'est ici qu'on ajuste le ressenti.
 */
export const FOG_INTERACTION = {
  /** Nombre max d'ondes simultanées (doit rester = MAX_RIPPLES du shader). */
  maxRipples: 6,
  /** Vitesse d'expansion de l'onde (hauteurs d'écran / seconde). */
  rippleSpeed: 0.75,
  /** Épaisseur de l'anneau. */
  rippleWidth: 0.06,
  /** Durée de vie d'une onde (s) : après, les nuages se sont refermés. */
  rippleLife: 2.2,
  /** Force avec laquelle l'anneau pousse les nuages (déformation). */
  rippleForce: 0.07,
  /** Éclaircissement de l'intérieur de l'onde (0 = aucun, 1 = fond totalement dégagé). */
  rippleClear: 0.3,
  /** Visibilité de l'anneau au front de l'onde (0 = invisible). */
  rippleEdge: 0.1,

  /** Éclaircissement autour du pointeur quand il bouge. */
  pointerClear: 0.1,
  /** Rayon du remous autour du pointeur. */
  pointerRadius: 0.14,
  /** Intensité du remous gagnée par unité de déplacement du pointeur. */
  stirGain: 5,
  /** Vitesse à laquelle le remous retombe quand le pointeur s'arrête (/s). */
  stirDecay: 2.5,
  /** Amplitude du décalage global du brouillard qui suit le pointeur. */
  parallax: 0.12,
  /** Réactivité du suivi (plus haut = plus nerveux). */
  follow: 6,

  /** Un tap tactile ne doit pas bouger de plus de N px ni durer plus de N ms. */
  tapMaxMove: 10,
  tapMaxDuration: 400,
} as const;
