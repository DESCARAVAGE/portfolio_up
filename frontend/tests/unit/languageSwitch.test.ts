import { describe, expect, it } from "vitest";
import { LOCALES, SECTION_ANCHORS, localeOfPath, switchLanguageHref, translateHash } from "@/app/i18n/config";
import { LANGUAGE_SWITCH_CASES } from "../e2e/shared/languageSwitch.cases";

describe("bouton de langue : destination", () => {
  it.each(LANGUAGE_SWITCH_CASES)("$from$hash → $expected", ({ from, hash, to, expected }) => {
    expect(switchLanguageHref(from, hash, to)).toBe(expected);
  });

  it("une page inconnue mène à l'accueil de l'autre langue", () => {
    expect(switchLanguageHref("/rien-ici", "", "en")).toBe("/en");
    expect(switchLanguageHref("/en/nothing-here", "", "fr")).toBe("/");
  });

  it("une ancre inconnue ou vide est abandonnée plutôt que gardée telle quelle", () => {
    expect(switchLanguageHref("/", "#nimporte-quoi", "en")).toBe("/en");
    expect(switchLanguageHref("/", "#", "en")).toBe("/en");
  });

  it("« En bref » et le haut de page suivent aussi", () => {
    expect(switchLanguageHref("/", "#en-bref", "en")).toBe("/en#at-a-glance");
    expect(switchLanguageHref("/en", "#at-a-glance", "fr")).toBe("/#en-bref");
    expect(switchLanguageHref("/", "#top", "en")).toBe("/en#top");
  });

  it("un « / » final ne change rien", () => {
    expect(switchLanguageHref("/en/", "#skills", "fr")).toBe("/#competences");
    expect(switchLanguageHref("/en/legal-notice/", "", "fr")).toBe("/mentions-legales");
  });

  it("une adresse qui commence par « en » sans être sous /en reste française", () => {
    expect(localeOfPath("/enfoo")).toBe("fr");
    expect(localeOfPath("/en")).toBe("en");
    expect(localeOfPath("/en/privacy")).toBe("en");
  });
});

describe("ancres des sections", () => {
  it("le site français garde ses ancres d'origine (clé de section = ancre française)", () => {
    for (const [section, anchors] of Object.entries(SECTION_ANCHORS)) expect(anchors.fr).toBe(section);
  });

  it("chaque ancre est unique dans sa langue", () => {
    for (const locale of LOCALES) {
      const anchors = Object.values(SECTION_ANCHORS).map((a) => a[locale]);
      expect(new Set(anchors).size).toBe(anchors.length);
    }
  });

  it("aller-retour : une ancre traduite puis retraduite revient à l'identique", () => {
    for (const anchors of Object.values(SECTION_ANCHORS)) {
      expect(translateHash(translateHash(`#${anchors.fr}`, "fr", "en"), "en", "fr")).toBe(`#${anchors.fr}`);
    }
  });
});
