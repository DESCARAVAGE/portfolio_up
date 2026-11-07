import type { ReactNode } from "react";
import Surface from "@/app/components/ui/base/Surface";
import ThemeToggle from "@/app/components/ThemeToggle";
import BackToPortfolio from "@/app/components/portfolio/legal/BackToPortfolio";
import BackToTop from "@/app/components/portfolio/legal/BackToTop";
import LegalNav from "@/app/components/portfolio/legal/LegalNav";
import LegalToc, { type TocItem } from "@/app/components/portfolio/legal/LegalToc";
import LanguageSwitch from "@/app/components/LanguageSwitch";
import NewTabNote from "@/app/components/ui/base/NewTabNote";
import { MAIN_ANCHOR, type Locale } from "@/app/i18n/config";
import { getUi } from "@/app/i18n/content";
import { LEGAL } from "@/app/content/legal";
import { PROFILE } from "@/app/content/profile";

const pill =
  "rounded-full border border-[var(--line)] px-4 py-2.5 text-[0.9375rem] transition hover:scale-105 hover:text-[var(--accent)]";

/** Id du titre : cible du bouton « Haut de page ». */
const TITLE_ID = "titre";

/**
 * Mise en page commune des pages légales :
 * - en haut : retour au portfolio (à l'endroit quitté), langue et thème ;
 * - sommaire : colonne collante sur ordinateur, bloc au-dessus du texte sur mobile ;
 * - texte dans une carte en verre dense (lisible sur le brouillard) ;
 * - bouton « Haut de page » une fois la page défilée.
 * Pas d'animation d'apparition : ces pages se lisent, elles ne se montrent pas.
 */
export default function LegalPage({
  locale,
  title,
  toc,
  children,
}: Readonly<{
  locale: Locale;
  title: string;
  toc: readonly TocItem[];
  children: ReactNode;
}>) {
  // Date de mise à jour écrite à la façon de chaque langue (21 octobre 2026 / October 21, 2026)
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(LEGAL.updatedAt),
  );
  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <BackToPortfolio className={pill} />
          <div className="flex items-center gap-1">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:py-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        <LegalToc
          items={toc}
          className="rounded-2xl border border-[var(--line)] bg-[var(--glass-fill-dense)] p-5 lg:sticky lg:top-6 lg:self-start lg:border-0 lg:bg-transparent lg:p-0 lg:pt-2"
        />

        <main id={MAIN_ANCHOR[locale]} className="min-w-0">
          <Surface variant="glass" density="dense" radius="1.75rem" contentClassName="flex flex-col gap-10 p-7 sm:p-12">
            <h1
              id={TITLE_ID}
              tabIndex={-1}
              className="m-0 text-[clamp(2.25rem,6vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] outline-none"
            >
              {title}
            </h1>
            {children}
            <p className="text-mute m-0 font-mono text-xs">
              {getUi(locale).legal.updated}
              {updated}
            </p>
          </Surface>
        </main>
      </div>

      <footer className="text-mute flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 pb-10 font-mono text-xs">
        <span>
          © {PROFILE.year} {PROFILE.fullName}
        </span>
        <LegalNav />
      </footer>

      <BackToTop targetId={TITLE_ID} />
    </>
  );
}

/** Une rubrique : titre de niveau 2 et contenu. `id` = cible du sommaire. */
export function LegalSection({ id, title, children }: Readonly<TocItem & { children: ReactNode }>) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-titre`}
      className="flex scroll-mt-6 flex-col gap-3 leading-relaxed outline-none"
    >
      <h2 id={`${id}-titre`} className="m-0 text-xl font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Liste « libellé : valeur » (coordonnées, identifiants). */
export function LegalFacts({ items }: Readonly<{ items: readonly { label: string; value: ReactNode }[] }>) {
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
export function OutLink({ href, children }: Readonly<{ href: string; children: ReactNode }>) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[var(--accent)]">
      {children}
      <NewTabNote />
    </a>
  );
}
