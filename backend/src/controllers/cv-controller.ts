import { Request, Response } from "express";
import { getCvStream } from "../services/cv-service";

export function downloadCv(_req: Request, res: Response) {
    try {
        const stream = getCvStream();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Dispositon", 'attachment; filename="exemple.pdf');

        stream.pipe(res);
    } catch (error) {
        res.status(404).json({ message: "Cv not available" });
    }
}