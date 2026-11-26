import type { Locale } from "@/app/i18n/config";

/**
 * Chronologie du projet (page /gantt) : chantiers, jalons et commits par semaine, relevés
 * dans l'historique git du dépôt (toutes branches). Les noms sont dans les deux langues ;
 * les commits clés gardent leur message d'origine (citations, non traduites).
 * Pour ajouter un chantier : une entrée dans TASKS, dans l'ordre de début.
 */

/** Type de travail d'un chantier : donne sa couleur dans le diagramme (tokens --tl-*). */
export type TimelineCategory = "front" | "back" | "ci" | "qual" | "infra" | "docs";

export type TimelineTask = {
  name: Record<Locale, string>;
  cat: TimelineCategory;
  /** Dates du premier et du dernier commit du chantier (AAAA-MM-JJ). */
  start: string;
  end: string;
  /** Pull requests fusionnées (texte libre : « #15 à #35 »), vide si aucune. */
  prs: string;
  /** Commits clés : hash court et message d'origine. */
  commits: readonly (readonly [string, string])[];
  /** Chantier en cours : signalé « en cours » dans le tableau. */
  live?: boolean;
};

/** Période représentée : du lundi de la première semaine au lundi qui suit la dernière. */
export const TIMELINE_RANGE = { start: "2026-01-19", end: "2026-11-16" } as const;
/** Dernier commit relevé (« aujourd'hui » sur le diagramme). */
export const TIMELINE_UPDATED = "2026-11-08";
/** Pause sans aucun commit : du lendemain du dernier commit à la veille du suivant. */
export const TIMELINE_PAUSE = { start: "2026-04-11", end: "2026-09-16", days: 159 } as const;

/** Totaux du dépôt au TIMELINE_UPDATED : commits (toutes branches) et pull requests fusionnées. */
export const TIMELINE_FIGURES = { commits: 224, prs: 58, versions: 2 } as const;

/** Commits hors fusions, par semaine, à partir de TIMELINE_RANGE.start (lundi). */
export const WEEKLY_COMMITS: readonly number[] = [
  1, 2, 1, 8, 6, 10, 4, 25, 4, 4, 30, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 4, 5, 19,
  8, 6, 6, 4,
];

export const TIMELINE_MILESTONES: readonly { date: string; label: Record<Locale, string>; align?: "end" }[] = [
  { date: "2026-04-03", label: { fr: "v1 en production (PR #53)", en: "v1 in production (PR #53)" } },
  { date: "2026-10-09", label: { fr: "v2.0.0", en: "v2.0.0" }, align: "end" },
  { date: "2026-11-07", label: { fr: "PR #61", en: "PR #61" }, align: "end" },
];

