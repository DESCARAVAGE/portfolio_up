import path from "node:path";
import { defineConfig } from "vitest/config";

/** Tests unitaires (fonctions pures, sans navigateur) : pnpm test:unit. Les tests e2e sont dans tests/e2e. */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
