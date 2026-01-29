import multer from "multer";
import path from "path";
import fs from "fs"; // Opération sur OS

const storagePath = path.resolve("storage");

// créer le dossier au boot si nécessaire
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

export const uploadCvMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, storagePath); // dossier UNIQUEMENT
    },
    filename: (_req, file, cb) => {
      cb(null, file.originalname); // nom réel du fichier
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
