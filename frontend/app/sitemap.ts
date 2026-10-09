import type { MetadataRoute } from "next";
import { PROFILE } from "@/app/content/profile";

/** /sitemap.xml : une seule page pour l'instant. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: PROFILE.siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
