import { CERTIFICATIONS, EDUCATION } from "@/app/content/profile";
import SectionHeading from "@/app/components/portfolio/layout/SectionHeading";
import Surface from "@/app/components/ui/base/Surface";
import Reveal from "@/app/components/ui/motion/Reveal";
import LogoTile from "@/app/components/ui/base/LogoTile";
import ScrollLine from "@/app/components/ui/motion/ScrollLine";

const KIND = {
  formation: { label: "formation", variant: "glass" as const },
  avant: { label: "avant la tech", variant: "solid" as const },
};

/**
 * Section « formation » — frise : la ligne d'accent se trace au fil du scroll ;
 * les diplômes (verre) basculent vers l'avant, l'étape « avant la tech » (pleine)
 * glisse depuis la gauche. Les certifications ferment la frise.
 */
export default function Journey() {
  return (
    <section id="formation" className="relative px-[4%] pt-8 pb-28 md:pb-36">
      <SectionHeading section="formation" className="mb-14" />

      {/* Le trait est hors de la liste : un <ol> ne doit contenir que des <li> */}
      <div className="relative">
        <ScrollLine className="absolute top-2 bottom-2 left-[0.6875rem] w-px md:left-[1.4375rem]" />
        <ol className="relative m-0 flex list-none flex-col gap-10 p-0 pl-10 md:pl-16">
          {EDUCATION.map((step, i) => {
            const kind = KIND[step.kind];
            return (
              <li key={`${step.period}-${i}`} className="relative">
                <span
                  aria-hidden
                  className="absolute top-8 -left-10 grid h-6 w-6 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper)] md:top-9 md:-left-16"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>

                <Reveal effect={kind.variant === "glass" ? "lift" : "slide-left"} amount={0.3}>
                  <Surface variant={kind.variant} contentClassName="flex flex-wrap gap-x-10 gap-y-4 p-7 sm:p-8">
                    <div className="flex flex-[0_0_12rem] flex-col gap-3">
                      {step.logo && <LogoTile logo={step.logo} />}
                      <span className="font-mono text-sm">{step.period}</span>
                      <span className="text-mute w-fit rounded-full border border-[color-mix(in_srgb,currentColor_25%,transparent)] px-3 py-1 font-mono text-xs">
                        {kind.label}
                      </span>
                    </div>
                    <div className="flex flex-[1_1_20rem] flex-col gap-2">
                      <h3 className="m-0 text-[clamp(1.4rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">
                        {step.title}
                      </h3>
                      <span className="font-medium">{step.place}</span>
                      <p className="text-mute m-0 leading-relaxed">{step.text}</p>
                    </div>
                  </Surface>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      <Reveal effect="fade-up" className="mt-10 md:ml-16">
        <Surface variant="accent" contentClassName="flex flex-wrap items-center justify-between gap-6 p-7 sm:p-8">
          <h3 className="m-0 text-2xl font-semibold tracking-[-0.02em]">{CERTIFICATIONS.title}</h3>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {CERTIFICATIONS.items.map((c, i) => (
              <li
                key={`${c.name}-${i}`}
                className="rounded-full border border-[color-mix(in_srgb,currentColor_45%,transparent)] px-4 py-2 text-sm"
              >
                <span className="font-mono text-xs">{c.issuer} · </span>
                {c.name}
              </li>
            ))}
          </ul>
        </Surface>
      </Reveal>
    </section>
  );
}
