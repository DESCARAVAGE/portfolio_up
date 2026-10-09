import type { CSSProperties } from "react";
import Image from "next/image";
import { PROJECTS, type Project } from "@/app/content/profile";
import SectionHeading from "@/app/components/portfolio/layout/SectionHeading";
import Surface from "@/app/components/ui/base/Surface";
import Reveal from "@/app/components/ui/motion/Reveal";
import Parallax from "@/app/components/ui/motion/Parallax";
import Curtain from "@/app/components/ui/motion/Curtain";
import CompareSlider from "@/app/components/ui/media/CompareSlider";
import LoopVideo from "@/app/components/ui/media/LoopVideo";
import TagList from "@/app/components/ui/base/Tag";
import ExternalLink from "@/app/components/ui/base/ExternalLink";

/**
 * `sizes` : largeur réelle d'affichage de chaque visuel, pour que le navigateur
 * télécharge le bon fichier (et pas une image 4 fois trop grande pour une vignette).
 */
const SIZES = {
  featured: "(min-width: 1024px) 55vw, 100vw",
  grid: "(min-width: 768px) 46vw, 100vw",
  minor: "208px", // vignette de 13rem
};

/** Vitesse de chaque carte de la grille : elles flottent à des hauteurs différentes. */
const DEPTHS = [0.1, -0.16, 0.22];

/**
 * Effet — le projet phare se dévoile par un rideau (clip-path) ; les autres
 * cartes basculent vers l'avant puis dérivent à des vitesses différentes.
 * Composant serveur : seuls les effets et les lecteurs (vidéo, comparateur) sont envoyés au navigateur.
 */
