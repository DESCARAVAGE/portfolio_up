"use client";

import { useUi } from "@/app/i18n/LocaleProvider";

/**
 * « (nouvel onglet) » pour les lecteurs d'écran, dans la langue de la page.
 * Composant client : utilisable dans les liens externes, côté serveur comme côté client.
 */
export default function NewTabNote() {
  return <span className="sr-only">{useUi().newTab}</span>;
}
