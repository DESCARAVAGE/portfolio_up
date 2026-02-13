import { Router } from "express";
import { downloadCv } from "../controllers/cv-controller";
// import { uploadCv } from "../controllers/cv-controller";

const router = Router();

router.get("/download", downloadCv);

// router.post("/upload", uploadCv);


export default router;