import fs from "fs";
// import { db } from "../dbConfig";
import { getCvFilePath } from "../storage/cv.storage";
import { resolve } from "dns";

export function getCvStream() {
  const filePath = getCvFilePath('LeadDeveloper.pdf');
  return fs.createReadStream(filePath);
}

// export function saveCvMetadata(file: Express.Multer.File) {
//   return new Promise<void>((resolve, reject) => {
//     db.run(
//       `
//       INSERT INTO cv (filename, filepath, uploaded_at)
//       VALUES (?, ?, ?)
//       `,
//       [
//         file.filename,
//         file.path,
//         new Date().toISOString(),
//       ],
//       (err: any) => {
//         if (err) reject(err);
//         else resolve();
//       }
//     )
//   })
// }