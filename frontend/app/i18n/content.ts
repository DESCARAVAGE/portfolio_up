import * as fr from "@/app/content/profile";
import * as en from "@/app/content/profile.en";
import { UI } from "@/app/content/ui";
import { LOCALES, type Locale } from "@/app/i18n/config";
import type { Localized } from "@/app/i18n/types";

/** Contenu du portfolio dans une langue : mêmes clés en français et en anglais. */
export type Content = Localized<Omit<typeof fr, "NAV">> & { NAV: typeof fr.NAV };

/** Le dictionnaire d'interface dans une langue : chaque `{ fr, en }` devient son texte. */
type InLocale<T> =
  T extends Record<Locale, string | readonly string[]> ? T[Locale] : { [K in keyof T]: InLocale<T[K]> };
/** Petits textes de l'interface dans une langue. */
export type Ui = InLocale<typeof UI>;

const isText = (value: unknown) => typeof value === "string" || Array.isArray(value);

/** Un texte traduit : exactement une valeur par langue, chacune un texte ou une liste de textes. */
const isTranslated = (node: object): node is Record<Locale, string | string[]> =>
  Object.keys(node).length === LOCALES.length &&
  LOCALES.every((l) => isText((node as Partial<Record<Locale, unknown>>)[l]));

function inLocale(node: unknown, locale: Locale): unknown {
  if (typeof node !== "object" || node === null || Array.isArray(node)) return node;
  if (isTranslated(node)) return node[locale];
  return Object.fromEntries(Object.entries(node).map(([key, child]) => [key, inLocale(child, locale)]));
}

const CONTENT: Record<Locale, Content> = { fr, en };
// Calculé une fois par langue, au chargement du module
const UI_BY_LOCALE = Object.fromEntries(LOCALES.map((l) => [l, inLocale(UI, l)])) as Record<Locale, Ui>;

/**
 * À appeler côté serveur (pages, sections). Les composants client reçoivent ce
 * dont ils ont besoin en props, ou les textes d'interface par useUi().
 */
export const getContent = (locale: Locale): Content => CONTENT[locale];
export const getUi = (locale: Locale): Ui => UI_BY_LOCALE[locale];
