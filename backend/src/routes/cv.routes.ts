import { Router } from "express";
import { downloadCv } from "../controllers/cv.controller";
import { uploadCv } from "../controllers/cv.controller";
import { uploadCvMiddleware } from "../middlewares/upload.middleware";

const router = Router();

router.get("/download", downloadCv);

router.post("/upload", uploadCvMiddleware.single("cv") , uploadCv)

export default router;
