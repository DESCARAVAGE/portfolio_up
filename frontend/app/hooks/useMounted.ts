"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Renvoie false côté serveur et pendant l'hydratation, true ensuite.
 * Le thème n'est pas connu côté serveur : on attend d'être monté
 * avant d'afficher ce qui en dépend (sinon erreur d'hydratation).
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true, // client
    () => false, // serveur
  );
}
