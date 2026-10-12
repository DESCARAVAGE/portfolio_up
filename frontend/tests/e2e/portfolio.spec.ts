import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

/** Coupe le défilement fluide : les tests vérifient la destination, pas l'animation. */
async function instantScroll(page: Page) {
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
}

test.describe("Contenu et structure", () => {
  test("le titre principal donne le nom et le poste, sans erreur dans la console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("Daniel Escaravage");
    await expect(h1).toContainText("Développeur Frontend");
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test("chaque section a un titre de niveau 2", async ({ page }) => {
    await page.goto("/");
    for (const id of [
      "en-bref",
      "experience",
      "projets",
      "competences",
      "approche",
      "vision",
      "formation",
      "contact",
    ]) {
      await expect(page.locator(`#${id} h2`).first(), `#${id}`).toBeAttached();
    }
  });
});

test.describe("Navigation", () => {
  test("chaque lien du menu mène à une section qui existe", async ({ page, isMobile }) => {
    await page.goto("/");
    await instantScroll(page);
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();

    // Liens internes seulement (la barre contient aussi le bouton LinkedIn)
    const links = page.getByRole("navigation", { name: "Sections" }).last().locator('a[href^="#"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(5);

    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href).toMatch(/^#/);
      await expect(page.locator(href!), href!).toHaveCount(1);
    }

    // Un clic amène bien la section à l'écran
    await links.filter({ hasText: "Formation" }).click();
    await expect(page.locator("#formation h2")).toBeInViewport();
  });

  test("le lien d'évitement mène au contenu principal", async ({ page, isMobile }) => {
    test.skip(isMobile, "navigation clavier : ordinateur uniquement");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Aller au contenu" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await expect(skip).toHaveAttribute("href", "#contenu");
  });

  test("les liens externes s'ouvrent dans un nouvel onglet, en sécurité", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[href^="http"]');
    const count = await external.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(external.nth(i)).toHaveAttribute("target", "_blank");
      await expect(external.nth(i)).toHaveAttribute("rel", /noreferrer/);
    }
  });
});

test.describe("Accessibilité (axe-core, WCAG 2.2 AA)", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`aucune violation en thème ${colorScheme === "light" ? "clair" : "sombre"}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto("/");
      await instantScroll(page);
      // Fait défiler toute la page pour déclencher les apparitions
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await page.waitForTimeout(800);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id} (${v.nodes.length})`)).toEqual([]);
    });
  }
});

test.describe("Vidéo de démonstration", () => {
  test("rien n'est téléchargé avant le clic, puis la vidéo se lance", async ({ page }) => {
    const videoRequests: string[] = [];
    page.on("request", (r) => r.url().includes("/videos/") && videoRequests.push(r.url()));

    await page.goto("/");
    await instantScroll(page);
    const play = page.getByRole("button", { name: /^Voir la démo/ });
    await play.scrollIntoViewIfNeeded();
    expect(videoRequests).toEqual([]);

    await play.click();
    const video = page.locator("#projets video");
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused), { timeout: 10_000 }).toBe(true);
    await expect(page.getByRole("button", { name: "Mettre la vidéo en pause" })).toBeVisible();
  });
});

test.describe("Mouvement réduit et robustesse", () => {
  test("avec mouvement réduit, pas de brouillard 3D : le fond CSS reste", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.mouse.move(200, 200);
    await page.waitForTimeout(2500);
    await expect(page.locator(".fog canvas")).toHaveCount(0);
  });

  test("le bouton de thème change aussi le fond de page, même sans brouillard", async ({ page }) => {
    // Système en sombre, mouvement réduit (pas de brouillard) : seul le fond CSS est visible
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.goto("/");
    const bodyBg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(await bodyBg()).toBe("rgb(5, 5, 5)");

    await page.getByRole("button", { name: /thème clair/ }).click();
    await expect.poll(bodyBg).toBe("rgb(244, 244, 242)");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("sans JavaScript, le titre et les projets restent lisibles", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const project = page.getByRole("heading", { name: "Système agentique de génération de sites web" });
    await project.scrollIntoViewIfNeeded();
    await expect(project).toBeVisible();
    await expect
      .poll(() => project.evaluate((el) => getComputedStyle(el.closest(".surface__content")!).opacity))
      .toBe("1");
    await context.close();
  });
});