export default function Projects() {
  const featured = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
  const others = PROJECTS.filter((p) => p !== featured && !p.minor);
  const minors = PROJECTS.filter((p) => p !== featured && p.minor);

  return (
    <section id="projets" className="relative px-[4%] pt-8 pb-32 md:pb-48">
      <SectionHeading section="projets" />

      {featured && <Featured project={featured} />}

      <div className="mt-10 grid grid-cols-1 items-start gap-6 md:mt-16 md:grid-cols-2">
        {others.map((p, i) => (
          <Parallax key={`${p.title}-${i}`} speed={DEPTHS[i % DEPTHS.length]} className={i % 3 === 1 ? "md:mt-24" : ""}>
            <Reveal effect={p.variant === "glass" ? "lift" : "fade-up"} delay={i * 0.1} amount={0.25}>
              <Surface variant={p.variant} contentClassName="flex flex-col gap-6 p-6">
                <ProjectMedia media={p.media} sizes={SIZES.grid} className="aspect-[16/10] rounded-xl" />
                <ProjectInfo project={p} />
              </Surface>
            </Reveal>
          </Parallax>
        ))}
      </div>

      {/* Projets secondaires : cartes compactes, sans effet de profondeur */}
      {minors.length > 0 && (
        <div className="mt-16 flex flex-col gap-4 md:mt-40">
          {minors.map((p, i) => (
            <MinorProject key={`${p.title}-${i}`} project={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function MinorProject({ project: p }: { project: Project }) {
  return (
    <Reveal effect="fade-up" amount={0.4}>
      <Surface variant={p.variant} radius="1.25rem" contentClassName="flex flex-wrap items-center gap-x-6 gap-y-4 p-4">
        <ProjectMedia
          media={p.media}
          sizes={SIZES.minor}
          className="aspect-[16/10] w-full max-w-[13rem] flex-[0_1_13rem] rounded-xl"
        />
        <div className="flex min-w-0 flex-[1_1_18rem] flex-col gap-2">
          <span className="text-mute font-mono text-xs">
            {p.role} · {p.period}
          </span>
          <h3 className="m-0 text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
          <p className="text-mute m-0 text-[0.9375rem] leading-snug">{p.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TagList items={p.stack} />
          {p.links.map((l, i) => (
            <ExternalLink key={`${l.label}-${i}`} href={l.href}>
              {l.label}
            </ExternalLink>
          ))}
        </div>
      </Surface>
    </Reveal>
  );
}

function Featured({ project }: { project: Project }) {
  // Un visuel avec un format connu (ex. la vidéo) garde ses proportions : rien n'est rogné
  const ratio = "ratio" in project.media ? project.media.ratio : undefined;
  const steps = project.media.type === "video" ? project.media.steps : undefined;

  return (
    <Reveal effect="lift" amount={0.2}>
      <Surface
        variant={project.variant}
        radius="1.75rem"
        contentClassName={`flex flex-wrap gap-8 p-6 sm:p-8 ${ratio ? "items-center" : "items-stretch"}`}
      >
        <div className="flex flex-[3_1_28rem] flex-col gap-4">
          <Curtain from="right" radius="1rem" className={ratio ? "" : "h-full"} frameClassName={ratio ? "" : "h-full"}>
            <ProjectMedia
              media={project.media}
              sizes={SIZES.featured}
              className={ratio ? "w-full rounded-2xl" : "h-full min-h-[22rem] rounded-2xl"}
              style={ratio ? { aspectRatio: ratio } : undefined}
            />
          </Curtain>
          {/* Ce que montre la vidéo, en texte : utile sans le son, au lecteur d'écran et au lecteur pressé */}
          {steps && (
            <ol className="text-mute m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 font-mono text-xs">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex flex-[2_1_20rem] flex-col justify-end gap-6 py-2">
          <span className="w-fit rounded-full bg-[var(--accent-surface)] px-3 py-1 font-mono text-xs text-[var(--accent-ink)]">
            projet phare
          </span>
          <ProjectInfo project={project} large />
        </div>
      </Surface>
    </Reveal>
  );
}

/**
 * Visuel d'un projet : comparateur avant / après, vidéo (lancée par le visiteur),
 * image, ou emplacement vide tant qu'aucun fichier n'est renseigné dans profile.ts.
 */
function ProjectMedia({
  media,
  sizes,
  className = "",
  style,
}: {
  media: Project["media"];
  sizes: string;
  className?: string;
  style?: CSSProperties;
}) {
  const box = `relative overflow-hidden bg-[color-mix(in_srgb,currentColor_10%,transparent)] ${className}`;

  if (media.type === "compare") {
    return (
      <div style={style} className={className}>
        <CompareSlider before={media.before} after={media.after} sizes={sizes} className={box} />
      </div>
    );
  }

  if (!media.src) {
    return (
      <div style={style} className={`${box} grid place-items-center p-6 text-center font-mono text-sm opacity-70`}>
        [{media.type === "video" ? "Vidéo" : "Capture"} : {media.alt}]
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div style={style} className={className}>
        <LoopVideo
          src={media.src}
          webm={media.webm}
          poster={media.poster}
          sizes={sizes}
          label={media.alt}
          className="h-full w-full rounded-[inherit]"
        />
      </div>
    );
  }

  return (
    <div style={style} className={box}>
      <Image src={media.src} alt={media.alt} fill sizes={sizes} placeholder="blur" className="object-cover" />
    </div>
  );
}

function ProjectInfo({ project: p, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-mute flex flex-wrap justify-between gap-2 font-mono text-xs">
        <span>{p.role}</span>
        {p.period && <span>{p.period}</span>}
      </div>
      <h3
        className={`m-0 leading-[1.02] font-semibold tracking-[-0.035em] ${large ? "text-[clamp(2rem,3.6vw,3.25rem)]" : "text-[1.75rem]"}`}
      >
        {p.title}
      </h3>
      <p className="text-mute m-0 leading-relaxed">{p.summary}</p>
      {p.highlights && p.highlights.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[0.9375rem] leading-snug">
          {p.highlights.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
      <TagList items={p.stack} />
      {p.links.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {p.links.map((l, i) => (
            <ExternalLink key={`${l.label}-${i}`} href={l.href}>
              {l.label}
            </ExternalLink>
          ))}
        </div>
      )}
    </div>
  );
}
