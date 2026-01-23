import path from "path";
import fs from "fs";

const STORAGE_PATH = path.join(process.cwd(), "storage");

export function getCvFilePath(filename: string): string {
  const filePath = path.join(STORAGE_PATH, filename);

  console.log("Looking for CV at:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("CV file not found");
  }

  return filePath;
}
