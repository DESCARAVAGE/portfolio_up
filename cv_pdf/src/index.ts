import express, { Response, Request } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const port = 8000;

app.use(cors());

app.get("/cv_pdf", (_: Request, res: Response) => {
    res.send("Hello World !");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}/cv_pdf`);
});
