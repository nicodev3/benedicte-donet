#!/usr/bin/env node
/**
 * Migre tous les chemins d'images dans les fichiers markdown
 * de ../../assets/images/... vers /images/...
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, lstatSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "../..");
const contentDir = join(root, "src/content");

const normalizeImagePath = (path) => {
  if (!path) return path;
  const match = path.match(/(?:\.\.\/)*assets\/images\/(.+)$/);
  if (match) return `/images/${match[1]}`;
  return path;
};

function migrateMarkdownFile(filePath) {
  let content = readFileSync(filePath, "utf-8");
  let modified = false;

  // Normaliser les chemins dans le frontmatter YAML
  content = content.replace(
    /^(image:\s*)(["']?)(?:\.\.\/)*assets\/images\/(.+?)\2$/gm,
    (match, prefix, quote, imagePath) => {
      console.log(`  Frontmatter: ${imagePath}`);
      modified = true;
      return `${prefix}${quote}/images/${imagePath}${quote}`;
    }
  );

  // Normaliser les chemins dans le markdown pour les images inline
  content = content.replace(
    /!\[([^\]]*)\]\((?:\.\.\/)*assets\/images\/([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (match, alt, imagePath, title) => {
      console.log(`  Inline: ${imagePath}`);
      modified = true;
      return title ? `![${alt}](/images/${imagePath} "${title}")` : `![${alt}](/images/${imagePath})`;
    }
  );

  if (modified) {
    writeFileSync(filePath, content, "utf-8");
    console.log(`✓ Migré: ${filePath}`);
  }

  return modified;
}

function walkContent(dir) {
  const entries = readdirSync(dir);
  let totalFiles = 0;
  let migratedFiles = 0;

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = lstatSync(fullPath);

    if (stat.isDirectory()) {
      const result = walkContent(fullPath);
      totalFiles += result.total;
      migratedFiles += result.migrated;
    } else if (entry.endsWith(".md")) {
      totalFiles++;
      if (migrateMarkdownFile(fullPath)) {
        migratedFiles++;
      }
    }
  }

  return { total: totalFiles, migrated: migratedFiles };
}

console.log("Début de la migration des chemins d'images...\n");
const result = walkContent(contentDir);

console.log(`\n✓ Migration complète!`);
console.log(`  Total de fichiers: ${result.total}`);
console.log(`  Fichiers modifiés: ${result.migrated}`);
