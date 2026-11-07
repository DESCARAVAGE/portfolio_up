import * as fr from "@/app/content/profile";
import * as en from "@/app/content/profile.en";
import { UI as uiFr } from "@/app/content/ui";
import { UI as uiEn } from "@/app/content/ui.en";
import type { Locale } from "@/app/i18n/config";
import type { Localized } from "@/app/i18n/types";

/** Contenu du portfolio dans une langue : mêmes clés en français et en anglais. */
export type Content = Localized<Omit<typeof fr, "NAV">> & { NAV: typeof fr.NAV };
/** Petits textes de l'interface dans une langue. */
export type Ui = Localized<typeof uiFr>;

const CONTENT: Record<Locale, Content> = { fr, en };
const UI: Record<Locale, Ui> = { fr: uiFr, en: uiEn };

/**
 * À appeler côté serveur (pages, sections). Les composants client reçoivent ce
 * dont ils ont besoin en props, ou les textes d'interface par useUi() : le
 * navigateur ne télécharge ainsi que la langue affichée.
 */
export const getContent = (locale: Locale): Content => CONTENT[locale];
export const getUi = (locale: Locale): Ui => UI[locale];
