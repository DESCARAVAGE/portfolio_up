"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { useUi } from "@/app/i18n/LocaleProvider";

/**
 * Bouton « Copier l'adresse » : un lien mailto: seul ne fait rien pour qui
 * utilise un webmail (Gmail, Outlook web…). La confirmation est annoncée
 * aux lecteurs d'écran (role="status").
 */
export default function CopyEmail({ email, className = "" }: Readonly<{ email: string; className?: string }>) {
  const [copied, setCopied] = useState(false);
  const { copyEmail: t } = useUi();

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      posthog.capture("contact_email_copied");
      setCopied(true);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé…) : on sélectionne l'adresse à la place
      window.prompt(t.prompt, email);
    }
  };

  return (
    <button type="button" onClick={copy} className={className}>
      <span role="status">{copied ? t.copied : t.copy}</span>
    </button>
  );
}
