/*
 * Avant les tests : le vrai CV n'est plus dans le dépôt (il contient des
 * coordonnées personnelles). Si storage/cv.pdf est absent (CI, clone neuf),
 * on crée un PDF minimal sans aucune donnée personnelle. Un vrai CV présent
 * en local n'est jamais remplacé.
 */
const fs = require("node:fs");
const path = require("node:path");

module.exports = async function createTestCv() {
  const dir = path.join(process.cwd(), "storage");
  const file = path.join(dir, "cv.pdf");
  if (fs.existsSync(file)) return;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    file,
    "%PDF-1.4\n% CV de test, sans donnee personnelle\n1 0 obj << >> endobj\ntrailer << >>\n%%EOF\n",
  );
};
