import { Request, Response } from "express";
import { getCvStream /*, saveCvMetadata*/ } from "../services/cv-service";

export function downloadCv(_req: Request, res: Response) {
  try {
    const stream = getCvStream();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="LeadDeveloper.pdf"'
    );

    stream.pipe(res);
  } catch (error) {
    res.status(404).json({ message: "CV not available" });
  }
}

export async function uploadCv(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // await saveCvMetadata(req.file);

  res.status(201).json({
    message: "CV uploaded successfully",
    filename: req.file.filename,
    path: "/storage/" + req.file.filename,
  });
}