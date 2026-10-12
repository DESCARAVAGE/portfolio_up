import { FaLinkedinIn } from "react-icons/fa6";
import { PROFILE } from "@/app/content/profile";

const STYLES = {
  /** Orange plein, comme « M'écrire » : se détache dans la barre de navigation. */
  accent: "h-11 w-11 bg-[var(--accent-surface)] text-[var(--accent-ink)] shadow-[0_8px_20px_-8px_var(--accent)]",
  /** Contour, comme « Mon CV » : à côté du bouton orange du pied de page. */
  outline:
    "h-12 w-12 border border-[color-mix(in_srgb,currentColor_35%,transparent)] hover:bg-[var(--accent-surface)] hover:text-[var(--accent-ink)] hover:border-transparent",
} as const;

/**
 * Bouton rond vers le profil LinkedIn, logo seul. Le nom est donné aux lecteurs
 * d'écran par aria-label. Le logo vient de react-icons (Font Awesome) : un SVG
 * en currentColor, qui prend la couleur du texte du bouton dans les deux thèmes.
 */
export default function LinkedInButton({
  variant = "accent",
  className = "",
}: {
  variant?: keyof typeof STYLES;
  className?: string;
}) {
  return (
    <a
      href={PROFILE.linkedin}
      target="_blank"
      rel="noreferrer"
      aria-label="LinkedIn (nouvel onglet)"
      title="LinkedIn"
      className={`grid shrink-0 place-items-center rounded-full transition hover:-translate-y-0.5 hover:scale-105 ${STYLES[variant]} ${className}`}
    >
      <FaLinkedinIn className="h-5 w-5" aria-hidden />
    </a>
  );
}
