import Image from "next/image";
import { APPROACH } from "@/app/content/profile";
import SectionHeading from "@/app/components/portfolio/layout/SectionHeading";
import Surface from "@/app/components/ui/base/Surface";
import Parallax from "@/app/components/ui/motion/Parallax";
import Reveal from "@/app/components/ui/motion/Reveal";
import ScrollWords from "@/app/components/ui/motion/ScrollWords";

/**
 * Section « approche » :
 * - le texte s'allume mot par mot au scroll, dans un panneau en verre qui passe devant ;
 * - la carte pleine (photo + infos pratiques) dérive plus lentement ;
 * - les trois piliers montent en cascade dessous.
 */
export default function About() {
  return (
    <section id="approche" className="relative px-[4%] py-28 md:py-36">
      <SectionHeading section="approche" />
      <div className="flex flex-wrap items-start gap-6">
        <Parallax speed={-0.12} className="flex-[2_1_34rem]">
          <Surface variant="glass" radius="1.75rem" contentClassName="p-8 sm:p-14">
            <ScrollWords
              text={APPROACH.story}
              className="m-0 text-[clamp(1.5rem,2.8vw,2.5rem)] leading-[1.22] font-medium tracking-[-0.025em]"
            />
          </Surface>
        </Parallax>

        <Parallax speed={0.14} className="flex-[1_1_18rem]">
          <Reveal effect="slide-right">
            <Surface variant="solid" radius="1.75rem" contentClassName="flex flex-col gap-6 p-7">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={APPROACH.photo.src}
                  alt={APPROACH.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
              <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-5">
                {APPROACH.facts.map((f) => (
                  <div key={f.label} className="flex flex-col gap-1">
                    <dt className="text-mute font-mono text-xs tracking-wider uppercase">{f.label}</dt>
                    <dd className="m-0 font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Surface>
          </Reveal>
        </Parallax>
      </div>

      <ol className="m-0 mt-6 grid list-none grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6 p-0">
        {APPROACH.pillars.map((p, i) => (
          <li key={p.title}>
            <Reveal effect="lift" delay={i * 0.1}>
              <Surface variant="glass" contentClassName="flex min-h-[11rem] flex-col justify-between gap-6 p-7">
                <span aria-hidden className="text-mute font-mono text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="m-0 text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
                  <p className="text-mute m-0 leading-relaxed">{p.text}</p>
                </div>
              </Surface>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
