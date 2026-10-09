import { SKILLS } from "@/app/content/profile";
import SectionHeading from "@/app/components/portfolio/layout/SectionHeading";
import Surface from "@/app/components/ui/base/Surface";
import Reveal from "@/app/components/ui/motion/Reveal";
import TagList from "@/app/components/ui/base/Tag";

/**
 * Effet — bento de spécialités : le verre bascule vers l'avant (lift),
 * les cartes pleines glissent de côté ; au survol la carte se soulève.
 */
export default function Skills() {
  return (
    <section id="competences" className="relative px-[4%] pt-8 pb-28 md:pb-36">
      <SectionHeading section="competences" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {SKILLS.map((s, i) => (
          <Reveal
            key={s.title}
            // Le verre ne doit pas fondre (opacité < 1 = brouillard invisible au travers) : il se soulève.
            effect={s.variant === "glass" ? "lift" : i % 2 === 0 ? "slide-left" : "slide-right"}
            delay={(i % 2) * 0.1}
            className={s.wide ? "md:col-span-2" : ""}
          >
            <Surface
              variant={s.variant}
              className="h-full transition-transform duration-500 hover:-translate-y-1.5"
              contentClassName="flex h-full min-h-[14rem] flex-col justify-between gap-8 p-8 sm:p-9 md:min-h-[16rem]"
            >
              <span aria-hidden className="text-mute font-mono text-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-4">
                <h3 className="m-0 text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
                  {s.title}
                </h3>
                <p className="text-mute m-0 max-w-md leading-relaxed">{s.text}</p>
                <TagList items={s.tools} label="Outils" />
              </div>
            </Surface>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
