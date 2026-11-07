import type { Locale } from "@/app/i18n/config";

/**
 * Cas du bouton de langue, partagés par le test unitaire (tests/unit/languageSwitch.test.ts)
 * et le test de bout en bout (tests/e2e/i18n.spec.ts) : une seule table à tenir à jour.
 * - from + hash : la page où l'on clique ;
 * - expected : l'adresse d'arrivée ;
 * - heading : ce qui doit être à l'écran après le clic (titre de la section ou de la page).
 */
export type LanguageSwitchCase = {
  from: string;
  hash: string;
  to: Locale;
  expected: string;
  heading: RegExp;
};

export const LANGUAGE_SWITCH_CASES: readonly LanguageSwitchCase[] = [
  { from: "/", hash: "", to: "en", expected: "/en", heading: /start from the need/ },
  { from: "/", hash: "#projets", to: "en", expected: "/en#projects", heading: /What I build/ },
  { from: "/", hash: "#competences", to: "en", expected: "/en#skills", heading: /What I'm good at/ },
  { from: "/", hash: "#formation", to: "en", expected: "/en#education", heading: /earned entirely through work-study/ },
  { from: "/", hash: "#approche", to: "en", expected: "/en#approach", heading: /How I work/ },
  { from: "/", hash: "#experience", to: "en", expected: "/en#experience", heading: /One project, carried end to end/ },
  { from: "/en", hash: "#vision", to: "fr", expected: "/#vision", heading: /Ce que je cherche/ },
  { from: "/en", hash: "#skills", to: "fr", expected: "/#competences", heading: /Ce que je maîtrise/ },
  { from: "/en", hash: "#education", to: "fr", expected: "/#formation", heading: /Du Bac\+2 au Bac\+5/ },
  { from: "/en", hash: "#contact", to: "fr", expected: "/#contact", heading: /on en parle/ },
  { from: "/mentions-legales", hash: "#hebergeur", to: "en", expected: "/en/legal-notice", heading: /^Legal notice$/ },
  { from: "/en/privacy", hash: "#your-rights", to: "fr", expected: "/confidentialite", heading: /^Confidentialité$/ },
];
