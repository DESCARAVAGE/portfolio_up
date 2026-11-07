/**
 * Langues du site. Le français reste à la racine (/, /mentions-legales…) ;
 * l'anglais est sous /en. Aucune redirection selon la langue du navigateur :
 * chacun choisit avec le bouton de langue de la barre.
 */
import type { SectionId } from "@/app/content/profile";

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

/** Une page, son adresse dans chaque langue. Le bouton de langue passe de l'une à l'autre. */
export const ROUTES = {
  home: { fr: "/", en: "/en" },
  legalNotice: { fr: "/mentions-legales", en: "/en/legal-notice" },
  privacy: { fr: "/confidentialite", en: "/en/privacy" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

/**
 * Ancre de chaque section de l'accueil, dans chaque langue (/#projets, /en#projects).
 * La clé est l'identifiant interne de la section (profile.ts) ; les ancres françaises
 * sont celles d'origine. Le bouton de langue passe de l'une à l'autre.
 */
export const SECTION_ANCHORS = {
  top: { fr: "top", en: "top" },
  "en-bref": { fr: "en-bref", en: "at-a-glance" },
  experience: { fr: "experience", en: "experience" },
  projets: { fr: "projets", en: "projects" },
  competences: { fr: "competences", en: "skills" },
  approche: { fr: "approche", en: "approach" },
  vision: { fr: "vision", en: "vision" },
  formation: { fr: "formation", en: "education" },
  contact: { fr: "contact", en: "contact" },
} as const satisfies Record<SectionId, Record<Locale, string>>;

/** Ancre du contenu principal (cible du lien d'évitement « Aller au contenu »). */
export const MAIN_ANCHOR: Record<Locale, string> = { fr: "contenu", en: "content" };

/** Ancre d'une section dans une langue (sans « # »). */
export const anchorOf = (section: SectionId, locale: Locale): string => SECTION_ANCHORS[section][locale];

/** « #projets » vu depuis une langue → la même section dans une autre (« #projects »). Ancre inconnue : "". */
export function translateHash(hash: string, from: Locale, to: Locale): string {
  const anchor = hash.replace(/^#/, "");
  if (!anchor) return "";
  const section = (Object.keys(SECTION_ANCHORS) as SectionId[]).find((s) => SECTION_ANCHORS[s][from] === anchor);
  return section ? `#${SECTION_ANCHORS[section][to]}` : "";
}

/** Pages légales, dans l'ordre du pied de page (aussi listées dans le sitemap). */
export const LEGAL_ROUTES = ["legalNotice", "privacy"] as const satisfies readonly RouteKey[];

/** Valeur de og:locale (Open Graph). */
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_US" };

/** Langue d'une adresse : /en et tout ce qui est dessous = anglais. */
export function localeOfPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/** Page correspondant à une adresse, dans n'importe quelle langue (null si inconnue). */
export function routeOfPath(pathname: string): RouteKey | null {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  for (const key of Object.keys(ROUTES) as RouteKey[]) {
    if (LOCALES.some((l) => ROUTES[key][l] === path)) return key;
  }
  return null;
}

/** Même page dans l'autre langue ; adresse inconnue : l'accueil de cette langue. */
export function counterpartPath(pathname: string, to: Locale): string {
  return ROUTES[routeOfPath(pathname) ?? "home"][to];
}

/**
 * Destination du bouton de langue : la même page dans l'autre langue, et sur l'accueil
 * la même section (« /#projets » → « /en#projects »). Sur une page légale, les rubriques
 * n'ont pas de correspondance : on arrive en haut de la page traduite.
 * Les paramètres d'URL (?utm=…) ne sont pas repris : `pathname` n'en contient pas.
 */
export function switchLanguageHref(pathname: string, hash: string, to: Locale): string {
  const path = counterpartPath(pathname, to);
  return routeOfPath(pathname) === "home" ? path + translateHash(hash, localeOfPath(pathname), to) : path;
}

/** Métadonnées d'une page : adresse canonique et ses équivalents hreflang (x-default = français). */
export function languageAlternates(key: RouteKey, locale: Locale) {
  const route = ROUTES[key];
  return {
    canonical: route[locale],
    languages: { fr: route.fr, en: route.en, "x-default": route[DEFAULT_LOCALE] },
  };
}
