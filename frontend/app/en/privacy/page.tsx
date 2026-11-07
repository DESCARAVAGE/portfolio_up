import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection, OutLink } from "@/app/components/portfolio/legal/LegalPage";
import { LEGAL } from "@/app/content/legal";
import { RETENTION } from "@/app/content/legal.en";
import { PROFILE } from "@/app/content/profile";
import { ROUTES, languageAlternates } from "@/app/i18n/config";

export const metadata: Metadata = {
  title: `Privacy — ${PROFILE.fullName}`,
  description: "Data recorded by Daniel Escaravage's website: server logs, no cookies, your rights.",
  alternates: languageAlternates("privacy", "en"),
};

/** Rubriques de la page : sommaire et ancres (#controller…). */
const TOC = [
  { id: "controller", title: "Data controller" },
  { id: "what-this-site-does-not-do", title: "What this website does not do" },
  { id: "server-logs", title: "Server logs" },
  { id: "intrusion-protection", title: "Protection against intrusions" },
  { id: "access", title: "Who can access this data" },
  { id: "emails", title: "If you write to me" },
  { id: "browser-storage", title: "Storage in your browser" },
  { id: "your-rights", title: "Your rights" },
] as const;
const [controller, noTracking, logs, intrusions, access, emails, browser, rights] = TOC;

/**
 * Traduction de la page Confidentialité (app/(fr)/confidentialite) : mêmes traitements,
 * mêmes durées (legal.en.ts). La version française fait foi, la page le dit en tête.
 */
export default function Privacy() {
  const { publisher: p, host: h } = LEGAL;
  const mail = <a href={`mailto:${p.email}`}>{p.email}</a>;

  return (
    <LegalPage locale="en" title="Privacy" toc={TOC}>
      <p className="text-mute m-0">
        This English version is provided for convenience. The{" "}
        <Link
          href={ROUTES.privacy.fr}
          hrefLang="fr"
          lang="fr"
          data-legal-reference
          className="underline underline-offset-4 hover:text-[var(--accent)]"
        >
          French version
        </Link>{" "}
        is the reference.
      </p>

      <LegalSection {...controller}>
        <p className="m-0">
          {p.name}, publisher of this website. Contact: {mail}.
        </p>
      </LegalSection>

      <LegalSection {...noTracking}>
        <p className="m-0">
          No cookies. No analytics. No advertising. No forms. No script or font loaded from a third-party service.
        </p>
      </LegalSection>

      <LegalSection {...logs}>
        <p className="m-0">
          Like any web server, this one records on each visit: the IP address, the date and time, the requested page,
          the response code, the referring page and the browser type.
        </p>
        <p className="m-0">
          Purpose: securing the website, preventing abuse and diagnosing failures. Legal basis: the publisher&apos;s
          legitimate interest in protecting the service (GDPR, Art. 6(1)(f)). Retention: {RETENTION.serverLogs}, then
          automatic deletion.
        </p>
      </LegalSection>

      <LegalSection {...intrusions}>
        <p className="m-0">
          The server uses fail2ban: IP addresses behind suspicious login attempts are recorded and temporarily blocked.
          Same purpose, same legal basis. Retention: {RETENTION.fail2ban}.
        </p>
      </LegalSection>

      <LegalSection {...access}>
        <p className="m-0">
          Only the publisher. The website is hosted by {h.name} ({h.address}), acting as a processor, on a server rented
          from OVHcloud{LEGAL.datacenter ? `, located in ${LEGAL.datacenter}` : ""}. Technical alerts from the server
          (which may contain a blocked IP address) are sent by email to the publisher
          {LEGAL.monitoringMail ? `, via ${LEGAL.monitoringMail}` : ""}. No data is sold or transferred.
        </p>
      </LegalSection>

      <LegalSection {...emails}>
        <p className="m-0">
          Your address and your message stay in my mailbox for the duration of our exchange, then for at most{" "}
          {RETENTION.emails}.
        </p>
      </LegalSection>

      <LegalSection {...browser}>
        <p className="m-0">
          The website stores two preferences in your browser (localStorage): your theme (light, dark or system) and, if
          you turn it on, your choice to show the 3D background. They never leave your device and serve a function you
          asked for, so no consent is required. You can clear them in your browser settings.
        </p>
      </LegalSection>

      <LegalSection {...rights}>
        <p className="m-0">
          You can ask to access, correct or delete your data, to restrict its processing, or object to it: write to{" "}
          {mail}. I will reply within one month.
        </p>
        <p className="m-0">
          You can also lodge a complaint with the <OutLink href="https://www.cnil.fr/en">CNIL</OutLink>, the French data
          protection authority.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
