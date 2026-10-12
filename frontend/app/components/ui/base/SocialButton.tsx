import type { IconType } from "react-icons";

const STYLES = {
  /** Orange plein, comme « M'écrire » : se détache dans la barre de navigation. */
  accent: "h-11 w-11 bg-[var(--accent-surface)] text-[var(--accent-ink)] shadow-[0_8px_20px_-8px_var(--accent)]",
  /** Encre pleine (s'inverse avec le thème), comme les cartes pleines du site. */
  ink: "h-11 w-11 bg-[var(--ink)] text-[var(--paper)] shadow-[0_8px_20px_-10px_var(--ink)]",
  /** Contour, comme « Mon CV » : à côté du bouton orange du pied de page. */
  outline:
    "h-12 w-12 border border-[color-mix(in_srgb,currentColor_35%,transparent)] hover:bg-[var(--accent-surface)] hover:text-[var(--accent-ink)] hover:border-transparent",
} as const;

export type SocialVariant = keyof typeof STYLES;

/**
 * Bouton rond vers un profil (LinkedIn, GitHub…), logo seul, ouvert dans un
 * nouvel onglet. Le nom est donné aux lecteurs d'écran par aria-label.
 * Le logo vient de react-icons (Font Awesome) : un SVG en currentColor,
 * qui prend la couleur du texte du bouton dans les deux thèmes.
 */
export default function SocialButton({
  href,
  label,
  icon: Icon,
  variant,
  className = "",
}: {
  href: string;
  label: string;
  icon: IconType;
  variant: SocialVariant;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${label} (nouvel onglet)`}
      title={label}
      className={`grid shrink-0 place-items-center rounded-full transition hover:-translate-y-0.5 hover:scale-105 ${STYLES[variant]} ${className}`}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </a>
  );
}
