/**
 * Faut-il lancer le brouillard 3D ? Non si l'utilisateur a demandé moins
 * d'animations, ou s'il a activé l'économie de données : le fond CSS fixe suffit.
 */
export function fogAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;
  return true;
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
