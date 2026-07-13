#!/usr/bin/env node
/**
 * Migration des images : public/images/wp → src/assets/images/{category}/
 * avec renommage selon la convention du projet.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "../..");
const publicWp = join(root, "public/images/wp");
const assetsWp = join(root, "src/assets/images/wp");
const assetsRoot = join(root, "src/assets/images");

/** @type {Record<string, string>} old filename → new path relative to src/assets/images */
const mapping = {
  // ui
  "logo-benedicte-donet.png": "ui/logo-benedicte-donet.png",
  "benedicte-donet-psychologue.png": "ui/logo-benedicte-donet-text.png",
  "whatsapp-1.svg": "ui/icon-whatsapp.svg",
  "gmail-1.svg": "ui/icon-gmail.svg",
  "newsletter.svg": "ui/icon-newsletter.svg",
  "fleche.png": "ui/icon-arrow.png",

  // heroes
  "hero-blog.png": "heroes/hero-blog.png",
  "hero-a-propos.png": "heroes/hero-a-propos.png",
  "hero-infos-pratiques.png": "heroes/hero-infos-pratiques.png",
  "hero-sexualite.png": "heroes/hero-masterclass.png",
  "banniere-2.png": "heroes/hero-accueil-desktop.png",
  "banniere-smartphone-accueil.png": "heroes/hero-accueil-mobile.png",
  "annie-spratt-ZUULm-nourc-unsplash.jpg": "heroes/hero-services.jpg",
  "annie-spratt-ZUULm-nourc-unsplash.jpg.webp": "heroes/hero-psychotherapie.webp",

  // backgrounds
  "banniere.png": "backgrounds/bg-rendez-vous-desktop.png",
  "Accueil-2.png": "backgrounds/bg-rendez-vous-mobile.png",
  "bg-citation-2.png": "backgrounds/bg-citation.png",
  "NL.png": "backgrounds/bg-newsletter.png",
  "kien-do-NjT4O7WYmwk-unsplash-scaled.jpg.webp": "backgrounds/bg-contact.webp",

  // portraits
  "bene-accueil-1.png": "portraits/portrait-accueil.png",
  "bene-page-accueil.png": "portraits/portrait-a-propos.png",
  "Portrait-infos-pratiques.png": "portraits/portrait-infos-pratiques.png",
  "portrait-infos-pratiques-1.png": "portraits/portrait-infos-pratiques-02.png",
  "autoportrait-Bene.png": "portraits/portrait-autoportrait.png",
  "benedicte-Teleconsultation.png": "portraits/portrait-teleconsultation.png",
  "DSCF0359.jpg": "portraits/portrait-01.jpg",
  "DSC07682.jpg": "portraits/portrait-02.jpg",
  "DSC07154.jpg": "portraits/portrait-emdr-01.jpg",
  "DSC06705.jpg": "portraits/portrait-masterclass.jpg",
  "DSCF1201.jpg": "portraits/portrait-emdr-02.jpg",
  "DSCF1217.jpg": "portraits/portrait-masterclass-meditation.jpg",

  // phototherapie
  "DSCF4124-scaled.jpg": "phototherapie/photo-phototherapie-cover.jpg",
  "20200802Bene_Clara-one-step-closer-to-love_1022-scaled.jpg":
    "phototherapie/photo-phototherapie-01.jpg",
  "DSCF1587-scaled.jpg": "phototherapie/photo-phototherapie-02.jpg",
  "DSCF5037-scaled.jpg": "phototherapie/photo-phototherapie-03.jpg",
  "DSCF5669-scaled.jpg": "phototherapie/photo-phototherapie-04.jpg",
  "DSCF7418-1-scaled.jpg": "phototherapie/photo-phototherapie-05.jpg",
  "DSCF7806-1-scaled.jpg": "phototherapie/photo-phototherapie-06.jpg",
  "photoshoot-1-e1693227930198.png": "phototherapie/photo-phototherapie-montage-01.png",
  "photoshoot-2-e1693228035506.png": "phototherapie/photo-phototherapie-montage-02.png",
  "DSCF7440-scaled.jpg": "phototherapie/photo-phototherapie-07.jpg",
  "DSCF8469-scaled.jpg": "phototherapie/photo-phototherapie-08.jpg",
  "DSCF8152-scaled.jpg": "phototherapie/photo-phototherapie-09.jpg",
  "DSCF5184-scaled.jpg": "phototherapie/photo-phototherapie-10.jpg",
  "DSCF4153-scaled.jpg": "phototherapie/photo-phototherapie-11.jpg",
  "DSCF3002-scaled.jpg": "phototherapie/photo-phototherapie-12.jpg",
  "DSCF2968-scaled.jpg": "phototherapie/photo-phototherapie-13.jpg",
  "DSCF1287.jpg": "phototherapie/photo-phototherapie-14.jpg",
  "DSCF7418-scaled.jpg": "phototherapie/photo-phototherapie-15.jpg",

  // illustrations
  "illustration-facettes-personnalite.png":
    "illustrations/illustration-facettes-personnalite.png",
  "illustration-gratitude-thailande.png":
    "illustrations/illustration-gratitude-thailande.png",
  "illustration-lien-aux-autres.png": "illustrations/illustration-lien-aux-autres.png",
  "illustration-ateliers-meditation.jpeg":
    "illustrations/illustration-ateliers-meditation.jpeg",
  "illustration-seance-individuelle-psychologie.jpeg":
    "illustrations/illustration-seance-individuelle-psychologie.jpeg",
  "Illustration-a-propos-formation-e1696347535950.png":
    "illustrations/illustration-a-propos-formation.png",
  "approche-1-1.webp": "illustrations/illustration-psychotherapie-approche-01.webp",
  "approche-2-1.webp": "illustrations/illustration-psychotherapie-approche-02.webp",
  "approche-3-1.webp": "illustrations/illustration-psychotherapie-approche-03.webp",
  "fleur-sechee-1.png": "illustrations/illustration-fleur-sechee-01.png",
  "fleur-sechee-2.png": "illustrations/illustration-fleur-sechee-02.png",
  "fleur-sechee-3.png": "illustrations/illustration-fleur-sechee-03.png",
  "psycho-services.png": "illustrations/illustration-services.png",
  "Traumatisme-et-memoire-scaled.jpg": "illustrations/illustration-traumatisme-memoire.jpg",
  "EMDR-therapie-scaled.jpeg": "illustrations/illustration-emdr-seance.jpeg",
  "therapie-EMDR-scaled.jpeg": "illustrations/illustration-emdr-schema.jpeg",
  "pleineconscience-scaled.jpg": "illustrations/illustration-pleine-conscience.jpg",

  // products
  "affiche-au-coeur-de-ta-poitrine.png": "products/poster-au-coeur-de-ta-poitrine.png",
  "affiche-meditation-1.png": "products/poster-meditation-01.png",
  "cultiver-lamour.png": "products/poster-cultiver-lamour.png",
  "se-reposer-en-soi-bis.png": "products/poster-se-reposer-en-soi.png",

  // stock
  "andre-taissin-5OUMf1Mr5pU-unsplash-scaled.jpg":
    "stock/stock-relation-argent-monnaie.jpg",
  "andre-taissin-5OUMf1Mr5pU-unsplash-1-scaled.jpg":
    "stock/stock-relation-argent-monnaie-02.jpg",
  "christine-roy-ir5MHI6rPg0-unsplash-scaled.jpg":
    "stock/stock-relation-argent-reflexion.jpg",
  "christine-roy-ir5MHI6rPg0-unsplash-1-scaled.jpg":
    "stock/stock-relation-argent-reflexion-02.jpg",
  "madison-lavern-4gcqRf3-f2I-unsplash-scaled.jpg":
    "stock/stock-meditation-pleine-conscience.jpg",
  "AdobeStock_270347315-scaled.jpeg": "stock/stock-meditation-conscience.jpeg",
  "ian-dooley-FgSyP02I0gw-unsplash-scaled.jpg": "stock/stock-traumatisme-guerison.jpg",
  "motoki-tonn-ezOKZhYJAFo-unsplash-scaled.jpg": "stock/stock-dissociation-meditation.jpg",
  "hopefilmphoto-QiYZCKJQMck-unsplash-scaled.jpg": "stock/stock-corps-meditation.jpg",
  "elijah-hiett-wW0BUXTTUmU-unsplash-scaled.jpg": "stock/stock-nature-presence.jpg",
  "daniel-oberg-41Wuv1xsmGM-unsplash-scaled.jpg": "stock/stock-emdr-desert.jpg",
  "neom-tSwRu3Jh0EM-unsplash-scaled.jpg": "stock/stock-emdr-paysage.jpg",
  "jeremy-bishop-Ncj5R2Wdlh4-unsplash-scaled.jpg":
    "stock/stock-developpement-personnel.jpg",
  "priscilla-du-preez-nF8xhLMmg0c-unsplash-scaled.jpg": "stock/stock-bien-etre-amis.jpg",
  "priscilla-du-preez-nF8xhLMmg0c-unsplash-1-scaled.jpg":
    "stock/stock-bien-etre-amis-02.jpg",
  "thought-catalog-UK78i6vK3sc-unsplash-scaled.jpg": "stock/stock-reflexion-bonheur.jpg",
  "brooke-cagle-WHWYBmtn3_0-unsplash-1-scaled.jpg": "stock/stock-bien-etre-sourire.jpg",
  "christopher-lemercier-12yvdCiLaVE-unsplash-scaled.jpg":
    "stock/stock-pensees-apaisement.jpg",
  "AdobeStock_692112417-scaled.jpeg": "stock/stock-pensees-apaisement-02.jpeg",
  "AdobeStock_79493040-scaled.jpeg": "stock/stock-pensees-negatives.jpeg",
  "AdobeStock_150001132-1-scaled.jpeg": "stock/stock-paix-interieure.jpeg",
  "AdobeStock_213461157-1-scaled.jpeg": "stock/stock-respiration-consciente.jpeg",
  "eli-defaria-vCzh1jOyre8-unsplash-scaled.jpg": "stock/stock-nature-respiration.jpg",
  "justin-follis-A7Um4oi-UYU-unsplash-scaled.jpg": "stock/stock-relation-couple.jpg",
  "gus-moretta-BCyfpZE3aVE-unsplash-scaled.jpg": "stock/stock-solitude.jpg",
  "kien-do-NjT4O7WYmwk-unsplash-scaled.jpg": "stock/stock-contact.jpg",
};

