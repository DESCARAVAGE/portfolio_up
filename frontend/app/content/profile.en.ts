/**
 * Contenu du portfolio en anglais (servi sous /en).
 * Même forme que profile.ts, vérifiée par le type Localized : une entrée oubliée,
 * en trop, ou un identifiant différent (id de section, cible de lien…) fait échouer `tsc`.
 * Les images et les données qui ne se traduisent pas (adresses, technologies) viennent de profile.ts.
 */

import * as FR from "@/app/content/profile";
import type { Localized } from "@/app/i18n/types";
import type { SectionId } from "@/app/content/profile";

const [enedis, splitScreen] = FR.EXPERIENCES;
const [agentique, ebook, cvRedesign, threeD, dashboard, greenStep] = FR.PROJECTS;
const [frontend, testing, ai, environment, backend, methods] = FR.SKILLS;
const [msdd, cda, dwwm, waiter] = FR.EDUCATION;

export const PROFILE: Localized<typeof FR.PROFILE> = {
  ...FR.PROFILE,
  role: "Frontend Developer, React / TypeScript",
};

export const SECTIONS: Localized<typeof FR.SECTIONS> = [
  { id: "top", label: "home" },
  { id: "en-bref", label: "at a glance", title: "At a glance" },
  { id: "experience", label: "experience", nav: "Experience", title: "One project, carried end to end." },
  { id: "projets", label: "projects", nav: "Projects", title: "What I build." },
  { id: "competences", label: "skills", nav: "Skills", title: "What I'm good at." },
  { id: "approche", label: "approach", nav: "Approach", title: "How I work." },
  { id: "vision", label: "vision", nav: "Vision", title: "What I'm looking for." },
  {
    id: "formation",
    label: "education",
    nav: "Education",
    title: "Master's level, earned entirely through work-study.",
  },
  { id: "contact", label: "contact", nav: "Contact", title: "shall we talk?" },
];

export const NAV: { label: string; target: SectionId }[] = SECTIONS.flatMap((s) =>
  "nav" in s ? [{ label: s.nav, target: s.id }] : [],
);

export const HERO: Localized<typeof FR.HERO> = {
  eyebrow: "Daniel Escaravage — Frontend Developer, React / TypeScript",
  lines: [
    { text: "start from the need," },
    { text: "ship interfaces that are" },
    { text: "resilient and maintainable.", accent: true },
  ],
  intro:
    "I build React / TypeScript interfaces for the people who use them, and for the people who will maintain them after me.",
  availability: "Available now",
  location: "Tours, France · open to relocation",
  ctaPrimary: { label: "See my experience", target: "experience" },
  ctaSecondary: { label: "Download my résumé (in French)" },
  hint: "scroll ↓",
};

export const HIGHLIGHTS: Localized<typeof FR.HIGHLIGHTS> = [
  {
    value: "Frontend",
    label: "the only frontend developer on a regional social network, all the way to production",
    variant: "solid",
  },
  {
    value: "400+",
    label: "idle screens brought back into use across the Centre-Val de Loire region, about €1M of equipment",
    variant: "glass",
  },
  { value: "Master's", label: "level degree (RNCP 7), earned through work-study", variant: "glass" },
  { value: "~10 min", label: "to generate a simple website with my AI tool", variant: "accent" },
];

