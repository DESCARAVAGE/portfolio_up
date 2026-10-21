/**
 * Données des pages « Mentions légales » et « Confidentialité ».
 * Comme profile.ts : les pages n'ont aucun texte légal en dur, tout part d'ici.
 *
 * Statut : entrepreneur individuel (micro-entreprise). La loi impose alors une
 * identification complète de l'éditeur (LCEN, loi n° 2004-575, art. 1-1 I).
 *
 * Les valeurs « [À COMPLÉTER …] » DOIVENT être remplacées avant la mise en ligne :
 * un test e2e échoue tant qu'il en reste une sur le site.
 */

/** Les pages légales, dans l'ordre du pied de page (aussi listées dans le sitemap). */
export const LEGAL_PAGES = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
] as const;

export const LEGAL = {
  publisher: {
    name: "Daniel Escaravage",
    status: "entrepreneur individuel (EI)",
    /**
     * Adresse de l'entreprise. Une adresse de domiciliation (société de domiciliation,
     * espace de coworking) évite de publier son domicile.
     */
    address: "Tours",
    /** Obligatoire pour un professionnel. Une ligne dédiée (2e SIM, numéro virtuel) protège le numéro personnel. */
    phone: "[À COMPLÉTER : numéro de téléphone professionnel]",
    email: "danysk.epro@gmail.com",
    siren: "[À COMPLÉTER : numéro SIREN (9 chiffres)]",
    /** Registre où l'entreprise est immatriculée. */
    register: "Registre national des entreprises (RNE)",
    /** N° de TVA intracommunautaire : null si aucun n'a été attribué (la ligne n'est alors pas affichée). */
    vat: null as string | null,
    /** Directeur de la publication : l'éditeur lui-même pour un entrepreneur individuel. */
    publicationDirector: "Daniel Escaravage",
  },

  /** Hébergeur : coordonnées officielles d'OVHcloud (page « Mentions légales » d'ovhcloud.com). */
  host: {
    name: "OVH SAS",
    form: "SAS au capital de 50 000 000 €",
    rcs: "RCS Lille Métropole 424 761 419 00045",
    address: "2 rue Kellermann, 59100 Roubaix, France",
    /**
     * La loi demande le téléphone de l'hébergeur, mais la page officielle d'OVHcloud n'en donne pas.
     * Le relever dans l'espace client OVHcloud (rubrique Contact / Support) : ne pas recopier
     * un numéro trouvé sur un forum.
     */
    phone: "Site Officiel",
    url: "https://www.ovhcloud.com/fr/",
    /** Lieu du centre de données : visible dans l'espace client OVHcloud, fiche du VPS (ex. « Gravelines, France »). */
    datacenter: "[À COMPLÉTER : ville et pays du centre de données du VPS]",
  },

  /** Durées de conservation annoncées : elles doivent correspondre à la configuration du serveur. */
  retention: {
    /** Journaux web (Caddy, nginx, Docker) : la CNIL recommande 6 mois à 1 an. */
    serverLogs: "6 mois",
    /** Adresses IP bloquées par fail2ban (paramètre dbpurgeage). */
    fail2ban: "30 jours",
    /** E-mails reçus via le site. */
    emails: "3 ans après le dernier échange",
  },

  /** Service qui envoie les alertes de supervision du serveur (ex. « Gmail (Google), via SMTP »). */
  monitoringMail: "[À COMPLÉTER : service utilisé pour envoyer les alertes de supervision]",

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
