/**
 * Données des pages « Mentions légales » et « Confidentialité ».
 * Comme profile.ts : les pages n'ont aucun texte légal en dur, tout part d'ici.
 *
 * Statut (LCEN, loi n° 2004-575, art. 1-1) :
 * - "particulier" : site édité à titre non professionnel. L'éditeur peut taire son adresse
 *   et son téléphone ; seul l'hébergeur (nom, adresse) doit être indiqué (art. 1-1 II).
 * - "professionnel" : activité déclarée (SIREN). Identification complète obligatoire
 *   (art. 1-1 I) : remplir le bloc `pro` avant de basculer.
 *
 * Les valeurs « [À COMPLÉTER …] » ne doivent jamais être publiées : un test e2e échoue
 * tant qu'il en reste une sur le site.
 */

/** Les pages légales, dans l'ordre du pied de page (aussi listées dans le sitemap). */
export const LEGAL_PAGES = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
] as const;

export type LegalStatus = "particulier" | "professionnel";

export const LEGAL = {
  /** Passer à "professionnel" une fois l'activité déclarée et le bloc `pro` rempli. */
  status: "particulier" as LegalStatus,

  publisher: {
    name: "Daniel Escaravage",
    email: "danysk.epro@gmail.com",
    /** Directeur de la publication : l'éditeur lui-même. */
    publicationDirector: "Daniel Escaravage",

    /** Utilisé seulement avec status: "professionnel". */
    pro: {
      /** Mention obligatoire de l'entrepreneur individuel (« EI » ou « entrepreneur individuel »). */
      status: "entrepreneur individuel (EI)",
      /** Adresse postale complète. Une domiciliation (société, coworking) évite de publier son domicile. */
      address: "[À COMPLÉTER : adresse postale complète de l'entreprise ou de domiciliation]",
      /** Une ligne dédiée (2e SIM, numéro virtuel) protège le numéro personnel. */
      phone: "[À COMPLÉTER : numéro de téléphone professionnel]",
      siren: "[À COMPLÉTER : numéro SIREN (9 chiffres)]",
      register: "Registre national des entreprises (RNE)",
      /** N° de TVA intracommunautaire : null si aucun n'a été attribué (la ligne n'est alors pas affichée). */
      vat: null as string | null,
    },
  },

  /** Hébergeur : coordonnées officielles d'OVHcloud (page « Mentions légales » d'ovhcloud.com). */
  host: {
    name: "OVH SAS",
    form: "SAS au capital de 50 000 000 €",
    rcs: "RCS Lille Métropole 424 761 419 00045",
    address: "2 rue Kellermann, 59100 Roubaix, France",
    /**
     * Facultatif pour un particulier (nom et adresse suffisent), obligatoire pour un professionnel.
     * La page officielle d'OVHcloud n'en donne pas : le relever dans l'espace client OVHcloud
     * (rubrique Contact / Support). null = ligne non affichée.
     */
    phone: null as string | null,
    url: "https://www.ovhcloud.com/fr/",
  },

  /**
   * Lieu du serveur, si on veut le préciser (ex. « Gravelines, France », visible dans l'espace
   * client OVHcloud, fiche du VPS). null = phrase générique. Si le serveur est hors de l'Union
   * européenne, le préciser ici : c'est une information due aux visiteurs (RGPD).
   */
  datacenter: null as string | null,

  /** Durées de conservation annoncées : elles doivent correspondre à la configuration du serveur. */
  retention: {
    /** Journaux web (Caddy, nginx, Docker) : la CNIL recommande 6 mois à 1 an. */
    serverLogs: "6 mois",
    /** Adresses IP bloquées par fail2ban (paramètre dbpurgeage). */
    fail2ban: "30 jours",
    /** E-mails reçus via le site. */
    emails: "3 ans après le dernier échange",
  },

  /** Service qui transmet les alertes de supervision (ex. « Gmail (Google) »). null = non précisé. */
  monitoringMail: null as string | null,

  /** Licence du code source publié sur GitHub (fichier LICENSE à la racine du dépôt). */
  codeLicense: "MIT",
  repository: "https://github.com/DESCARAVAGE/portfolio_up",

  /** À changer à chaque modification d'une des deux pages. */
  updatedAt: "21 octobre 2026",
} as const;

/** Crédits : œuvres de tiers utilisées sur le site, avec leur licence. */
export const CREDITS = [
  {
    what: "Icônes LinkedIn et GitHub",
    who: "Font Awesome Free (Fonticons, Inc.), via react-icons",
    license: "CC BY 4.0",
    href: "https://fontawesome.com/license/free",
  },
  {
    what: "Fond animé",
    who: "adapté de l'effet FOG de Vanta.js (Teng Bao), d'après The Book of Shaders (Patricio Gonzalez Vivo) et un bruit de valeur de Morgan McGuire",
    license: "MIT",
    href: "https://github.com/tengbao/vanta",
  },
  {
    what: "Polices Geist et Geist Mono",
    who: "Vercel, auto-hébergées",
    license: "SIL Open Font License 1.1",
    href: "https://github.com/vercel/geist-font",
  },
] as const;
