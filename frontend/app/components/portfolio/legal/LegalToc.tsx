"use client";

import { useEffect, useState, type MouseEvent } from "react";

export type TocItem = { readonly id: string; readonly title: string };

/**
 * Rubrique en cours de lecture : la dernière dont le titre est passé sous le premier
 * tiers de l'écran. Ainsi la rubrique choisie dans le sommaire (amenée en haut) est
 * bien celle qui s'allume. En bas de page, la dernière rubrique s'allume.
 */
function useTocActive(items: readonly TocItem[]) {
  const [active, setActive] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(atBottom ? items.at(-1)?.id : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return active;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Sommaire d'une page légale : un lien par rubrique, la rubrique lue est soulignée.
 * Le clic fait défiler jusqu'à la rubrique et met à jour l'URL (#rubrique) SANS ajouter
 * d'entrée d'historique : « Retour au portfolio » ramène donc toujours au portfolio.
 */
export default function LegalToc({
  items,
  className = "",
}: Readonly<{ items: readonly TocItem[]; className?: string }>) {
  const active = useTocActive(items);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    // On garde l'état de Next dans l'entrée d'historique remplacée (sinon « précédent » rechargerait la page)
    window.history.replaceState(window.history.state, "", `#${id}`);
    // Clavier et lecteur d'écran repartent de la rubrique choisie
    target.focus({ preventScroll: true });
  };

  return (
    <nav aria-label="Sommaire" className={className}>
      <p className="text-mute m-0 mb-3 font-mono text-xs tracking-wider uppercase">Sur cette page</p>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={(e) => go(e, it.id)}
              aria-current={active === it.id ? "location" : undefined}
              className="block rounded-lg border-l-2 border-transparent py-1.5 pr-2 pl-3 text-[0.9375rem] leading-snug transition-colors hover:text-[var(--accent)] aria-[current=location]:border-[var(--accent)] aria-[current=location]:text-[var(--ink)]"
            >
              {it.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
