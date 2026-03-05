import axios from "axios"; // client HTTP pour faire la requête dans le test
import nock from "nock"; // outil pour mocker les réponses HTTP

//
const { Pool } = require('pg');

describe("Ping backend", () => {
  const host = "http://localhost:3001"; // hôte utilisée par les tests
  let pgPool;

  beforeAll(() => {
    axios.defaults.baseURL = host; // configure axios pour pointer vers l'hôte mocké
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL
    });
  });

  afterAll(async () => {
    nock.cleanAll(); // nettoie les mocks nock après les tests
    delete axios.defaults.baseURL; // restaure la config d'axios
    await pgPool.end();
  });

  /**
   * TEST 1
   * Vérifie que le backend répond sur la route GET "/"
   */
  it("responds on GET / with server message", async () => {
    // mock: quand on GET sur '/' pour cet hôte, renvoie 200 et le texte attendu
    nock(host).get("/").reply(200, "Express + TypeScript Server");

    // exécution: effectuer la requête HTTP via axios
    const res = await axios.get("/");

    // assertions: vérifier le statut et le corps de la réponse
    expect(res.status).toBe(200);
    expect(res.data).toBe("Express + TypeScript Server");
  });

  /**
   * TEST 2
   * Vérifie que le backend répond sur la route GET "/api/health"
   */
  it("responds on GET /api/health with server message", async () => {
    // mock: quand on GET sur '/api/health' pour ce hôte, renvoie 200 et le status attendu
    nock(host).get("/api/health").reply(200, "ok");
 
    // exécution: effectuer la requête HTTP via axios
    const res = await axios.get("/api/health");

    // assertions: vérifier le statut et le corps de la réponse
    expect(res.status).toBe(200);
    expect(res.data).toBe("ok")
  });
});
