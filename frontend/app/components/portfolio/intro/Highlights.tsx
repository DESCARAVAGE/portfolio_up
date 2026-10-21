import { HIGHLIGHTS } from "@/app/content/profile";
import Surface from "@/app/components/ui/base/Surface";
import Reveal from "@/app/components/ui/motion/Reveal";
import Parallax from "@/app/components/ui/motion/Parallax";

/** Vitesses alternées : les chiffres flottent à des hauteurs différentes. */
const DEPTHS = [0.06, -0.1, 0.12, -0.06];

/**
 * Effet — quatre chiffres clés qui arrivent en cascade et flottent à des
 * hauteurs différentes. Placés juste après le hero : la preuve avant le discours.
 * Composant serveur : seuls Reveal, Parallax et Surface s'exécutent dans le navigateur.
 */
export default function Highlights() {
  return (
    <section id="en-bref" aria-labelledby="en-bref-titre" className="relative px-[4%] pt-10 pb-24 md:pb-32">
      <h2 id="en-bref-titre" className="sr-only">
        En bref
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-5 gap-y-5 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h, i) => (
          <li key={h.value}>
            <Parallax speed={DEPTHS[i % DEPTHS.length]}>
              <Reveal effect={h.variant === "glass" ? "lift" : "fade-up"} delay={i * 0.08}>
                <Surface
                  variant={h.variant}
                  contentClassName="flex min-h-[11rem] flex-col justify-between gap-8 p-7 md:min-h-[13rem]"
                >
                  <span className="text-[clamp(2.25rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.04em]">
                    {h.value}
                  </span>
                  <span className="text-mute leading-snug">{h.label}</span>
                </Surface>
              </Reveal>
            </Parallax>
          </li>
        ))}
      </ul>
    </section>
  );
}
