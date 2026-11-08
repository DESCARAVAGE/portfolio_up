import type { Metadata } from "next";
import NotFoundView from "@/app/components/portfolio/NotFoundView";
import { LocaleProvider } from "@/app/i18n/LocaleProvider";
import NotFoundLanguage from "@/app/components/portfolio/NotFoundLanguage";
import { getUi } from "@/app/i18n/content";
import { PROFILE } from "@/app/content/profile";

/*
 * Page 404 de tout le site : toute adresse inconnue (code HTTP 404), rendue dans la
 * mise en page racine commune (app/layout.tsx), donc avec le fond 3D, le thème, et un
 * retour au portfolio sans rechargement.
 *
 * Cette page est statique et ne connaît pas l'adresse demandée : elle contient les deux
 * langues. RootShell passe <html lang> à "en" sous /en avant l'affichage, et globals.css
 * ne montre que la langue de <html lang>. Sans JavaScript : français. NotFoundLanguage met
 * le titre anglais à l'hydratation. Les composants client hors des deux blocs (bandeau du
 * fond 3D) suivent l'adresse.
 */
const title = (locale: "fr" | "en") => `${getUi(locale).notFound.metaTitle} — ${PROFILE.fullName}`;

export const metadata: Metadata = { title: title("fr") };

export default function NotFound() {
  return (
    <>
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
    </>
  );
}