test.describe("Référencement et partage", () => {
  test("métadonnées de partage, données structurées, robots et sitemap", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(JSON.parse(jsonLd!)).toMatchObject({ "@type": "Person", name: "Daniel Escaravage" });

    for (const path of ["/robots.txt", "/sitemap.xml", "/opengraph-image"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });
});

test.describe("Intégration portfolio_up", () => {
  test("les anciennes URL du portfolio Vite redirigent de façon permanente", async ({ request }) => {
    const home = await request.get("/home", { maxRedirects: 0 });
    expect(home.status()).toBe(308);
    expect(home.headers().location).toBe("/");

    const xp = await request.get("/xp-details/1", { maxRedirects: 0 });
    expect(xp.status()).toBe(308);
    expect(xp.headers().location).toBe("/#experience");
  });

  test("les liens de CV pointent vers la route du backend", async ({ page }) => {
    await page.goto("/");
    const links = page.locator('a[href="/api/cv/download"]');
    await expect(links).toHaveCount(2);
    await expect(links.first()).toHaveAttribute("download", /\.pdf$/);
  });

  test("le CV se télécharge à travers la passerelle nginx", async ({ request }) => {
    // Le serveur Next seul ne sert pas /api : ce test ne tourne que contre la stack Docker complète.
    test.skip(!process.env.BASE_URL, "nécessite BASE_URL (stack docker compose)");
    const res = await request.get("/api/cv/download");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("application/pdf");
    expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });
});

test.describe("Contact", () => {
  const EMAIL = "danysk.epro@gmail.com";

  test("« M'écrire » et les autres liens e-mail visent la bonne adresse", async ({ page }) => {
    await page.goto("/");
    const write = page.getByRole("link", { name: "M'écrire", exact: true });
    await expect(write).toHaveAttribute("href", `mailto:${EMAIL}`);

    // Grand titre « on en parle ? », bouton « M'écrire » et adresse en clair
    const hrefs = await page
      .locator('a[href^="mailto:"]')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    expect(new Set(hrefs)).toEqual(new Set([`mailto:${EMAIL}`]));

    // Le clic confie l'e-mail au logiciel de messagerie : la page ne doit ni changer ni planter
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const url = page.url();
    await write.click();
    await expect(page).toHaveURL(url);
    expect(errors).toEqual([]);
  });

  test("« Copier l'adresse » copie l'e-mail et l'annonce", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const button = page.locator("#contact").getByRole("button");
    await expect(button).toHaveText("Copier l'adresse");

    await button.click();
    await expect(button).toHaveText("Adresse copiée ✓");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);

    // Le libellé revient tout seul après la confirmation
    await expect(button).toHaveText("Copier l'adresse", { timeout: 5_000 });
  });

  test("les deux boutons de CV téléchargent le PDF", async ({ page }) => {
    // Le serveur Next seul ne sert pas /api : ce test ne tourne que contre la stack Docker complète.
    test.skip(!process.env.BASE_URL, "nécessite BASE_URL (stack docker compose)");
    await page.goto("/");

    for (const name of ["Télécharger mon CV", "Mon CV"]) {
      const link = page.getByRole("link", { name, exact: true });
      const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
      expect(download.suggestedFilename(), name).toMatch(/\.pdf$/i);
      const content = await readFile(await download.path());
      expect(content.subarray(0, 5).toString(), name).toBe("%PDF-");
    }
  });
});

test.describe("Version", () => {
  test("le pied de page affiche la version de package.json", async ({ page }) => {
    const { version } = JSON.parse(await readFile("package.json", "utf8"));
    await page.goto("/");
    await expect(page.locator("#contact")).toContainText(`v${version}`);
  });
});

test.describe("Brouillard économe en mémoire", () => {
  /** Réveille le brouillard (comme un premier geste). Renvoie false si WebGL est indisponible. */
  async function wakeFog(page: Page) {
    await page.goto("/");
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    return page
      .locator(".fog[data-ready] canvas")
      .waitFor({ state: "attached", timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
  }

  test("contexte WebGL minimal et canvas en basse résolution", async ({ page, isMobile }) => {
    test.skip(!(await wakeFog(page)), "WebGL indisponible ici : le fond CSS reste, rien à mesurer");
    const info = await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>(".fog canvas")!;
      const attrs = canvas.getContext("webgl")?.getContextAttributes();
      return { attrs, width: canvas.width, screen: window.innerWidth * window.devicePixelRatio };
    });
    expect(info.attrs).toMatchObject({ alpha: false, antialias: false, depth: false, stencil: false });
    // Densité de l'écran divisée par 4 sur mobile, par 2 sur ordinateur
    expect(info.width).toBeLessThanOrEqual(Math.ceil(info.screen / (isMobile ? 4 : 2)) + 1);
  });

  test("si le système reprend le contexte WebGL, le fond CSS prend le relais", async ({ page }) => {
    test.skip(!(await wakeFog(page)), "WebGL indisponible ici : le fond CSS reste, rien à mesurer");
    await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>(".fog canvas")!;
      canvas.getContext("webgl")?.getExtension("WEBGL_lose_context")?.loseContext();
    });
    await expect(page.locator(".fog canvas")).toHaveCount(0);
    await expect(page.locator(".fog")).not.toHaveAttribute("data-ready");
  });

  test("sur écran tactile, une carte en verre n'a qu'un seul calque de flou", async ({ page, isMobile }) => {
    await page.goto("/");
    const display = (selector: string) =>
      page
        .locator(`.surface--glass ${selector}`)
        .first()
        .evaluate((el) => getComputedStyle(el).display);
    // Anneau et reflet : remplacés par une bordure fixe sur mobile, gardés avec une souris
    const expected = isMobile ? "none" : "block";
    expect(await display(".surface__edge")).toBe(expected);
    expect(await display(".surface__shine")).toBe(expected);
  });
});

