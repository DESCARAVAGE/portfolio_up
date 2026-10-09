import express, { Express, Request, Response } from "express";
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
        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    };
};

export { createApp, runServer };