import type { ReactNode } from "react";

/**
 * Lien vers un autre site, en bouton arrondi : ouvre un nouvel onglet,
 * et le dit aux lecteurs d'écran (la flèche ↗ est décorative).
 */
export default function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`rounded-full border border-[color-mix(in_srgb,currentColor_30%,transparent)] px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children} <span aria-hidden>↗</span>
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}
