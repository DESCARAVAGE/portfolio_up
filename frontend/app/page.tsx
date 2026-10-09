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

/**
 * Page d'accueil : uniquement l'assemblage des sections, dans l'ordre de lecture
 * d'un recruteur : qui → preuves → expérience → projets → compétences → approche → vision → formation → contact.
 */
export default function Home() {
  return (
    <>
      <PersonJsonLd />
      {/* Lien d'évitement : visible au premier Tab, il saute la navigation et mène au début du contenu */}
      <a
        href="#contenu"
        className="sr-only z-[70] rounded-full bg-[var(--accent-surface)] px-5 py-3 text-[var(--accent-ink)] focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Aller au contenu
      </a>
      <ScrollProgress />
      <ScrollRail />
      <SiteHeader />
      {/* overflow-x-clip : les cartes qui arrivent de côté ne créent pas de scroll horizontal
          (clip, contrairement à hidden, ne casse pas les éléments sticky) */}
      <main id="contenu" tabIndex={-1} className="relative overflow-x-clip text-[var(--ink)] outline-none">
        <Hero />
        <Highlights />
        <Experience />
        <Projects />
        <Skills />
        <About />
        <Vision />
        <Journey />
      </main>
      <ContactFooter />
    </>
  );
}