export const TIMELINE_TASKS: readonly TimelineTask[] = [
  {
    name: {
      fr: "Migration du dépôt, frontend v1 React + Vite",
      en: "Repository migration, v1 frontend in React + Vite",
    },
    cat: "front",
    start: "2026-01-23",
    end: "2026-01-23",
    prs: "",
    commits: [["2e41fef", "migration repo"]],
  },
  {
    name: { fr: "Base PostgreSQL, API Express + TypeORM", en: "PostgreSQL database, Express + TypeORM API" },
    cat: "back",
    start: "2026-01-26",
    end: "2026-02-24",
    prs: "#1, #8",
    commits: [
      ["dcea88c", "db init"],
      ["04d319b", "Remove SQLite"],
      ["00ec6ac", "health route"],
      ["1096202", "add migration"],
    ],
  },
  {
    name: { fr: "Premiers workflows CI, cache des dépendances", en: "First CI workflows, dependency cache" },
    cat: "ci",
    start: "2026-02-13",
    end: "2026-02-23",
    prs: "#2 – #7",
    commits: [
      ["8efae36", "creation de workflow"],
      ["bbe1537", "ci file"],
      ["37c879c", "cache dep fix"],
    ],
  },
  {
    name: { fr: "Premiers tests (Jest front et back)", en: "First tests (Jest, front and back)" },
    cat: "qual",
    start: "2026-02-18",
    end: "2026-03-05",
    prs: "#2, #12",
    commits: [
      ["268ca1e", "test env"],
      ["d0424ca", "2 tests implemented"],
      ["714c940", "Building test"],
    ],
  },
  {
    name: { fr: "Téléchargement du CV", en: "Résumé download" },
    cat: "back",
    start: "2026-03-03",
    end: "2026-03-05",
    prs: "#10, #13",
    commits: [
      ["130ac62", "update download cv"],
      ["905c6c0", "use the db path"],
    ],
  },
  {
    name: { fr: "Images Docker, Docker Hub, compose de prod", en: "Docker images, Docker Hub, production compose" },
    cat: "ci",
    start: "2026-03-09",
    end: "2026-03-12",
    prs: "#15 – #35",
    commits: [
      ["35c3f14", "touch build.dockerfile back and front"],
      ["8adad1e", "docker compose prod update"],
      ["5ee903d", "Try to login in docker hub"],
    ],
  },
  {
    name: { fr: "SonarQube, image Node 25", en: "SonarQube, Node 25 image" },
    cat: "qual",
    start: "2026-03-16",
    end: "2026-03-17",
    prs: "#36 – #39",
    commits: [
      ["9b2f5da", "Fix with SonarQube"],
      ["74e04cd", "switch node image lts -> 25"],
    ],
  },
  {
    name: { fr: "Mise en prod : nginx, passerelle, persistance", en: "Going live: nginx, gateway, persistence" },
    cat: "infra",
    start: "2026-03-26",
    end: "2026-04-10",
    prs: "#40 – #53",
    commits: [
      ["b972a15", "add nginx logs"],
      ["f3a44f6", "Fix the GATEWAY=8000 de prod"],
      ["8c21456", "Fix the db persistance"],
    ],
  },
  {
    name: { fr: "Vulnérabilités des images nginx et backend", en: "Vulnerabilities in the nginx and backend images" },
    cat: "qual",
    start: "2026-04-01",
    end: "2026-04-02",
    prs: "#48",
    commits: [
      ["129fab0", "Fix vuln"],
      ["c206c5e", "fix build backend vuln"],
    ],
  },
  {
    name: { fr: "README et captures", en: "README and screenshots" },
    cat: "docs",
    start: "2026-09-17",
    end: "2026-09-17",
    prs: "",
    commits: [
      ["43621f7", "README"],
      ["6780a8b", "png"],
    ],
  },
  {
    name: { fr: "CV ajouté puis retiré, à répétition", en: "Résumé added then removed, repeatedly" },
    cat: "docs",
    start: "2026-09-17",
    end: "2026-10-09",
    prs: "",
    commits: [
      ["dfb7dfa", "remove cv"],
      ["bec173f", "add new cv"],
    ],
  },
  {
    name: { fr: "Sécurité backend, test de la route CV", en: "Backend security, résumé route test" },
    cat: "back",
    start: "2026-10-01",
    end: "2026-10-09",
    prs: "",
    commits: [
      ["fa84b07", "fix(security): lancer node directement en prod, nodemon passe en devDependency"],
      ["1172424", "test: couvrir la route /api/cv/download"],
    ],
  },
  {
    name: { fr: "Refonte v2 Next.js 16, versions, CHANGELOG", en: "v2 rebuild on Next.js 16, versioning, CHANGELOG" },
    cat: "front",
    start: "2026-10-09",
    end: "2026-10-09",
    prs: "#54",
    commits: [
      ["c92e828", "migration frontend"],
      ["f23b80c", "Add Versionning, Changlog"],
      ["07eddbf", "fix(sonar): image de dev sans root"],
    ],
  },
  {
    name: {
      fr: "Fond WebGL sans bibliothèque, LinkedIn, GitHub",
      en: "Library-free WebGL background, LinkedIn, GitHub",
    },
    cat: "front",
    start: "2026-10-12",
    end: "2026-10-12",
    prs: "#55",
    commits: [
      ["5ee5acb", "perf(frontend): brouillard WebGL sans bibliothèque, moins de mémoire sur mobile"],
      ["c93926a", "feat(frontend): fond 3D adapté à l'appareil"],
    ],
  },
  {
    name: { fr: "Pages légales, avertissements SonarCloud", en: "Legal pages, SonarCloud warnings" },
    cat: "docs",
    start: "2026-10-21",
    end: "2026-10-21",
    prs: "#56, #57",
    commits: [
      ["cbf527f", "Fix legal front"],
      ["851d8c0", "refactor(legal): corrige les avertissements SonarCloud de la PR 56"],
    ],
  },
  {
    name: { fr: "Images Docker construites sur les PR", en: "Docker images built on pull requests" },
    cat: "ci",
    start: "2026-10-21",
    end: "2026-10-21",
    prs: "#58",
    commits: [["6d05879", "ci: construit les images Docker sur les PR, sans les publier"]],
  },
  {
    name: { fr: "CV hors de git, compose de prod du VPS", en: "Résumé out of git, VPS production compose" },
    cat: "infra",
    start: "2026-10-28",
    end: "2026-10-28",
    prs: "#58 – #60",
    commits: [
      ["5f58a86", "fix(legal): retire le CV du suivi git"],
      ["a743d8e", "chore(prod): reprend les réglages du VPS dans docker-compose.prod.yml"],
    ],
  },
  {
    name: { fr: "Page 404, thème en onde de choc", en: "404 page, shockwave theme switch" },
    cat: "front",
    start: "2026-10-28",
    end: "2026-10-28",
    prs: "",
    commits: [["526353f", "Fix 404 & style"]],
  },
  {
    name: { fr: "Version anglaise, sécurité, chronologie", en: "English version, security, timeline" },
    cat: "front",
    start: "2026-11-07",
    end: "2026-11-08",
    prs: "#61",
    live: true,
    commits: [
      ["5440ed3", "Ajout de i18n"],
      ["99e7f14", "Fix en/fr"],
    ],
  },
];
