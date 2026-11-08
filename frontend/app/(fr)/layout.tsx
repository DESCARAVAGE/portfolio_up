import type { ReactNode } from "react";
import { languageMetadata } from "@/app/components/RootShell";

/*
 * Site français. Le groupe (fr) n'apparaît pas dans les adresses : les pages restent à
 * /, /mentions-legales, /confidentialite. Le HTML commun est dans app/layout.tsx.
 */
export const metadata = languageMetadata("fr");

export default function FrenchLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
