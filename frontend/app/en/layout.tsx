import type { ReactNode } from "react";
import RootShell, { rootMetadata, rootViewport } from "@/app/components/RootShell";

/** Mise en page racine du site anglais : tout ce qui est sous /en. */
export const metadata = rootMetadata("en");
export const viewport = rootViewport;

export default function EnglishLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell locale="en">{children}</RootShell>;
}
