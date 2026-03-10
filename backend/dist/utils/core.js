"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = runServer;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const cv_routes_1 = __importDefault(require("../routes/cv-routes"));
const health_routes_1 = __importDefault(require("../routes/health-routes"));
function runServer() {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield db_1.dataSource.initialize();
        if (process.env.PORT) {
            const port = +process.env.PORT;
            const app = (0, express_1.default)();
            app.use("/api/", health_routes_1.default);
            app.use("/api/cv", cv_routes_1.default);
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
    });
}
;
//# sourceMappingURL=core.js.map