import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "tarteaucitronjs");
const dest = join(root, "public", "tarteaucitron");

const files = [
  "tarteaucitron.min.js",
  "tarteaucitron.services.min.js",
  "css/tarteaucitron.min.css",
  "lang/tarteaucitron.fr.min.js",
  "lang/tarteaucitron.en.min.js",
];

rmSync(dest, { recursive: true, force: true });

for (const file of files) {
  const from = join(src, file);
  const to = join(dest, file);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
}

console.log(`Synced ${files.length} tarteaucitron files → public/tarteaucitron/`);
