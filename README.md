# Portfolio — [Ton prénom/nom]

## 🎯 Pourquoi ce projet

Après 3 années de Faculté de sport, je me suis reconverti dans la programmation — d'abord en autodidacte, puis en suivant des formations de professionnalisation pour des clients et en entreprise.

Ce portfolio répond à un manque concret : l'absence de présence en ligne construite et maîtrisée de bout en bout. Plutôt que de passer par une plateforme clé-en-main, j'ai fait le choix de tout gérer moi-même, « à l'ancienne » : provisionnement et configuration d'un VPS OVH, conteneurisation avec Docker, mise en place d'un reverse proxy, sécurisation du serveur, et supervision manuelle des services — sans dashboard automatisé qui fait le travail à ma place.

L'objectif : démontrer une compréhension réelle de la chaîne complète, du code jusqu'à l'infrastructure qui le fait tourner.

## 🔗 Lien du projet

👉 [www.dany-sk-fsp.com](https://www.dany-sk-fsp.com/)

## 🛠️ Technologies

### Backend
- **[Node.js](https://nodejs.org/) + [Express](https://expressjs.com/fr/)** — Serveur HTTP léger et flexible, avec un écosystème mature pour construire une API REST rapidement tout en gardant le contrôle sur chaque middleware.
- **[TypeScript](https://www.typescriptlang.org/)** — Typage statique pour fiabiliser le code et limiter les erreurs à l'exécution, particulièrement utile en solo sur un projet qui grandit.
- **[TypeORM](https://typeorm.io/)** — ORM pour gérer les entités et les migrations PostgreSQL sans écrire du SQL brut à chaque requête, tout en gardant la possibilité de descendre au SQL quand c'est nécessaire.
- **[PostgreSQL](https://www.postgresql.org/)** — Base de données relationnelle robuste et éprouvée, adaptée à un modèle de données structuré.

### Frontend
- **[Vite](https://vitejs.dev/)** — Serveur de développement et bundler rapide, avec un temps de démarrage et de rebuild quasi instantané comparé aux outils plus anciens.
- **[À compléter — React / Vue / autre]** — [Explication à ajouter]

### CI/CD
- **[Github Actions](https://github.com/features/actions?locale=fr-fr)**
- **[Docker Build](https://github.com/features/actions?locale=fr-fr)**

### Infrastructure & déploiement
- **[Docker](https://www.docker.com/) / Docker Compose** — Conteneurisation de chaque service (frontend, backend, base de données, proxy) pour des environnements reproductibles et un déploiement cohérent entre local et production.
- **[Nginx](https://nginx.org/)** — Reverse proxy interne devant le frontend.
- **[Caddy](https://caddyserver.com/)** — Proxy en périphérie avec gestion automatique du HTTPS (certificats TLS renouvelés sans intervention manuelle).
- **[GitHub Actions](https://docs.github.com/fr/actions)** — Intégration continue pour automatiser build et déploiement.
- **[Fail2ban](https://github.com/fail2ban/fail2ban)** — Protection du serveur contre les tentatives de connexion SSH par force brute.
- **VPS [OVHcloud](https://www.ovhcloud.com/fr/)** — Hébergement géré manuellement : configuration système, sécurité et supervision faites à la main plutôt que via une plateforme managée.

> *[À compléter si d'autres technologies manquent à cette liste]*

## 🙏 Remerciements

Merci à la communauté des développeurs et à l'écosystème open source, qui donne accès à des outils puissants et à une documentation permettant d'apprendre en continu — et qui encourage à rester curieux, projet après projet.