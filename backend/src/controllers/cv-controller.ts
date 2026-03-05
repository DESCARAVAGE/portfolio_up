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
    res.status(404).json({ message: "Cv not available" });
  }
}

// import { Request, Response } from "express";
// import { getCvStream } from "../services/cv-service";

// export function downloadCv(_req: Request, res: Response) {
//     try {
//         const stream = getCvStream();

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Dispositon", 'attachment; filename="cv.pdf');

//         stream.pipe(res);
//     } catch (error) {
//         res.status(404).json({ message: "Cv not available" });
//     }
// }


