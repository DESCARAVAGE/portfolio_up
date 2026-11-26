import type { MetadataRoute } from "next";
import { PROFILE } from "@/app/content/profile";

/*
 * /robots.txt, sur le modèle de celui de Google : une règle générale, puis des groupes
 * nommés pour les robots qui doivent être traités à part (un robot suit le groupe qui le
 * nomme, sinon celui de « * »).
 *
 * - Tout le site est indexable ; seul /api/health, sans intérêt pour un moteur, est exclu.
 * - Le CV (/api/cv/download) reste accessible aux robots, mais le backend l'envoie avec
 *   X-Robots-Tag: noindex : Google ne voit cette consigne que s'il peut lire le fichier
 *   (un fichier bloqué ici peut quand même apparaître dans les résultats).
 * - Aperçus de partage et moteurs de réponse IA : autorisés, ils citent le site.
 * - Robots d'entraînement des modèles d'IA : refusés.
 */
const BLOCKED_FOR_ALL = ["/api/health"];

/** Aperçus de liens (LinkedIn, Slack, WhatsApp…) : ils lisent les métadonnées et l'image de partage. */
const LINK_PREVIEWS = ["LinkedInBot", "facebookexternalhit", "Twitterbot", "Slackbot", "Discordbot", "WhatsApp"];

/** Moteurs de réponse IA : recherche et lecture à la demande d'un utilisateur, avec citation du site. */
const AI_ANSWERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

/** Entraînement des modèles d'IA (Google-Extended et Applebot-Extended sont des jetons, pas des robots). */
const AI_TRAINING = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "CCBot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: BLOCKED_FOR_ALL },
      { userAgent: LINK_PREVIEWS, allow: "/", disallow: BLOCKED_FOR_ALL },
      { userAgent: AI_ANSWERS, allow: "/", disallow: BLOCKED_FOR_ALL },
      { userAgent: AI_TRAINING, disallow: "/" },
    ],
    sitemap: `${PROFILE.siteUrl}/sitemap.xml`,
  };
}