function findSource(oldName) {
  const inPublic = join(publicWp, oldName);
  if (existsSync(inPublic)) return inPublic;
  const inAssets = join(assetsWp, oldName);
  if (existsSync(inAssets)) return inAssets;
  return null;
}

// Vérifier que tous les fichiers wp sont mappés
const publicFiles = existsSync(publicWp) ? readdirSync(publicWp) : [];
const unmapped = publicFiles.filter((f) => !mapping[f]);
if (unmapped.length > 0) {
  console.error("Fichiers non mappés :", unmapped);
  process.exit(1);
}

// 1. Copier les images vers la nouvelle structure
for (const [oldName, newRel] of Object.entries(mapping)) {
  const src = findSource(oldName);
  if (!src) {
    console.warn(`⚠ Source introuvable : ${oldName}`);
    continue;
  }
  const dest = join(assetsRoot, newRel);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
  console.log(`✓ ${oldName} → ${newRel}`);
}

// 2. Mettre à jour les références dans le code
const textExtensions = new Set([
  ".md",
  ".astro",
  ".ts",
  ".js",
  ".yml",
  ".yaml",
  ".json",
]);

function walkDir(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      entry.name === ".git" ||
      entry.name.startsWith(".")
    )
      continue;
    if (entry.isDirectory()) walkDir(full, files);
    else if (textExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) files.push(full);
  }
  return files;
}