test.describe("Fond adapté à l'appareil", () => {
  const INSTAGRAM_IPHONE =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 400.0.0.0.0 (iPhone15,2; iOS 18_6; fr_FR; fr; scale=3.00; 1179x2556)";
  const IPHONE = { viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true };
  const offer = (page: Page) => page.getByRole("button", { name: "Activer le fond 3D" });

  /** WebGL est-il disponible dans ce navigateur de test ? (sinon, rien à vérifier sur le canvas) */
  async function webglAvailable(page: Page) {
    return page.evaluate(() => !!document.createElement("canvas").getContext("webgl"));
  }

  test("ordinateur : 3D complète ; téléphone : 3D allégée", async ({ page, isMobile }) => {
    await page.goto("/");
    await expect(page.locator(".fog")).toHaveAttribute("data-tier", isMobile ? "lite" : "full");
    await expect(offer(page)).toHaveCount(0);
  });

  test("mouvement réduit : ni 3D, ni bouton pour l'activer", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".fog")).toHaveAttribute("data-tier", "off");
    await expect(offer(page)).toHaveCount(0);
  });

  test("navigateur d'Instagram : fond CSS, et la 3D se lance au choix du visiteur", async ({ browser }) => {
    const context = await browser.newContext({ ...IPHONE, userAgent: INSTAGRAM_IPHONE });
    const page = await context.newPage();
    await page.goto("/");
    const fog = page.locator(".fog");
    await expect(fog).toHaveAttribute("data-tier", "offer");

    // Un geste ne lance pas la 3D ici
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await page.waitForTimeout(1500);
    await expect(page.locator(".fog canvas")).toHaveCount(0);

    // Le bouton est lisible, accessible, et indique comment avoir la version complète
    await expect(offer(page)).toBeVisible();
    await expect(page.getByText("ouvrir le lien dans le navigateur")).toBeVisible();
    const a11y = await new AxeBuilder({ page })
      .include("aside")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(a11y.violations.map((v) => v.id)).toEqual([]);

    await offer(page).click();
    await expect(fog).toHaveAttribute("data-tier", "lite");
    await expect(offer(page)).toHaveCount(0);
    if (await webglAvailable(page)) {
      await expect(page.locator(".fog[data-ready] canvas")).toHaveCount(1, { timeout: 10_000 });
    }

    // Le choix est retenu pour la visite suivante
    await page.reload();
    await expect(fog).toHaveAttribute("data-tier", "lite");
    await expect(offer(page)).toHaveCount(0);
    await context.close();
  });

  test("le bouton peut être masqué", async ({ browser }) => {
    const context = await browser.newContext({ ...IPHONE, userAgent: INSTAGRAM_IPHONE });
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "Masquer" }).click();
    await expect(offer(page)).toHaveCount(0);
    await expect(page.locator(".fog canvas")).toHaveCount(0);
    await context.close();
  });

  test("appareil à faible mémoire : la 3D est proposée, pas imposée", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(Navigator.prototype, "deviceMemory", { get: () => 1 }));
    await page.goto("/");
    await expect(page.locator(".fog")).toHaveAttribute("data-tier", "offer");
    await expect(offer(page)).toBeVisible();
  });

  test("si l'appareil peine, la qualité baisse toute seule", async ({ page, isMobile }) => {
    test.skip(isMobile, "un seul cas suffit : on part de la qualité complète (ordinateur)");
    await page.goto("/");
    test.skip(!(await webglAvailable(page)), "WebGL indisponible ici : rien à mesurer");
    const fog = page.locator(".fog");
    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await expect(fog).toHaveAttribute("data-quality", "full", { timeout: 10_000 });
    // Processeur 20 fois plus lent pendant la mesure : les images arrivent en retard
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 20 });
    await expect(fog).toHaveAttribute("data-quality", /^(lite|low)$/, { timeout: 20_000 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  });
});

test.describe("LinkedIn et GitHub", () => {
  const PROFILES = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/escaravage-daniel" },
    { name: "GitHub", href: "https://github.com/descaravage" },
  ];

  test("boutons au centre de la barre de navigation et dans le pied de page", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("banner");

    for (const { name, href } of PROFILES) {
      for (const zone of [banner, page.locator("#contact")]) {
        const link = zone.getByRole("link", { name: new RegExp(name) });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link.locator("svg")).toHaveCount(1); // le logo est dessiné
      }
    }

    // Les deux boutons, ensemble, sont centrés dans la barre (à quelques pixels près)
    const bar = await banner.locator(".surface").first().boundingBox();
    const first = await banner.getByRole("link", { name: /LinkedIn/ }).boundingBox();
    const last = await banner.getByRole("link", { name: /GitHub/ }).boundingBox();
    const middle = (first!.x + last!.x + last!.width) / 2;
    expect(Math.abs(middle - (bar!.x + bar!.width / 2))).toBeLessThan(4);
  });
});
