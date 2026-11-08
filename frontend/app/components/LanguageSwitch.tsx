"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLanguageHref, type Locale } from "@/app/i18n/config";
import { useLocale, useUi } from "@/app/i18n/LocaleProvider";
import Flag from "@/app/components/ui/base/Flag";

/**
 * Bouton rond au drapeau de la langue affichée (France sur le site français, Royaume-Uni
 * sur le site anglais) : un clic mène à la même page dans l'autre langue (accueil → /en,
 * mentions légales → /en/legal-notice…). Sur l'accueil, la section en cours suit, avec
 * son ancre traduite (/#projets → /en#projects) : voir switchLanguageHref (i18n/config.ts).
 * La destination est dans le `href` (pas calculée au clic) : clic du milieu, « copier le
 * lien » et nouvel onglet gardent la section. Sur l'accueil, `section` est la section
 * affichée (barre de navigation) ; ailleurs, l'ancre de l'adresse.
 * Lien Next : les deux langues partagent la mise en page racine, le changement se fait
 * sans recharger la page : le fond 3D et le thème restent en place, la barre ne rejoue pas
 * son entrée.
 * Son libellé est dans la langue d'arrivée (lang/hrefLang), pour les lecteurs d'écran ;
 * le drapeau est décoratif (le libellé donne le nom du lien). L'infobulle, comme le
 * drapeau, montre la langue affichée (« Français »).
 */
export default function LanguageSwitch({
  section,
  className = "",
}: Readonly<{ section?: string; className?: string }>) {
  const pathname = usePathname();
  const locale = useLocale();
  const { switchLanguage: t } = useUi();
  const to: Locale = locale === "fr" ? "en" : "fr";

  // Ancre de l'adresse : vide côté serveur, suivie ensuite à chaque changement
  const hash = useSyncExternalStore(subscribeHash, readHash, () => "");

  // En haut de l'accueil, pas d'ancre à garder
  const current = section === undefined ? hash : section === "top" ? "" : `#${section}`;
  const href = switchLanguageHref(pathname, current, to);

  return (
    <Link
      href={href}
      hrefLang={to}
      lang={t.lang}
      aria-label={t.label}
      title={t.current}
      data-language-switch
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line)] transition hover:scale-105 hover:border-[var(--accent)] ${className}`}
    >
      <Flag locale={locale} className="h-6 w-6" />
    </Link>
  );
}

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const readHash = () => window.location.hash;
