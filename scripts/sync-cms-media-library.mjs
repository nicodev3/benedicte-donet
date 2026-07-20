#!/usr/bin/env node
/**
 * Génère la bibliothèque plate Decap CMS :
 * - public/images/cms-library/  → servie en HTTP (prévisualisations CMS)
 * - src/assets/images/uploads/  → miroir des uploads libres pour astro:assets
 *   (WebP + srcset au build ; invisible pour la cliente)
 *
 * Decap ne liste pas les sous-dossiers ; on y copie aussi les images
 * catégorisées sous un nom plat `${catégorie}-${fichier}`.
 *
 * Les fichiers uploadés via le CMS (ex. img_0233.jpeg) sont conservés
 * dans public/ et mirorés dans uploads/ pour l'optimisation Astro.
 */
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "../..");
const assetsRoot = join(root, "src/assets/images");
const publicLibrary = join(root, "public/images/cms-library");
const publicImages = join(root, "public/images");
const uploadsAssets = join(assetsRoot, "uploads");

const imageExt = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const skipDirs = new Set(["cms-library", "uploads"]);

function isImageFile(name) {
  return imageExt.test(name);
}

function listAssetCategories() {
  if (!existsSync(assetsRoot)) return [];
  return readdirSync(assetsRoot).filter((category) => {
    if (skipDirs.has(category)) return false;
    const categoryPath = join(assetsRoot, category);
    return existsSync(categoryPath) && lstatSync(categoryPath).isDirectory();
  });
}

/** True si le fichier ressemble à une copie sync `${catégorie}-…`. */
function isSyncedLibraryName(name, categories) {
  return categories.some((category) => name.startsWith(`${category}-`));
}

function removeObsoleteSyncedFiles(dir, syncedNames, categories) {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    if (entry === ".gitkeep") continue;
    // Préserver les uploads CMS (noms libres, hors préfixe catégorie)
    if (!isSyncedLibraryName(entry, categories)) continue;
    if (syncedNames.has(entry)) continue;
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

function linkLibraries(linkName, category, file) {
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

/**
 * Miroir des uploads CMS libres → src/assets/images/uploads/
 * pour que getOptimizedImage / SiteImage puissent générer WebP + srcset.
 */
function mirrorCmsUploads(categories) {
  mkdirSync(uploadsAssets, { recursive: true });
  mkdirSync(publicLibrary, { recursive: true });

  const kept = new Set([".gitkeep"]);
  let mirrored = 0;

  for (const entry of readdirSync(publicLibrary)) {
    if (entry === ".gitkeep") continue;
    if (isSyncedLibraryName(entry, categories)) continue;
    if (!isImageFile(entry)) continue;

    const source = join(publicLibrary, entry);
    if (!lstatSync(source).isFile()) continue;
    // Ignorer d'éventuels stubs texte (chemins relatifs)
    if (lstatSync(source).size < 256) continue;

    copyFileSync(source, join(uploadsAssets, entry));
    kept.add(entry);
    mirrored++;
  }

  for (const entry of readdirSync(uploadsAssets)) {
    if (kept.has(entry)) continue;
    rmSync(join(uploadsAssets, entry), { recursive: true, force: true });
  }

  writeFileSync(join(uploadsAssets, ".gitkeep"), "");
  return mirrored;
}

const categories = listAssetCategories();
const syncedNames = new Set();
const planned = [];

for (const category of categories) {
  const categoryPath = join(assetsRoot, category);

  for (const file of readdirSync(categoryPath)) {
    if (!isImageFile(file)) continue;

    const source = join(categoryPath, file);
    if (!lstatSync(source).isFile()) continue;

    const linkName = `${category}-${file}`;
    syncedNames.add(linkName);
    planned.push({ linkName, category, file });
  }
}

removeObsoleteSyncedFiles(publicLibrary, syncedNames, categories);

let count = 0;
let preserved = 0;
for (const entry of readdirSync(publicLibrary)) {
  if (entry === ".gitkeep") continue;
  if (!isSyncedLibraryName(entry, categories)) preserved++;
}

for (const { linkName, category, file } of planned) {
  try {
    linkLibraries(linkName, category, file);
    count++;
  } catch (error) {
    console.error(`✗ ${linkName}: ${error.message}`);
  }
}

const mirroredUploads = mirrorCmsUploads(categories);

console.log(
  `✓ ${count} images synchronisées dans public/images/cms-library/` +
    (preserved ? ` (${preserved} upload(s) CMS conservé(s))` : "") +
    (mirroredUploads ? ` → ${mirroredUploads} miroré(s) pour optimisation Astro` : ""),
);
