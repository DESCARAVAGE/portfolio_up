import type { Metadata } from "next";
import RootShell from "@/app/components/RootShell";
import NotFoundView from "@/app/components/portfolio/NotFoundView";
import { LocaleProvider } from "@/app/i18n/LocaleProvider";
import NotFoundLanguage from "@/app/components/portfolio/NotFoundLanguage";
import { getUi } from "@/app/i18n/content";
import { PROFILE } from "@/app/content/profile";

/*
 * Page 404 de tout le site (toute adresse inconnue, avec le code HTTP 404).
 * Avec une mise en page racine par langue, c'est la solution prévue par Next
 * (experimental.globalNotFound, voir next.config.ts) : une 404 posée sous une
 * mise en page racine n'est pas rendue côté serveur.
 *
 * Cette page ne connaît pas l'adresse demandée : elle contient les deux langues.
 * Le script ci-dessous, lu avant l'affichage, passe <html lang> à "en" sous /en,
 * et globals.css ne montre que la langue de <html lang>. Sans JavaScript : français.
 * NotFoundLanguage refait le réglage après l'hydratation (Next y réécrit le titre).
 * Les composants client hors des deux blocs (bandeau du fond 3D) suivent l'adresse.
 */
const title = (locale: "fr" | "en") => `${getUi(locale).notFound.metaTitle} — ${PROFILE.fullName}`;

export const metadata: Metadata = { title: title("fr") };

// Même règle que localeOfPath (i18n/config.ts), recopiée : un script en ligne ne peut rien importer
const pickLanguage = `(function(){if(/^\\/en(\\/|$)/.test(location.pathname)){document.documentElement.lang="en";document.title=${JSON.stringify(title("en"))}}})()`;

export default function GlobalNotFound() {
  return (
    <RootShell locale="fr" localeFromPath>
      <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
      <NotFoundLanguage englishTitle={title("en")} />
      <LocaleProvider locale="fr" ui={getUi("fr")}>
        <div data-lang="fr">
          <NotFoundView locale="fr" />
        </div>
      </LocaleProvider>
      <LocaleProvider locale="en" ui={getUi("en")}>
        <div data-lang="en" lang="en">
          <NotFoundView locale="en" />
        </div>
      </LocaleProvider>
    </RootShell>
  );
}
