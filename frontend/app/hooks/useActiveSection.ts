"use client";

import { useEffect, useState } from "react";

/**
 * Renvoie l'id de la section qui occupe le milieu de l'écran.
 * Sert au compteur « 03 / 08 » et au trait sous le lien actif du header.
 *
 * En bas de page, c'est toujours la dernière section : sur un grand écran, la
 * dernière (le contact, courte) n'atteint jamais le milieu de l'écran.
 */
export function useActiveSection<T extends string>(ids: readonly T[]): T {
  const [observed, setObserved] = useState<T>(ids[0]);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // Bande fine au milieu de l'écran : la section qui la traverse est l'active
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setObserved(entry.target.id as T);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setAtBottom(max > 0 && window.scrollY >= max - 2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return atBottom ? ids[ids.length - 1] : observed;
}
