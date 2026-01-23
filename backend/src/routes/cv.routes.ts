import { Router } from "express";
import { downloadCv } from "../controllers/cv.controller";

const router = Router();

router.get("/download", downloadCv);

export default router;
