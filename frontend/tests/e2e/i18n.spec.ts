import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { LANGUAGE_SWITCH_CASES } from "./shared/languageSwitch.cases";
import { SECTION_ANCHORS } from "@/app/i18n/config";

/**
 * Version anglaise sous /en. Le site français ne change pas : toute la suite
 * portfolio.spec.ts continue de tourner sur /, /mentions-legales, /confidentialite.
 */

const PAGES = [
  { fr: "/", en: "/en" },
  { fr: "/mentions-legales", en: "/en/legal-notice" },
  { fr: "/confidentialite", en: "/en/privacy" },
] as const;

/** Textes visibles et attributs lus par les lecteurs d'écran (sans scripts ni styles). */
async function texts(page: Page) {
  return page.evaluate(() => {
    const out = new Set<string>();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement?.closest("script, style, noscript, [data-lang]")) continue;
      const t = node.textContent!.replace(/\s+/g, " ").trim();
      if (t) out.add(t);
    }
    for (const el of document.querySelectorAll("[alt], [aria-label], [title]")) {
      for (const a of ["alt", "aria-label", "title"]) {
        const v = el.getAttribute(a)?.trim();
        if (v) out.add(v);
      }
    }
    return [...out];
  });
}

/** Adresse absolue qui se termine par ce chemin (l'accueil n'a pas de « / » final). */
const ends = (path: string) => (path === "/" ? /^https?:\/\/[^/]+$/ : new RegExp(`${path}$`));

/** Textes identiques dans les deux langues, et c'est voulu (noms propres, dates, intitulés en anglais). */
const SAME_IN_BOTH = new Set([
  "Agile / Scrum",
  "2019 – 2021",
  "Courtepaille · Olivet",
  // Données légales, identiques dans les deux langues
  "RCS Lille Métropole 424 761 419 00045",
  "2 rue Kellermann, 59100 Roubaix, France",
  "Font Awesome Free (Fonticons, Inc.), via react-icons",
  "CC BY 4.0",
  "SIL Open Font License 1.1",
  "AI Fluency for Builders",
  "Building Effective Human-Agent Teams",
  "AI for App Building",
  "Wild Code School · Orléans",
]);

