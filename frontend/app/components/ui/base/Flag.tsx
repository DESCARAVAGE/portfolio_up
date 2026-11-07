import { useId } from "react";
import type { Locale } from "@/app/i18n/config";

/**
 * Drapeau rond d'une langue (fr → France, en → Royaume-Uni), en SVG inline : les
 * drapeaux emoji ne s'affichent pas sous Windows (lettres « FR » / « GB » à la place).
 * Purement décoratif : le nom du lien qui le contient est donné par son aria-label.
 * Le cadrage carré (le cercle est obtenu par CSS) garde le centre de chaque drapeau.
 */
export default function Flag({ locale, className = "" }: Readonly<{ locale: Locale; className?: string }>) {
  const common = {
    "aria-hidden": true,
    focusable: false,
    className: `block rounded-full ${className}`,
  } as const;

  return locale === "fr" ? <FrenchFlag {...common} /> : <BritishFlag {...common} />;
}

type SvgProps = Readonly<{ "aria-hidden": true; focusable: false; className: string }>;

function FrenchFlag(props: SvgProps) {
  return (
    <svg viewBox="0 0 3 3" {...props}>
      <rect width="1" height="3" fill="#002395" />
      <rect x="1" width="1" height="3" fill="#ffffff" />
      <rect x="2" width="1" height="3" fill="#ed2939" />
    </svg>
  );
}

function BritishFlag(props: SvgProps) {
  // Identifiant unique : deux drapeaux sur la page ne partagent pas leur découpe
  const clip = `${useId()}-uk`;
  return (
    <svg viewBox="15 0 30 30" {...props}>
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${clip})`} stroke="#c8102e" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}
