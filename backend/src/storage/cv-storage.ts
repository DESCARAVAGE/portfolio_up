import path from "node:path";
import fs from "node:fs";

const STORAGE_PATH = path.join(process.cwd(), "storage");

export function getCvFilePath(urlOrFilename: string): string {
  // If remote URL -> not supported here (could be implemented later)
  if (urlOrFilename.startsWith("http://") || urlOrFilename.startsWith("https://")) {
    throw new Error("Remote URLs are not supported by local storage resolver");
  }

  // Absolute path: use as-is
  if (path.isAbsolute(urlOrFilename)) {
    if (!fs.existsSync(urlOrFilename)) throw new Error("CV file not found");
    return urlOrFilename;
  }

  // Otherwise treat as filename inside storage dir
  const filePath = path.join(STORAGE_PATH, urlOrFilename);
  console.log("Looking for CV at:", filePath);
  if (!fs.existsSync(filePath)) {
    throw new Error("CV file not found");
  }
  return filePath;
}
