import { VISION } from "@/app/content/profile";
import SectionHeading from "@/app/components/portfolio/layout/SectionHeading";
import Surface from "@/app/components/ui/base/Surface";
import Reveal from "@/app/components/ui/motion/Reveal";
import Parallax from "@/app/components/ui/motion/Parallax";
import { Stagger, StaggerItem } from "@/app/components/ui/motion/Stagger";

/**
 * Section « vision » :
 * - à gauche, ce que je cherche : trois lignes qui montent en cascade dans un panneau en verre ;
 * - à droite, deux cartes à des hauteurs différentes : « pourquoi le code » (pleine)
 *   et la conviction sur l'IA (accent), qui grandit en apparaissant.
 */
export default function Vision() {
  return (
    <section id="vision" className="relative px-[4%] pt-8 pb-28 md:pb-36">
      <SectionHeading section="vision" />

      <div className="flex flex-wrap items-start gap-6">
        <Parallax speed={-0.08} className="flex-[3_1_32rem]">
          <Reveal effect="lift" amount={0.2}>
            <Surface variant="glass" radius="1.75rem" contentClassName="px-7 py-3 sm:px-10">
              <Stagger as="dl" step={0.12} amount={0.3} className="m-0">
                {VISION.seeking.map((s) => (
                  <StaggerItem
                    key={s.label}
                    className="flex flex-wrap items-baseline gap-x-10 gap-y-2 border-b border-[var(--line)] py-7 last:border-b-0"
                  >
                    <dt className="text-mute basis-28 font-mono text-xs tracking-wider uppercase">{s.label}</dt>
                    <dd className="m-0 flex-[1_1_18rem] text-[clamp(1.25rem,2vw,1.6rem)] leading-snug tracking-[-0.015em]">
                      {s.text}
                    </dd>
                  </StaggerItem>
                ))}
              </Stagger>
            </Surface>
          </Reveal>
        </Parallax>

        <div className="flex flex-[2_1_20rem] flex-col gap-6">
          <Parallax speed={0.12}>
            <Reveal effect="slide-right">
              <Surface variant="solid" contentClassName="flex flex-col gap-4 p-8">
                <h3 className="text-mute m-0 font-mono text-xs font-normal tracking-wider uppercase">
                  {VISION.why.label}
                </h3>
                <p className="m-0 text-xl leading-snug">{VISION.why.text}</p>
              </Surface>
            </Reveal>
          </Parallax>

          <Parallax speed={-0.14}>
            <Reveal effect="scale">
              <Surface variant="accent" contentClassName="flex flex-col gap-5 p-8">
                <h3 className="m-0 font-mono text-xs font-normal tracking-wider uppercase">
                  {VISION.conviction.label}
                </h3>
                <p className="m-0 text-xl leading-snug">{VISION.conviction.text}</p>
                <a
                  href={`#${VISION.conviction.link.target}`}
                  className="w-fit rounded-full border border-[color-mix(in_srgb,currentColor_40%,transparent)] px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5"
                >
                  {VISION.conviction.link.label} <span aria-hidden>↑</span>
                </a>
              </Surface>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
