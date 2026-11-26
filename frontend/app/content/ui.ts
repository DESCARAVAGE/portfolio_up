import type { Locale } from "@/app/i18n/config";

/**
 * Petits textes de l'interface (boutons, libellés pour lecteurs d'écran, messages),
 * dans les deux langues côte à côte : chaque texte est un `{ fr, en }`. Une langue
 * oubliée fait échouer `tsc` (voir `satisfies` en bas du fichier).
 * Le contenu du portfolio lui-même reste dans profile.ts et profile.en.ts.
 * Pour lire ces textes dans une langue : getUi(locale) (i18n/content.ts).
 */
export const UI = {
  meta: {
    description: {
      fr: "Développeur frontend React / TypeScript à Tours : étude de cas Enedis, projets, parcours en alternance du Bac+2 au Bac+5. Disponible immédiatement.",
      en: "Frontend developer (React / TypeScript) based in Tours, France: Enedis case study, projects, and work-study from associate to master's level. Available now.",
    },
    /** Sujets de compétence pour les données structurées (schema.org). */
    knowsAbout: {
      fr: ["React", "TypeScript", "Next.js", "Accessibilité web", "Tests end-to-end", "Agents IA"],
      en: ["React", "TypeScript", "Next.js", "Web accessibility", "End-to-end testing", "AI agents"],
    },
  },
  /** Deux-points : avec l'espace avant en français (« Expérience : … »). */
  colon: { fr: " : ", en: ": " },
  skipToContent: { fr: "Aller au contenu", en: "Skip to content" },
  newTab: { fr: " (nouvel onglet)", en: " (opens in a new tab)" },
  header: {
    homeSuffix: { fr: "retour en haut de page", en: "back to top" },
    sections: { fr: "Sections", en: "Sections" },
    menu: { fr: "Menu", en: "Menu" },
    closeMenu: { fr: "Fermer le menu", en: "Close menu" },
  },
  /**
   * Bouton de langue. Libellé (lecteurs d'écran) : ce que fait le clic, dans la langue
   * d'arrivée. Infobulle : la langue affichée, comme le drapeau.
   */
  switchLanguage: {
    label: { fr: "Read this page in English", en: "Lire cette page en français" },
    lang: { fr: "en", en: "fr" },
    current: { fr: "Français", en: "English" },
  },
  theme: {
    change: { fr: "Changer de thème", en: "Change theme" },
    toLight: { fr: "Passer au thème clair", en: "Switch to light theme" },
    toDark: { fr: "Passer au thème sombre", en: "Switch to dark theme" },
    /** Infobulle : le thème affiché, comme l'icône. */
    light: { fr: "Thème clair", en: "Light theme" },
    dark: { fr: "Thème sombre", en: "Dark theme" },
    system: { fr: " (réglage du système)", en: " (system setting)" },
  },
  fog: {
    region: { fr: "Fond animé", en: "Animated background" },
    enable: { fr: "Activer le fond 3D", en: "Turn on the 3D background" },
    inApp: {
      fr: "Pour la version complète, ouvrir le lien dans le navigateur (menu ⋯).",
      en: "For the full version, open the link in your browser (⋯ menu).",
    },
    hide: { fr: "Masquer", en: "Hide" },
  },
  copyEmail: {
    copy: { fr: "Copier l'adresse", en: "Copy address" },
    copied: { fr: "Adresse copiée ✓", en: "Address copied ✓" },
    prompt: { fr: "Adresse e-mail :", en: "Email address:" },
  },
  video: {
    play: { fr: "Voir la démo", en: "Watch the demo" },
    pause: { fr: "Mettre la vidéo en pause", en: "Pause the video" },
    resume: { fr: "Reprendre la lecture", en: "Resume playback" },
    pauseShort: { fr: "pause", en: "pause" },
    resumeShort: { fr: "lecture", en: "play" },
    enterFullscreen: { fr: "Afficher la vidéo en plein écran", en: "Show the video full screen" },
    exitFullscreen: { fr: "Réduire : quitter le plein écran", en: "Exit full screen" },
    enterShort: { fr: "plein écran", en: "full screen" },
    exitShort: { fr: "réduire", en: "exit" },
  },
  compare: {
    before: { fr: "avant", en: "before" },
    after: { fr: "après", en: "after" },
    label: { fr: "Comparer l'ancienne et la nouvelle version", en: "Compare the old and new versions" },
  },
  experience: { achievements: { fr: "Réalisations", en: "Achievements" } },
  journey: {
    formation: { fr: "formation", en: "education" },
    avant: { fr: "avant la tech", en: "before tech" },
  },
  projects: {
    featured: { fr: "projet phare", en: "featured project" },
    video: { fr: "Vidéo", en: "Video" },
    image: { fr: "Capture", en: "Screenshot" },
  },
  skills: { tools: { fr: "Outils", en: "Tools" } },
  contact: {
    write: { fr: "M'écrire", en: "Email me" },
    cv: { fr: "Mon CV", en: "My résumé (French)" },
  },
  legal: {
    /** Liens du pied de page vers les pages annexes (légales et chronologie). */
    nav: { fr: "Autres pages", en: "Other pages" },
    back: { fr: "Retour au portfolio", en: "Back to portfolio" },
    top: { fr: "Haut de page", en: "Back to top" },
    toc: { fr: "Sommaire", en: "Contents" },
    tocTitle: { fr: "Sur cette page", en: "On this page" },
    updated: { fr: "Dernière mise à jour : ", en: "Last updated: " },
    pages: {
      legalNotice: { fr: "Mentions légales", en: "Legal notice" },
      privacy: { fr: "Confidentialité", en: "Privacy" },
      gantt: { fr: "Chronologie du projet", en: "Project timeline" },
    },
  },
  /** Page /gantt : chronologie du dépôt (données dans timeline.ts). */
  timeline: {
    description: {
      fr: "Chronologie du portfolio de Daniel Escaravage : diagramme de Gantt des chantiers et tableau des étapes, tirés de l'historique git.",
      en: "Timeline of Daniel Escaravage's portfolio: Gantt chart of the work and table of milestones, drawn from the git history.",
    },
    intro: {
      fr: "L'histoire de ce site, reconstituée depuis son dépôt git : chaque chantier, dans l'ordre où il a commencé, avec ses pull requests et ses commits clés.",
      en: "The story of this website, rebuilt from its git repository: every piece of work, in the order it started, with its pull requests and key commits.",
    },
    chart: { fr: "Diagramme de Gantt", en: "Gantt chart" },
    chartLabel: {
      fr: "Diagramme de Gantt des chantiers du site, de janvier à novembre 2026. Le même contenu est dans le tableau qui suit.",
      en: "Gantt chart of the website's work, January to November 2026. The same content is in the table that follows.",
    },
    table: { fr: "Chronologie en tableau", en: "Timeline as a table" },
    weekly: { fr: "Commits par semaine", en: "Commits per week" },
    milestones: { fr: "Jalons", en: "Milestones" },
    pause: { fr: "Pause : {n} jours sans commit", en: "Break: {n} days without a commit" },
    scroll: {
      fr: "Sur un petit écran, le diagramme défile à l'horizontale.",
      en: "On a small screen, the chart scrolls sideways.",
    },
    figures: {
      fr: "{commits} commits, {prs} pull requests fusionnées, {versions} versions publiées.",
      en: "{commits} commits, {prs} merged pull requests, {versions} published versions.",
    },
    cols: {
      task: { fr: "Chantier", en: "Work" },
      type: { fr: "Type", en: "Type" },
      dates: { fr: "Dates", en: "Dates" },
      prs: { fr: "PR", en: "PR" },
      commits: { fr: "Commits clés", en: "Key commits" },
    },
    inProgress: { fr: "en cours", en: "in progress" },
    cats: {
      front: { fr: "Frontend & fonctionnalités", en: "Frontend & features" },
      back: { fr: "Backend & données", en: "Backend & data" },
      ci: { fr: "CI/CD & Docker", en: "CI/CD & Docker" },
      qual: { fr: "Tests, qualité & sécurité", en: "Testing, quality & security" },
      infra: { fr: "Infra & mise en prod", en: "Infrastructure & go-live" },
      docs: { fr: "Docs, légal & contenu", en: "Docs, legal & content" },
    },
  },
  notFound: {
    metaTitle: { fr: "Page introuvable", en: "Page not found" },
    title: { fr: "Vous vous êtes perdu ?", en: "Are you lost?" },
    text: {
      fr: "Cette adresse ne mène à aucune page du portfolio (erreur 404). Le lien a peut-être changé, ou une lettre s'est glissée dans l'adresse.",
      en: "This address doesn't lead to any page of the portfolio (error 404). The link may have changed, or a typo slipped into the address.",
    },
    back: { fr: "Revenir au portfolio", en: "Back to the portfolio" },
    shortcuts: {
      before: { fr: "Ou directement vers les", en: "Or go straight to the" },
      projects: { fr: "projets", en: "projects" },
      between: { fr: "ou le", en: "or the" },
      contact: { fr: "contact", en: "contact section" },
    },
  },
} satisfies UiTree;

/** Un texte (ou une liste de textes) dans chaque langue. */
type Translated = Record<Locale, string> | Record<Locale, readonly string[]>;
/**
 * Forme du dictionnaire : des groupes, et au bout de chaque branche, un texte traduit.
 * Un groupe ne peut pas s'appeler `fr` ou `en` : il serait pris pour un texte traduit.
 */
type UiTree = { [key: string]: Translated | UiTree } & { [L in Locale]?: never };
