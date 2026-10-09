import { HERO, PROFILE } from "@/app/content/profile";

/**
 * Données structurées schema.org « Person » : Google peut relier ce site à ton
 * nom, ton poste et tes profils (sameAs), ce qui aide une recherche sur « Daniel Escaravage ».
 */
export default function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.fullName,
    alternateName: PROFILE.brand,
    jobTitle: PROFILE.role,
    description: HERO.intro,
    url: PROFILE.siteUrl,
    email: `mailto:${PROFILE.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Tours", addressCountry: "FR" },
    sameAs: PROFILE.socials.map((s) => s.href),
    knowsAbout: ["React", "TypeScript", "Next.js", "Accessibilité web", "Tests end-to-end", "Agents IA"],
  };

  return (
    <script
      type="application/ld+json"
      // JSON sérialisé côté serveur ; « < » échappé pour ne jamais fermer la balise script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
