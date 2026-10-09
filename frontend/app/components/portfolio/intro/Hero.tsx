"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { HERO, PROFILE } from "@/app/content/profile";
import { useMotionFactor } from "@/app/hooks/useMotionFactor";
import Surface from "@/app/components/ui/base/Surface";

/** Délai d'une animation d'entrée CSS (.anim-rise / .anim-fade, portfolio.css). */
const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

/**
 * Entrée : en CSS (portfolio.css), pour que le titre soit visible dès le premier
 * affichage, même avant le JavaScript. Chaque ligne monte depuis un masque.
 * Défilement : le titre recule, la carte part plus vite (elle paraît plus proche),
 * l'indice « faites défiler » s'efface. Rien ne bouge si l'utilisateur réduit les animations.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const k = useMotionFactor();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform([p, k], ([p, k]: number[]) => `${p * 40 * k}%`);
  const scale = useTransform([p, k], ([p, k]: number[]) => 1 - 0.1 * p * k);
  const opacity = useTransform([p, k], ([p, k]: number[]) => 1 - Math.min(p / 0.6, 1) * k);
  const cardY = useTransform([p, k], ([p, k]: number[]) => `${-60 * p * k}%`);
  const hintOpacity = useTransform([p, k], ([p, k]: number[]) => 1 - Math.min(p / 0.12, 1) * k);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end gap-12 px-[4%] pt-40 pb-16"
    >
      <motion.div style={{ y, scale, opacity, transformOrigin: "0% 100%" }}>
        {/* Le h1 porte le nom et le poste (ce qu'un recruteur et un moteur de recherche
            cherchent en premier), puis la promesse en grand. */}
        <h1 className="m-0 flex flex-col gap-8 font-semibold">
          <span className="anim-fade font-mono text-sm font-normal" style={delay(0.2)}>
            {HERO.eyebrow}
          </span>
          <span className="block max-w-[16ch] text-[clamp(2.75rem,7.5vw,8rem)] leading-[0.95] tracking-[-0.045em] lowercase">
            {HERO.lines.map((line, i) => (
              <span key={line.text} className="block overflow-hidden pb-[0.08em]">
                <span
                  className="anim-rise block"
                  style={{ ...delay(0.15 + i * 0.12), ...(line.accent ? { color: "var(--accent)" } : {}) }}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </span>
        </h1>
      </motion.div>

      <div className="flex flex-wrap items-end justify-between gap-8">
        {/* Deux couches : l'extérieure suit le scroll, l'intérieure fait l'entrée (CSS) */}
        <motion.div style={{ y: cardY }} className="max-w-xl flex-[1_1_22rem]">
          <div className="anim-rise" style={{ ...delay(0.5), "--rise-from": "60px" } as CSSProperties}>
            <Surface variant="glass" radius="1.5rem" contentClassName="flex flex-col gap-5 p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.8125rem]">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {HERO.availability}
                </span>
                <span className="text-mute">{HERO.location}</span>
              </div>
              <p className="m-0 text-lg leading-relaxed">{HERO.intro}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`#${HERO.ctaPrimary.target}`}
                  className="rounded-full bg-[var(--accent-surface)] px-5 py-3 font-medium text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
                >
                  {HERO.ctaPrimary.label}
                </a>
                <a
                  href={PROFILE.cv}
                  download={PROFILE.cvFileName}
                  className="rounded-full border border-[var(--line)] px-5 py-3 font-medium transition-colors hover:border-[var(--ink)]"
                >
                  {HERO.ctaSecondary.label} <span aria-hidden>↓</span>
                </a>
              </div>
            </Surface>
          </div>
        </motion.div>

        <motion.p aria-hidden style={{ opacity: hintOpacity }} className="text-mute m-0 font-mono text-[0.8125rem]">
          <span className="anim-fade" style={delay(1.2)}>
            {HERO.hint}
          </span>
        </motion.p>
      </div>
    </section>
  );
}
