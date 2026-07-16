/**
 * Compresse les images sources dans src/assets/images (hors cms-library).
 * - JPEG / WebP : ré-encodage qualité 80
 * - PNG avec alpha : optimisation (+ resize logo UI)
 * - PNG sans alpha (photos) : conversion JPEG + mise à jour des chemins
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  renameSync,
  existsSync,
} from "node:fs";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(fileURLToPath(import.meta.url), "../..");
const assetsRoot = join(root, "src/assets/images");
const skipDirs = new Set(["cms-library", "uploads"]);
const MIN_BYTES = 80 * 1024;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;
const LOGO_MAX_WIDTH = 640;

const textExt = /\.(astro|md|mdx|yml|yaml|json|ts|js|mjs|html|css)$/i;
const imageExt = /\.(jpe?g|png|webp)$/i;

function walkImages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!skipDirs.has(name)) walkImages(full, out);
      continue;
    }
    if (!imageExt.test(name) || st.size < MIN_BYTES) continue;
    out.push(full);
  }
  return out;
}

function walkTextFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".git" || name === "cms-library") continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkTextFiles(full, out);
      continue;
    }
    if (textExt.test(name)) out.push(full);
  }
  return out;
}

function relPosix(abs) {
  return abs.slice(root.length + 1).replaceAll("\\", "/");
}

async function compressJpeg(input, meta) {
  let pipeline = sharp(input).rotate();
  if ((meta.width || 0) > 2000) pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
  return pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true }).toBuffer();
}

async function compressWebp(input, meta) {
  let pipeline = sharp(input).rotate();
  if ((meta.width || 0) > 2000) pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
  return pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
}

async function compressPngWithAlpha(input, meta, filePath) {
  let pipeline = sharp(input).rotate();
  const isLogo = /[\\/]ui[\\/]logo-/.test(filePath) || basename(filePath).includes("logo-");
  if (isLogo && (meta.width || 0) > LOGO_MAX_WIDTH) {
    pipeline = pipeline.resize({ width: LOGO_MAX_WIDTH, withoutEnlargement: true });
  } else if ((meta.width || 0) > 2000) {
    pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
  }
  return pipeline.png({ compressionLevel: 9, quality: 80, effort: 10 }).toBuffer();
}

function replaceInRepo(fromPath, toPath) {
  const fromPublic = fromPath.replace(/^src\/assets\/images\//, "/images/");
  const toPublic = toPath.replace(/^src\/assets\/images\//, "/images/");
  const fromCms = fromPath.replace(/^src\/assets\/images\/([^/]+)\/(.+)$/, "cms-library/$1-$2");
  const toCms = toPath.replace(/^src\/assets\/images\/([^/]+)\/(.+)$/, "cms-library/$1-$2");
  const fromCmsPublic = `/images/${fromCms}`;
  const toCmsPublic = `/images/${toCms}`;

  const pairs = [
    [fromPath, toPath],
    [fromPublic, toPublic],
    [fromCmsPublic, toCmsPublic],
    [fromPath.replaceAll("/", "\\"), toPath.replaceAll("/", "\\")],
  ];

  let filesTouched = 0;
  for (const file of walkTextFiles(root)) {
    let content = readFileSync(file, "utf8");
    let next = content;
    for (const [a, b] of pairs) {
      if (a !== b) next = next.split(a).join(b);
    }
    if (next !== content) {
      writeFileSync(file, next);
      filesTouched++;
    }
  }
  return filesTouched;
}

const results = [];
const renames = [];

const files = walkImages(assetsRoot);
console.log(`Images à traiter (≥ ${MIN_BYTES / 1024} Ko) : ${files.length}`);

function atomicWrite(targetPath, data) {
  const tmp = `${targetPath}.tmp-${process.pid}`;
  writeFileSync(tmp, data);
  try {
    renameSync(tmp, targetPath);
  } catch {
    // Windows : remplacement si la cible existe déjà
    writeFileSync(targetPath, data);
    unlinkSync(tmp);
  }
}

for (const file of files) {
  const before = statSync(file).size;
  const ext = extname(file).toLowerCase();
  let outBuffer;
  let outPath = file;
  let converted = false;

  try {
    // Lire en mémoire pour libérer le handle avant réécriture (Windows)
    const input = readFileSync(file);
    const meta = await sharp(input).metadata();

    if (ext === ".jpg" || ext === ".jpeg") {
      outBuffer = await compressJpeg(input, meta);
    } else if (ext === ".webp") {
      outBuffer = await compressWebp(input, meta);
    } else if (ext === ".png") {
      if (meta.hasAlpha) {
        outBuffer = await compressPngWithAlpha(input, meta, file);
      } else {
        // Photo / fond sans transparence → JPEG bien plus léger
        let pipeline = sharp(input).rotate();
        if (meta.width > 2000) pipeline = pipeline.resize({ width: 2000, withoutEnlargement: true });
        outBuffer = await pipeline
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
          .toBuffer();
        outPath = join(dirname(file), `${basename(file, ext)}.jpg`);
        converted = true;
      }
    } else {
      continue;
    }

    // Ne garder que si gain ≥ 5 %
    if (outBuffer.length >= before * 0.95 && !converted) {
      results.push({ file: relPosix(file), before, after: before, skipped: true });
      continue;
    }

    atomicWrite(outPath, outBuffer);
    if (converted && outPath !== file) {
      unlinkSync(file);
      const fromRel = relPosix(file);
      const toRel = relPosix(outPath);
      const touched = replaceInRepo(fromRel, toRel);
      renames.push({ from: fromRel, to: toRel, refs: touched });
    }

    const after = outBuffer.length;
    results.push({
      file: relPosix(converted ? outPath : file),
      before,
      after,
      converted,
      saved: before - after,
    });
  } catch (error) {
    console.error(`✗ ${relPosix(file)}: ${error.message}`);
  }
}

results.sort((a, b) => (b.saved || 0) - (a.saved || 0));

const totalBefore = results.reduce((s, r) => s + r.before, 0);
const totalAfter = results.reduce((s, r) => s + r.after, 0);
const changed = results.filter((r) => !r.skipped && r.after < r.before);

console.log("\n--- Top économies ---");
for (const r of changed.slice(0, 20)) {
  const kb = (n) => `${(n / 1024).toFixed(0)} Ko`;
  console.log(
    `${kb(r.before).padStart(8)} → ${kb(r.after).padStart(7)}  (−${kb(r.saved)})  ${r.converted ? "[png→jpg] " : ""}${r.file}`
  );
}

if (renames.length) {
  console.log(`\n--- Renommages (${renames.length}) ---`);
  for (const r of renames) {
    console.log(`${r.from} → ${r.to} (${r.refs} fichier(s) mis à jour)`);
  }
}

const savedPct = totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0) : "0";
console.log(
  `\n✓ ${changed.length} images compressées : ${(totalBefore / 1024 / 1024).toFixed(2)} Mo → ${(totalAfter / 1024 / 1024).toFixed(2)} Mo (-${savedPct} %)`
);
