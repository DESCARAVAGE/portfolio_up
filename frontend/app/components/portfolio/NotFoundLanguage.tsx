"use client";

import { useEffect } from "react";
import { localeOfPath } from "@/app/i18n/config";

/**
 * Page 404 commune (app/global-not-found.tsx) : sous /en, garde <html lang="en"> et le
 * titre anglais une fois la page hydratée. Next pose le titre des métadonnées (français)
 * après coup : on le surveille et on le remet en anglais tant que la page est affichée.
 */
export default function NotFoundLanguage({ englishTitle }: Readonly<{ englishTitle: string }>) {
  useEffect(() => {
    if (localeOfPath(window.location.pathname) !== "en") return;
    const apply = () => {
      if (document.documentElement.lang !== "en") document.documentElement.lang = "en";
      if (document.title !== englishTitle) document.title = englishTitle;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [englishTitle]);
  return null;
}
