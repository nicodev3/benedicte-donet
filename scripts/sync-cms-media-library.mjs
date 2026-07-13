#!/usr/bin/env node
/**
 * Génère src/assets/images/cms-library/ : dossier plat de liens symboliques
 * vers toutes les images catégorisées, pour la bibliothèque Media Decap CMS
 * (qui ne liste pas les sous-dossiers récursivement).
 */
import { existsSync, lstatSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "../..");
const assetsRoot = join(root, "src/assets/images");
const cmsLibrary = join(assetsRoot, "cms-library");

const imageExt = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const skipDirs = new Set(["cms-library", "uploads"]);

function isImageFile(name) {
  return imageExt.test(name);
}

mkdirSync(cmsLibrary, { recursive: true });

// Supprimer les anciens liens (conserver .gitkeep)
for (const entry of readdirSync(cmsLibrary)) {
  if (entry === ".gitkeep") continue;
  const full = join(cmsLibrary, entry);
  rmSync(full, { recursive: true, force: true });
}

let count = 0;
for (const category of readdirSync(assetsRoot)) {
  const categoryPath = join(assetsRoot, category);
  if (!existsSync(categoryPath) || !lstatSync(categoryPath).isDirectory()) continue;
  if (skipDirs.has(category)) continue;

  for (const file of readdirSync(categoryPath)) {
    if (!isImageFile(file)) continue;

    const source = join(categoryPath, file);
    if (!lstatSync(source).isFile()) continue;

    const linkName = `${category}-${file}`;
    const linkPath = join(cmsLibrary, linkName);
    const target = join("..", category, file);

    try {
      symlinkSync(target, linkPath);
      count++;
    } catch (error) {
      console.error(`✗ ${linkName}: ${error.message}`);
    }
  }
}

console.log(`✓ ${count} liens créés dans src/assets/images/cms-library/`);
