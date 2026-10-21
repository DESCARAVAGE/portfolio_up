/**
 * Retour des pages légales vers le portfolio, à l'endroit exact quitté.
 *
 * Pourquoi pas un simple « précédent » (history.back) : un clic sur un lien d'ancre
 * de la barre (#contact…) crée une entrée d'historique que Next.js ne gère pas ;
 * en y revenant, Next ignore l'évènement et la page légale reste affichée.
 * On mémorise donc l'adresse et la position de défilement au départ, puis on y
 * revient par une navigation Next (sans recharger la page).
 */
const ORIGIN = "legal:origin";
const RESTORE = "legal:restore-y";

type Origin = { href: string; y: number };

/** Au clic vers une page légale, depuis le portfolio. */
export function rememberPortfolioOrigin() {
  try {
    const origin: Origin = {
      href: window.location.pathname + window.location.search + window.location.hash,
      y: window.scrollY,
    };
    sessionStorage.setItem(ORIGIN, JSON.stringify(origin));
  } catch {
    /* navigation privée : le retour se fera vers l'accueil */
  }
}

/** Au clic sur « Retour » : l'origine mémorisée (et la position à rétablir), ou null. */
export function takePortfolioOrigin(): Origin | null {
  try {
    const raw = sessionStorage.getItem(ORIGIN);
    sessionStorage.removeItem(ORIGIN);
    if (!raw) return null;
    const origin = JSON.parse(raw) as Origin;
    sessionStorage.setItem(RESTORE, String(origin.y));
    return origin;
  } catch {
    return null;
  }
}

/** Sur le portfolio, une fois affiché : rétablit la position de défilement, s'il y en a une. */
export function restorePortfolioScroll() {
  try {
    const y = sessionStorage.getItem(RESTORE);
    if (y === null) return;
    sessionStorage.removeItem(RESTORE);
    // « instant » : sinon le défilement fluide de la page ferait glisser depuis le haut
    window.scrollTo({ top: Number(y), behavior: "instant" });
  } catch {
    /* rien à rétablir */
  }
}
