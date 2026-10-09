"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { SECTIONS } from "@/app/content/profile";
import { EASE_OUT } from "@/app/lib/motion";

type Tick = { id: string; label: string; at: number };

/**
 * Barre de défilement maison, à droite (remplace la barre native, masquée dans portfolio.css) :
 * - rail en verre fin qui s'élargit au survol ;
 * - poignée dont la taille suit la longueur de la page et la position suit le scroll ;
 * - un repère par section (clic = aller à la section, survol = son nom) ;
 * - glisser la poignée ou cliquer sur le rail fait défiler la page.
 * À l'arrivée sur la page, elle glisse depuis la droite, comme le header depuis le haut.
 * Affichée seulement avec une souris (`pointer: fine`) : sur mobile, l'indicateur natif reste.
 * Purement visuelle pour les lecteurs d'écran (aria-hidden) : molette, clavier et tactile marchent sans elle.
 */
export default function ScrollRail() {
  const rail = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState(0.2); // part de la page visible (0..1)
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [dragging, setDragging] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 34, mass: 0.3 });
  const [p, setP] = useState(0);
  useMotionValueEvent(progress, "change", setP);

  // Taille de la poignée et position des repères : recalculées si la page change de hauteur
  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      setThumb(Math.min(1, Math.max(0.06, window.innerHeight / doc.scrollHeight)));
      setTicks(
        SECTIONS.flatMap((s) => {
          const el = document.getElementById(s.id);
          if (!el || s.id === "top") return [];
          const top = el.getBoundingClientRect().top + window.scrollY;
          return [{ id: s.id, label: s.label, at: Math.min(1, top / max) }];
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /** Position verticale du pointeur sur le rail → défilement de la page. */
  const scrollToPointer = (clientY: number, smooth: boolean) => {
    const r = rail.current?.getBoundingClientRect();
    if (!r) return;
    const usable = r.height * (1 - thumb);
    const ratio = Math.min(1, Math.max(0, (clientY - r.top - (r.height * thumb) / 2) / usable));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: ratio * max, behavior: smooth ? "smooth" : "instant" });
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).dataset.tick) return; // clic sur un repère : géré par le lien
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    scrollToPointer(e.clientY, false);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => dragging && scrollToPointer(e.clientY, false);
  const onUp = () => setDragging(false);

  return (
    <motion.div
      aria-hidden
      // Même entrée que le header (SiteHeader), mais depuis la droite, juste après lui
      initial={{ x: 56 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
      className="scroll-rail pointer-events-none fixed top-24 right-1.5 bottom-4 z-40 w-5 justify-center"
    >
      <div
        ref={rail}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={`group pointer-events-auto relative h-full cursor-pointer rounded-full transition-[width] duration-300 hover:w-2.5 ${
          dragging ? "w-2.5" : "w-1.5"
        }`}
      >
        {/* Rail en verre */}
        <span className="absolute inset-0 rounded-full border border-[var(--line)] bg-[var(--glass-fill)] backdrop-blur-md" />

        {/* Repères de sections */}
        {ticks.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            tabIndex={-1}
            data-tick
            style={{ top: `${t.at * 100}%` }}
            className="group/tick absolute left-1/2 z-10 block h-3 w-3 -translate-x-1/2 -translate-y-1/2"
          >
            <span
              data-tick
              className="absolute top-1/2 left-1/2 h-px w-2.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--mute)] opacity-60"
            />
            {/* Nom de la section au survol du repère */}
            <span
              data-tick
              className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 rounded-full bg-[var(--solid-fill)] px-2.5 py-1 font-mono text-[0.6875rem] whitespace-nowrap text-[var(--paper)] opacity-0 transition-opacity group-hover/tick:opacity-100"
            >
              {t.label}
            </span>
          </a>
        ))}

        {/* Poignée */}
        <motion.span
          className="absolute inset-x-0 rounded-full bg-[var(--ink)] opacity-70 transition-opacity group-hover:bg-[var(--accent)] group-hover:opacity-100"
          style={{ height: `${thumb * 100}%`, top: `${p * (1 - thumb) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}
