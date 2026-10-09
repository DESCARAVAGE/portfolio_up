import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/app/providers/ThemeProvider";
import MotionProvider from "@/app/providers/MotionProvider";
import VantaFog from "@/app/components/VantaFog";
import { PROFILE } from "@/app/content/profile";
import "./styles/globals.css";
import "./styles/portfolio.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = `${PROFILE.fullName} — ${PROFILE.role}`;
const description =
  "Développeur frontend React / TypeScript à Tours : étude de cas Enedis, projets, parcours en alternance du Bac+2 au Bac+5. Disponible immédiatement.";

/*
 * metadataBase : rend absolues les URL de partage (image Open Graph, canonique).
 * L'image de partage est générée par app/opengraph-image.tsx et ajoutée automatiquement.
 */
export const metadata: Metadata = {
  metadataBase: new URL(PROFILE.siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  authors: [{ name: PROFILE.fullName, url: PROFILE.siteUrl }],
  openGraph: {
    type: "profile",
    locale: "fr_FR",
    url: "/",
    siteName: PROFILE.fullName,
    title,
    description,
    firstName: PROFILE.firstName,
    lastName: PROFILE.fullName.split(" ").slice(1).join(" "),
  },
  twitter: { card: "summary_large_image", title, description },
};

/** Couleur de la barre du navigateur mobile, selon le thème du système. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

/*
 * Le bouton de thème est dans le header (SiteHeader) : il ne doit PAS être ici.
 * data-scroll-behavior="smooth" : Next garde le défilement fluide sur les ancres
 * et le coupe seulement le temps d'un changement de page.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning : next-themes ajoute la classe `dark` avant l'hydratation
    <html lang="fr" suppressHydrationWarning data-scroll-behavior="smooth">
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
        <ThemeProvider>
          <MotionProvider>
            <VantaFog />
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