const filesToUpdate = walkDir(root).filter(
  (f) => !f.includes("scripts/migrate-images.mjs")
);

// Trier par longueur de nom décroissant pour éviter les remplacements partiels
const sortedOldNames = Object.keys(mapping).sort((a, b) => b.length - a.length);

let totalReplacements = 0;
for (const file of filesToUpdate) {
  let content = readFileSync(file, "utf8");
  let changed = false;

  for (const oldName of sortedOldNames) {
    const newRel = mapping[oldName];

    const patterns = [
      [`/images/wp/${oldName}`, `/images/${newRel}`],
      [`../../assets/images/wp/${oldName}`, `../../assets/images/${newRel}`],
      [`assets/images/wp/${oldName}`, `assets/images/${newRel}`],
    ];

    for (const [from, to] of patterns) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
        totalReplacements++;
      }
    }
  }

  // preview.js : chemins génériques wp → images
  if (file.endsWith("preview.js")) {
    const before = content;
    content = content
      .replace(/\/images\/wp\/\$\{assetsMatch\[1\]\}/g, "/images/${assetsMatch[1]}")
      .replace(/\/images\/wp\/\$\{wpMatch\[1\]\}/g, "/images/${imageMatch[1]}")
      .replace(
        /const wpMatch = path\.match\(\/\(\?:\^\|\\\/\)images\/wp\/\(\.\+\)\$\//,
        "const imageMatch = path.match(/(?:^|\\/)images\\/(.+)$/"
      )
      .replace(/if \(wpMatch\) return/, "if (imageMatch) return")
      .replace(/assets\/images\/(?:wp\/)?\(\.\+\)/, "assets/images/(.+)");
    if (content !== before) changed = true;
  }

  if (changed) writeFileSync(file, content, "utf8");
}

console.log(`\n✓ ${totalReplacements} remplacements de chemins effectués`);

// 3. Supprimer les anciens dossiers wp
if (existsSync(publicWp)) {
  rmSync(publicWp, { recursive: true });
  console.log("✓ Supprimé public/images/wp/");
}
if (existsSync(assetsWp)) {
  rmSync(assetsWp, { recursive: true });
  console.log("✓ Supprimé src/assets/images/wp/");
}

// 4. Créer le dossier uploads CMS (src/assets pour optimisation Astro)
const uploadsDir = join(root, "src/assets/images/uploads");
mkdirSync(uploadsDir, { recursive: true });
const gitkeep = join(uploadsDir, ".gitkeep");
if (!existsSync(gitkeep)) writeFileSync(gitkeep, "", "utf8");
console.log("✓ Créé src/assets/images/uploads/");

console.log("\nMigration terminée.");
