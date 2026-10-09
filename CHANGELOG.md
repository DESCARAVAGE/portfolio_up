# Historique des versions

Toutes les évolutions notables du portfolio sont listées ici.
Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et la numérotation
[Semantic Versioning](https://semver.org/lang/fr/) : `MAJEURE.MINEURE.CORRECTIF`.

La version affichée sur le site (pied de page) et celle des images Docker sont lues dans
`frontend/package.json`.

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