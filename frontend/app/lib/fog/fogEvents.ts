/**
 * Demande d'onde de choc venue d'ailleurs que du fond (ex. le bouton de thème, sur
 * lequel un clic ne déclenche normalement pas d'onde). useFogPointer l'écoute.
 * Coordonnées en pixels de la fenêtre (clientX / clientY).
 * Sans brouillard 3D (fond CSS, mouvement réduit), l'appel n'a aucun effet.
 */
const FOG_BURST_EVENT = "fog:burst";

export type FogBurstDetail = { clientX: number; clientY: number };

export function requestFogBurst(clientX: number, clientY: number) {
  window.dispatchEvent(new CustomEvent<FogBurstDetail>(FOG_BURST_EVENT, { detail: { clientX, clientY } }));
}

export function onFogBurstRequest(handler: (detail: FogBurstDetail) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<FogBurstDetail>).detail);
  window.addEventListener(FOG_BURST_EVENT, listener);
  return () => window.removeEventListener(FOG_BURST_EVENT, listener);
}
