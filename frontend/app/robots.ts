import type { MetadataRoute } from "next";
import { PROFILE } from "@/app/content/profile";

/** /robots.txt : tout est indexable, et le sitemap est indiqué aux moteurs. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${PROFILE.siteUrl}/sitemap.xml`,
  };
}
