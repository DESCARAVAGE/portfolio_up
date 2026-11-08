import { CREDITS as CREDITS_FR, LEGAL } from "@/app/content/legal";
import type { Localized } from "@/app/i18n/types";

/**
 * Textes de legal.ts à traduire pour les pages anglaises (/en/legal-notice, /en/privacy).
 * Le reste (noms, adresses, immatriculation, licence) est repris tel quel de legal.ts.
 */

/** Durées de conservation : mêmes valeurs que LEGAL.retention, en anglais. */
export const RETENTION: Localized<typeof LEGAL.retention> = {
  serverLogs: "6 months",
  fail2ban: "30 days",
  emails: "3 years after our last exchange",
};

/** Forme juridique de l'hébergeur (LEGAL.host.form). */
export const HOST_FORM = "simplified joint-stock company (SAS) with share capital of €50,000,000";

/** Statut de l'éditeur s'il passe en professionnel (LEGAL.publisher.pro.status). */
export const PRO_STATUS = "sole proprietor (entrepreneur individuel, EI)";

export const CREDITS: Localized<typeof CREDITS_FR> = [
  { ...CREDITS_FR[0], what: "LinkedIn and GitHub icons", who: "Font Awesome Free (Fonticons, Inc.), via react-icons" },
  {
    ...CREDITS_FR[1],
    what: "Animated background",
    who: "adapted from the Vanta.js FOG effect (Teng Bao), based on The Book of Shaders (Patricio Gonzalez Vivo) and a value noise by Morgan McGuire",
  },
  { ...CREDITS_FR[2], what: "Geist and Geist Mono fonts", who: "Vercel, self-hosted" },
];
