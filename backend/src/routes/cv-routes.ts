import { Router } from "express";
import { downloadLatestCv } from "../controllers/cv-controller";

const router = Router();

// Return the CV with the highest id (latest)
router.get("/download", downloadLatestCv);

export default router;