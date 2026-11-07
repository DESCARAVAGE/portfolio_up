import type { SectionId } from "@/app/content/profile";
import type { Locale } from "@/app/i18n/config";
import { getContent, getUi } from "@/app/i18n/content";

/**
 * Titre de section (h2) : petit libellé numéroté « 03 — expérience » à gauche,
 * phrase-titre en grand à droite. Les deux viennent de SECTIONS (profile.ts) :
 * réordonner les sections renumérote tout automatiquement.
 *
 * Lecteur d'écran : il entend « Expérience : Un projet porté de bout en bout. »
 * (« Experience: One project, carried end to end. » en anglais)
 * (le numéro est décoratif).
 */
export default function SectionHeading({
  locale,
  section,
  className = "mb-10",
}: Readonly<{ locale: Locale; section: SectionId; className?: string }>) {
  const { SECTIONS } = getContent(locale);
  const index = SECTIONS.findIndex((s) => s.id === section);
  const entry = SECTIONS[index];
  const label = entry?.label ?? section;
  const title = entry && "title" in entry ? entry.title : undefined;

  return (
    <h2 className={`m-0 flex flex-wrap items-end justify-between gap-6 font-[inherit] font-normal ${className}`}>
      <span aria-hidden className="text-mute font-mono text-[0.8125rem]">
        {String(index + 1).padStart(2, "0")} — {label}
      </span>
      <span className="max-w-[16ch] text-[clamp(2rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.035em]">
        <span className="sr-only">
          {label.charAt(0).toUpperCase() + label.slice(1)}
          {getUi(locale).colon}
        </span>
        {title ?? label}
      </span>
    </h2>
  );
}
