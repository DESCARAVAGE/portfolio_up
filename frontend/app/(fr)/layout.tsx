import type { ReactNode } from "react";
import RootShell, { rootMetadata, rootViewport } from "@/app/components/RootShell";

/*
 * Mise en page racine du site français. Le groupe (fr) n'apparaît pas dans les
 * adresses : les pages françaises restent à /, /mentions-legales, /confidentialite.
 */
export const metadata = rootMetadata("fr");
export const viewport = rootViewport;

export default function FrenchLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell locale="fr">{children}</RootShell>;
}
