import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const runServer: () => void = (): void => {
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
    /*
     * Create an Express application and get the
     * value of the PORT environment variable
     * from the `process.env`
     */
    if (process.env.PORT) {
        const port: number | undefined = +process.env.PORT;

        const app: Express = express();

        /* Define a route for the root path ("/")
         using the HTTP GET method */
        app.get("/", (req: Request, res: Response) => {
            res.send("Express + TypeScript Server");
        });

        /* Start the Express app and listen
         for incoming requests on the specified port */
        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    };
};

export { runServer };
