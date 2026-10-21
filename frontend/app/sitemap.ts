import type { MetadataRoute } from "next";
import { PROFILE } from "@/app/content/profile";
import { LEGAL_PAGES } from "@/app/content/legal";

/** /sitemap.xml : la page d'accueil, puis les pages légales (rarement modifiées). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: PROFILE.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...LEGAL_PAGES.map((p) => ({
      url: `${PROFILE.siteUrl}${p.href}`,
      changeFrequency: "yearly" as const,
      priority: 0.1,
    })),
  ];
}
