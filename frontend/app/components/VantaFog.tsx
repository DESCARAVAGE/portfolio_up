"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { useVantaFog } from "@/app/hooks/useVantaFog";
import { useFogPointer } from "@/app/hooks/useFogPointer";
import { FOG_PALETTES } from "@/app/lib/vanta/fogConfig";

/**
 * Fond plein écran. Le dégradé CSS de `.fog` (portfolio.css) s'affiche tout de
 * suite ; le brouillard 3D apparaît en fondu par-dessus quand il est prêt.
 * Sans WebGL, ou avec mouvement réduit, le dégradé reste seul.
 */
export default function VantaFog() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // resolvedTheme vaut undefined tant que le thème n'est pas connu (SSR / 1er rendu)
  const colors = resolvedTheme ? FOG_PALETTES[resolvedTheme === "dark" ? "dark" : "light"] : null;

  const { interaction, ready } = useVantaFog(ref, colors);
  useFogPointer(ref, interaction);

  return <div ref={ref} className="fog fixed inset-0 -z-10" data-ready={ready || undefined} aria-hidden />;
}
