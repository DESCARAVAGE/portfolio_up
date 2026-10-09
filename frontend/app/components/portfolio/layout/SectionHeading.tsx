import { SECTIONS, type SectionId } from "@/app/content/profile";

/**
 * Titre de section (h2) : petit libellé numéroté « 03 — expérience » à gauche,
 * phrase-titre en grand à droite. Les deux viennent de SECTIONS (profile.ts) :
 * réordonner les sections renumérote tout automatiquement.
 *
 * Lecteur d'écran : il entend « Expérience : Un projet porté de bout en bout. »
 * (le numéro est décoratif).
 */
export default function SectionHeading({ section, className = "mb-10" }: { section: SectionId; className?: string }) {
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
        <span className="sr-only">{label.charAt(0).toUpperCase() + label.slice(1)} : </span>
        {title ?? label}
      </span>
    </h2>
  );
}
