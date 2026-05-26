import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const MAX_LINES = 200;
const ROOT = process.cwd();
const CODE_EXTENSIONS = new Set([".css", ".js", ".jsx", ".json", ".mjs", ".ts", ".tsx"]);
const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "public",
]);
const IGNORED_FILES = new Set(["next-env.d.ts", "package-lock.json"]);

function hasCodeExtension(filePath) {
  return [...CODE_EXTENSIONS].some((extension) => filePath.endsWith(extension));
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return IGNORED_DIRECTORIES.has(entry.name) ? [] : collectFiles(fullPath);
    }

    if (IGNORED_FILES.has(entry.name) || !hasCodeExtension(entry.name)) {
      return [];
    }

    return [fullPath];
  });
}

function countLines(filePath) {
  const content = readFileSync(filePath, "utf8");
  return content.length === 0 ? 0 : content.split(/\r?\n/).length;
}

const oversizedFiles = collectFiles(ROOT)
  .map((filePath) => ({
    path: relative(ROOT, filePath),
    lines: countLines(filePath),
  }))
  .filter((file) => file.lines > MAX_LINES)
  .sort((a, b) => b.lines - a.lines);

if (oversizedFiles.length > 0) {
  console.error(`Files cannot exceed ${MAX_LINES} lines:`);
  oversizedFiles.forEach((file) => {
    console.error(`- ${file.path}: ${file.lines} lines`);
  });
  process.exit(1);
}

console.log(`All source files are within ${MAX_LINES} lines.`);
