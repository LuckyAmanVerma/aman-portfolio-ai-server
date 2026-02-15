import path from "path";
import fs from "fs";

export function loadDocuments() {
  const dataPath = path.join(process.cwd(), "src", "data");

  const files = fs.readdirSync(dataPath);

  let combinedText = "";

  for (const file of files) {
    const filePath = path.join(dataPath, file);
    const content = fs.readFileSync(filePath, "utf-8");

    combinedText += `\n\nSource: ${file}\n${content}`;
  }

  return combinedText;
}