export const EXPERIENCES: Localized<typeof FR.EXPERIENCES> = [
  {
    ...enedis,
    media: {
      src: enedis.media!.src,
      alt: "Interactive screen on a stand, seen from the back with its connectors",
      caption: "The reused interactive screens, turned into a broadcast channel.",
    },
    role: "Frontend Developer",
    context: "Work-study · internal regional social network",
    period: "Sept 2023 – Oct 2025",
    place: "Tours",
    summary: "An enterprise social network for an entire region, and a pivot made before it was too late.",
    chapters: [
      {
        label: "The context",
        text: "Enedis Centre-Val de Loire wanted to replace Steeples, an external enterprise social network, with an internal platform for the whole region.",
      },
      {
        label: "The pivot",
        highlight: true,
        text: "In meetings, there were signs that Microsoft Viva Engage was coming. Three to four months before the official announcement, together with the Enedis Lab, we widened the scope to a use case Viva Engage would not cover: broadcasting information on screens across the region.",
      },
      {
        label: "What I built",
        text: "The entire frontend, from mockup to production readiness, within an Agile team.",
      },
      {
        label: "What I took away",
        text: "In my first year of work-study, with no management background, I owned a project end to end: I learned what is at stake for a project owner, and what it means to be accountable for it.",
      },
    ],
    bullets: [
      "Reused more than 400 idle interactive screens as a broadcast channel for the platform.",
      "Prepared the production release with Docker.",
      "Unit and end-to-end tests (Jest, Playwright, Docker) on the main user journeys, run before every delivery.",
      "Fixed defects based on feedback from business teams, sprint after sprint.",
      "Ran demos for business teams and trained the team to carry the project forward.",
    ],
  },
  {
    ...splitScreen,
    media: {
      src: splitScreen.media!.src,
      alt: "Split Screen back office: the list of events, with Add, Edit and Delete buttons",
      caption: "The back office: the association manages its own events, news, members and partners (test data).",
    },
    role: "Full-Stack Developer",
    context: "Client project · showcase website",
    period: "May 2022 – Aug 2022",
    place: "Orléans",
    summary: "A showcase website for an association, built in 4 months, from design to deployment.",
    bullets: ["Worked closely with the client, then documented and handed the project over."],
  },
];

export const PROJECTS: Localized<typeof FR.PROJECTS> = [
  {
    ...agentique,
    title: "Agentic website generation system",
    summary:
      "Chained LLM agents, with human validation at every step. Next step: cover the whole product cycle, from design to SEO, security, testing and legal compliance (GDPR, terms of use, terms of sale, legal notice).",
    role: "Independent project · with partners",
    period: "May 2026 – present",
    media: {
      ...(agentique.media as Extract<FR.Project["media"], { type: "video" }>),
      alt: "Demo: a brief is entered, the agents run one after another in the workflow, then the generated website of a boxing club appears.",
      steps: [
        "A boxing club's brief is entered.",
        "The agents run one after another in the workflow, each step validated by a human.",
        "The generated website appears.",
      ],
    },
  },
  {
    ...ebook,
    title: "Ebook — photographer showcase website",
    summary: "A showcase website for a photographer, deployed on Vercel with Supabase.",
    role: "Freelance project",
    media: {
      type: "image",
      src: (ebook.media as { src?: FR.Img["src"] }).src,
      alt: "Home page of the Aesteria — Photographer website",
    },
    links: [{ label: "Visit the website", href: ebook.links[0].href }],
  },
  {
    ...cvRedesign,
    title: "Redesign of my online résumé",
    summary:
      "UI/UX redesign of my online résumé, self-hosted on my Linux server. An interactive WebGL background written without a library, whose quality adapts to the device; glass cards that refract the scenery; a theme synced with the system; code quality tracked with SonarQube.",
    role: "Personal project",
    media: {
      type: "compare",
      before: {
        src: (cvRedesign.media as { before: FR.Img }).before.src,
        alt: "Previous version of the online résumé",
      },
      after: { src: (cvRedesign.media as { after: FR.Img }).after.src, alt: "New version: the current portfolio" },
    },
    links: [{ label: "My GitHub", href: cvRedesign.links[0].href }],
  },
  {
    ...threeD,
    title: "First 3D project",
    summary: "My first steps in 3D: scene, camera and animation written by hand with Three.js, in Next.js.",
    role: "Learning",
    media: {
      type: "image",
      src: (threeD.media as { src?: FR.Img["src"] }).src,
      alt: "Wireframe sphere at the center of a 360° 3D grid, with the shape picker at the bottom",
    },
  },
  {
    ...dashboard,
    summary:
      "The official Next.js course, followed end to end to strengthen browser-side optimization and see more clearly what belongs to the server and what belongs to the browser.",
    role: "Learning · Next.js course",
    media: {
      type: "image",
      src: (dashboard.media as { src?: FR.Img["src"] }).src,
      alt: "Acme dashboard: invoice metrics, revenue chart and latest invoices",
    },
  },
  {
    ...greenStep,
    summary:
      "A carbon footprint tracking app built by a team of 7 during training. My scope: carbon expenses, from the GraphQL API to the interface, plus CI for the backend tests.",
    role: "Team project · Wild Code School",
    media: {
      type: "image",
      src: (greenStep.media as { src?: FR.Img["src"] }).src,
      alt: "Green Step illustration: a smartphone with the recycling symbol, surrounded by leaves",
    },
  },
];

