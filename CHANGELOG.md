# Historique des versions

Toutes les évolutions notables du portfolio sont listées ici.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et la numérotation
[Semantic Versioning](https://semver.org/lang/fr/) : `MAJEURE.MINEURE.CORRECTIF`.

La version affichée sur le site (pied de page) et celle des images Docker sont lues dans
`frontend/package.json`.

## [Non publié]

### Modifié

- Fond en brouillard réécrit en WebGL sans bibliothèque : Three.js et Vanta.js sont retirés
  (~150 Ko compressés de moins, ~4 Ko pour le nouveau moteur). Même rendu, mais bien moins
  de mémoire : contexte WebGL minimal, 30 images par seconde, pas de réallocation quand la
  barre d'adresse d'iOS bouge, retour au fond CSS si le système reprend le contexte WebGL.
- Écrans tactiles : l'anneau et le reflet des cartes en verre deviennent une bordure fixe
  (un calque de flou par carte au lieu de trois).

### Nouveau

- Pages « Mentions légales » et « Confidentialité », liées depuis le pied de page et listées
  dans le sitemap. Éditeur en entrepreneur individuel, hébergeur OVH, crédits (Font Awesome
  CC BY 4.0, Vanta.js, Geist), journaux et durées de conservation, droits RGPD.
  Données dans `frontend/app/content/legal.ts`. Un test e2e bloque la CI tant qu'un champ
  « [À COMPLÉTER » est publié.
- Pages légales : sommaire (rubrique en cours surlignée), bouton « Haut de page », et
  « Retour au portfolio » qui revient à l'endroit quitté (ex. `/#contact`, même position)
  au lieu de recharger l'accueil en haut de page.
- Licence MIT pour le code source (fichier `LICENSE`) ; les contenus restent réservés.
- Le CV n'est plus dans le dépôt ni dans l'image Docker publique : il est monté sur le
  serveur en lecture seule. Les tests backend utilisent un PDF factice.
- Journaux Docker limités (10 Mo × 5 fichiers par service).
- Fond adapté à l'appareil : 3D complète sur ordinateur, allégée sur écran tactile.
  Dans les navigateurs intégrés aux applications (Instagram, Facebook, TikTok…), avec
  l'économie de données ou peu de mémoire, la 3D n'est pas lancée d'office : un bouton
  « Activer le fond 3D » la propose, et le choix est retenu.
- Mesure en direct : si l'appareil peine, la qualité du brouillard baisse toute seule.
- Bouton LinkedIn rond, logo seul (icône de react-icons ; orange dans la barre, contour dans le pied de page),
  au centre de la barre de navigation et dans le pied de page. Sur ordinateur,
  les liens des sections l'entourent ; sur téléphone, le bouton « Menu » devient une icône
  ronde pour que la barre reste symétrique. Le profil LinkedIn est aussi déclaré aux moteurs
  de recherche (JSON-LD `sameAs`).
- Bouton GitHub à côté de LinkedIn (encre pleine dans la barre, contour dans le pied de page) :
  les deux profils sont accessibles sans défiler. Composant commun `SocialButton`.

### Corrigé

- Mémoire réduite pour limiter les rechargements en boucle observés sur iPhone (à confirmer sur l'appareil).
- Contraste des numéros d'étapes des projets en thème clair (3,9:1 → 6:1).
- Contraste du texte qui s'allume au défilement (« À propos ») avant d'être atteint :
  opacité de départ 0,35 → 0,5 (2,3:1 → 3,5:1). Lighthouse accessibilité revient à 100.

- Barre de navigation : le trait orange et le compteur passent bien sur « Contact » en bas
  de page, même sur grand écran.
- « Retour au portfolio » ne restait pas bloqué sur la page légale après un clic sur un
  lien de la barre (#contact) : l'adresse et la position quittées sont mémorisées, puis
  rétablies sans recharger la page.
- Bouton « Haut de page » visible aussi sur les pages courtes affichées sur grand écran.
- Mentions légales en version « particulier » (site non professionnel, LCEN art. 1-1 II) tant
  que l'activité n'est pas déclarée ; bascule en version professionnelle (EI, SIREN, adresse,
  téléphone) par `LEGAL.status` dans `frontend/app/content/legal.ts`.
<<<<<<< Updated upstream
- Images Docker construites sur chaque PR (sans publication) : un Dockerfile cassé est vu avant le merge.
- Avertissements SonarCloud de la PR 56 (props en lecture seule, `.at(-1)`, attente sans délai fixe).
=======
>>>>>>> Stashed changes

## [2.0.0] — 2026-10-09

Refonte complète du frontend. Le backend, la base de données et l'infrastructure restent en place.

### Nouveau

- Frontend réécrit avec **Next.js 16** (App Router, Turbopack), React 19, TypeScript et Tailwind CSS v4.
- Page unique : fond en brouillard 3D interactif (Vanta.js + Three.js, chargé au premier geste),
  cartes en verre, thème clair / sombre, animations au défilement qui respectent le mouvement réduit.
- Contenu centralisé dans `frontend/app/content/profile.ts`.
- Référencement : métadonnées Open Graph, image de partage générée, JSON-LD, `robots.txt`, `sitemap.xml`.
- Tests de bout en bout Playwright + axe-core (WCAG 2.2 AA) sur ordinateur et mobile,
  dont le téléchargement du CV et le contact par e-mail.
- Lighthouse CI : accessibilité et SEO à 100, performance ≥ 85.
- Version du site affichée dans le pied de page.
- Images Docker taguées par version (`2.0.0`, `2.0`, `2`) et par commit, en plus de `latest`.

### Modifié

- Le conteneur frontend sert le site avec le serveur Node de Next.js (sortie `standalone`)
  au lieu de nginx, toujours sur le port 8080 derrière la passerelle.
- Le CV reste servi par le backend (`/api/cv/download`).
- CI frontend : lint, format, build, tests e2e et Lighthouse avant la publication de l'image.

### Supprimé

- Ancien frontend React + Vite (MUI, HeroUI, Sass, Vitest).

### Redirections

- `/home` → `/` et `/xp-details/:id` → `/#experience` (redirections permanentes 308),
  pour les liens de la v1 déjà partagés.

## [1.0.0]

Première version en production : frontend React + Vite servi par nginx, API Express + TypeORM,
PostgreSQL, le tout en conteneurs Docker sur un VPS OVH derrière Caddy.

[2.0.0]: https://github.com/DESCARAVAGE/portfolio_up/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/DESCARAVAGE/portfolio_up/releases/tag/v1.0.0
