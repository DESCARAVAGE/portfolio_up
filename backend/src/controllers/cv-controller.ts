import { Request, Response } from "express";
import { getLatestCvStream } from "../services/cv-service";

export async function downloadLatestCv(_req: Request, res: Response) {
  try {
    const { stream, cv } = await getLatestCvStream();

    res.setHeader("Content-Type", cv.mimeType ?? "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${cv.filename}"`);

    stream.on("error", () => {
      res.status(500).end();
    });

    stream.pipe(res);
  } catch (error) {
    // Message fixe : l'erreur (chemin du fichier, détail de la base) reste dans les journaux
    res.status(404).json({ message: "CV introuvable" });
    console.error(error);
  }
}
