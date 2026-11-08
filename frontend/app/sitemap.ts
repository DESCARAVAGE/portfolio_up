import type { MetadataRoute } from "next";
import { PROFILE } from "@/app/content/profile";
import { DEFAULT_LOCALE, LEGAL_ROUTES, LOCALES, ROUTES, type RouteKey } from "@/app/i18n/config";

/**
 * /sitemap.xml : chaque page dans chaque langue, avec ses équivalents (hreflang).
 * L'accueil d'abord, puis les pages légales (rarement modifiées).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${PROFILE.siteUrl}${path === "/" ? "" : path}`;
  const entries = (key: RouteKey, extra: Partial<MetadataRoute.Sitemap[number]>) =>
    LOCALES.map((locale) => ({
      url: url(ROUTES[key][locale]),
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [l, url(ROUTES[key][l])])),
          "x-default": url(ROUTES[key][DEFAULT_LOCALE]),
        },
      },
      ...extra,
    }));

  return [
    ...entries("home", { lastModified: new Date(), changeFrequency: "monthly", priority: 1 }),
    ...LEGAL_ROUTES.flatMap((key) => entries(key, { changeFrequency: "yearly", priority: 0.1 })),
  ];
}
