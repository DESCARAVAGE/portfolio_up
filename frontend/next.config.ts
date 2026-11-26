import path from "node:path";
import type { NextConfig } from "next";

/*
 * Politique de sécurité du contenu (CSP) : tout vient du site lui-même (polices, images,
 * vidéos et scripts sont servis par Next), rien ne peut l'afficher dans un cadre, aucun
 * plugin, aucun formulaire vers un autre site.
 * 'unsafe-inline' pour les scripts : Next et le site posent des scripts en ligne (données
 * de page, thème, langue) ; les autoriser par nonce obligerait à rendre chaque page à la
 * demande au lieu de la servir statique. Le site n'affiche aucun contenu saisi par un
 * visiteur, ce qui limite ce risque. 'unsafe-eval' seulement en développement (rechargement
 * à chaud). Le HTTPS (et HSTS) est géré par Caddy, devant le site.
 */
const isDev = process.env.NODE_ENV === "development";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Aucune de ces fonctions n'est utilisée par le site
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  // Image Docker : serveur Node minimal (.next/standalone/server.js), sans node_modules complet.
  output: "standalone",
  // Le frontend est un projet autonome dans le monorepo portfolio_up :
  // on fixe la racine pour que Next ne remonte pas à la racine du dépôt.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // Anciennes URL du portfolio Vite, conservées pour les liens déjà partagés et le référencement.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/xp-details/:id", destination: "/#experience", permanent: true },
      // Même chose sous /en : une redirection ne change jamais de langue
      { source: "/en/home", destination: "/en", permanent: true },
      { source: "/en/xp-details/:id", destination: "/en#experience", permanent: true },
    ];
  },
};

export default nextConfig;
