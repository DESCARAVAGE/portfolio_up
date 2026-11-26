# Historique des versions

Toutes les évolutions notables du portfolio sont listées ici.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et la numérotation
[Semantic Versioning](https://semver.org/lang/fr/) : `MAJEURE.MINEURE.CORRECTIF`.

Le plus récent est en haut : les versions vont de la plus récente à la plus ancienne, et
les changements pas encore publiés sont en tête, groupés par date (date d'entrée dans le
dépôt). À la publication d'une version, ils passent sous son numéro.

La version affichée sur le site (pied de page) et celle des images Docker sont lues dans
`frontend/package.json`.

## [Non publié]

### 26 novembre 2026

#### Sécurité

- Passerelle nginx 1.28.2 → 1.30.8 (stable) : corrige les dix failles « NGINX2Root » du
  18 novembre 2026 (dont CVE-2026-123007, exécution de code à distance par HTTP/2) et
  CVE-2026-132779 (23 novembre). La branche 1.28 n'est plus corrigée par nginx.
- Next.js 16.3.8 → 16.4.5 : corrige deux failles critiques (exécution de code à distance)
  et un déni de service, toutes présentes jusqu'à la 16.4.0.
- Politique de sécurité du contenu (CSP) et en-têtes de sécurité sur toutes les pages :
  tout vient du site lui-même, aucun affichage dans un cadre, aucun plugin.
- Backend : en-têtes de sécurité par helmet, `X-Powered-By` retiré, réponse 404 sans détail
  interne, requêtes SQL journalisées en développement seulement ; dépendances corrigées
  (body-parser, qs).
- CI : workflows en lecture seule, actions épinglées par SHA, audit des dépendances de
  production (une faille élevée bloque), Dependabot chaque semaine. Le contrôle « aucun CV
  dans l'image » tourne aussi sur `main`, sur l'image publiée.
- Images Docker : une version publiée ne change plus (tags `2.0.0`, `2.0`, `2` posés une seule
  fois) ; le backend publie aussi un tag `sha-…`.

#### Nouveau

- `robots.txt` sur le modèle de celui de Google : site indexable (sauf `/api/health`),
  aperçus de liens et moteurs de réponse IA admis (ChatGPT, Claude, Perplexity), robots
  d'entraînement des modèles refusés (GPTBot, ClaudeBot, Google-Extended, CCBot…). Le CV
  reste lisible par les robots mais sort des résultats : l'API répond avec
  `X-Robots-Tag: noindex, nofollow`.
- Page « Chronologie du projet » (`/gantt`, `/en/gantt`, et `/Gantt`) : diagramme de Gantt
  des chantiers tiré de l'historique git, puis la chronologie en tableau. Rendue au build,
  sans JavaScript ; lien dans le pied de page.

#### Modifié

- Curseur en forme de main sur tous les boutons (thème, menu, copie de l'adresse, vidéo…),
  que Tailwind v4 laisse sinon en curseur par défaut.

#### Corrigé

- Accessibilité (Lighthouse 97 → 100 sur `/`) : sur téléphone, les liens « Autres pages » du
  pied de page passent sur deux lignes en français et faisaient 16 px de haut, trop serrés
  (WCAG 2.5.8, taille des cibles). Ils font maintenant 24 px ; un test e2e le vérifie.
- SonarCloud, duplication sur le nouveau code (PR des MAJ 18–19) : les données de la
  chronologie passent de `timeline.ts` à `timeline.json`. Les 19 chantiers de même forme
  étaient comptés comme du code copié ; `timeline.ts` les type et les contrôle au build.
- Version anglaise, sur téléphone : le bouton « Back to top » ne passe plus sous le bandeau
  « Turn on the 3D background » (le style visait le libellé français du bandeau).
- Page Confidentialité : mention du stockage de session utilisé par « Retour au portfolio ».
- Journaux nginx : rotation sur 180 jours au plus (`ops/logrotate-portfolio-nginx`), comme
  l'annonce la page Confidentialité.
- Nettoyage : `backend/dist`, le second lockfile du backend, le `cv.pdf` vide et le
  `package-lock.json` vide de la racine, et les SVG du gabarit Next ne sont plus suivis.

### 8 novembre 2026

#### Nouveau

- Version anglaise du site sous `/en` (accueil, `/en/legal-notice`, `/en/privacy`) ; le
  site français ne change pas d'adresse. Bouton au drapeau de la langue affichée
  (France / Royaume-Uni, infobulle « Français » / « English ») à droite de la maison,
  qui mène à la même page dans l'autre langue, sans recharger la page (une seule mise en
  page racine pour les deux langues). `<html lang>`, canonique, hreflang et sitemap par
  langue. Traduction vérifiée par TypeScript (même forme que le français) et par un test
  e2e qui détecte tout texte français resté sur la version anglaise.

#### Modifié

- Bouton de thème : l'icône et l'infobulle montrent le thème affiché (soleil, « Thème
  clair » ; lune, « Thème sombre ») ; le libellé pour lecteurs d'écran dit ce que fait le clic.

### 28 octobre 2026

#### Nouveau

- Page 404 « Vous vous êtes perdu ? » pour toute adresse inconnue (code HTTP 404, non
  indexée), avec un bouton de retour au portfolio et des raccourcis vers les projets et le contact.
- Changement de thème progressif : le nouveau thème s'étend en cercle depuis le bouton, avec
  un front flou, pendant que le brouillard lance une onde de choc depuis le même point.
  Instantané avec « réduire les animations » ou sans l'API View Transitions.

#### Corrigé

- Mentions légales en version « particulier » (site non professionnel, LCEN art. 1-1 II) tant
  que l'activité n'est pas déclarée ; bascule en version professionnelle (EI, SIREN, adresse,
  téléphone) par `LEGAL.status` dans `frontend/app/content/legal.ts`.
- Images Docker construites sur chaque PR (sans publication) : un Dockerfile cassé est vu avant le merge.
- Avertissements SonarCloud de la PR 56 (props en lecture seule, `.at(-1)`, attente sans délai fixe).

### 21 octobre 2026

#### Nouveau

- Pages « Mentions légales » et « Confidentialité », liées depuis le pied de page et listées
  dans le sitemap. Éditeur en entrepreneur individuel, hébergeur OVH, crédits (Font Awesome
  CC BY 4.0, Vanta.js, Geist), journaux et durées de conservation, droits RGPD.
  Données dans `frontend/app/content/legal.ts`. Un test e2e bloque la CI tant qu'un champ
  « [À COMPLÉTER » est publié.
- Pages légales : sommaire (rubrique en cours surlignée), bouton « Haut de page », et
  « Retour au portfolio » qui revient à l'endroit quitté (ex. `/#contact`, même position)
  au lieu de recharger l'accueil en haut de page.
- Licence MIT pour le code source (fichier `LICENSE.md`) ; les contenus restent réservés.
- Le CV n'est plus dans le dépôt ni dans l'image Docker publique : il est monté sur le
  serveur en lecture seule. Les tests backend utilisent un PDF factice.
- Journaux Docker limités (10 Mo × 5 fichiers par service).

#### Corrigé

- Barre de navigation : le trait orange et le compteur passent bien sur « Contact » en bas
  de page, même sur grand écran.
- « Retour au portfolio » ne restait pas bloqué sur la page légale après un clic sur un
  lien de la barre (#contact) : l'adresse et la position quittées sont mémorisées, puis
  rétablies sans recharger la page.
- Bouton « Haut de page » visible aussi sur les pages courtes affichées sur grand écran.

### 12 octobre 2026

#### Nouveau

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

#### Modifié

- Fond en brouillard réécrit en WebGL sans bibliothèque : Three.js et Vanta.js sont retirés
  (~150 Ko compressés de moins, ~4 Ko pour le nouveau moteur). Même rendu, mais bien moins
  de mémoire : contexte WebGL minimal, 30 images par seconde, pas de réallocation quand la
  barre d'adresse d'iOS bouge, retour au fond CSS si le système reprend le contexte WebGL.
- Écrans tactiles : l'anneau et le reflet des cartes en verre deviennent une bordure fixe
  (un calque de flou par carte au lieu de trois).

#### Corrigé

- Mémoire réduite pour limiter les rechargements en boucle observés sur iPhone (à confirmer sur l'appareil).
- Contraste des numéros d'étapes des projets en thème clair (3,9:1 → 6:1).
- Contraste du texte qui s'allume au défilement (« À propos ») avant d'être atteint :
  opacité de départ 0,35 → 0,5 (2,3:1 → 3,5:1). Lighthouse accessibilité revient à 100.

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
