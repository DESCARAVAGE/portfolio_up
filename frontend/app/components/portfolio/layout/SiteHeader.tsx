"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Surface from "@/app/components/ui/base/Surface";
import ThemeToggle from "@/app/components/ThemeToggle";
import { useActiveSection } from "@/app/hooks/useActiveSection";
import { NAV, SECTIONS, PROFILE } from "@/app/content/profile";
import { EASE_OUT } from "@/app/lib/motion";

const IDS = SECTIONS.map((s) => s.id);
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Barre flottante en verre : nom (→ haut de page), compteur de section,
 * navigation générée depuis SECTIONS (lien actif souligné), thème.
 * Sous 1024 px, la navigation passe dans un menu déroulant.
 */
export default function SiteHeader() {
  const active = useActiveSection(IDS);
  const index = Math.max(0, IDS.indexOf(active));
  const [open, setOpen] = useState(false);

  // Échap ferme le menu mobile
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <Surface
        variant="glass"
        density="dense"
        radius="999px"
        className="mx-auto max-w-6xl"
        contentClassName="flex items-center justify-between gap-4 py-2 pr-2.5 pl-2.5"
      >
        {/* Maison dans un cercle, même style que le bouton de thème : la couleur suit le thème
            (currentColor = --ink). Pas de texte visible : le nom est donné par aria-label. */}
        <a
          href="#top"
          aria-label={`${PROFILE.brand} — retour en haut de page`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition hover:scale-105 hover:text-[var(--accent)]"
          onClick={() => setOpen(false)}
        >
          <HomeIcon />
        </a>

        {/* Compteur : le numéro glisse à chaque changement de section */}
        <span className="text-mute hidden items-center gap-2 font-mono text-xs xl:flex" aria-hidden>
          <span className="relative inline-flex h-4 w-5 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={index}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                {pad(index + 1)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span>/ {pad(IDS.length)}</span>
        </span>

        <div className="flex items-center gap-1">
          <nav aria-label="Sections" className="hidden items-center gap-0.5 text-[0.9375rem] lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.target} href={`#${item.target}`} active={active === item.target}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full px-4 py-2.5 text-[0.9375rem] lg:hidden"
          >
            {open ? "Fermer" : "Menu"}
          </button>
          <ThemeToggle />
        </div>
      </Surface>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="mx-auto mt-2 max-w-6xl lg:hidden"
          >
            <Surface variant="glass" density="dense" radius="1.5rem" contentClassName="p-2">
              <nav aria-label="Sections">
                <ul className="m-0 flex list-none flex-col p-0">
                  {NAV.map((item, i) => (
                    <li key={item.target}>
                      <a
                        href={`#${item.target}`}
                        onClick={() => setOpen(false)}
                        aria-current={active === item.target ? "location" : undefined}
                        className="flex items-baseline gap-4 rounded-2xl px-4 py-3.5 text-lg aria-[current=location]:text-[var(--accent)]"
                      >
                        <span className="text-mute font-mono text-xs">{pad(i + 1)}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Surface>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <a
      href={href}
      aria-current={active ? "location" : undefined}
      className="relative rounded-full px-3.5 py-2.5 transition-colors hover:text-[var(--accent)]"
    >
      {children}
      {/* Trait sous le lien actif, qui glisse d'un lien à l'autre */}
      {active && (
        <motion.span
          layoutId="nav-active"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-x-3.5 bottom-1.5 h-px bg-[var(--accent)]"
        />
      )}
    </a>
  );
}

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}
