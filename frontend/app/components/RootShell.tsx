import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/app/providers/ThemeProvider";
import MotionProvider from "@/app/providers/MotionProvider";
import FogBackground from "@/app/components/FogBackground";
import { LocaleProvider, PathLocaleProvider } from "@/app/i18n/LocaleProvider";
import { LOCALES, OG_LOCALE, ROUTES, languageAlternates, type Locale } from "@/app/i18n/config";
import { getContent, getUi } from "@/app/i18n/content";
import { PROFILE } from "@/app/content/profile";
import "@/app/styles/globals.css";
import "@/app/styles/portfolio.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/*
 * Métadonnées communes d'une langue (accueil). metadataBase rend absolues les URL
 * de partage (image Open Graph, canonique, hreflang). L'image de partage est générée
 * par opengraph-image.tsx dans le dossier de chaque langue.
 */
export function rootMetadata(locale: Locale): Metadata {
  const { PROFILE: p } = getContent(locale);
  const { meta } = getUi(locale);
  const title = `${p.fullName} — ${p.role}`;
  const alternates = languageAlternates("home", locale);
  return {
    metadataBase: new URL(PROFILE.siteUrl),
    title,
    description: meta.description,
    alternates,
    authors: [{ name: p.fullName, url: `${PROFILE.siteUrl}${locale === "fr" ? "" : ROUTES.home[locale]}` }],
    openGraph: {
      type: "profile",
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url: alternates.canonical,
      siteName: p.fullName,
      title,
      description: meta.description,
      firstName: p.firstName,
      lastName: p.fullName.split(" ").slice(1).join(" "),
    },
    twitter: { card: "summary_large_image", title, description: meta.description },
  };
}

/** Couleur de la barre du navigateur mobile, selon le thème du système. */
export const rootViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

/*
 * Base HTML commune aux deux langues (app/(fr)/layout.tsx et app/en/layout.tsx) :
 * chaque langue a sa propre mise en page racine, donc le bon <html lang> sans
 * rendu dynamique. Changer de langue recharge la page, ce qui est attendu.
 *
 * Le bouton de thème est dans le header (SiteHeader) : il ne doit PAS être ici.
 * data-scroll-behavior="smooth" : Next garde le défilement fluide sur les ancres
 * et le coupe seulement le temps d'un changement de page.
 */
export default function RootShell({
  locale,
  localeFromPath = false,
  children,
}: Readonly<{
  locale: Locale;
  /** Page 404 commune : la langue des composants client suit l'adresse (/en…). */
  localeFromPath?: boolean;
  children: ReactNode;
}>) {
  const page = (
    <ThemeProvider>
      <MotionProvider>
        <FogBackground />
        {children}
      </MotionProvider>
    </ThemeProvider>
  );

  return (
    // suppressHydrationWarning : next-themes ajoute la classe `dark` avant l'hydratation
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} text-[var(--ink)] antialiased`}>
        {/* Sans JavaScript, les animations d'apparition ne se lancent jamais :
            on affiche directement le contenu dans son état final. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                '[style*="opacity:0"]{opacity:1!important}[style*="transform"]{transform:none!important}[style*="clip-path"]{clip-path:none!important}',
            }}
          />
        </noscript>
        {localeFromPath ? (
          <PathLocaleProvider uis={{ fr: getUi("fr"), en: getUi("en") }}>{page}</PathLocaleProvider>
        ) : (
          <LocaleProvider locale={locale} ui={getUi(locale)}>
            {page}
          </LocaleProvider>
        )}
      </body>
    </html>
  );
}
