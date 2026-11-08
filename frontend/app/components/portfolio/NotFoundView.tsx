import Link from "next/link";
import Surface from "@/app/components/ui/base/Surface";
import ThemeToggle from "@/app/components/ThemeToggle";
import { ROUTES, anchorOf, type Locale } from "@/app/i18n/config";
import { getUi } from "@/app/i18n/content";

const link = "text-[var(--ink)] underline underline-offset-4 hover:text-[var(--accent)]";

/**
 * Contenu de la page 404 dans une langue (app/not-found.tsx affiche les deux
 * et ne montre que celle de l'adresse demandée).
 * Le brouillard du layout reste derrière : on s'est « perdu » dedans.
 * Une sortie principale (l'accueil) et deux raccourcis vers ce qu'on vient en général chercher.
 */
export default function NotFoundView({ locale }: Readonly<{ locale: Locale }>) {
  const { notFound: t } = getUi(locale);
  const home = ROUTES.home[locale];
  // Section de l'accueil, dans la langue : /#projets, /en#projects
  const anchor = (section: "projets" | "contact") => `${home}#${anchorOf(section, locale)}`;

  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-5xl justify-end">
          <ThemeToggle />
        </div>
      </header>

      <main className="grid min-h-[calc(100svh-6rem)] place-items-center px-4 py-10">
        <Surface
          variant="glass"
          density="dense"
          radius="1.75rem"
          className="w-full max-w-xl"
          contentClassName="flex flex-col gap-6 p-8 sm:p-12"
        >
          <h1 className="m-0 text-[clamp(2.25rem,7vw,3.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
            {t.title}
          </h1>
          <p className="m-0 max-w-[46ch] leading-relaxed">{t.text}</p>
          <Link
            href={home}
            className="self-start rounded-full bg-[var(--accent-surface)] px-5 py-3 font-medium text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
          >
            {t.back}
          </Link>
          <p className="text-mute m-0 text-[0.9375rem]">
            {t.shortcuts.before}{" "}
            <Link href={anchor("projets")} className={link}>
              {t.shortcuts.projects}
            </Link>{" "}
            {t.shortcuts.between}{" "}
            <Link href={anchor("contact")} className={link}>
              {t.shortcuts.contact}
            </Link>
            .
          </p>
        </Surface>
      </main>
    </>
  );
}
