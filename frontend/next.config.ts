import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image Docker : serveur Node minimal (.next/standalone/server.js), sans node_modules complet.
  output: "standalone",
  // Le frontend est un projet autonome dans le monorepo portfolio_up :
  // on fixe la racine pour que Next ne remonte pas jusqu'au package-lock.json de la racine.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
  poweredByHeader: false,
  // Page 404 commune aux deux mises en page racines (app/(fr) et app/en) : app/global-not-found.tsx
  experimental: { globalNotFound: true },
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
