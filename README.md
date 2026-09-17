# Portfolio — Dany SK

## 🎯 Pourquoi ce projet

Après 3 années de Faculté de sport, je me suis reconverti dans la programmation — d'abord en autodidacte, puis en suivant des formations de professionnalisation pour des clients et en entreprise.

Ce portfolio répond à un manque concret : l'absence de présence en ligne construite et maîtrisée de bout en bout. Plutôt que de passer par une plateforme clé-en-main, j'ai fait le choix de tout gérer moi-même, « à l'ancienne » : provisionnement et configuration d'un VPS OVH, conteneurisation avec Docker, mise en place d'un reverse proxy, sécurisation du serveur, et supervision manuelle des services — sans dashboard automatisé qui fait le travail à ma place.

L'objectif : démontrer une compréhension réelle de la chaîne complète, du code jusqu'à l'infrastructure qui le fait tourner.

## 🔗 Lien du projet

👉 [www.dany-sk-fsp.com](https://www.dany-sk-fsp.com/)

![Aperçu du portfolio](https://github.com/DESCARAVAGE/portfolio_up/raw/main//frontend/public/assets/promo.png "Aperçu du portfolio")

## 🛠️ Technologies

### Backend
- **[Node.js](https://nodejs.org/) + [Express](https://expressjs.com/fr/)** — Serveur HTTP léger et flexible, avec un écosystème mature pour construire une API REST rapidement tout en gardant le contrôle sur chaque middleware.
- **[TypeScript](https://www.typescriptlang.org/)** — Typage statique pour fiabiliser le code et limiter les erreurs à l'exécution, particulièrement utile en solo sur un projet qui grandit.
- **[TypeORM](https://typeorm.io/)** — ORM pour gérer les entités et les migrations PostgreSQL sans écrire du SQL brut à chaque requête, tout en gardant la possibilité de descendre au SQL quand c'est nécessaire.
- **[PostgreSQL](https://www.postgresql.org/)** — Base de données relationnelle robuste et éprouvée, adaptée à un modèle de données structuré.
- **[Jest](https://jestjs.io/) + [Supertest](https://github.com/forwardemail/supertest)** — Tests unitaires et d'intégration de l'API, exécutés en CI contre une vraie instance PostgreSQL de test (pas de mock de la base).

### Frontend
- **[React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)** — Bibliothèque UI composant par composant, avec typage statique pour fiabiliser les props et les états.
- **[Vite](https://vitejs.dev/)** — Serveur de développement et bundler rapide, avec un temps de démarrage et de rebuild quasi instantané comparé aux outils plus anciens.
- **[React Router](https://reactrouter.com/)** — Navigation côté client entre les différentes sections du portfolio.
- **[MUI](https://mui.com/) + [HeroUI](https://www.heroui.com/)** — Composants d'interface prêts à l'emploi et accessibles, pour aller plus vite sans sacrifier la cohérence visuelle.
- **[Emotion](https://emotion.sh/)** — Styling CSS-in-JS utilisé par MUI, pour des styles scoppés par composant.
- **[Sass](https://sass-lang.com/)** — Pour les styles personnalisés au-delà de ce que couvrent les librairies de composants.
- **[Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) + [Testing Library](https://testing-library.com/)** — Tests unitaires et d'intégration front, exécutés automatiquement en CI avant chaque build.

### Infrastructure & déploiement
- **[Docker](https://www.docker.com/) / Docker Compose** — Conteneurisation de chaque service (frontend, backend, base de données, proxy) pour des environnements reproductibles et un déploiement cohérent entre local et production.
- **[Nginx](https://nginx.org/)** — Reverse proxy interne devant le frontend.
- **[Caddy](https://caddyserver.com/)** — Proxy en périphérie avec gestion automatique du HTTPS (certificats TLS renouvelés sans intervention manuelle).
- **[Fail2ban](https://github.com/fail2ban/fail2ban)** — Protection du serveur contre les tentatives de connexion SSH par force brute.
- **VPS [OVHcloud](https://www.ovhcloud.com/fr/)** — Hébergement géré manuellement : configuration système, sécurité et supervision faites à la main plutôt que via une plateforme managée.

### CI/CD

- **[GitHub Actions](https://docs.github.com/fr/actions)** — Deux pipelines indépendants, un pour le frontend et un pour le backend, déclenchés uniquement quand le dossier concerné change (pas de build inutile si un seul des deux évolue).
- **[Docker Build](https://docs.docker.com/build/ci/github-actions/)**

Chaque pipeline suit le même principe : **tester avant de construire**.
1. **Tests automatiques** à chaque push — Vitest/Playwright côté frontend, Jest/Supertest côté backend (contre un vrai conteneur PostgreSQL éphémère, pas une base mockée).
2. **Build & push conditionnels** — uniquement si les tests passent *et* que le push a lieu sur `main` : construction d'images Docker multi-architecture ([QEMU](https://www.qemu.org/) + [Docker Buildx](https://docs.docker.com/build/buildx/)) puis publication sur [Docker Hub](https://hub.docker.com/).
3. **Déploiement** — le VPS OVH récupère ensuite ces images à jour via un script (`fetch-and-deploy.sh`) qui relance la stack Docker Compose en production.

Ce découplage garantit qu'aucune image cassée n'atteint jamais Docker Hub : si les tests échouent, le build s'arrête avant la publication.

## 🙏 Remerciements

Merci à la communauté des développeurs et à l'écosystème open source, qui donne accès à des outils puissants et à une documentation permettant d'apprendre en continu — et qui encourage à rester curieux, projet après projet.
