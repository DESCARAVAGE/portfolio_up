"use client";

import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { motion } from "motion/react";
import { CONTENT_FADE } from "@/app/lib/motion";
import type { SurfaceVariant } from "@/app/content/profile";
// Les styles des cartes sont importés ICI : dès qu'une carte est utilisée,
// ses styles sont chargés, quel que soit le layout.
import "@/app/styles/portfolio.css";

type Props = {
  variant?: SurfaceVariant;
  /** "dense" : verre plus opaque, pour ce qui passe au-dessus du texte (header). */
  density?: "light" | "dense";
  className?: string;
  /** Classes du contenu (padding, layout…). */
  contentClassName?: string;
  radius?: string;
  children: ReactNode;
};

/**
 * Carte « verre » (transparente, contour qui réfracte le brouillard)
 * ou « pleine » (encre / accent). Les couleurs viennent de portfolio.css
 * et suivent donc le thème clair / sombre.
 *
 * Le reflet du contour suit le pointeur via deux variables CSS (--mx, --my)
 * écrites directement sur l'élément : aucun re-render React.
 */
export default function Surface({
  variant = "glass",
  density = "light",
  className = "",
  contentClassName = "",
  radius,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isGlass = variant === "glass";

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !isGlass) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const style = radius ? ({ "--surface-radius": radius } as CSSProperties) : undefined;

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      style={style}
      className={`surface surface--${variant} ${isGlass && density === "dense" ? "surface--dense" : ""} ${className}`}
    >
      <div className="surface__body" aria-hidden />
      {isGlass && <div className="surface__edge" aria-hidden />}
      {isGlass && <div className="surface__shine" aria-hidden />}
      {/* Le contenu fond quand le parent <Reveal> passe en "show" */}
      <motion.div variants={CONTENT_FADE} className={`surface__content ${contentClassName}`}>
        {children}
      </motion.div>
    </div>
  );
}
