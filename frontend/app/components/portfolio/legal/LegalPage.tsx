import Link from "next/link";
import type { ReactNode } from "react";
import Surface from "@/app/components/ui/base/Surface";
import ThemeToggle from "@/app/components/ThemeToggle";
import { LEGAL, LEGAL_PAGES } from "@/app/content/legal";
import { PROFILE } from "@/app/content/profile";

const pill =
  "rounded-full border border-[var(--line)] px-4 py-2.5 text-[0.9375rem] transition hover:scale-105 hover:text-[var(--accent)]";

/**
 * Mise en page commune des pages légales : retour au portfolio et thème en haut,
 * texte dans une carte en verre dense (lisible sur le brouillard), liens légaux en bas.
 * Pas d'animation : ces pages se lisent, elles ne se montrent pas.
 */
export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href="/" className={pill}>
            <span aria-hidden>← </span>Retour au portfolio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main id="contenu" className="px-4 py-10 sm:py-14">
        <Surface
          variant="glass"
          density="dense"
          radius="1.75rem"
          className="mx-auto max-w-3xl"
          contentClassName="flex flex-col gap-10 p-7 sm:p-12"
        >
          <h1 className="m-0 text-[clamp(2.25rem,6vw,3.5rem)] leading-none font-semibold tracking-[-0.04em]">
            {title}
          </h1>
          {children}
          <p className="text-mute m-0 font-mono text-xs">Dernière mise à jour : {LEGAL.updatedAt}</p>
        </Surface>
      </main>

      <footer className="text-mute flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 pb-10 font-mono text-xs">
        <span>
          © {PROFILE.year} {PROFILE.fullName}
        </span>
        <LegalNav />
      </footer>
    </>
  );
}

/** Liens vers les pages légales : pied de page du portfolio et des pages légales. */
export function LegalNav({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Informations légales" className={className}>
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
        {LEGAL_PAGES.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="underline-offset-4 hover:text-[var(--accent)] hover:underline">
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Une rubrique : titre de niveau 2 et contenu. */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 leading-relaxed">
      <h2 className="m-0 text-xl font-semibold tracking-[-0.01em]">{title}</h2>
      {children}
    </section>
  );
}

/** Liste « libellé : valeur » (coordonnées, identifiants). */
export function LegalFacts({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
      {items.map((it) => (
        <div key={it.label} className="contents">
          <dt className="text-mute font-mono text-xs tracking-wider uppercase sm:pt-1">{it.label}</dt>
          <dd className="m-0 mb-2 sm:mb-0">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Lien vers un autre site : nouvel onglet, annoncé aux lecteurs d'écran. */
export function OutLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[var(--accent)]">
      {children}
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}