test.describe("Version anglaise", () => {
  test("chaque page a sa langue, son adresse canonique et ses équivalents hreflang", async ({ page }) => {
    for (const p of PAGES) {
      for (const locale of ["fr", "en"] as const) {
        await page.goto(p[locale]);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", ends(p[locale]));
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", ends(p.en));
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      }
    }
  });

  test("un navigateur réglé en anglais reçoit toujours le site français à /, sans redirection", async ({ request }) => {
    const res = await request.get("/", { headers: { "Accept-Language": "en-US,en;q=0.9" }, maxRedirects: 0 });
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('<html lang="fr"');
  });

  test("changer de langue ne recharge pas la page : le fond 3D reste en place, titre et canonique suivent", async ({
    page,
  }) => {
    await page.goto("/");
    // Repères posés dans la page : un rechargement les effacerait
    await page.evaluate(() => {
      Object.assign(window, { sansRechargement: true });
      document.querySelector<HTMLElement>(".fog")!.dataset.repere = "1";
    });
    const kept = () =>
      page.evaluate(() => "sansRechargement" in window && document.querySelector<HTMLElement>(".fog")?.dataset.repere);

    await page.getByRole("link", { name: /Read this page in English/ }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/developer/i);
    await expect(page).toHaveTitle(/Frontend Developer/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en$/);
    expect(await kept()).toBe("1");

    await page.getByRole("link", { name: /Lire cette page en français/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    expect(await kept()).toBe("1");
  });

  test("la langue est annoncée avant l'affichage, et le contenu anglais l'est même sans JavaScript", async ({
    page,
    browser,
  }) => {
    // HTML commun aux deux langues (lang="fr") : le script le passe à "en" avant l'hydratation
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const plain = await noJs.newPage();
    for (const path of ["/en", "/en/legal-notice"]) {
      await plain.goto(path);
      const lang = await plain
        .locator("h1")
        .first()
        .evaluate((h) => h.closest("[lang]")?.getAttribute("lang"));
      expect(lang, path).toBe("en");
    }
    await noJs.close();
  });

  test("le bouton de langue est juste à droite de la maison et mène à la même page", async ({ page }) => {
    await page.goto("/");
    const home = page.getByRole("link", { name: /retour en haut de page/ });
    const toEnglish = page.getByRole("link", { name: /Read this page in English/ });
    await expect(home).toBeVisible();
    await expect(toEnglish).toBeVisible();
    // Les deux positions dans la même image : la barre glisse encore depuis le haut au chargement
    const [h, l] = await page.evaluate(() =>
      [document.querySelector('header a[href="#top"]')!, document.querySelector("header [data-language-switch]")!].map(
        (el) => el.getBoundingClientRect().toJSON() as DOMRect,
      ),
    );
    expect(l.x).toBeGreaterThan(h.x + h.width - 1);
    expect(Math.abs(l.y - h.y)).toBeLessThan(2);
    await expect(toEnglish).toHaveAttribute("hreflang", "en");
    // Le drapeau de la langue affichée (SVG, pas un emoji), aucun texte : le nom vient de l'aria-label
    await expect(toEnglish.locator("svg[aria-hidden='true']")).toHaveCount(1);
    await expect(toEnglish.locator("svg")).toHaveAttribute("data-flag", "fr");
    await expect(toEnglish).toHaveAttribute("title", "Français");
    await expect(toEnglish).toHaveText("");

    await toEnglish.click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    const toFrench = page.getByRole("link", { name: /Lire cette page en français/ });
    await expect(toFrench.locator("svg")).toHaveAttribute("data-flag", "en");
    await expect(toFrench).toHaveAttribute("title", "English");
    await toFrench.click();
    await expect(page).toHaveURL(/\/$/);
  });

  // Mêmes cas que le test unitaire (tests/unit/languageSwitch.test.ts), ici avec un vrai clic
  for (const c of LANGUAGE_SWITCH_CASES) {
    test(`bouton de langue : ${c.from}${c.hash} → ${c.expected}, entièrement traduit`, async ({ page }) => {
      await page.goto(c.from + c.hash);
      const name = c.to === "en" ? /Read this page in English/ : /Lire cette page en français/;
      const button = page.getByRole("link", { name });
      // La destination est dans le href (clic du milieu, nouvel onglet) ; attendre qu'il soit à jour
      await expect(button).toHaveAttribute("href", c.expected);
      await button.click();

      await expect(page).toHaveURL(new RegExp(`${c.expected.replace(/[/#]/g, "\\$&")}$`));
      await expect(page.locator("html")).toHaveAttribute("lang", c.to);
      await expect(page.getByRole("heading", { name: c.heading }).first()).toBeInViewport();
      // Retour possible dans l'autre sens : le bouton propose maintenant la langue de départ
      const back = c.to === "en" ? /Lire cette page en français/ : /Read this page in English/;
      await expect(page.getByRole("link", { name: back })).toHaveAttribute("hreflang", c.to === "en" ? "fr" : "en");
    });
  }

  for (const path of [
    "/",
    "/mentions-legales",
    "/confidentialite",
    "/rien-ici",
    "/en",
    "/en/legal-notice",
    "/en/privacy",
    "/en/nothing-here",
  ]) {
    test(`on reste dans sa langue : aucun lien de ${path} ne change de langue, sauf le bouton`, async ({ page }) => {
      await page.goto(path);
      const english = path.startsWith("/en");
      // Liens internes visibles (pages du site ; l'API du CV n'est pas une page). Seules exceptions :
      // le bouton de langue, et le lien vers la version française qui fait foi (pages légales anglaises)
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>("a[href^='/']")]
          .filter((a) => a.offsetParent !== null && !a.getAttribute("href")!.startsWith("/api/"))
          .filter((a) => !a.matches("[data-language-switch], [data-legal-reference]"))
          .map((a) => a.getAttribute("href")!),
      );
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        const pathOnly = href.split("#")[0];
        expect(pathOnly === "/en" || pathOnly.startsWith("/en/"), `${path} → ${href}`).toBe(english);
      }
    });
  }

  test("chaque section porte l'ancre de sa langue, et le lien d'évitement aussi", async ({ page }) => {
    for (const locale of ["fr", "en"] as const) {
      await page.goto(locale === "fr" ? "/" : "/en");
      for (const anchors of Object.values(SECTION_ANCHORS)) {
        await expect(page.locator(`[id="${anchors[locale]}"]`), anchors[locale]).toHaveCount(1);
      }
      const skip = page.locator("a[href^='#']").first();
      await expect(skip).toHaveAttribute("href", locale === "fr" ? "#contenu" : "#content");
      await expect(page.locator(locale === "fr" ? "main#contenu" : "main#content")).toHaveCount(1);
    }
  });

  test("les anciennes adresses redirigent sans changer de langue", async ({ request }) => {
    for (const [from, to] of [
      ["/home", "/"],
      ["/xp-details/1", "/#experience"],
      ["/en/home", "/en"],
      ["/en/xp-details/1", "/en#experience"],
    ]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(res.headers().location, from).toBe(to);
    }
  });

  test("depuis une page légale, le bouton mène à sa traduction, et « Back to portfolio » à /en", async ({ page }) => {
    await page.goto("/mentions-legales");
    await page.getByRole("link", { name: /Read this page in English/ }).click();
    await expect(page).toHaveURL(/\/en\/legal-notice$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Legal notice");
    // La version française fait foi : la page le dit et y renvoie
    await expect(page.getByRole("link", { name: "French version" })).toHaveAttribute("href", "/mentions-legales");

    await page.getByRole("link", { name: /Back to portfolio/ }).click();
    await expect(page).toHaveURL(/\/en$/);
  });

  test("langue changée sur une page légale : « Back to portfolio » revient à la même section, en anglais", async ({
    page,
  }) => {
    await page.goto("/#projets");
    await page
      .getByRole("navigation", { name: "Informations légales" })
      .getByRole("link", { name: "Mentions légales" })
      .click();
    await expect(page).toHaveURL(/\/mentions-legales$/);
    await page.getByRole("link", { name: /Read this page in English/ }).click();
    await expect(page).toHaveURL(/\/en\/legal-notice$/);
    await page.getByRole("link", { name: /Back to portfolio/ }).click();
    // L'ancre est traduite : #projets → #projects
    await expect(page).toHaveURL(/\/en#projects$/);
    await expect(page.getByRole("heading", { name: /What I build/ })).toBeInViewport();
  });

  test("la navigation et le pied de page anglais mènent aux bonnes ancres et pages", async ({ page, isMobile }) => {
    await page.goto("/en");
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    await page
      .getByRole("navigation", { name: "Sections" })
      .last()
      .getByRole("link", { name: /Projects$/ })
      .click();
    await expect(page).toHaveURL(/\/en#projects$/);
    await expect(page.locator("#projects")).toBeInViewport();

    const legal = page.getByRole("navigation", { name: "Legal information" });
    await expect(legal.getByRole("link", { name: "Legal notice" })).toHaveAttribute("href", "/en/legal-notice");
    await expect(legal.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/en/privacy");
  });

  test("aucun texte français oublié sur les pages anglaises", async ({ page }) => {
    for (const p of PAGES) {
      await page.goto(p.fr);
      const fr = new Set(await texts(page));
      await page.goto(p.en);
      const leftovers = (await texts(page)).filter(
        (t) => fr.has(t) && t.split(" ").length >= 3 && !SAME_IN_BOTH.has(t),
      );
      expect(leftovers, `${p.en} reprend ces textes de ${p.fr}`).toEqual([]);
    }
  });

  test("404 : la page inconnue répond dans la langue de l'adresse", async ({ page }) => {
    const en = await page.goto("/en/nothing-here");
    expect(en?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1, name: "Are you lost?" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Vous vous êtes perdu ?" })).toBeHidden();
    await expect(page).toHaveTitle(/Page not found/);
    await expect(page.getByRole("link", { name: "projects", exact: true })).toHaveAttribute("href", "/en#projects");
    await expect(page.getByRole("link", { name: "contact section" })).toHaveAttribute("href", "/en#contact");
    // Retour sans rechargement : la page d'accueil reprend son titre et sa langue
    await page.getByRole("link", { name: "Back to the portfolio" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page).toHaveTitle(/Frontend Developer/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const fr = await page.goto("/rien-par-ici");
    expect(fr?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1, name: "Vous vous êtes perdu ?" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Are you lost?" })).toBeHidden();
  });

  test("le sitemap liste les six pages avec leurs équivalents", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    for (const p of PAGES) {
      for (const path of [p.fr, p.en]) expect(locs, path).toContain(path);
    }
    expect(xml.match(/<loc>/g)).toHaveLength(6);
    expect(xml.match(/hreflang="en"/g)).toHaveLength(6);
  });

  for (const path of ["/en", "/en/legal-notice", "/en/privacy", "/en/nothing-here"]) {
    test(`aucune violation d'accessibilité sur ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      if (path === "/en") {
        // Amène chaque section à l'écran (une image chacune) pour déclencher les apparitions
        await page.evaluate(async () => {
          for (const el of document.querySelectorAll("main > section, footer")) {
            el.scrollIntoView();
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          }
        });
      }
      // Les cartes finissent d'apparaître après le défilement : on relance l'analyse jusqu'à ce qu'elle soit propre
      const violations = async () =>
        (
          await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()
        ).violations.map((v) => `${v.id} (${v.nodes.length})`);
      await expect.poll(violations, { timeout: 10_000 }).toEqual([]);
    });
  }
});
