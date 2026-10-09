"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { animate, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import type { Img } from "@/app/content/profile";

type Props = {
  before: Img;
  after: Img;
  /** Largeur d'affichage, transmise à next/image pour choisir le bon fichier. */
  sizes?: string;
  className?: string;
};

/**
 * Comparateur avant / après : on glisse le curseur (souris, doigt ou flèches du
 * clavier) pour révéler l'ancienne version par-dessus la nouvelle.
 * Le contrôle est un vrai <input type="range"> invisible qui couvre l'image :
 * accessible au clavier et aux lecteurs d'écran, sans code de glisser-déposer.
 * À la première apparition, le curseur fait un aller-retour pour montrer qu'il bouge.
 * Les deux images doivent avoir le même format (ici 16:10).
 */
export default function CompareSlider({
  before,
  after,
  sizes = "(min-width: 768px) 50vw, 100vw",
  className = "",
}: Props) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const pos = useMotionValue(50);
  const [value, setValue] = useState(50);
  const [touched, setTouched] = useState(false);

  useMotionValueEvent(pos, "change", (v) => setValue(v));

  // Démonstration : 50 → 25 → 75 → 50, seulement tant que personne n'a touché au curseur
  useEffect(() => {
    if (!inView || touched) return;
    const controls = animate(pos, [50, 22, 78, 50], { duration: 2.4, ease: "easeInOut", delay: 0.4 });
    return () => controls.stop();
  }, [inView, touched, pos]);

  const onInput = (v: number) => {
    setTouched(true);
    pos.stop();
    pos.set(v);
  };

  return (
    <div
      ref={ref}
      // Le curseur est invisible : on montre le focus clavier sur tout le cadre
      className={`relative overflow-hidden select-none has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[var(--accent)] ${className}`}
    >
      {/* Après, en dessous */}
      <Image src={after.src} alt={after.alt} fill sizes={sizes} placeholder="blur" className="object-cover" />
      {/* Avant, au-dessus, découpé jusqu'à la position du curseur */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes={sizes} placeholder="blur" className="object-cover" />
      </div>

      {/* Étiquettes */}
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 font-mono text-xs text-white backdrop-blur">
        avant
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 font-mono text-xs text-white backdrop-blur">
        après
      </span>

      {/* Trait + poignée */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${value}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-sm font-semibold text-neutral-900 shadow-lg">
          ⇆
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Comparer l&apos;ancienne et la nouvelle version
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(value)}
        onChange={(e) => onInput(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
