/**
 * Tout le contenu du portfolio (source : CV d'octobre 2026).
 * C'est le seul fichier à modifier : les composants n'ont aucun texte en dur.
 * Ajoute ou retire des entrées dans les listes, la mise en page suit.
 *
 * Images : rangées dans app/assets/images et IMPORTÉES ci-dessous (pas dans /public).
 * Next leur donne un nom unique (cache navigateur permanent), connaît leurs dimensions
 * et génère le flou de chargement. Une image manquante fait échouer le build.
 * Pour en ajouter une : dépose-la dans app/assets/images, importe-la ici, utilise la variable.
 * Restent dans /public : le CV (adresse fixe) et les vidéos (non gérées par next/image).
 */

import type { StaticImageData } from "next/image";
import logoEnedis from "@/app/assets/images/logos/enedis.webp";
import ecransReemployes from "@/app/assets/images/enedis/ecrans-reemployes.webp";
import logoSplitScreen from "@/app/assets/images/logos/split-screen.webp";
import splitScreenAdmin from "@/app/assets/images/projets/split-screen-admin.webp";
import agentiquePoster from "@/app/assets/images/projets/agentique-poster.webp";
import ebookPhotographe from "@/app/assets/images/projets/ebook-photographe.webp";
import cvAvant from "@/app/assets/images/projets/cv-en-ligne-avant.webp";
import cvApres from "@/app/assets/images/projets/cv-en-ligne-apres.webp";
import threeProject from "@/app/assets/images/projets/three-project.webp";
import nextjsDashboard from "@/app/assets/images/projets/nextjs-dashboard.webp";
import greenStep from "@/app/assets/images/projets/green-step.webp";
import photoDaniel from "@/app/assets/images/daniel-escaravage.webp";
import logoSkolae from "@/app/assets/images/logos/skolae-cefim.webp";
import logoWildCodeSchool from "@/app/assets/images/logos/wild-code-school.webp";

export type SurfaceVariant = "glass" | "solid" | "accent";

/** Une image importée depuis app/assets/images. */
export type Img = { src: StaticImageData; alt: string };

export const PROFILE = {
  firstName: "Daniel",
  /** Nom affiché dans le header (lien vers le haut de page). */
  brand: "Dany SK",
  fullName: "Daniel Escaravage",
  role: "Développeur Frontend React / TypeScript",
  email: "danysk.epro@gmail.com",
  /** Servi par le backend (dernier CV enregistré en base), via la passerelle nginx. */
  cv: "/api/cv/download",
  /** Nom du fichier quand le visiteur le télécharge (plutôt qu'un anonyme « cv.pdf »). */
  cvFileName: "Daniel-Escaravage-CV-Developpeur-Frontend.pdf",
  /**
   * Adresse publique du site : sert aux liens de partage (Open Graph), au sitemap
   * et à l'URL canonique. À définir dans .env : NEXT_PUBLIC_SITE_URL=https://ton-domaine.fr
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  year: "2026",
  /** Ajouter LinkedIn ici : { label: "LinkedIn", href: "https://www.linkedin.com/in/…" } */
  socials: [{ label: "GitHub", href: "https://github.com/descaravage" }] as { label: string; href: string }[],
} as const;

/**
 * Sections dans l'ordre : numéros des sections, compteur du header ET navigation.
 * `nav` = libellé dans la barre de navigation (absent = pas de lien).
 * `title` = titre de la section (le h2), à côté du petit libellé numéroté.
 * La nav est générée depuis cette liste : impossible d'avoir un lien mort.
 */
