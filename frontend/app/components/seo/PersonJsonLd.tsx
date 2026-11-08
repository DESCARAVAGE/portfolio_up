import { ROUTES, type Locale } from "@/app/i18n/config";
import { getContent, getUi } from "@/app/i18n/content";

/**
 * Données structurées schema.org « Person » : Google peut relier ce site à ton
 * nom, ton poste et tes profils (sameAs), ce qui aide une recherche sur « Daniel Escaravage ».
 */
export default function PersonJsonLd({ locale }: Readonly<{ locale: Locale }>) {
  const { PROFILE, HERO } = getContent(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.fullName,
    alternateName: PROFILE.brand,
    jobTitle: PROFILE.role,
    description: HERO.intro,
    url: `${PROFILE.siteUrl}${locale === "fr" ? "" : ROUTES.home[locale]}`,
    email: `mailto:${PROFILE.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Tours", addressCountry: "FR" },
    sameAs: [PROFILE.linkedin, PROFILE.github],
    knowsAbout: getUi(locale).meta.knowsAbout,
  };

  return (
    <script
      type="application/ld+json"
      // JSON sérialisé côté serveur ; « < » échappé pour ne jamais fermer la balise script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
