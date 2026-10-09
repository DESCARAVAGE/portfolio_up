import "reflect-metadata"; // requis par les décorateurs TypeORM de l'entité Cv
import fs from "node:fs";
import path from "node:path";
import { getLatestCvStream } from "../services/cv-service";
import { getCvFilePath } from "../storage/cv-storage";
import { dataSource } from "../utils/db";

/*
 * Tests du service et du stockage derrière /api/cv/download.
 *
 * Le service et la résolution du fichier sont réels ; seule la connexion
 * PostgreSQL (dataSource) est simulée.
 */
jest.mock("../utils/db", () => ({
  dataSource: { getRepository: jest.fn() },
}));

const CV_PATH = path.join(process.cwd(), "storage", "cv.pdf");

// Simule repo.createQueryBuilder("cv").orderBy("cv.id", "DESC").getOne()
function mockLatestCvRow(row: unknown) {
  const queryBuilder = {
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(row),
  };
  (dataSource.getRepository as jest.Mock).mockReturnValue({
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
  });
  return queryBuilder;
}

// Lit un flux jusqu'au bout et renvoie son contenu.
function readAll(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (c) => chunks.push(Buffer.from(c)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

describe("cv-service : getLatestCvStream", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // cv-storage logue le chemin cherché : on garde la sortie des tests lisible.
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("demande le CV le plus récent (id décroissant)", async () => {
    const qb = mockLatestCvRow({ id: 3, filename: "cv.pdf", mimeType: "application/pdf" });

    const { stream } = await getLatestCvStream();
    stream.destroy();

    expect(qb.orderBy).toHaveBeenCalledWith("cv.id", "DESC");
  });

  it("renvoie la ligne en base et un flux du vrai fichier", async () => {
    const row = { id: 3, filename: "cv.pdf", mimeType: "application/pdf" };
    mockLatestCvRow(row);

    const { stream, cv } = await getLatestCvStream();

    expect(cv).toBe(row);
    expect(Buffer.compare(await readAll(stream), fs.readFileSync(CV_PATH))).toBe(0);
  });

  it("échoue avec 'CV record not found' quand la table est vide", async () => {
    mockLatestCvRow(null);

    await expect(getLatestCvStream()).rejects.toThrow("CV record not found");
  });

  it("échoue avec 'CV file not found' quand le fichier référencé n'existe pas", async () => {
    mockLatestCvRow({ id: 4, filename: "cv-inexistant.pdf", mimeType: "application/pdf" });

    await expect(getLatestCvStream()).rejects.toThrow("CV file not found");
  });
});

describe("cv-storage : getCvFilePath", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("résout un nom de fichier dans le dossier storage/", () => {
    expect(getCvFilePath("cv.pdf")).toBe(CV_PATH);
  });

  it("accepte un chemin absolu existant", () => {
    expect(getCvFilePath(CV_PATH)).toBe(CV_PATH);
  });

  it("refuse les URL distantes", () => {
    expect(() => getCvFilePath("https://example.com/cv.pdf")).toThrow(
      "Remote URLs are not supported"
    );
  });

  it("échoue si le fichier n'existe pas", () => {
    expect(() => getCvFilePath("absent.pdf")).toThrow("CV file not found");
  });
});