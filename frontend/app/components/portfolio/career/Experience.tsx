import Image from "next/image";
import { EXPERIENCES, type Experience as Exp } from "@/app/content/profile";
import SectionHeading from "@/app/components/portfolio/layout/SectionHeading";
import Surface from "@/app/components/ui/base/Surface";
import Reveal from "@/app/components/ui/motion/Reveal";
import LogoTile from "@/app/components/ui/base/LogoTile";
import TagList from "@/app/components/ui/base/Tag";
import Curtain from "@/app/components/ui/motion/Curtain";
import { Stagger, StaggerItem } from "@/app/components/ui/motion/Stagger";

/**
 * Effet — l'expérience principale est une étude de cas en grand : la colonne
 * de gauche (entreprise, poste, dates) reste collée pendant que l'histoire
 * (contexte → pivot → réalisation → leçon) puis les réalisations défilent.
 * Les autres expériences suivent en cartes.
 */
export default function Experience() {
  const featured = EXPERIENCES.find((e) => e.featured) ?? EXPERIENCES[0];
  const others = EXPERIENCES.filter((e) => e !== featured);

  return (
    <section id="experience" className="relative px-[4%] pt-8 pb-28 md:pb-36">
      <SectionHeading section="experience" />

      {featured && (
        <Reveal effect="lift" amount={0.15}>
          <Surface
            variant={featured.variant}
            radius="1.75rem"
            contentClassName="flex flex-wrap items-start gap-x-12 gap-y-8 p-7 sm:p-10"
          >
            <div className="flex flex-[1_1_18rem] flex-col gap-4 md:sticky md:top-32">
              {featured.logo && <LogoTile logo={featured.logo} />}
              <Meta exp={featured} />
              <h3 className="m-0 text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-semibold tracking-[-0.045em]">
                {featured.company}
              </h3>
              <p className="m-0 text-xl font-medium">{featured.role}</p>
              <TagList items={featured.stack} />
            </div>

            <div className="flex flex-[2_1_28rem] flex-col gap-6">
              <p className="m-0 text-[clamp(1.25rem,2vw,1.6rem)] leading-snug tracking-[-0.015em]">
                {featured.summary}
              </p>

              {/* Étude de cas : chaque chapitre monte à son tour ; le pivot est mis en avant */}
              {featured.chapters && (
                <ol className="m-0 flex list-none flex-col gap-4 p-0">
                  {featured.chapters.map((c, i) => (
                    <li key={c.label}>
                      <Reveal effect="fade-up" amount={0.4}>
                        {c.highlight ? (
                          <Surface variant="accent" radius="1.25rem" contentClassName="flex flex-col gap-2 p-6">
                            <Chapter index={i} label={c.label} text={c.text} />
                          </Surface>
                        ) : (
                          <div className="flex flex-col gap-2 px-1 py-2">
                            <Chapter index={i} label={c.label} text={c.text} />
                          </div>
                        )}
                      </Reveal>
                    </li>
                  ))}
                </ol>
              )}

              {featured.media && (
                <figure className="m-0 flex flex-col gap-3">
                  <Curtain frameClassName="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-white">
                    <Image
                      src={featured.media.src}
                      alt={featured.media.alt}
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      placeholder="blur"
                      className="object-contain p-4"
                    />
                  </Curtain>
                  <figcaption className="text-mute font-mono text-xs">{featured.media.caption}</figcaption>
                </figure>
              )}

              <h4 className="text-mute m-0 mt-4 font-mono text-xs font-normal tracking-wider uppercase">
                Réalisations
              </h4>
              <Stagger as="ul" step={0.09} className="m-0 flex list-none flex-col p-0">
                {featured.bullets.map((b, i) => (
                  <StaggerItem key={i} as="li" effect="right" className="flex gap-5 border-t border-[var(--line)] py-5">
                    <span aria-hidden className="text-mute font-mono text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{b}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Surface>
        </Reveal>
      )}

      {others.length > 0 && (
        <div className="mt-6 flex flex-col gap-6">
          {others.map((e, i) => (
            <Reveal key={`${e.company}-${i}`} effect={e.variant === "glass" ? "lift" : "slide-left"} amount={0.2}>
              <Surface
                variant={e.variant}
                radius="1.75rem"
                contentClassName="flex flex-wrap items-center gap-x-10 gap-y-8 p-7 sm:p-8"
              >
                <div className="flex flex-[1_1_18rem] flex-col gap-4">
                  {e.logo && <LogoTile logo={e.logo} />}
                  <Meta exp={e} />
                  <h3 className="m-0 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em]">
                    {e.role} · {e.company}
                  </h3>
                  <p className="text-mute m-0 leading-relaxed">
                    {e.summary} {e.bullets.join(" ")}
                  </p>
                  <TagList items={e.stack} />
                </div>
                {e.media && <ExperienceMedia media={e.media} className="flex-[2_1_26rem]" />}
              </Surface>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Capture d'une expérience : se dévoile par un rideau, affichée en entier (sans rognage).
 * Les proportions viennent de l'image importée : rien à renseigner à la main.
 */
function ExperienceMedia({ media, className = "" }: { media: NonNullable<Exp["media"]>; className?: string }) {
  return (
    <figure className={`m-0 flex flex-col gap-3 ${className}`}>
      <Curtain
        from="right"
        radius="1rem"
        frameStyle={{ aspectRatio: media.src.width / media.src.height }}
        frameClassName="relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/10"
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          placeholder="blur"
          className="object-cover object-top"
        />
      </Curtain>
      <figcaption className="text-mute font-mono text-xs">{media.caption}</figcaption>
    </figure>
  );
}

function Chapter({ index, label, text }: { index: number; label: string; text: string }) {
  return (
    <>
      {/* Sur la carte accent, le libellé reste à pleine opacité : contraste AA */}
      <span className="font-mono text-xs tracking-wider uppercase">
        <span aria-hidden>{String(index + 1).padStart(2, "0")} · </span>
        {label}
      </span>
      <p className="m-0 text-lg leading-relaxed">{text}</p>
    </>
  );
}

function Meta({ exp }: { exp: Exp }) {
  return (
    <div className="text-mute flex flex-col gap-1 font-mono text-xs">
      <span>{exp.context}</span>
      <span>
        {exp.period} · {exp.place}
      </span>
    </div>
  );
}
