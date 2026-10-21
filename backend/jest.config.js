/**@type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  // Ne cherche les tests que dans les sources TypeScript,
  // jamais dans le code compilé (dist/) ni dans les dépendances.
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  // Crée un CV de test si storage/cv.pdf est absent (le vrai CV n'est pas versionné)
  globalSetup: "<rootDir>/jest.global-setup.js",
  globals: {
  axios: require("axios"),
 },
};