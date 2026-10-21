/**
 * Pastilles de technologies / outils : une liste <ul> nommée pour les lecteurs d'écran.
 * La bordure prend la couleur du texte : lisible sur verre, carte pleine ou accent.
 */
export default function TagList({
  items,
  label = "Technologies",
  className = "",
}: {
  items: string[];
  label?: string;
  className?: string;
}) {
  return (
    <ul className={`m-0 flex list-none flex-wrap gap-2 p-0 ${className}`} aria-label={label}>
      {items.map((t, i) => (
        <li
          key={`${t}-${i}`}
          className="rounded-full border border-[color-mix(in_srgb,currentColor_25%,transparent)] px-3 py-1 font-mono text-xs"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
