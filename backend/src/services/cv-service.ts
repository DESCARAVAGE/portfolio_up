import fs from "fs";
import { getCvFilePath } from "../storage/cv-storage";
import { dataSource } from "../utils/db";
import { Cv } from "../entities/cv-entities";

export async function getLatestCvStream() {
  const repo = dataSource.getRepository(Cv);
  const cv = await repo.createQueryBuilder("cv").orderBy("cv.id", "DESC").getOne();
  if (!cv) throw new Error("CV record not found");

  const filePath = getCvFilePath(cv.filename);
  const stream = fs.createReadStream(filePath);
  return { stream, cv };
}

// import fs from "fs";
// import { getCvFilePath } from "../storage/cv-storage";

// export function getCvStream() {
//   const filePath = getCvFilePath('cv.pdf');
//   return fs.createReadStream(filePath);
// }