"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { localeOfPath, type Locale } from "@/app/i18n/config";
import type { Ui } from "@/app/i18n/content";

type LocaleValue = { locale: Locale; ui: Ui };

const LocaleContext = createContext<LocaleValue | null>(null);

/**
 * Langue de la page pour les composants client (bouton de thème, vidéo, menu…).
 * Posé par la mise en page racine de chaque langue, avec les textes de cette langue seulement.
 */
export function LocaleProvider({ locale, ui, children }: Readonly<LocaleValue & { children: ReactNode }>) {
  return <LocaleContext.Provider value={{ locale, ui }}>{children}</LocaleContext.Provider>;
}

/**
 * Page 404 commune (app/global-not-found.tsx) : elle sert toutes les adresses inconnues,
 * la langue vient donc de l'adresse (/en… = anglais). Reçoit les textes des deux langues.
 * La 404 est statique : au rendu serveur, l'adresse n'est pas celle demandée. Seuls des
 * composants affichés après le montage (bandeau du fond 3D) doivent donc s'en servir.
 */
export function PathLocaleProvider({ uis, children }: Readonly<{ uis: Record<Locale, Ui>; children: ReactNode }>) {
  const locale = localeOfPath(usePathname() ?? "/");
  return <LocaleContext.Provider value={{ locale, ui: uis[locale] }}>{children}</LocaleContext.Provider>;
}

function useLocaleValue() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("LocaleProvider manquant : il est posé par app/(fr)/layout.tsx et app/en/layout.tsx");
  return value;
}

export const useLocale = () => useLocaleValue().locale;
export const useUi = () => useLocaleValue().ui;
