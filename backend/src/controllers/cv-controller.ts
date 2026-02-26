import { Request, Response } from "express";
import { getCvStream } from "../services/cv-service";

export function downloadCv(_req: Request, res: Response) {
    try {
        const stream = getCvStream();

        // en HTTP, un téléchargement repose sur les Headers de réponse, lien avec le type 
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="exemple.pdf');

        stream.pipe(res);
    } catch (error) {
        res.status(404).json({ message: "Cv not available" });
    }
}

// export function uploadCv(_req: Request, res: Response) {

// }
