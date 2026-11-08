import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalFacts, LegalSection, OutLink } from "@/app/components/portfolio/legal/LegalPage";
import { LEGAL } from "@/app/content/legal";
import { CREDITS, HOST_FORM, PRO_STATUS } from "@/app/content/legal.en";
import { PROFILE } from "@/app/content/profile";
import { ROUTES, languageAlternates } from "@/app/i18n/config";

export const metadata: Metadata = {
  title: `Legal notice — ${PROFILE.fullName}`,
  description: "Publisher, host, intellectual property and credits for Daniel Escaravage's website.",
  alternates: languageAlternates("legalNotice", "en"),
};

/** Rubriques de la page : sommaire et ancres (#publisher…). */
const TOC = [
  { id: "publisher", title: "Publisher" },
  { id: "host", title: "Host" },
  { id: "intellectual-property", title: "Intellectual property" },
  { id: "credits", title: "Credits" },
  { id: "personal-data", title: "Personal data" },
] as const;
const [publisher, host, ip, credits, data] = TOC;

const link = "underline underline-offset-4 hover:text-[var(--accent)]";

/**
 * Traduction des mentions légales (app/(fr)/mentions-legales) : même logique selon
 * LEGAL.status. La version française fait foi, la page le dit en tête.
 */
export default function LegalNotice() {
  const { publisher: p, host: h } = LEGAL;
  const pro = LEGAL.status === "professionnel" ? p.pro : null;

  return (
    <LegalPage locale="en" title="Legal notice" toc={TOC}>
      <p className="text-mute m-0">
        This English version is provided for convenience. The{" "}
        {/* Seul lien qui change de langue en dehors du bouton : il mène au texte qui fait foi */}
        <Link href={ROUTES.legalNotice.fr} hrefLang="fr" lang="fr" className={link} data-legal-reference>
          French version
        </Link>{" "}
        is the reference.
      </p>

      <LegalSection {...publisher}>
        <LegalFacts
          items={[
            { label: "Name", value: pro ? `${p.name}, ${PRO_STATUS}` : p.name },
            ...(pro
              ? [
                  { label: "Address", value: pro.address },
                  { label: "Phone", value: pro.phone },
                ]
              : []),
            { label: "Email", value: <a href={`mailto:${p.email}`}>{p.email}</a> },
            ...(pro ? [{ label: "SIREN", value: `${pro.siren}, registered with the ${pro.register}` }] : []),
            ...(pro?.vat ? [{ label: "EU VAT no.", value: pro.vat }] : []),
            { label: "Publication director", value: p.publicationDirector },
          ]}
        />
        {!pro && (
          <p className="m-0">
            This website is published on a non-professional basis. In accordance with Article 1-1 II of French Law No.
            2004-575 of 21 June 2004 on confidence in the digital economy (LCEN), the publisher does not disclose their
            address or phone number: their identification details have been provided to the host.
          </p>
        )}
      </LegalSection>

      <LegalSection {...host}>
        <LegalFacts
          items={[
            { label: "Company", value: `${h.name}, ${HOST_FORM}` },
            { label: "Registration", value: h.rcs },
            { label: "Address", value: h.address },
            ...(h.phone ? [{ label: "Phone", value: h.phone }] : []),
            { label: "Website", value: <OutLink href={h.url}>ovhcloud.com</OutLink> },
          ]}
        />
      </LegalSection>

      <LegalSection {...ip}>
        <p className="m-0">
          The texts, photograph, résumé and visuals on this website belong to {p.name}, unless otherwise stated. They
          may not be reproduced without permission.
        </p>
        <p className="m-0">
          The source code is published under the {LEGAL.codeLicense} license on{" "}
          <OutLink href={LEGAL.repository}>GitHub</OutLink>. This license covers the code, not the content listed above.
        </p>
        <p className="m-0">
          Company, school and client names and logos belong to their respective owners. They are mentioned to describe a
          professional background, without any partnership or endorsement on their part. LinkedIn and GitHub are
          trademarks of their respective owners.
        </p>
      </LegalSection>

      <LegalSection {...credits}>
        <ul className="m-0 flex flex-col gap-2 pl-5">
          {CREDITS.map((c) => (
            <li key={c.what}>
              {c.what}: {c.who}, <OutLink href={c.href}>{c.license}</OutLink> license.
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection {...data}>
        <p className="m-0">
          This website sets no cookies and does not measure traffic. What is recorded, why and for how long: see the{" "}
          <Link href={ROUTES.privacy.en} className={link}>
            Privacy
          </Link>{" "}
          page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
