import type { Metadata } from "next";
import Link from "next/link";
import Surface from "@/app/components/ui/base/Surface";
import ThemeToggle from "@/app/components/ThemeToggle";
import { PROFILE } from "@/app/content/profile";

// Next ajoute lui-même <meta name="robots" content="noindex"> sur la page 404
export const metadata: Metadata = {
  title: `Page introuvable — ${PROFILE.fullName}`,
};

const link = "text-[var(--ink)] underline underline-offset-4 hover:text-[var(--accent)]";

/**
 * Page 404 : toute adresse qui ne correspond à aucune page (Next renvoie le code 404).
 * Le brouillard du layout reste derrière : on s'est « perdu » dedans.
 * Une sortie principale (l'accueil) et deux raccourcis vers ce qu'on vient en général chercher.
 */
export default function NotFound() {
  return (
    <>
      <header className="px-4 pt-4">
        <div className="mx-auto flex max-w-5xl justify-end">
          <ThemeToggle />
        </div>
      </header>

      <main id="contenu" className="grid min-h-[calc(100svh-6rem)] place-items-center px-4 py-10">
        <Surface
          variant="glass"
          density="dense"
          radius="1.75rem"
          className="w-full max-w-xl"
          contentClassName="flex flex-col gap-6 p-8 sm:p-12"
        >
          <h1 className="m-0 text-[clamp(2.25rem,7vw,3.75rem)] leading-[0.95] font-semibold tracking-[-0.04em]">
            Vous vous êtes perdu ?
          </h1>
          <p className="m-0 max-w-[46ch] leading-relaxed">
            Cette adresse ne mène à aucune page du portfolio (erreur 404). Le lien a peut-être changé, ou une lettre
            s&apos;est glissée dans l&apos;adresse.
          </p>
          <Link
            href="/"
            className="self-start rounded-full bg-[var(--accent-surface)] px-5 py-3 font-medium text-[var(--accent-ink)] transition-transform hover:-translate-y-0.5"
          >
            Revenir au portfolio
          </Link>
          <p className="text-mute m-0 text-[0.9375rem]">
            Ou directement vers les{" "}
            <Link href="/#projets" className={link}>
              projets
            </Link>{" "}
            ou le{" "}
            <Link href="/#contact" className={link}>
              contact
            </Link>
            .
          </p>
        </Surface>
      </main>
    </>
  );
}
