/**
 * Profils publics, repris par PROFILE (profile.ts). Dans un fichier à part : les boutons
 * LinkedIn et GitHub sont aussi rendus côté client, et importer profile.ts y ferait
 * télécharger tout le contenu du portfolio (textes et images) au navigateur.
 */
export const LINKS = {
  linkedin: "https://www.linkedin.com/in/escaravage-daniel",
  github: "https://github.com/descaravage",
} as const;
