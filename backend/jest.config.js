/**@type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  // Ne cherche les tests que dans les sources TypeScript,
  // jamais dans le code compilé (dist/) ni dans les dépendances.
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  globals: {
  axios: require("axios"),
 },
};