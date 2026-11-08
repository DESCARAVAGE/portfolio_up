"use client";

import { createContext, useContext, useLayoutEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { localeOfPath, type Locale } from "@/app/i18n/config";
import type { Ui } from "@/app/i18n/content";

type LocaleValue = { locale: Locale; ui: Ui };

const LocaleContext = createContext<LocaleValue | null>(null);

/**
 * Langue imposée à une partie de la page, avec ses textes : les deux blocs de la 404
 * commune (app/not-found.tsx), qui contient les deux langues.
 */
export function LocaleProvider({ locale, ui, children }: Readonly<LocaleValue & { children: ReactNode }>) {
  return <LocaleContext.Provider value={{ locale, ui }}>{children}</LocaleContext.Provider>;
}

/**
 * Langue de la page pour les composants client (bouton de thème, vidéo, menu…), posée
 * par la mise en page racine commune (RootShell) : elle vient de l'adresse (/en… = anglais)
 * et suit donc un changement de langue sans rechargement. Reçoit les textes des deux langues.
 * Garde aussi <html lang> à jour après une navigation (au premier affichage, c'est
 * HTML_LANG_SCRIPT qui le règle).
 * Sur la 404 (statique), l'adresse du rendu serveur n'est pas celle demandée : seuls des
 * composants affichés après le montage (bandeau du fond 3D) s'en servent, le reste de
 * la 404 a son propre LocaleProvider par langue.
 */
export function PathLocaleProvider({ uis, children }: Readonly<{ uis: Record<Locale, Ui>; children: ReactNode }>) {
  const locale = localeOfPath(usePathname() ?? "/");
  // Avant l'affichage de la nouvelle langue (sinon une image passerait avec l'ancien lang)
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return <LocaleContext.Provider value={{ locale, ui: uis[locale] }}>{children}</LocaleContext.Provider>;
}

function useLocaleValue() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("LocaleProvider manquant : il est posé par RootShell (app/layout.tsx)");
  return value;
}

export const useLocale = () => useLocaleValue().locale;
export const useUi = () => useLocaleValue().ui;
