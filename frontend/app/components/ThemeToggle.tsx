"use client";

import { useMounted } from "@/app/hooks/useMounted";
import { useThemeToggle } from "@/app/hooks/useThemeToggle";

/** Bouton clair / sombre. Aucune logique ici : tout est dans useThemeToggle. Placé par le header. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const { isDark, followsSystem, toggle } = useThemeToggle();

  // Côté serveur le thème est inconnu : libellé neutre jusqu'au montage
  const label = !mounted ? "Changer de thème" : isDark ? "Passer au thème clair" : "Passer au thème sombre";
  const title = mounted && followsSystem ? `${label} (actuellement : thème système)` : label;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={title}
      className={`grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition hover:scale-105 ${className}`}
    >
      {mounted && (isDark ? <SunIcon /> : <MoonIcon />)}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
