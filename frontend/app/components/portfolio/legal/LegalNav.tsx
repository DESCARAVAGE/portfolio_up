"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LEGAL_ROUTES, ROUTES } from "@/app/i18n/config";
import { useLocale, useUi } from "@/app/i18n/LocaleProvider";
import { rememberPortfolioOrigin, restorePortfolioScroll } from "@/app/components/portfolio/legal/legalReturn";

/**
 * Liens vers les pages légales, dans le pied de page du portfolio et des pages légales.
 * - depuis le portfolio : on mémorise l'origine, pour que « Retour » y ramène au même endroit ;
 * - d'une page légale à l'autre : on remplace l'entrée d'historique, pour que « Retour »
 *   ramène toujours au portfolio, pas à la page légale précédente ;
 * - au retour sur le portfolio : on rétablit la position de défilement quittée.
 */
export default function LegalNav({ className = "" }: Readonly<{ className?: string }>) {
  const pathname = usePathname();
  const locale = useLocale();
  const { legal } = useUi();
  const pages = LEGAL_ROUTES.map((key) => ({ href: ROUTES[key][locale], label: legal.pages[key] }));
  const onLegalPage = pages.some((p) => p.href === pathname);

  useEffect(() => {
    if (!onLegalPage) restorePortfolioScroll();
  }, [onLegalPage]);

  return (
    <nav aria-label={legal.nav} className={className}>
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
        {pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              replace={onLegalPage}
              onClick={onLegalPage ? undefined : rememberPortfolioOrigin}
              aria-current={p.href === pathname ? "page" : undefined}
              className="underline-offset-4 hover:text-[var(--accent)] hover:underline aria-[current=page]:text-[var(--ink)]"
            >
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
