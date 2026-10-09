# Portfolio — Dany SK

[![CI](https://github.com/DESCARAVAGE/Refont/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/DESCARAVAGE/Refont/actions/workflows/ci.yml)

Portfolio de développeur frontend React / TypeScript : une page unique, un fond
en brouillard 3D interactif, des cartes en verre qui réfractent le décor, et un
thème clair / sombre synchronisé avec le système.

## Sommaire

1. [En bref](#en-bref)
2. [Démarrage rapide](#démarrage-rapide)
3. [Scripts](#scripts)
4. [Structure du projet](#structure-du-projet)
5. [Modifier le contenu](#modifier-le-contenu)
6. [Styles et thème](#styles-et-thème)
7. [Le fond 3D](#le-fond-3d)
8. [Qualité : tests, accessibilité, performance](#qualité--tests-accessibilité-performance)
9. [Intégration continue](#intégration-continue)
10. [Mise en production](#mise-en-production)
11. [Conventions](#conventions)

## En bref

|              |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack), React 19, TypeScript            |
| Styles       | Tailwind CSS v4, deux feuilles CSS (`globals.css`, `portfolio.css`) |
| Animations   | Motion (`motion/react`), animations CSS pour le premier écran       |
| Fond 3D      | Vanta.js FOG + Three.js, shader patché (remous et ondes au clic)    |
| Thème        | next-themes (clair / sombre / système)                              |
| Qualité      | ESLint, Prettier, Playwright + axe-core, Lighthouse CI              |
| Gestionnaire | pnpm 10                                                             |
| Hébergement  | serveur Linux, Docker, Caddy                                        |

Mesures sur le build de production (Lighthouse) : performance 86 sur mobile et
100 sur ordinateur, accessibilité, bonnes pratiques et SEO à 100.

## Démarrage rapide

**Prérequis :** Node.js 22 et pnpm 10 (`corepack enable` active la version
déclarée dans `package.json`).

```bash
pnpm install                          # dépendances
pnpm exec playwright install chromium # navigateur des tests (une seule fois)
pnpm dev                              # http://localhost:3000
```

Pour juger les performances ou la fluidité, toujours passer par le build de
production, nettement plus rapide que le mode dev :

```bash
pnpm build && pnpm start
```

### Variables d'environnement

| Variable               | Rôle                                                                                                 | Exemple                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Adresse publique du site : liens de partage (Open Graph), URL canonique, `sitemap.xml`, `robots.txt` | `https://mon-domaine.fr` |

Elle est lue **au moment du build**. En local, sans elle, le site utilise
`http://localhost:3000`.

## Scripts

| Commande            | Ce qu'elle fait                                                      |
| ------------------- | -------------------------------------------------------------------- |
| `pnpm dev`          | Serveur de développement                                             |
| `pnpm build`        | Build de production (vérifie aussi les types, tests compris)         |
| `pnpm start`        | Sert le build de production                                          |
| `pnpm lint`         | ESLint                                                               |
| `pnpm format`       | Met tout le projet au format Prettier                                |
| `pnpm format:check` | Vérifie le format sans rien modifier                                 |
| `pnpm test:e2e`     | Tests de bout en bout (lance lui-même le serveur sur le port 3100)   |
| `pnpm run ci`       | Rejoue toute la CI en local : lint, format, build, tests, Lighthouse |

`pnpm run ci` et non `pnpm ci` : `ci` est une commande réservée par pnpm.
Pour l'étape Lighthouse sans Chrome installé :

```bash
export CHROME_PATH=$(node -e "console.log(require('@playwright/test').chromium.executablePath())")
```

## Structure du projet

```
app/
├── layout.tsx              Coquille HTML : polices, métadonnées, thème, fond 3D
├── page.tsx                Assemblage des sections, dans l'ordre de lecture
├── opengraph-image.tsx     Image d'aperçu générée au build (partage LinkedIn, Slack…)
├── robots.ts, sitemap.ts   /robots.txt et /sitemap.xml
├── icon.svg                Favicon
│
├── content/
│   └── profile.ts          TOUT le contenu du site (textes, projets, images, liens)
│
├── components/
│   ├── portfolio/          Une section de la page par fichier (Hero, Experience, Projects…)
│   ├── ui/
│   │   ├── base/           Briques d'interface : Surface (cartes), Tag, ExternalLink, LogoTile, CopyEmail
│   │   ├── motion/         Effets : Reveal, Parallax, Curtain, Stagger, ScrollWords, ScrollLine, ScrollSlide
│   │   ├── media/          Visuels interactifs : LoopVideo, CompareSlider
│   │   └── scroll/         Indicateurs de défilement : ScrollProgress, ScrollRail
│   ├── seo/                Données structurées (JSON-LD Person)
│   ├── VantaFog.tsx        Fond 3D plein écran
│   └── ThemeToggle.tsx     Bouton clair / sombre
│
├── hooks/                  Logique réutilisable (useVantaFog, useMotionFactor, useActiveSection…)
├── lib/
│   ├── motion.ts           Courbes et variantes d'animation partagées
│   └── vanta/              Brouillard : configuration, shader, interaction, chargement
├── providers/              ThemeProvider (next-themes), MotionProvider (mouvement réduit)
├── styles/
│   ├── globals.css         Base de l'application : Tailwind, couleurs, fond, défilement
│   └── portfolio.css       Styles des composants : brouillard, cartes, rail
├── types/                  Déclarations pour les paquets sans types (Vanta)
└── assets/images/          Images importées (optimisées par next/image)

public/
├── videos/                 Vidéo de démonstration (WebM + MP4)
└── cv.pdf                  CV téléchargeable

tests/e2e/                  Tests Playwright + axe-core
.github/workflows/ci.yml    Intégration continue
```

### Rendu serveur et client

Les sections (`components/portfolio`) sont des **Server Components** : leur HTML
est produit au build, sans JavaScript envoyé pour elles. Seuls les effets et les
éléments interactifs sont des composants client (`"use client"`) : `Hero`,
`SiteHeader`, et les composants de `ui/motion`, `ui/media`, `ui/scroll`,
`Surface`, `CopyEmail`.

## Modifier le contenu

Tout se passe dans **`app/content/profile.ts`**. Aucun composant n'est à toucher pour :

| Changer…                                 | Où dans `profile.ts`                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| Nom, e-mail, CV, réseaux                 | `PROFILE` (ajouter LinkedIn dans `socials`)                                              |
| Sections, ordre, titres, menu            | `SECTIONS` : la navigation et la numérotation en sont générées, aucun lien mort possible |
| Titre et accroche du haut                | `HERO`                                                                                   |
| Chiffres clés                            | `HIGHLIGHTS`                                                                             |
| Expériences                              | `EXPERIENCES` (`featured: true` = étude de cas en grand)                                 |
| Projets                                  | `PROJECTS` (`featured` = projet phare, `minor` = carte compacte en bas)                  |
| Compétences, approche, vision, formation | `SKILLS`, `APPROACH`, `VISION`, `EDUCATION`, `CERTIFICATIONS`                            |

`variant` choisit l'apparence d'une carte : `"glass"` (verre), `"solid"` (pleine)
ou `"accent"` (orange).

### Images

Les images vivent dans `app/assets/images/` et sont **importées** en haut de
`profile.ts` :

```ts
import monProjet from "@/app/assets/images/projets/mon-projet.webp";
// …
media: { type: "image", src: monProjet, alt: "Ce que montre l'image" },
```

Next.js connaît ainsi leurs dimensions (pas de décalage de mise en page), génère
un flou d'attente et les sert avec un cache d'un an. Prévoir des fichiers d'au
moins **deux fois** leur largeur d'affichage pour les écrans Retina (WebP).

### Vidéos

Les vidéos restent dans `public/videos/` (un import ne convient pas à la
lecture en continu) et sont référencées par leur chemin. Fournir une version
**WebM** (VP9) et une **MP4** (H.264) : certains Chromium sous Linux ne lisent
pas le H.264. Rien n'est téléchargé avant le clic sur « Voir la démo ».

## Styles et thème

| Fichier                    | Contient                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/styles/globals.css`   | Tout ce qui vaut pour l'application : import de Tailwind, couleurs clair / sombre, fond et police de la page, défilement, animations d'entrée |
| `app/styles/portfolio.css` | Les styles de composants : brouillard, cartes (verre, pleine, orange), rail de défilement                                                     |

Les couleurs sont des variables CSS qui changent avec la classe `dark` posée par
next-themes. Elles existent aussi en classes Tailwind :

```html
<a class="bg-accent-surface text-accent-ink">…</a>
<!-- au lieu de bg-[var(--accent-surface)] -->
```

| Token                               | Rôle                                           |
| ----------------------------------- | ---------------------------------------------- |
| `--bg` / `bg-page`                  | Fond de page                                   |
| `--ink` / `text-ink`                | Texte principal                                |
| `--mute` / `.text-mute`             | Texte secondaire                               |
| `--line` / `border-line`            | Filets et bordures                             |
| `--accent`                          | Orange décoratif (titres, détails)             |
| `--accent-surface` / `--accent-ink` | Fond orange sous du texte blanc (contraste AA) |

Le fond de page est posé sur `<body>`, jamais sur `<html>` : sinon il passerait
au-dessus du brouillard et le masquerait.

## Le fond 3D

Le brouillard est un décor : il ne doit jamais ralentir l'affichage du contenu.

- **Chargement différé.** Three.js et Vanta (~150 Ko compressés) ne sont importés
  qu'au premier geste du visiteur (souris, toucher, défilement, clavier) ou
  5 s après le chargement. Un dégradé CSS s'affiche en attendant, puis le
  brouillard apparaît en fondu.
- **Pas de brouillard** si l'utilisateur a demandé moins d'animations, active
  l'économie de données, ou si WebGL est indisponible : le dégradé reste.
- **Interaction** : le pointeur remue le brouillard, un clic dans le fond lance
  une onde. Réglages dans `app/lib/vanta/fogConfig.ts` (`FOG_INTERACTION`).
- **Couleurs** : une palette par thème (`FOG_PALETTES`), changée sans recréer la scène.

| Fichier                       | Rôle                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `hooks/useVantaFog.ts`        | Cycle de vie : quand charger, créer, recolorer, détruire |
| `lib/vanta/fogSupport.ts`     | Conditions de lancement et déclenchement différé         |
| `lib/vanta/createFog.ts`      | Seul fichier qui importe Three.js (chargé à la demande)  |
| `lib/vanta/fogShader.ts`      | Patch GLSL du shader de Vanta                            |
| `lib/vanta/fogInteraction.ts` | Remous et ondes, image par image                         |
| `hooks/useFogPointer.ts`      | Relie souris et toucher à l'interaction                  |

## Qualité : tests, accessibilité, performance

```bash
pnpm build
pnpm test:e2e
```

Les tests (`tests/e2e/portfolio.spec.ts`) tournent sur ordinateur et sur mobile
(Pixel 7) et vérifient :

| Thème         | Vérifications                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Contenu       | Le `h1` donne le nom et le poste, chaque section a un `h2`, aucune erreur console                       |
| Navigation    | Chaque lien du menu mène à une section existante, lien d'évitement, liens externes sécurisés            |
| Accessibilité | Aucune violation axe-core (WCAG 2.2 AA), en thème clair et sombre                                       |
| Vidéo         | Rien n'est téléchargé avant le clic, puis la lecture démarre                                            |
| Robustesse    | Mouvement réduit (pas de brouillard), changement de thème sans brouillard, page lisible sans JavaScript |
| SEO           | Open Graph, JSON-LD, URL canonique, `robots.txt`, `sitemap.xml`                                         |

Pour viser un serveur déjà lancé : `BASE_URL=http://localhost:3000 pnpm test:e2e`.

Accessibilité prise en compte dans le code : contrastes AA vérifiés (y compris
sur le fond de secours), titres hiérarchisés, lien d'évitement, focus visible,
`prefers-reduced-motion` respecté par toutes les animations (y compris celles
liées au défilement), vidéo lancée par l'utilisateur avec description textuelle.

## Intégration continue

`.github/workflows/ci.yml` s'exécute à chaque push sur `main` et à chaque pull request :

1. Installation (`pnpm install --frozen-lockfile`)
2. Lint et format (`pnpm lint`, `pnpm format:check`)
3. Build, qui vérifie aussi les types
4. Tests Playwright + axe
5. Lighthouse CI (3 passages) avec des seuils : accessibilité et SEO à 100,
   performance ≥ 85, CLS ≤ 0,05 (configuration dans `lighthouserc.json`)

En cas d'échec, le rapport Playwright est joint à l'exécution (onglet _Actions_).

**Configuration GitHub** : _Settings → Secrets and variables → Actions →
Variables_, créer `SITE_URL` avec l'adresse du site. Le champ `packageManager`
de `package.json` indique à la CI quelle version de pnpm installer.

Rejouer la CI en local : `pnpm run ci`.

## Mise en production

Le site est entièrement statique : `pnpm build` puis `pnpm start` (port 3000).

- Définir `NEXT_PUBLIC_SITE_URL` **avant** le build (dans le Dockerfile : `ARG`
  puis `ENV` avant `pnpm build`).
- `X-Powered-By` est désactivé (`poweredByHeader: false` dans `next.config.ts`).
- En-têtes de sécurité à poser dans le Caddyfile :

```
header {
  Strict-Transport-Security "max-age=31536000; includeSubDomains"
  X-Content-Type-Options "nosniff"
  Referrer-Policy "strict-origin-when-cross-origin"
  -Server
}
```

- Les fichiers de `public/` sont servis sans cache long. Pour les vidéos :
  versionner le nom (`agentique-demo-v1.mp4`) et ajouter un cache d'un an sur
  `/videos/*` dans Caddy.

## Conventions

- **Imports** : toujours l'alias `@/` (= racine du projet), jamais de chemins relatifs.
- **Format** : Prettier (largeur 120, classes Tailwind triées), lancé avant chaque commit.
- **Composants** : Server Component par défaut ; `"use client"` seulement pour
  l'état, les effets ou les événements, isolé dans le plus petit composant possible.
- **Animations** : tout effet lié au défilement passe par `useMotionFactor()`
  pour respecter le mouvement réduit.
- **Contenu** : jamais de texte en dur dans un composant, tout vient de `profile.ts`.
