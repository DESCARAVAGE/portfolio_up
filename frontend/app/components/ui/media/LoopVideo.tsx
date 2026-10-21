"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { EASE_OUT } from "@/app/lib/motion";

type Props = {
  /** Fichier MP4 (H.264) : lu partout sauf par certains Chromium Linux sans codec propriétaire. */
  src: string;
  /** Version WebM (VP9), proposée en premier : lue par tous les navigateurs récents. */
  webm?: string;
  /**
   * Image d'aperçu, affichée par next/image (et non par l'attribut `poster`) :
   * elle se charge seulement à l'approche, au bon format, avec un flou d'attente.
   */
  poster?: StaticImageData;
  /** Largeur d'affichage, pour que next/image choisisse le bon fichier. */
  sizes?: string;
  /** Description de ce que montre la vidéo (lue par les lecteurs d'écran). */
  label: string;
  className?: string;
};

/** Safari iPhone ne sait pas mettre une <div> en plein écran, seulement la vidéo. */
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * Vidéo de démonstration, muette et en boucle :
 * - rien ne démarre seul : l'image d'aperçu s'affiche avec un grand bouton « Lire » ;
 * - une fois lancée, Pause / Lecture en bas à gauche ;
 * - si on fait défiler pendant la lecture, elle se met en pause et reprend au retour ;
 * - bouton plein écran en bas à droite (Échap pour sortir), qui lance aussi la lecture.
 */
export default function LoopVideo({
  src,
  webm,
  poster,
  sizes = "(min-width: 1024px) 55vw, 100vw",
  label,
  className = "",
}: Props) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(box, { amount: 0.3 });

  /** L'utilisateur a-t-il lancé la vidéo au moins une fois ? */
  const [started, setStarted] = useState(false);
  /** Lecture voulue par l'utilisateur (indépendamment du défilement). */
  const [wantPlay, setWantPlay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Joue seulement si l'utilisateur l'a demandé ET si la vidéo est visible (ou en plein écran)
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (wantPlay && (inView || fullscreen)) v.play().catch(() => setWantPlay(false));
    else v.pause();
  }, [wantPlay, inView, fullscreen]);

  // Suit l'entrée / la sortie du plein écran (y compris avec Échap)
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === box.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const play = () => {
    setStarted(true);
    setWantPlay(true);
  };

  const toggleFullscreen = async () => {
    const el = box.current;
    const v = video.current as IOSVideo | null;
    if (!el || !v) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    play();
    if (el.requestFullscreen) await el.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  };

  return (
    <div ref={box} className={`group/video relative overflow-hidden bg-black [&:fullscreen]:rounded-none ${className}`}>
      <video
        ref={video}
        aria-label={label}
        muted
        loop
        playsInline
        // Rien n'est téléchargé avant le clic : l'image d'aperçu occupe la place en attendant
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-contain"
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>

      {/* Aperçu, tant que la vidéo n'a pas été lancée */}
      {poster && !started && (
        <Image
          src={poster}
          alt=""
          fill
          sizes={sizes}
          placeholder="blur"
          className="pointer-events-none object-contain"
        />
      )}

      {/* Avant la première lecture : grand bouton au centre de l'aperçu.
          Son nom accessible commence par le texte visible (WCAG 2.5.3) :
          « Voir la démo » suffit à la commande vocale, la description suit pour le lecteur d'écran. */}
      <AnimatePresence>
        {!started && (
          <motion.button
            type="button"
            onClick={play}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="absolute inset-0 grid cursor-pointer place-items-center bg-black/35 transition-colors hover:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            <span className="flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-medium text-neutral-900 shadow-xl transition-transform group-hover/video:scale-105">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 4v16l13-8z" />
              </svg>
              Voir la démo
            </span>
            <span className="sr-only"> : {label}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contrôles, une fois lancée */}
      {started && (
        <button
          type="button"
          onClick={() => setWantPlay(!playing)}
          aria-label={playing ? "Mettre la vidéo en pause" : "Reprendre la lecture"}
          className={controlClass("left-3")}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playing ? "pause" : "lecture"}
        </button>
      )}

      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? "Réduire : quitter le plein écran" : "Afficher la vidéo en plein écran"}
        className={controlClass("right-3")}
      >
        {fullscreen ? <ShrinkIcon /> : <ExpandIcon />}
        {fullscreen ? "réduire" : "plein écran"}
      </button>
    </div>
  );
}

const controlClass = (side: string) =>
  `absolute bottom-3 ${side} z-10 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-2.5 font-mono text-xs text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`;

const icon = { width: 12, height: 12, viewBox: "0 0 24 24", "aria-hidden": true } as const;

function PlayIcon() {
  return (
    <svg {...icon} fill="currentColor">
      <path d="M7 4v16l13-8z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg {...icon} fill="currentColor">
      <rect x="5" y="4" width="5" height="16" rx="1" />
      <rect x="14" y="4" width="5" height="16" rx="1" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg {...icon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

function ShrinkIcon() {
  return (
    <svg {...icon} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
    </svg>
  );
}
