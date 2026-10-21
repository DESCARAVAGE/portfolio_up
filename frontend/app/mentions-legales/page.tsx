import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalFacts, LegalSection, OutLink } from "@/app/components/portfolio/legal/LegalPage";
import { CREDITS, LEGAL } from "@/app/content/legal";
import { PROFILE } from "@/app/content/profile";

export const metadata: Metadata = {
  title: `Mentions légales — ${PROFILE.fullName}`,
  description: "Éditeur, hébergeur, propriété intellectuelle et crédits du site de Daniel Escaravage.",
  alternates: { canonical: "/mentions-legales" },
};

/** Rubriques de la page : sommaire et ancres (#editeur…). */
const TOC = [
  { id: "editeur", title: "Éditeur du site" },
  { id: "hebergeur", title: "Hébergeur" },
  { id: "propriete-intellectuelle", title: "Propriété intellectuelle" },
  { id: "credits", title: "Crédits" },
  { id: "donnees-personnelles", title: "Données personnelles" },
] as const;
const [editeur, hebergeur, propriete, credits, donnees] = TOC;

/**
 * Mentions légales, selon LEGAL.status : particulier (éditeur non professionnel,
 * adresse et téléphone non publiés) ou professionnel (entrepreneur individuel).
 * Base : loi n° 2004-575 du 21 juin 2004 (LCEN), art. 1-1, dans sa version issue
 * de la loi n° 2024-449 (SREN). Toutes les données viennent de app/content/legal.ts.
 */
export default function MentionsLegales() {
  const { publisher: p, host: h } = LEGAL;
  const pro = LEGAL.status === "professionnel" ? p.pro : null;

  return (
    <LegalPage title="Mentions légales" toc={TOC}>
      <LegalSection {...editeur}>
        <LegalFacts
          items={[
            { label: "Nom", value: pro ? `${p.name}, ${pro.status}` : p.name },
            ...(pro
              ? [
                  { label: "Adresse", value: pro.address },
                  { label: "Téléphone", value: pro.phone },
                ]
              : []),
            { label: "E-mail", value: <a href={`mailto:${p.email}`}>{p.email}</a> },
            ...(pro ? [{ label: "SIREN", value: `${pro.siren}, immatriculé au ${pro.register}` }] : []),
            ...(pro?.vat ? [{ label: "TVA intracom.", value: pro.vat }] : []),
            { label: "Publication", value: `Directeur de la publication : ${p.publicationDirector}` },
          ]}
        />
        {!pro && (
          <p className="m-0">
            Ce site est édité à titre non professionnel. Conformément à l&apos;article 1-1 II de la loi n° 2004-575 du
            21 juin 2004 pour la confiance dans l&apos;économie numérique, l&apos;éditeur ne publie ni son adresse ni
            son numéro de téléphone : ses éléments d&apos;identification ont été communiqués à l&apos;hébergeur.
          </p>
        )}
      </LegalSection>

      <LegalSection {...hebergeur}>
        <LegalFacts
          items={[
            { label: "Société", value: `${h.name}, ${h.form}` },
            { label: "Immatriculation", value: h.rcs },
            { label: "Adresse", value: h.address },
            ...(h.phone ? [{ label: "Téléphone", value: h.phone }] : []),
            { label: "Site", value: <OutLink href={h.url}>ovhcloud.com</OutLink> },
          ]}
        />
      </LegalSection>

      <LegalSection {...propriete}>
        <p className="m-0">
          Les textes, la photographie, le CV et les visuels de ce site appartiennent à {p.name}, sauf mention contraire.
          Leur reproduction sans autorisation est interdite.
        </p>
        <p className="m-0">
          Le code source est publié sous licence {LEGAL.codeLicense} sur{" "}
          <OutLink href={LEGAL.repository}>GitHub</OutLink>. Cette licence couvre le code, pas les contenus cités
          ci-dessus.
        </p>
        <p className="m-0">
          Les noms et logos d&apos;entreprises, d&apos;écoles et de clients appartiennent à leurs titulaires. Ils sont
          cités pour décrire un parcours professionnel, sans partenariat ni recommandation de leur part. LinkedIn et
          GitHub sont des marques de leurs titulaires respectifs.
        </p>
      </LegalSection>

      <LegalSection {...credits}>
        <ul className="m-0 flex flex-col gap-2 pl-5">
          {CREDITS.map((c) => (
            <li key={c.what}>
              {c.what} : {c.who}, licence <OutLink href={c.href}>{c.license}</OutLink>.
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection {...donnees}>
        <p className="m-0">
          Ce site ne dépose aucun cookie et ne mesure pas l&apos;audience. Ce qui est enregistré, pourquoi et pour
          combien de temps : voir la page{" "}
          <Link href="/confidentialite" className="underline underline-offset-4 hover:text-[var(--accent)]">
            Confidentialité
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
