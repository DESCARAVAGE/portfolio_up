import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import request from "supertest";
import { createApp } from "../utils/core";
import { getLatestCvStream } from "../services/cv-service";

/*
 * Tests de la route GET /api/cv/download.
 *
 * Contrairement à ping.spec.tsx (qui mocke la réponse HTTP avec nock),
 * ces tests appellent la vraie application Express via supertest :
 * le routage, le contrôleur et les en-têtes HTTP sont réellement exécutés.
 *
 * Seul le service est simulé, pour ne pas dépendre d'une base PostgreSQL.
 * Le fichier envoyé est le vrai storage/cv.pdf du dépôt.
 */
jest.mock("../services/cv-service");

const mockedGetLatestCvStream = getLatestCvStream as jest.MockedFunction<
  typeof getLatestCvStream
>;

const CV_PATH = path.join(process.cwd(), "storage", "cv.pdf");

// Ligne "cv" telle que TypeORM la renverrait depuis la table cv.
function fakeCv(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    filename: "cv.pdf",
    mimeType: "application/pdf",
    size: fs.statSync(CV_PATH).size,
    url: "cv.pdf",
    dateCreated: new Date("2026-01-01T00:00:00Z"),
    ...overrides,
  } as any;
}

// Récupère le corps de la réponse sous forme de Buffer (fichier binaire).
function binaryParser(res: any, callback: (err: Error | null, body: Buffer) => void) {
  const chunks: Buffer[] = [];
  res.on("data", (chunk: Buffer) => chunks.push(chunk));
  res.on("end", () => callback(null, Buffer.concat(chunks)));
}

describe("GET /api/cv/download", () => {
  const app = createApp();

  beforeEach(() => {
    jest.resetAllMocks();
    // Le contrôleur logue l'erreur dans le cas 404 : on évite de polluer la sortie.
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("le fichier CV existe bien dans storage/ (sinon la route renverra toujours 404)", () => {
    expect(fs.existsSync(CV_PATH)).toBe(true);
    // Un PDF valide commence par la signature "%PDF-"
    expect(fs.readFileSync(CV_PATH).subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("renvoie 200 avec le PDF complet et les bons en-têtes de téléchargement", async () => {
    mockedGetLatestCvStream.mockResolvedValue({
      stream: fs.createReadStream(CV_PATH),
      cv: fakeCv(),
    });

    const res = await request(app)
      .get("/api/cv/download")
      .buffer(true)
      .parse(binaryParser);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    expect(res.headers["content-disposition"]).toBe('attachment; filename="cv.pdf"');

    // Le contenu reçu doit être exactement le fichier sur disque, octet pour octet.
    expect(Buffer.compare(res.body, fs.readFileSync(CV_PATH))).toBe(0);
    expect(mockedGetLatestCvStream).toHaveBeenCalledTimes(1);
  });

  it("utilise le nom de fichier enregistré en base dans Content-Disposition", async () => {
    mockedGetLatestCvStream.mockResolvedValue({
      stream: fs.createReadStream(CV_PATH),
      cv: fakeCv({ filename: "cv-dany-2026.pdf" }),
    });

    const res = await request(app)
      .get("/api/cv/download")
      .buffer(true)
      .parse(binaryParser);

    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toBe(
      'attachment; filename="cv-dany-2026.pdf"'
    );
  });

  it("retombe sur application/pdf si le type MIME est absent en base", async () => {
    mockedGetLatestCvStream.mockResolvedValue({
      stream: fs.createReadStream(CV_PATH),
      cv: fakeCv({ mimeType: null }),
    });

    const res = await request(app)
      .get("/api/cv/download")
      .buffer(true)
      .parse(binaryParser);

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
  });

  it("renvoie 404 quand aucun CV n'est enregistré en base", async () => {
    mockedGetLatestCvStream.mockRejectedValue(new Error("CV record not found"));

    const res = await request(app).get("/api/cv/download");

    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("renvoie 404 quand le fichier du CV est introuvable sur le disque", async () => {
    mockedGetLatestCvStream.mockRejectedValue(new Error("CV file not found"));

    const res = await request(app).get("/api/cv/download");

    expect(res.status).toBe(404);
  });

  it("renvoie 500 si la lecture du fichier échoue pendant l'envoi", async () => {
    // Flux qui échoue dès que le contrôleur commence à le lire,
    // comme un disque qui renvoie une erreur en cours de lecture.
    const brokenStream = new Readable({
      read() {
        this.destroy(new Error("disk read error"));
      },
    });
    mockedGetLatestCvStream.mockResolvedValue({
      stream: brokenStream as unknown as fs.ReadStream,
      cv: fakeCv(),
    });

    const res = await request(app).get("/api/cv/download");

    expect(res.status).toBe(500);
  });

  it("n'accepte pas d'autre méthode que GET", async () => {
    const res = await request(app).post("/api/cv/download");

    expect(res.status).toBe(404);
    expect(mockedGetLatestCvStream).not.toHaveBeenCalled();
  });
});