import type { ReactNode } from "react";
import RootShell, { rootViewport } from "@/app/components/RootShell";

/*
 * Mise en page racine unique, commune aux deux langues : passer de / à /en (et
 * inversement) est une navigation sans rechargement. Les métadonnées de chaque
 * langue sont posées par app/(fr)/layout.tsx et app/en/layout.tsx.
 */
export const viewport = rootViewport;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell>{children}</RootShell>;
}
