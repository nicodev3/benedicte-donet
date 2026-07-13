#!/usr/bin/env node
/**
 * Génère la bibliothèque plate Decap CMS :
 * - public/images/cms-library/  → servie en HTTP (prévisualisations CMS)
 * - src/assets/images/cms-library/ → résolue par Astro (optimisation build)
 *
 * Decap ne liste pas les sous-dossiers ; les deux dossiers contiennent des
 * liens symboliques plats vers les images catégorisées.
 */
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "../..");
const assetsRoot = join(root, "src/assets/images");
const assetsLibrary = join(assetsRoot, "cms-library");
const publicLibrary = join(root, "public/images/cms-library");
const publicImages = join(root, "public/images");

const imageExt = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const skipDirs = new Set(["cms-library", "uploads"]);

function isImageFile(name) {
  return imageExt.test(name);
}

function clearLibrary(dir) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    if (entry === ".gitkeep") continue;
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function linkLibraries(linkName, category, file) {
  const assetsTarget = join("..", category, file);
  symlinkSync(assetsTarget, join(assetsLibrary, linkName));

  // Copier le fichier réel dans public/images/cms-library/ avec le nom préfixé
  // (les symlinks ne fonctionnent pas en HTTP pour Decap CMS)
  const publicSource = join(assetsRoot, category, file);
  const publicDest = join(publicLibrary, linkName);
  copyFileSync(publicSource, publicDest);

  // Copier aussi dans public/images/ avec la structure d'origine
  // (pour que les paths relatifs comme ../../assets/images/category/file se résolvent correctement)
  const categoryDir = join(publicImages, category);
  mkdirSync(categoryDir, { recursive: true });
  const publicImagesDest = join(categoryDir, file);
  copyFileSync(publicSource, publicImagesDest);
}

clearLibrary(assetsLibrary);
clearLibrary(publicLibrary);

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
    try {
      linkLibraries(linkName, category, file);
      count++;
    } catch (error) {
      console.error(`✗ ${linkName}: ${error.message}`);
    }
  }
}

// Uploads CMS : copier les fichiers réels de public vers src/assets pour l'optimisation Astro
for (const entry of readdirSync(publicLibrary)) {
  if (entry === ".gitkeep") continue;
  const publicPath = join(publicLibrary, entry);
  const assetsPath = join(assetsLibrary, entry);
  if (!existsSync(assetsPath) && lstatSync(publicPath).isFile()) {
    copyFileSync(publicPath, assetsPath);
    console.log(`✓ Upload CMS copié vers assets : ${entry}`);
  }
}

console.log(`✓ ${count} liens créés dans public/ et src/assets/ cms-library/`);
