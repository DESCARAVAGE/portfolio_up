/**
 * Petits textes de l'interface (boutons, libellés pour lecteurs d'écran, messages),
 * en français. La version anglaise (ui.en.ts) doit avoir exactement la même forme.
 * Le contenu du portfolio lui-même reste dans profile.ts.
 */
export const UI = {
  meta: {
    description:
      "Développeur frontend React / TypeScript à Tours : étude de cas Enedis, projets, parcours en alternance du Bac+2 au Bac+5. Disponible immédiatement.",
    /** Sujets de compétence pour les données structurées (schema.org). */
    knowsAbout: ["React", "TypeScript", "Next.js", "Accessibilité web", "Tests end-to-end", "Agents IA"],
  },
  /** Deux-points, avec l'espace avant à la française (« Expérience : … »). */
  colon: " : ",
  skipToContent: "Aller au contenu",
  newTab: " (nouvel onglet)",
  header: {
    homeSuffix: "retour en haut de page",
    sections: "Sections",
    menu: "Menu",
    closeMenu: "Fermer le menu",
  },
  /** Bouton de langue : il mène vers l'AUTRE langue, son libellé est donc dans cette langue-là. */
  switchLanguage: { label: "Read this page in English", lang: "en" },
  theme: {
    change: "Changer de thème",
    toLight: "Passer au thème clair",
    toDark: "Passer au thème sombre",
    system: " (actuellement : thème système)",
  },
  fog: {
    region: "Fond animé",
    enable: "Activer le fond 3D",
    inApp: "Pour la version complète, ouvrir le lien dans le navigateur (menu ⋯).",
    hide: "Masquer",
  },
  copyEmail: { copy: "Copier l'adresse", copied: "Adresse copiée ✓", prompt: "Adresse e-mail :" },
  video: {
    play: "Voir la démo",
    pause: "Mettre la vidéo en pause",
    resume: "Reprendre la lecture",
    pauseShort: "pause",
    resumeShort: "lecture",
    enterFullscreen: "Afficher la vidéo en plein écran",
    exitFullscreen: "Réduire : quitter le plein écran",
    enterShort: "plein écran",
    exitShort: "réduire",
  },
  compare: { before: "avant", after: "après", label: "Comparer l'ancienne et la nouvelle version" },
  experience: { achievements: "Réalisations" },
  journey: { formation: "formation", avant: "avant la tech" },
  projects: { featured: "projet phare", video: "Vidéo", image: "Capture" },
  skills: { tools: "Outils" },
  contact: { write: "M'écrire", cv: "Mon CV" },
  legal: {
    nav: "Informations légales",
    back: "Retour au portfolio",
    top: "Haut de page",
    toc: "Sommaire",
    tocTitle: "Sur cette page",
    updated: "Dernière mise à jour : ",
    pages: { legalNotice: "Mentions légales", privacy: "Confidentialité" },
  },
  notFound: {
    metaTitle: "Page introuvable",
    title: "Vous vous êtes perdu ?",
    text: "Cette adresse ne mène à aucune page du portfolio (erreur 404). Le lien a peut-être changé, ou une lettre s'est glissée dans l'adresse.",
    back: "Revenir au portfolio",
    shortcuts: { before: "Ou directement vers les", projects: "projets", between: "ou le", contact: "contact" },
  },
};