export const SKILLS: Localized<typeof FR.SKILLS> = [
  { ...frontend, text: "React and TypeScript every day since 2023, Next.js for my own projects." },
  { ...testing, title: "Testing & quality", text: "From unit tests to full user journeys, plus static analysis." },
  {
    ...ai,
    title: "AI",
    text: "Agent workflows where humans stay in control.",
    tools: ["Agentic workflows", "RAG", "Prompt iteration", "Human-in-the-loop", "Claude Code", "Opencode"],
  },
  { ...environment, title: "Infrastructure", text: "I deploy and secure my own servers." },
  {
    ...backend,
    text: "Full-stack training: I understand what lies behind the API.",
    tools: ["Node.js", "Express", "REST API", "GraphQL (Apollo)", "Prisma", "PostgreSQL"],
  },
  {
    ...methods,
    title: "Methods",
    text: "Agile, day to day.",
    tools: ["Agile / Scrum", "Figma mockups", "Merise", "DevSecOps"],
  },
];

export const APPROACH: Localized<typeof FR.APPROACH> = {
  story:
    "Trained as a full-stack developer, I care as much about what we build as about how we build it. My final thesis was on the systems approach: looking at a project as a whole, with its users, its teams, its tools and how they interact.",
  pillars: [
    { title: "Listen before coding", text: "Feedback from business teams steers every sprint." },
    { title: "See the whole system", text: "A screen never stands alone: users, tools, teams, maintenance." },
    { title: "Hand it over", text: "Test, document, train: the project must live on without me." },
  ],
  photo: FR.APPROACH.photo,
  facts: [
    { label: "Coding since", value: "2022" },
    { label: "Languages", value: "French, English (B1)" },
    { label: "Driver's license", value: "B" },
  ],
};

export const VISION: Localized<typeof FR.VISION> = {
  seeking: [
    {
      label: "The team",
      text: "A team whose core business is web development: an IT services firm or a large company.",
    },
    { label: "The role", text: "A position where React / TypeScript frontend work is at the heart of what I do." },
    { label: "What's next", text: "Grow toward a role closer to product and coordination." },
  ],
  why: {
    label: "Why code",
    text: "After working in restaurants, I chose development to put my creativity to use and, above all, to be able to innovate.",
  },
  conviction: {
    label: "My take on AI",
    text: "To me, the agentic approach is the most effective, both for productivity and for visibility into the work done. That is the path I'm exploring, with a human validating every step.",
    link: { label: "See the project", target: "projets" },
  },
};

export const EDUCATION: Localized<typeof FR.EDUCATION> = [
  {
    ...msdd,
    period: "Oct 2024 – Oct 2025",
    title: "Digital Solutions and Data Manager",
    place: "Skolæ / CEFIM · work-study at Enedis",
    text: "RNCP level 7, master's level.",
  },
  {
    ...cda,
    period: "Sept 2023 – Sept 2024",
    title: "Application Designer and Developer",
    place: "Wild Code School · work-study at Enedis",
    text: "RNCP level 6, bachelor's level.",
  },
  {
    ...dwwm,
    period: "Feb 2022 – Aug 2022",
    title: "Web and Mobile Web Developer",
    place: "Wild Code School · Orléans",
    text: "RNCP level 5, two-year degree level.",
  },
  {
    ...waiter,
    title: "Head waiter",
    place: "Courtepaille · Olivet",
    text: "Before tech: customer service, pace and teamwork.",
  },
];

export const CERTIFICATIONS: Localized<typeof FR.CERTIFICATIONS> = {
  ...FR.CERTIFICATIONS,
  title: "AI certifications",
};

export const CONTACT: Localized<typeof FR.CONTACT> = {
  headline: "shall we talk?",
  pitch: "A job, a project or a technical question: write to me, I reply quickly.",
  practical: [{ label: "Availability", value: "Immediate" }],
};
