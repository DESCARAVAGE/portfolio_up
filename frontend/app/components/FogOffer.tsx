"use client";

import { useState } from "react";
import { isInAppBrowser } from "@/app/lib/fog/fogSupport";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

/**
 * Proposé quand le fond 3D n'est pas lancé d'office (navigateur intégré à une
 * application, économie de données, appareil à faible mémoire) : le visiteur
 * peut l'activer quand même. Fond plein, sans flou : aucun calque de plus.
 */
export default function FogOffer({ onEnable }: { onEnable: () => void }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <aside
      aria-label="Fond animé"
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3 shadow-lg sm:right-auto sm:left-4 sm:mx-0"
    >
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onEnable}
          className={`rounded-full bg-accent-surface px-4 py-2 text-sm font-medium text-accent-ink ${FOCUS}`}
        >
          Activer le fond 3D
        </button>
        {isInAppBrowser() && (
          <p className="text-mute mt-2 text-xs">
            Pour la version complète, ouvrir le lien dans le navigateur (menu ⋯).
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Masquer"
        className={`text-mute grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg ${FOCUS}`}
      >
        ×
      </button>
    </aside>
  );
}
