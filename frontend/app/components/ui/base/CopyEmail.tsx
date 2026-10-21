"use client";

import { useEffect, useState } from "react";

/**
 * Bouton « Copier l'adresse » : un lien mailto: seul ne fait rien pour qui
 * utilise un webmail (Gmail, Outlook web…). La confirmation est annoncée
 * aux lecteurs d'écran (role="status").
 */
export default function CopyEmail({ email, className = "" }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé…) : on sélectionne l'adresse à la place
      window.prompt("Adresse e-mail :", email);
    }
  };

  return (
    <button type="button" onClick={copy} className={className}>
      <span role="status">{copied ? "Adresse copiée ✓" : "Copier l'adresse"}</span>
    </button>
  );
}
