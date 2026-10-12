import type { FogQuality } from "@/app/lib/fog/fogConfig";

/**
 * Palier du fond, décidé une fois dans le navigateur du visiteur :
 * - "full" / "lite" : brouillard 3D, qualité de départ (voir FOG_QUALITY) ;
 * - "offer" : fond CSS, et un bouton propose d'activer la 3D ;
 * - "off"   : fond CSS seul (mouvement réduit demandé : on ne propose rien).
 * Côté serveur, le palier est inconnu (null) : la page est la même pour tous.
 */
export type FogTier = FogQuality | "offer" | "off";

/**
 * Navigateurs intégrés aux applications (Instagram, Facebook, TikTok, LinkedIn…).
 * Sur iPhone, leur budget mémoire est plus serré que celui de Safari : le
 * brouillard y faisait recharger la page en boucle.
 */
const IN_APP_BROWSER =
  /Instagram|FBAN|FBAV|FB_IAB|FB4A|musical_ly|Bytedance|TikTok|LinkedInApp|Snapchat|Pinterest|Line\//i;

/** Mémoire de l'appareil (Go), annoncée par Chrome et Edge seulement. */
const LOW_MEMORY_GB = 2;

/** Le visiteur a activé la 3D lui-même : on s'en souvient pour ses prochaines visites. */
const OPT_IN_KEY = "fog-opt-in";

export function isInAppBrowser(): boolean {
  return typeof navigator !== "undefined" && IN_APP_BROWSER.test(navigator.userAgent);
}

export function rememberOptIn() {
  try {
    localStorage.setItem(OPT_IN_KEY, "1");
  } catch {
    /* navigation privée : le choix vaut pour cette visite seulement */
  }
}

function hasOptedIn(): boolean {
  try {
    return localStorage.getItem(OPT_IN_KEY) === "1";
  } catch {
    return false;
  }
}

export function detectFogTier(): FogTier {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";

  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const constrained =
    isInAppBrowser() ||
    nav.connection?.saveData === true ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= LOW_MEMORY_GB);
  if (constrained) return hasOptedIn() ? "lite" : "offer";

  const touch = window.matchMedia("(pointer: coarse)").matches;
  return touch || window.innerWidth < 600 ? "lite" : "full";
}

/** Premiers gestes du visiteur qui réveillent le brouillard. */
const WAKE_EVENTS = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown", "scroll"] as const;

/**
 * Appelle `cb` une seule fois, au premier des deux :
 * - le premier geste du visiteur (souris, toucher, molette, clavier, défilement) ;
 * - `fallbackMs` après le chargement, s'il ne bouge pas.
 *
 * Pourquoi : le brouillard est un décor. Le lancer pendant l'affichage de la page
 * disputerait le processeur au contenu (Lighthouse mesurait 4 s de blocage sur mobile).
 * Le dégradé CSS s'affiche en attendant, le brouillard arrive ensuite en fondu.
 * Renvoie une fonction d'annulation.
 */
export function whenVisitorEngages(cb: () => void, fallbackMs = 5000): () => void {
  let done = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const cleanup = () => {
    WAKE_EVENTS.forEach((e) => window.removeEventListener(e, fire));
    window.removeEventListener("load", startTimer);
    if (timer !== undefined) clearTimeout(timer);
  };

  function fire() {
    if (done) return;
    done = true;
    cleanup();
    // Pas dans le gestionnaire du geste lui-même : on laisse d'abord le navigateur
    // répondre au visiteur (défilement, clic), puis on lance au premier moment calme.
    if ("requestIdleCallback" in window) window.requestIdleCallback(cb, { timeout: 1500 });
    else setTimeout(cb, 200); // Safari : pas de requestIdleCallback
  }

  function startTimer() {
    timer = setTimeout(fire, fallbackMs);
  }

  WAKE_EVENTS.forEach((e) => window.addEventListener(e, fire, { passive: true, once: true }));
  if (document.readyState === "complete") startTimer();
  else window.addEventListener("load", startTimer, { once: true });

  return () => {
    done = true;
    cleanup();
  };
}
