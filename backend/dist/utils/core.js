"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const runServer = () => {
    /*
     * Load up and parse configuration details from
     * the `.env` file to the `process.env`
     * object of Node.js
     */
    dotenv_1.default.config();
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
        const port = +process.env.PORT;
        const app = (0, express_1.default)();
        /* Define a route for the root path ("/")
         using the HTTP GET method */
        app.get("/", (req, res) => {
            res.send("Express + TypeScript Server");
        });
        /* Start the Express app and listen
         for incoming requests on the specified port */
        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    }
    ;
};
exports.runServer = runServer;
//# sourceMappingURL=core.js.map