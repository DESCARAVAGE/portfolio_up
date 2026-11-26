import type { Locale } from "@/app/i18n/config";
import data from "@/app/content/timeline.json";

/**
 * Chronologie du projet (page /gantt) : chantiers, jalons et commits par semaine, relevés
 * dans l'historique git du dépôt (toutes branches).
 *
 * Les données sont dans timeline.json : ce sont des données, pas du code (les 19 chantiers
 * ont la même forme, que l'analyse de duplication de SonarCloud compterait comme du code
 * copié). Ce fichier les type et les contrôle au build ; tests/unit/timeline.test.ts vérifie
 * en plus les dates (dans l'ordre, dans la période) et les commits par semaine.
 *
 * Pour ajouter un chantier : une entrée dans `tasks`, dans l'ordre de début. Les noms sont
 * dans les deux langues ; les commits clés gardent leur message d'origine (non traduits).
 */

/** Type de travail d'un chantier : donne sa couleur dans le diagramme (tokens --tl-*). */
export const TIMELINE_CATEGORIES = ["front", "back", "ci", "qual", "infra", "docs"] as const;
export type TimelineCategory = (typeof TIMELINE_CATEGORIES)[number];

export type TimelineTask = {
  name: Record<Locale, string>;
  cat: TimelineCategory;
  /** Dates du premier et du dernier commit du chantier (AAAA-MM-JJ). */
  start: string;
  end: string;
  /** Pull requests fusionnées (texte libre : « #15 – #35 »), vide si aucune. */
  prs: string;
  /** Commits clés : hash court et message d'origine. */
  commits: readonly (readonly [string, string])[];
  /** Chantier en cours : signalé « en cours » dans le tableau. */
  live?: boolean;
};

export type TimelineMilestone = { date: string; label: Record<Locale, string>; align?: "end" };

/** Période représentée : du lundi de la première semaine au lundi qui suit la dernière. */
export const TIMELINE_RANGE: { readonly start: string; readonly end: string } = data.range;
/** Dernier commit relevé (« aujourd'hui » sur le diagramme). */
export const TIMELINE_UPDATED: string = data.updated;
/** Pause sans aucun commit : du lendemain du dernier commit à la veille du suivant. */
export const TIMELINE_PAUSE: { readonly start: string; readonly end: string; readonly days: number } = data.pause;
/** Totaux du dépôt au TIMELINE_UPDATED : commits (toutes branches) et pull requests fusionnées. */
export const TIMELINE_FIGURES: { readonly commits: number; readonly prs: number; readonly versions: number } =
  data.figures;
/** Commits hors fusions, par semaine, à partir de TIMELINE_RANGE.start (lundi). */
export const WEEKLY_COMMITS: readonly number[] = data.weeklyCommits;

// Le JSON est typé large (string, string[]) : on vérifie ici ce que TypeScript ne peut pas
// voir. Une valeur inattendue fait échouer le build (la page est rendue au build).
const fail = (what: string): never => {
  throw new Error(`timeline.json : ${what}`);
};

const isCategory = (cat: string): cat is TimelineCategory => (TIMELINE_CATEGORIES as readonly string[]).includes(cat);

const toCommit = (commit: readonly string[], task: string): readonly [string, string] =>
  commit.length === 2 ? [commit[0], commit[1]] : fail(`commit sans la forme [hash, message] (${task})`);

/** Clés d'un chantier : une clé mal écrite (« lvie ») serait sinon ignorée sans bruit. */
const TASK_KEYS = new Set(["name", "cat", "start", "end", "prs", "commits", "live"]);

const toTask = (raw: (typeof data.tasks)[number]): TimelineTask => {
  const unknown = Object.keys(raw).filter((key) => !TASK_KEYS.has(key));
  if (unknown.length > 0) fail(`clé inconnue « ${unknown.join(", ")} » (${raw.name.fr})`);
  return {
    name: raw.name,
    cat: isCategory(raw.cat) ? raw.cat : fail(`catégorie inconnue « ${raw.cat} » (${raw.name.fr})`),
    start: raw.start,
    end: raw.end,
    prs: raw.prs,
    commits: raw.commits.map((commit) => toCommit(commit, raw.name.fr)),
    live: raw.live,
  };
};

const toMilestone = ({ align, ...rest }: (typeof data.milestones)[number]): TimelineMilestone => {
  if (align === undefined) return rest;
  return align === "end" ? { ...rest, align } : fail(`alignement inconnu « ${align} » (${rest.date})`);
};

export const TIMELINE_TASKS: readonly TimelineTask[] = data.tasks.map(toTask);
export const TIMELINE_MILESTONES: readonly TimelineMilestone[] = data.milestones.map(toMilestone);
