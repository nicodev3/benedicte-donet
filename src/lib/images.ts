import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{jpeg,jpg,jpe,png,gif,webp,avif,svg}",
  { eager: true }
);

/**
 * Résout un chemin public (/images/...) ou relatif (../../assets/images/...)
 * vers les métadonnées Astro Image.
 */
export function resolveImage(src: string): ImageMetadata | undefined {
  if (!src) return undefined;

  let assetPath: string | undefined;

  if (src.startsWith("/images/")) {
    assetPath = src.replace(/^\/images\//, "/src/assets/images/");
  } else {
    const match = src.match(/(?:\.\.\/)*assets\/images\/(.+)$/);
    if (match) assetPath = `/src/assets/images/${match[1]}`;
  }

  if (!assetPath) return undefined;
  return imageModules[assetPath]?.default;
}
