import type { StaticImageData } from "next/image";

/**
 * Clés dont la valeur est un identifiant, pas un texte : elles restent identiques
 * dans toutes les langues (clé d'une section, cible d'un lien, type de carte…). Les ancres
 * affichées dans l'adresse, elles, sont traduites : SECTION_ANCHORS dans config.ts.
 */
type Fixed = "id" | "target" | "kind" | "variant" | "type" | "href" | "src" | "webm" | "poster" | "ratio";

/**
 * Forme d'un contenu traduit, déduite de la version française :
 * chaque texte devient `string`, tout le reste (identifiants, images, nombres,
 * longueur des listes figées) doit être identique. Une clé oubliée, en trop ou
 * une liste de longueur différente dans la traduction fait échouer `tsc`.
 */
export type Localized<T> = T extends string
  ? string
  : T extends StaticImageData | number | boolean | null | undefined
    ? T
    : T extends readonly unknown[]
      ? { [K in keyof T]: Localized<T[K]> }
      : T extends object
        ? { [K in keyof T]: K extends Fixed ? T[K] : Localized<T[K]> }
        : T;
