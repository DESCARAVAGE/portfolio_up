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

/** Réglages Vanta qui ne dépendent pas du thème. */
export const FOG_OPTIONS = {
  // Le shader FOG d'origine n'exploite pas la souris : on désactive
  // les écouteurs de Vanta, l'interaction est gérée par useFogPointer.
  mouseControls: false,
  touchControls: false,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  blurFactor: 0.6,
  zoom: 1,
  speed: 1,
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
