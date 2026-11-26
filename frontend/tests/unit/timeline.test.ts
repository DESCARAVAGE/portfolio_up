import { describe, expect, it } from "vitest";
import {
  TIMELINE_CATEGORIES,
  TIMELINE_MILESTONES,
  TIMELINE_PAUSE,
  TIMELINE_RANGE,
  TIMELINE_TASKS,
  TIMELINE_UPDATED,
  WEEKLY_COMMITS,
} from "@/app/content/timeline";

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;
const days = (from: string, to: string) => (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS;
const inRange = (iso: string) => iso >= TIMELINE_RANGE.start && iso < TIMELINE_RANGE.end;

/**
 * timeline.ts refuse déjà, au chargement, une catégorie, une clé ou un commit invalides
 * (le build échoue). Ces tests vérifient le reste : contenu non vide, hash, dates dans
 * l'ordre et dans la période, pause et commits par semaine cohérents.
 */
describe("Chronologie du projet (app/content/timeline.json)", () => {
  it("chaque chantier a une catégorie connue, ses deux noms et des commits [hash, message]", () => {
    for (const task of TIMELINE_TASKS) {
      expect(TIMELINE_CATEGORIES, task.name.fr).toContain(task.cat);
      expect(task.name.fr.length * task.name.en.length, task.name.fr).toBeGreaterThan(0);
      expect(typeof task.prs).toBe("string");
      expect(task.live === undefined || typeof task.live === "boolean").toBe(true);
      expect(task.commits.length, task.name.fr).toBeGreaterThan(0);
      for (const commit of task.commits) {
        expect(commit).toHaveLength(2);
        expect(commit[0], task.name.fr).toMatch(/^[0-9a-f]{7}$/);
        expect(commit[1].length).toBeGreaterThan(0);
      }
    }
  });

  it("les dates sont valides, dans la période, et les chantiers rangés par date de début", () => {
    for (const task of TIMELINE_TASKS) {
      expect(task.start, task.name.fr).toMatch(ISO);
      expect(task.end, task.name.fr).toMatch(ISO);
      expect(task.start <= task.end, task.name.fr).toBe(true);
      expect(inRange(task.start) && inRange(task.end), task.name.fr).toBe(true);
    }
    const starts = TIMELINE_TASKS.map((t) => t.start);
    expect(starts).toEqual([...starts].sort());
  });

  it("jalons, pause et dernière mise à jour tombent dans la période", () => {
    for (const m of TIMELINE_MILESTONES) {
      expect(inRange(m.date), m.date).toBe(true);
      expect(m.align === undefined || m.align === "end").toBe(true);
      expect(m.label.fr.length * m.label.en.length).toBeGreaterThan(0);
    }
    expect(inRange(TIMELINE_UPDATED)).toBe(true);
    expect(days(TIMELINE_PAUSE.start, TIMELINE_PAUSE.end) + 1).toBe(TIMELINE_PAUSE.days);
  });

  it("une valeur de commits par semaine, du premier lundi à la semaine de la mise à jour", () => {
    expect(new Date(`${TIMELINE_RANGE.start}T00:00:00Z`).getUTCDay()).toBe(1);
    const weeks = days(TIMELINE_RANGE.start, TIMELINE_RANGE.end) / 7;
    expect(Number.isInteger(weeks)).toBe(true);
    expect(WEEKLY_COMMITS.length).toBeLessThanOrEqual(weeks);
    expect(WEEKLY_COMMITS.length).toBeGreaterThan(Math.floor(days(TIMELINE_RANGE.start, TIMELINE_UPDATED) / 7));
    expect(WEEKLY_COMMITS.every((n) => Number.isInteger(n) && n >= 0)).toBe(true);
  });
});
