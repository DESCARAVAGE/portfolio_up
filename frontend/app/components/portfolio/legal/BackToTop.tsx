"use client";

import { useEffect, useState } from "react";

/**
 * Bouton « Haut de page », affiché une fois la page un peu défilée : 480 px, ou le tiers
 * du défilement possible si la page est courte (grand écran), pour qu'il apparaisse partout.
 * Ramène en haut et place le focus sur le titre (clavier, lecteur d'écran).
 */
export default function BackToTop({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(max > 0 && window.scrollY > Math.min(480, max / 3));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    document.getElementById(targetId)?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Haut de page"
      title="Haut de page"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`back-to-top fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 grid h-12 w-12 place-items-center rounded-full bg-[var(--ink)] text-[var(--paper)] shadow-lg transition duration-300 hover:scale-105 hover:bg-[var(--accent-surface)] hover:text-[var(--accent-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
