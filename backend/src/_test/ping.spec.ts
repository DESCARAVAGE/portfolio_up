import request from "supertest"; // envoie de vraies requêtes HTTP à l'app Express
import { createApp } from "../utils/core";

/*
 * Vérifie que le backend répond sur ses routes de base.
 *
 * Ces tests appellent la vraie application Express (pas de mock HTTP) :
 * si une route est supprimée ou mal branchée, ils échouent.
 */
describe("Ping backend", () => {
  const app = createApp();

  /**
   * TEST 1
   * Vérifie que le backend répond sur la route GET "/"
   */
  it("responds on GET / with server message", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("Express + TypeScript Server");
  });

  /**
   * TEST 2
   * Vérifie que le backend répond sur la route GET "/api/health"
   */
  it("responds on GET /api/health with status ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    // date au format JJ/MM/AAAA et heure au format HH:MM:SS (Europe/Paris)
    expect(res.body.date).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    expect(res.body.time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  /**
   * TEST 3
   * Vérifie qu'une route inconnue renvoie 404
   */
  it("responds 404 on an unknown route", async () => {
    const res = await request(app).get("/api/route-inexistante");

    expect(res.status).toBe(404);
  });
});