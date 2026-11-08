import { describe, expect, it } from "vitest";
import { LOCALES } from "@/app/i18n/config";
import { getUi } from "@/app/i18n/content";

/** Chemins de tous les textes d'un dictionnaire (« theme.toLight »…), avec leur valeur. */
function leaves(node: unknown, path = ""): [string, unknown][] {
  if (typeof node !== "object" || node === null || Array.isArray(node)) return [[path, node]];
  return Object.entries(node).flatMap(([key, child]) => leaves(child, path ? `${path}.${key}` : key));
}

describe("Textes d'interface (app/content/ui.ts)", () => {
  it("chaque texte est résolu dans sa langue : plus aucun { fr, en } ni texte vide", () => {
    for (const locale of LOCALES) {
      for (const [path, value] of leaves(getUi(locale))) {
        // Un { fr, en } resté tel quel laisserait un chemin en « .fr » / « .en »
        expect(path, `${locale} : ${path}`).not.toMatch(/(^|\.)(fr|en)$/);
        const ok = typeof value === "string" ? value.length > 0 : Array.isArray(value) && value.length > 0;
        expect(ok, `${locale} : ${path}`).toBe(true);
      }
    }
  });

  it("chaque langue a ses propres textes", () => {
    expect(getUi("fr").theme.toDark).toBe("Passer au thème sombre");
    expect(getUi("en").theme.toDark).toBe("Switch to dark theme");
    expect(getUi("en").meta.knowsAbout).toContain("Web accessibility");
  });

  it("le bouton de langue parle la langue d'arrivée", () => {
    expect(getUi("fr").switchLanguage.lang).toBe("en");
    expect(getUi("en").switchLanguage.lang).toBe("fr");
  });
});
