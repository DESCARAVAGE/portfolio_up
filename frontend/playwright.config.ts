import { defineConfig, devices } from "@playwright/test";

/**
 * Tests de bout en bout du portfolio, sur le build de production.
 * En local : `pnpm build && pnpm test:e2e` (le serveur est lancé automatiquement).
 * Pour viser un site déjà lancé : BASE_URL=http://localhost:3000 pnpm test:e2e
 */
const PORT = 3100;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "ordinateur", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `pnpm start --port ${PORT}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
