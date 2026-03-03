import fs from "fs";
import { getCvFilePath } from "../storage/cv-storage";

export function getCvStream() {
  const filePath = getCvFilePath('cv.pdf');
  return fs.createReadStream(filePath);
}