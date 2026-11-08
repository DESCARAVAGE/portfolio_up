"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { takePortfolioOrigin } from "@/app/components/portfolio/legal/legalReturn";
import { ROUTES, localeOfPath, translateHash } from "@/app/i18n/config";
import { useLocale, useUi } from "@/app/i18n/LocaleProvider";

/**
 * « Retour au portfolio » : si on vient du portfolio, on y revient à l'adresse quittée
 * (ex. /#contact) et à la même position de défilement, sans recharger la page.
 * L'entrée d'historique de la page légale est remplacée : « précédent » ne la rouvre pas.
 * Portfolio quitté dans l'autre langue (langue changée sur la page légale) : accueil de
 * la langue de la page, à la même section, ancre traduite (/#projets → /en#projects).
 * Sinon (lien partagé, nouvel onglet), c'est un lien classique vers l'accueil.
 */
export default function BackToPortfolio({ className = "" }: Readonly<{ className?: string }>) {
  const router = useRouter();
  const locale = useLocale();
  const { legal } = useUi();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Maj + clic, clic molette : le navigateur ouvre un nouvel onglet, on le laisse faire
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const url = (href: string) => new URL(href, window.location.origin);
    const origin = takePortfolioOrigin((href) => localeOfPath(url(href).pathname) === locale);
    if (!origin) return;
    e.preventDefault();
    const from = localeOfPath(url(origin.href).pathname);
    if (from !== locale) {
      router.replace(ROUTES.home[locale] + translateHash(url(origin.href).hash, from, locale));
      return;
    }
    // scroll: false : la position est rétablie par LegalNav une fois le portfolio affiché
    router.replace(origin.href, { scroll: false });
  };

  return (
    <Link href={ROUTES.home[locale]} onClick={onClick} className={className}>
      <span aria-hidden>← </span>
      {legal.back}
    </Link>
  );
}
