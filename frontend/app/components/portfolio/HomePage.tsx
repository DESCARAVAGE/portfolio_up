import SiteHeader from "@/app/components/portfolio/layout/SiteHeader";
import Hero from "@/app/components/portfolio/intro/Hero";
import Highlights from "@/app/components/portfolio/intro/Highlights";
import Experience from "@/app/components/portfolio/career/Experience";
import Projects from "@/app/components/portfolio/showcase/Projects";
import Skills from "@/app/components/portfolio/showcase/Skills";
import About from "@/app/components/portfolio/about/About";
import Vision from "@/app/components/portfolio/about/Vision";
import Journey from "@/app/components/portfolio/career/Journey";
import ContactFooter from "@/app/components/portfolio/layout/ContactFooter";
import ScrollProgress from "@/app/components/ui/scroll/ScrollProgress";
import ScrollRail from "@/app/components/ui/scroll/ScrollRail";
import PersonJsonLd from "@/app/components/seo/PersonJsonLd";
import { MAIN_ANCHOR, anchorOf, type Locale } from "@/app/i18n/config";
import { getContent, getUi } from "@/app/i18n/content";

/**
 * Page d'accueil, dans une langue : uniquement l'assemblage des sections, dans l'ordre de lecture
 * d'un recruteur : qui → preuves → expérience → projets → compétences → approche → vision → formation → contact.
 * Les composants client (header, hero, rail) reçoivent leur texte ici, en props.
 */
export default function HomePage({ locale }: Readonly<{ locale: Locale }>) {
  const { PROFILE, SECTIONS, NAV, HERO } = getContent(locale);
  const ui = getUi(locale);
  // Les composants client reçoivent les ancres de la langue (/#projets, /en#projects)
  const sections = SECTIONS.map((s) => ({ anchor: anchorOf(s.id, locale), label: s.label }));
  const nav = NAV.map((n) => ({ label: n.label, target: anchorOf(n.target, locale) }));

  return (
    <>
      <PersonJsonLd locale={locale} />
      {/* Lien d'évitement : visible au premier Tab, il saute la navigation et mène au début du contenu */}
      <a
        href={`#${MAIN_ANCHOR[locale]}`}
        className="sr-only z-[70] rounded-full bg-[var(--accent-surface)] px-5 py-3 text-[var(--accent-ink)] focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {ui.skipToContent}
      </a>
      <ScrollProgress />
      <ScrollRail sections={sections.map(({ anchor, label }) => ({ id: anchor, label }))} />
      <SiteHeader brand={PROFILE.brand} sections={sections.map((s) => s.anchor)} nav={nav} />
      {/* overflow-x-clip : les cartes qui arrivent de côté ne créent pas de scroll horizontal
          (clip, contrairement à hidden, ne casse pas les éléments sticky) */}
      <main id={MAIN_ANCHOR[locale]} tabIndex={-1} className="relative overflow-x-clip text-[var(--ink)] outline-none">
        <Hero
          hero={HERO}
          ctaHref={`#${anchorOf(HERO.ctaPrimary.target, locale)}`}
          cv={PROFILE.cv}
          cvFileName={PROFILE.cvFileName}
        />
        <Highlights locale={locale} />
        <Experience locale={locale} />
        <Projects locale={locale} />
        <Skills locale={locale} />
        <About locale={locale} />
        <Vision locale={locale} />
        <Journey locale={locale} />
      </main>
      <ContactFooter locale={locale} />
    </>
  );
}
