import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { dataSource } from "./db";
import cvRoutes from "../routes/cv-routes";
import health from "../routes/health-routes";


/*
 * Build the Express application (routes only, no DB connection, no listen).
 * Kept separate from runServer() so tests can exercise the real routes
 * with supertest without starting a server or a database.
 */
function createApp(): Express {
    const app: Express = express();

    // En-têtes de sécurité (nosniff, CSP stricte pour l'API, pas de framing…) ;
    // helmet retire aussi X-Powered-By, qui annonçait Express.
    app.use(helmet());

    // Les réponses de l'API (CV compris) ne doivent pas apparaître dans les moteurs.
    // robots.txt les laisse accessibles exprès : c'est ainsi que les robots voient cette consigne.
    app.use("/api/", (_req: Request, res: Response, next: NextFunction) => {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        next();
    });

    app.use("/api/", health);

    app.use("/api/cv", cvRoutes);

    /* Define a route for the root path ("/")
     using the HTTP GET method */
    app.get("/", (req: Request, res: Response) => {
        res.send("Express + TypeScript Server");
    });

    return app;
}

async function runServer(): Promise<void> {
    /*
     * Load up and parse configuration details from
     * the `.env` file to the `process.env`
     * object of Node.js
     */
    dotenv.config();

    /*
     * Create an Express application and get the
     * value of the PORT environment variable
     * from the `process.env`
     */

    await dataSource.initialize();

    if (process.env.PORT) {
        const port: number | undefined = +process.env.PORT;

        const app: Express = createApp();

        /* Start the Express app and listen
         for incoming requests on the specified port */
        const server = app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });

        /*
         * Arrêt propre (docker stop, redéploiement) : node, lancé directement dans
         * l'image, ne s'arrête pas tout seul sur SIGTERM. On finit les requêtes en
         * cours, on ferme la connexion à la base, puis on sort.
         */
        const shutdown = (signal: string) => {
            console.log(`[server]: ${signal} reçu, arrêt en cours`);
            server.close(() => {
                dataSource
                    .destroy()
                    .catch((error) => console.error(error))
                    .finally(() => process.exit(0));
            });
        };
        process.once("SIGTERM", () => shutdown("SIGTERM"));
        process.once("SIGINT", () => shutdown("SIGINT"));
    };
};

export { createApp, runServer };