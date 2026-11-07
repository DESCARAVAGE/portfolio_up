import type { UI as UI_FR } from "@/app/content/ui";
import type { Localized } from "@/app/i18n/types";

/** Textes de l'interface en anglais : même forme que ui.ts (vérifié par le type). */
export const UI: Localized<typeof UI_FR> = {
  meta: {
    description:
      "Frontend developer (React / TypeScript) based in Tours, France: Enedis case study, projects, and work-study from associate to master's level. Available now.",
    knowsAbout: ["React", "TypeScript", "Next.js", "Web accessibility", "End-to-end testing", "AI agents"],
  },
  colon: ": ",
  skipToContent: "Skip to content",
  newTab: " (opens in a new tab)",
  header: {
    homeSuffix: "back to top",
    sections: "Sections",
    menu: "Menu",
    closeMenu: "Close menu",
  },
  switchLanguage: { label: "Lire cette page en français", lang: "fr" },
  theme: {
    change: "Change theme",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    system: " (currently: system theme)",
  },
  fog: {
    region: "Animated background",
    enable: "Turn on the 3D background",
    inApp: "For the full version, open the link in your browser (⋯ menu).",
    hide: "Hide",
  },
  copyEmail: { copy: "Copy address", copied: "Address copied ✓", prompt: "Email address:" },
  video: {
    play: "Watch the demo",
    pause: "Pause the video",
    resume: "Resume playback",
    pauseShort: "pause",
    resumeShort: "play",
    enterFullscreen: "Show the video full screen",
    exitFullscreen: "Exit full screen",
    enterShort: "full screen",
    exitShort: "exit",
  },
  compare: { before: "before", after: "after", label: "Compare the old and new versions" },
  experience: { achievements: "Achievements" },
  journey: { formation: "education", avant: "before tech" },
  projects: { featured: "featured project", video: "Video", image: "Screenshot" },
  skills: { tools: "Tools" },
  contact: { write: "Email me", cv: "My résumé (French)" },
  legal: {
    nav: "Legal information",
    back: "Back to portfolio",
    top: "Back to top",
    toc: "Contents",
    tocTitle: "On this page",
    updated: "Last updated: ",
    pages: { legalNotice: "Legal notice", privacy: "Privacy" },
  },
  notFound: {
    metaTitle: "Page not found",
    title: "Are you lost?",
    text: "This address doesn't lead to any page of the portfolio (error 404). The link may have changed, or a typo slipped into the address.",
    back: "Back to the portfolio",
    shortcuts: { before: "Or go straight to the", projects: "projects", between: "or the", contact: "contact section" },
  },
};
