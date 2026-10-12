"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { useFog } from "@/app/hooks/useFog";
import { useFogPointer } from "@/app/hooks/useFogPointer";
import { FOG_PALETTES } from "@/app/lib/fog/fogConfig";
import FogOffer from "@/app/components/FogOffer";

/**
 * Fond plein écran. Le dégradé CSS de `.fog` (portfolio.css) s'affiche tout de
 * suite ; le brouillard 3D apparaît en fondu par-dessus quand il est prêt.
 * Sa qualité dépend de l'appareil (voir useFog) ; quand il n'est pas lancé
 * d'office, un bouton propose de l'activer. Avec mouvement réduit, le dégradé reste seul.
 *
 * data-tier / data-quality : palier et qualité en cours, utiles pour vérifier
 * sur un appareil réel (inspecteur) et dans les tests.
 */
export default function FogBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // resolvedTheme vaut undefined tant que le thème n'est pas connu (SSR / 1er rendu)
  const colors = resolvedTheme ? FOG_PALETTES[resolvedTheme === "dark" ? "dark" : "light"] : null;

  const { interaction, ready, tier, quality, enable } = useFog(ref, colors);
  useFogPointer(ref, interaction);

  return (
    <>
      <div
        ref={ref}
        className="fog fixed inset-0 -z-10"
        data-ready={ready || undefined}
        data-tier={tier ?? undefined}
        data-quality={quality ?? undefined}
        aria-hidden
      />
      {tier === "offer" && <FogOffer onEnable={enable} />}
    </>
  );
}
