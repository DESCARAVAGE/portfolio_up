import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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

    const links = page.getByRole("navigation", { name: "Sections" }).last().getByRole("link");
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
