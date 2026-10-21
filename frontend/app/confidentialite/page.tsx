import type { Metadata } from "next";
import LegalPage, { LegalSection, OutLink } from "@/app/components/portfolio/legal/LegalPage";
import { LEGAL } from "@/app/content/legal";
import { PROFILE } from "@/app/content/profile";

export const metadata: Metadata = {
  title: `Confidentialité — ${PROFILE.fullName}`,
  description: "Données enregistrées par le site de Daniel Escaravage : journaux du serveur, aucun cookie, vos droits.",
  alternates: { canonical: "/confidentialite" },
};

/** Rubriques de la page : sommaire et ancres (#responsable…). */
const TOC = [
  { id: "responsable", title: "Responsable" },
  { id: "ce-que-le-site-ne-fait-pas", title: "Ce que ce site ne fait pas" },
  { id: "journaux", title: "Journaux du serveur" },
  { id: "intrusions", title: "Protection contre les intrusions" },
  { id: "acces", title: "Qui accède à ces données" },
  { id: "emails", title: "Si vous m'écrivez" },
  { id: "navigateur", title: "Stockage dans votre navigateur" },
  { id: "droits", title: "Vos droits" },
] as const;
const [responsable, sansTraceur, journaux, intrusions, acces, emails, navigateur, droits] = TOC;

/**
 * Information des visiteurs (RGPD, art. 13). Décrit ce que le serveur enregistre
 * réellement : à tenir à jour si la configuration change (journaux, fail2ban, supervision).
 * Toutes les données viennent de app/content/legal.ts.
 */
export default function Confidentialite() {
  const { publisher: p, host: h, retention: r } = LEGAL;
  const mail = <a href={`mailto:${p.email}`}>{p.email}</a>;

  return (
    <LegalPage title="Confidentialité" toc={TOC}>
      <LegalSection {...responsable}>
        <p className="m-0">
          {p.name}, éditeur de ce site. Contact : {mail}.
        </p>
      </LegalSection>

      <LegalSection {...sansTraceur}>
        <p className="m-0">
          Pas de cookie. Pas de mesure d&apos;audience. Pas de publicité. Pas de formulaire. Aucun script ni aucune
          police chargés depuis un service tiers.
        </p>
      </LegalSection>

      <LegalSection {...journaux}>
        <p className="m-0">
          Comme tout serveur web, celui-ci enregistre à chaque visite : l&apos;adresse IP, la date et l&apos;heure, la
          page demandée, le code de réponse, la page d&apos;origine et le type de navigateur.
        </p>
        <p className="m-0">
          Finalité : sécuriser le site, prévenir les abus et diagnostiquer les pannes. Base légale : l&apos;intérêt
          légitime de l&apos;éditeur à protéger son service (RGPD, art. 6.1 f). Durée : {r.serverLogs}, puis suppression
          automatique.
        </p>
      </LegalSection>

      <LegalSection {...intrusions}>
        <p className="m-0">
          Le serveur utilise fail2ban : les adresses IP à l&apos;origine de tentatives de connexion suspectes sont
          enregistrées et bloquées temporairement. Même finalité, même base légale. Durée : {r.fail2ban}.
        </p>
      </LegalSection>

      <LegalSection {...acces}>
        <p className="m-0">
          Seul l&apos;éditeur. Le site est hébergé par {h.name} ({h.address}), qui agit comme sous-traitant, sur un
          serveur situé à {h.datacenter}. Les alertes techniques du serveur sont envoyées par e-mail via{" "}
          {LEGAL.monitoringMail}. Aucune donnée n&apos;est vendue ni cédée.
        </p>
      </LegalSection>

      <LegalSection {...emails}>
        <p className="m-0">
          Votre adresse et votre message restent dans ma messagerie le temps de l&apos;échange, puis au plus {r.emails}.
        </p>
      </LegalSection>

      <LegalSection {...navigateur}>
        <p className="m-0">
          Le site enregistre dans votre navigateur (localStorage) deux préférences : votre thème (clair, sombre ou
          système) et, si vous l&apos;activez, votre choix d&apos;afficher le fond 3D. Elles ne quittent jamais votre
          appareil et servent une fonction que vous demandez : elles sont exemptées de consentement. Vous pouvez les
          effacer depuis les réglages de votre navigateur.
        </p>
      </LegalSection>

      <LegalSection {...droits}>
        <p className="m-0">
          Vous pouvez demander l&apos;accès à vos données, leur rectification ou leur effacement, la limitation du
          traitement, ou vous y opposer : écrivez à {mail}. Réponse sous un mois.
        </p>
        <p className="m-0">
          Vous pouvez aussi adresser une réclamation à la <OutLink href="https://www.cnil.fr">CNIL</OutLink>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