export const SECTIONS = [
  { id: "top", label: "accueil" },
  { id: "en-bref", label: "en bref", title: "En bref" },
  { id: "experience", label: "expérience", nav: "Expérience", title: "Un projet porté de bout en bout." },
  { id: "projets", label: "projets", nav: "Projets", title: "Ce que je construis." },
  { id: "competences", label: "compétences", nav: "Compétences", title: "Ce que je maîtrise." },
  { id: "approche", label: "approche", nav: "Approche", title: "Comment je travaille." },
  { id: "vision", label: "vision", nav: "Vision", title: "Ce que je cherche." },
  { id: "formation", label: "formation", nav: "Formation", title: "Du Bac+2 au Bac+5, en alternance." },
  { id: "contact", label: "contact", nav: "Contact", title: "on en parle ?" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const NAV: { label: string; target: SectionId }[] = SECTIONS.flatMap((s) =>
  "nav" in s ? [{ label: s.nav, target: s.id }] : [],
);

export const HERO = {
  /** Ligne au-dessus du titre : qui et quoi, lisible en 2 secondes. */
  eyebrow: "Daniel Escaravage — Développeur Frontend React / TypeScript",
  /** Chaque entrée = une ligne animée. `accent` colore la ligne. */
  lines: [
    { text: "partir du besoin," },
    { text: "livrer une interface" },
    { text: "résiliente et maintenable.", accent: true },
  ],
  intro:
    "Je conçois des interfaces React / TypeScript pour les personnes qui les utilisent, et pour celles qui les maintiendront après moi.",
  availability: "Disponible immédiatement",
  location: "Tours · ouvert à la mobilité",
  ctaPrimary: { label: "Voir mon expérience", target: "experience" as SectionId },
  ctaSecondary: { label: "Télécharger mon CV" },
  hint: "faites défiler ↓",
};

/** Chiffres clés, juste sous le hero : la preuve avant le discours. */
export const HIGHLIGHTS: { value: string; label: string; variant: SurfaceVariant }[] = [
  {
    value: "Frontend",
    label: "seul développeur frontend d'un réseau social régional, jusqu'à la mise en production",
    variant: "solid",
  },
  {
    value: "400+",
    label: "écrans valorisés sur la DR Centre-Val de Loire, pour un investissement d'environ 1 M€",
    variant: "glass",
  },
  { value: "Bac+5", label: "titre RNCP 7, obtenu en alternance", variant: "glass" },
  { value: "~10 min", label: "pour générer un site simple avec mon outil IA", variant: "accent" },
];

export type Experience = {
  company: string;
  role: string;
  context: string;
  period: string;
  place: string;
  summary: string;
  logo?: Img;
  /** Visuel affiché en entier avec une légende (proportions lues dans l'image). */
  media?: Img & { caption: string };
  /** Étude de cas racontée en chapitres (contexte → pivot → réalisation → leçon). */
  chapters?: { label: string; text: string; highlight?: boolean }[];
  bullets: string[];
  stack: string[];
  variant: SurfaceVariant;
  /** Mise en avant en grand (étude de cas). */
  featured?: boolean;
};

export const EXPERIENCES: Experience[] = [
  {
    company: "Enedis",
    logo: { src: logoEnedis, alt: "Enedis" },
    media: {
      src: ecransReemployes,
      alt: "Écran interactif sur pied, vu de dos avec sa connectique",
      caption: "Les écrans interactifs réemployés comme canal de diffusion.",
    },
    role: "Développeur Frontend",
    context: "Alternance · réseau social interne régional",
    period: "sept. 2023 – oct. 2025",
    place: "Tours",
    summary: "Un réseau social d'entreprise pour toute une région, et un pivot anticipé avant qu'il ne soit trop tard.",
    chapters: [
      {
        label: "Le contexte",
        text: "Enedis Centre-Val de Loire voulait remplacer Steeples, un réseau social d'entreprise externe, par une plateforme interne destinée à toute la région.",
      },
      {
        label: "Le pivot",
        highlight: true,
        text: "En réunion, l'arrivée de Viva Engage (Microsoft) se dessinait. Trois à quatre mois avant l'annonce officielle, avec l'Enedis Lab, nous avons élargi la conception vers un cas d'usage que Viva Engage ne couvrirait pas : la diffusion d'informations sur les écrans de la région.",
      },
      {
        label: "Ce que j'ai construit",
        text: "Le frontend complet, de la maquette à la préparation de la mise en production, au sein d'une équipe Agile.",
      },
      {
        label: "Ce que j'en retiens",
        text: "En première année d'alternance, sans expérience de la gestion terrain, j'ai porté un projet : j'y ai compris les enjeux d'un porteur de projet, et ce que veut dire en être responsable.",
      },
    ],
    bullets: [
      "Réemploi de plus de 400 écrans interactifs inutilisés comme canal de diffusion de la plateforme.",
      "Préparation de la mise en production avec Docker.",
      "Tests unitaires et end-to-end (Jest, Playwright, Docker) sur les parcours principaux, exécutés avant chaque livraison.",
      "Correction d'anomalies à partir des retours des équipes métiers, sprint après sprint.",
      "Démonstrations aux équipes métiers et formation de l'équipe pour la suite du projet.",
    ],
    stack: ["React", "TypeScript", "Vite", "Jest", "Playwright", "Docker"],
    variant: "glass",
    featured: true,
  },
  {
    company: "Split Screen",
    logo: { src: logoSplitScreen, alt: "Split Screen" },
    media: {
      src: splitScreenAdmin,
      alt: "Back-office de Split Screen : la liste des événements, avec boutons Ajouter, Modifier et Supprimer",
      caption:
        "Le back-office : l'association gère elle-même événements, actus, membres et partenaires (données de test).",
    },
    role: "Développeur Full-Stack",
    context: "Mission client · site vitrine",
    period: "mai 2022 – août 2022",
    place: "Orléans",
    summary: "Site vitrine d'une association réalisé en 4 mois, de la conception au déploiement.",
    bullets: ["En lien régulier avec le client, puis documenté et transmis."],
    stack: ["PHP", "Symfony", "Twig", "Bootstrap"],
    variant: "solid",
  },
];

export type Project = {
  title: string;
  /** Pourquoi ce projet : 1 à 2 phrases. */
  summary: string;
  /** Points clés affichés en liste sous le résumé (optionnel). */
  highlights?: string[];
  role: string;
  period: string;
  stack: string[];
  /**
   * Visuel du projet :
   * - image : importée depuis app/assets/images (sans `src`, un emplacement vide s'affiche) ;
   * - vidéo : fichiers dans /public/videos (chemins en texte), image d'aperçu importée ;
   * - compare : avant / après.
   */
  media:
    | { type: "image"; src?: StaticImageData; alt: string }
    | {
        type: "video";
        /** MP4 de secours, dans /public/videos. */
        src: string;
        /** Version WebM, lue en priorité. */
        webm?: string;
        alt: string;
        poster?: StaticImageData;
        /** Proportions largeur / hauteur de la vidéo : affichée en entier, sans être rognée. */
        ratio?: number;
        /**
         * Ce que montre la vidéo, étape par étape, affiché sous elle : alternative
         * textuelle d'une vidéo sans son (WCAG 1.2.1), utile aussi au lecteur pressé.
         */
        steps?: string[];
      }
    | { type: "compare"; before: Img; after: Img };
  links: { label: string; href: string }[];
  variant: SurfaceVariant;
  /** Mis en avant en grand, en tête de section. */
  featured?: boolean;
  /** Projet secondaire : petite carte compacte, en bas de la section. */
  minor?: boolean;
};

/** `featured` = en grand ; `minor` = carte compacte en bas ; sinon grille. `links` peut être vide. */
export const PROJECTS: Project[] = [
  {
    title: "Système agentique de génération de sites web",
    summary:
      "Des agents LLM enchaînés, avec une validation humaine à chaque étape. Prochaine étape : couvrir tout le cycle produit, de la conception au SEO, à la sécurité, aux tests et à la conformité légale (RGPD, CGU, CGV, mentions légales).",
    role: "Projet indépendant · avec des associés",
    period: "mai 2026 – aujourd'hui",
    stack: ["TypeScript", "Python", "Claude Code", "Cursor", "Shell"],
    media: {
      type: "video",
      src: "/videos/agentique-demo.mp4",
      webm: "/videos/agentique-demo.webm",
      poster: agentiquePoster,
      alt: "Démonstration : un brief est saisi, les agents s'enchaînent dans le workflow, puis le site d'un club de boxe généré s'affiche.",
      ratio: 1280 / 594,
      steps: [
        "Le brief d'un club de boxe est saisi.",
        "Les agents s'enchaînent dans le workflow, chaque étape validée par un humain.",
        "Le site généré s'affiche.",
      ],
    },
    links: [],
    variant: "glass",
    featured: true,
  },
  {
    title: "Ebook — site vitrine de photographe",
    summary: "Site vitrine pour un photographe, déployé sur Vercel avec Supabase.",
    role: "Projet freelance",
    period: "2026",
    stack: ["Next.js", "Vercel", "Supabase"],
    media: { type: "image", src: ebookPhotographe, alt: "Page d'accueil du site Aesteria — Photographe" },
    links: [{ label: "Visiter le site", href: "https://book-online-dev.vercel.app/" }],
    variant: "glass",
  },
  {
    title: "Refonte de mon CV en ligne",
    summary:
      "Refonte UI/UX de mon CV en ligne, auto-hébergé sur mon serveur Linux. Fond WebGL interactif (shader Vanta patché), cartes en verre qui réfractent le décor, thème synchronisé avec le système, qualité suivie avec SonarQube.",
    role: "Projet personnel",
    period: "2026",
    stack: ["Next.js", "Three.js", "GLSL", "Motion", "Docker", "Caddy"],
    media: {
      type: "compare",
      before: { src: cvAvant, alt: "Ancienne version du CV en ligne" },
      after: { src: cvApres, alt: "Nouvelle version : le portfolio actuel" },
    },
    // Pointe vers le profil tant que le dépôt du portfolio n'est pas public : remplacer par l'URL du dépôt
    links: [{ label: "Mon GitHub", href: "https://github.com/descaravage" }],
    variant: "solid",
  },
  {
    title: "Premier projet 3D",
    summary: "Mes premiers pas en 3D : scène, caméra et animation écrites à la main avec Three.js, dans Next.js.",
    role: "Apprentissage",
    period: "2026",
    stack: ["Three.js", "Next.js", "TypeScript"],
    media: {
      type: "image",
      src: threeProject,
      alt: "Sphère en fil de fer au centre d'une grille 3D à 360°, avec la barre de choix des formes en bas",
    },
    links: [{ label: "Code", href: "https://github.com/DESCARAVAGE/Three-project" }],
    variant: "accent",
    minor: true,
  },
  {
    title: "Next.js Dashboard",
    summary:
      "Le cours officiel Next.js, suivi de bout en bout pour solidifier l'optimisation côté navigateur et mieux visualiser ce qui revient au serveur ou au navigateur.",
    role: "Apprentissage · cours Next.js",
    period: "2026",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    media: {
      type: "image",
      src: nextjsDashboard,
      alt: "Tableau de bord Acme : indicateurs de factures, graphique des revenus et dernières factures",
    },
    links: [{ label: "Code", href: "https://github.com/DESCARAVAGE/nextjs-dashboard" }],
    variant: "glass",
    minor: true,
  },
  {
    title: "Green Step",
    summary:
      "Application de suivi d'empreinte carbone, réalisée à 7 en formation. Mon périmètre : les dépenses carbone, de l'API GraphQL à l'interface, et la CI des tests backend.",
    role: "Projet d'équipe · Wild Code School",
    period: "2024",
    stack: ["Next.js", "GraphQL", "TypeORM", "Playwright", "Docker"],
    media: {
      type: "image",
      src: greenStep,
      alt: "Illustration de Green Step : un smartphone avec le symbole du recyclage, entouré de feuilles",
    },
    links: [{ label: "Code", href: "https://github.com/WildCodeSchool/2023-09-wns-blanc-green-step" }],
    variant: "solid",
    minor: true,
  },
];

/** Compétences regroupées par domaine (comme sur le CV). `wide` = 2 colonnes. */
export const SKILLS: { title: string; text: string; tools: string[]; variant: SurfaceVariant; wide?: boolean }[] = [
  {
    title: "Frontend",
    text: "React et TypeScript au quotidien depuis 2023, Next.js pour mes projets.",
    tools: ["TypeScript", "JavaScript", "React", "Next.js", "Vite", "Tailwind CSS", "HTML5", "CSS3"],
    variant: "glass",
    wide: true,
  },
  {
    title: "Tests & qualité",
    text: "Du test unitaire au parcours complet, plus l'analyse statique.",
    tools: ["Jest", "Vitest", "Playwright", "SonarQube", "Design patterns"],
    variant: "solid",
  },
  {
    title: "IA",
    text: "Des workflows d'agents où l'humain garde la main.",
    tools: ["Workflows agentiques", "RAG", "Itération de prompts", "Human-in-the-loop", "Claude Code", "Opencode"],
    variant: "accent",
  },
  {
    title: "Environnement",
    text: "Je déploie et sécurise mes propres serveurs.",
    tools: ["Linux", "Shell", "VPS", "iptables", "Git", "GitHub Actions", "Docker", "Nginx", "Caddy"],
    variant: "glass",
    wide: true,
  },
  {
    title: "Backend",
    text: "Formation fullstack : je comprends ce qu'il y a derrière l'API.",
    tools: ["Node.js", "Express", "API REST", "GraphQL (Apollo)", "Prisma", "PostgreSQL"],
    variant: "glass",
    wide: true,
  },
  {
    title: "Méthodes",
    text: "Agile au quotidien.",
    tools: ["Agile / Scrum", "Maquettes Figma", "Merise", "DevSecOps"],
    variant: "solid",
  },
];

export const APPROACH = {
  /** Les mots s'allument un par un au scroll. */
  story:
    "Développeur fullstack de formation, je m'intéresse autant à ce que l'on construit qu'à la façon de le bâtir. Mon mémoire de fin d'études portait sur l'approche systémique : regarder un projet dans son ensemble, avec ses utilisateurs, ses équipes, ses outils et leurs interactions.",
  pillars: [
    { title: "Écouter avant de coder", text: "Les retours des équipes métiers orientent chaque sprint." },
    {
      title: "Voir le système entier",
      text: "Un écran n'existe pas seul : utilisateurs, outils, équipes, maintenance.",
    },
    { title: "Rendre la main", text: "Tester, documenter, former : le projet doit vivre sans moi." },
  ],
  photo: { src: photoDaniel, alt: "Daniel Escaravage" } satisfies Img,
  facts: [
    { label: "Dans le code depuis", value: "2022" },
    { label: "Langues", value: "Français, anglais B1" },
    { label: "Permis", value: "B" },
  ],
};

/** Section « vision » : ce que je cherche, pourquoi le code, ma conviction sur l'IA. */
export const VISION = {
  seeking: [
    { label: "L'équipe", text: "Une équipe dont le cœur de métier est le développement web : ESN ou grand groupe." },
    { label: "Le rôle", text: "Un poste où le frontend React / TypeScript est au cœur de mon travail." },
    { label: "La suite", text: "Évoluer vers un poste plus proche du produit et de la coordination." },
  ],
  why: {
    label: "Pourquoi le code",
    text: "Après la restauration, j'ai choisi le développement pour exploiter ma créativité et, surtout, pouvoir innover.",
  },
  conviction: {
    label: "Ma conviction sur l'IA",
    text: "Pour moi, l'approche agentique est la plus efficace, en productivité comme en visibilité sur le travail accompli. C'est la voie que j'explore, avec un humain qui valide chaque étape.",
    link: { label: "Voir le projet", target: "projets" as SectionId },
  },
};

export const EDUCATION: {
  period: string;
  title: string;
  place: string;
  text: string;
  kind: "formation" | "avant";
  logo?: Img;
}[] = [
  {
    period: "oct. 2024 – oct. 2025",
    title: "Manager de solutions digitales et data",
    place: "Skolæ / CEFIM · en alternance chez Enedis",
    logo: { src: logoSkolae, alt: "Skolæ" },
    text: "RNCP 7, Bac+5.",
    kind: "formation",
  },
  {
    period: "sept. 2023 – sept. 2024",
    title: "Concepteur développeur d'applications",
    place: "Wild Code School · en alternance chez Enedis",
    logo: { src: logoWildCodeSchool, alt: "Wild Code School" },
    text: "RNCP 6, Bac+3/4.",
    kind: "formation",
  },
  {
    period: "févr. 2022 – août 2022",
    title: "Développeur web et web mobile",
    place: "Wild Code School · Orléans",
    logo: { src: logoWildCodeSchool, alt: "Wild Code School" },
    text: "RNCP 5, Bac+2.",
    kind: "formation",
  },
  {
    period: "2019 – 2021",
    title: "Responsable de rang",
    place: "Courtepaille · Olivet",
    text: "Avant la tech : le service client, le rythme et le travail en équipe.",
    kind: "avant",
  },
];

export const CERTIFICATIONS = {
  title: "Certifications IA",
  items: [
    { issuer: "Anthropic", name: "AI Fluency for Builders" },
    { issuer: "Anthropic", name: "Building Effective Human-Agent Teams" },
    { issuer: "Google", name: "AI for App Building" },
  ],
};

export const CONTACT = {
  headline: "on en parle ?",
  pitch: "Un poste, un projet ou une question technique : écrivez-moi, je réponds rapidement.",
  /** Infos pratiques visibles d'un coup d'œil (plutôt qu'une FAQ à déplier). */
  practical: [{ label: "Disponibilité", value: "Immédiate" }],
};
