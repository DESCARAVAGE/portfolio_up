import type { ReactNode } from "react";
import { languageMetadata } from "@/app/components/RootShell";

/**
 * Site anglais : tout ce qui est sous /en. Le HTML commun est dans app/layout.tsx.
 * Le contenu est marqué lang="en" ici aussi : sans JavaScript, <html> reste en "fr"
 * (HTML commun aux deux langues), mais les lecteurs d'écran lisent quand même l'anglais.
 */
export const metadata = languageMetadata("en");

export default function EnglishLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div lang="en" className="contents">
      {children}
    </div>
  );
}
