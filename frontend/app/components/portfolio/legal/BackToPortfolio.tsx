"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { takePortfolioOrigin } from "@/app/components/portfolio/legal/legalReturn";

/**
 * « Retour au portfolio » : si on vient du portfolio, on y revient à l'adresse quittée
 * (ex. /#contact) et à la même position de défilement, sans recharger la page.
 * L'entrée d'historique de la page légale est remplacée : « précédent » ne la rouvre pas.
 * Sinon (lien partagé, nouvel onglet), c'est un lien classique vers l'accueil.
 */
export default function BackToPortfolio({ className = "" }: { className?: string }) {
  const router = useRouter();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Maj + clic, clic molette : le navigateur ouvre un nouvel onglet, on le laisse faire
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const origin = takePortfolioOrigin();
    if (!origin) return;
    e.preventDefault();
    // scroll: false : la position est rétablie par LegalNav une fois le portfolio affiché
    router.replace(origin.href, { scroll: false });
  };

  return (
    <Link href="/" onClick={onClick} className={className}>
      <span aria-hidden>← </span>Retour au portfolio
    </Link>
  );
}
