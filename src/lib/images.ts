import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{jpeg,jpg,jpe,png,gif,webp,avif,svg}",
  { eager: true }
);

export interface OptimizeImageOptions {
  width?: number;
  widths?: number[];
  height?: number;
  format?: "webp" | "png" | "jpg" | "jpeg";
}

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

export function isExternalImage(src: string): boolean {
  return /^https?:\/\//.test(src);
}

/**
 * Retourne l'URL optimisée par astro:assets pour un chemin local ou externe.
 */
export async function getOptimizedSrc(
  src: string | undefined,
  options: OptimizeImageOptions = {}
): Promise<string | undefined> {
  if (!src) return undefined;
  if (isExternalImage(src)) return src;

  const image = resolveImage(src);
  if (!image) {
    if (src.startsWith("/images/")) return src;
    console.warn(`[images] Asset introuvable pour optimisation : ${src}`);
    return undefined;
  }

  const { getImage } = await import("astro:assets");
  const optimized = await getImage({
    src: image,
    width: options.width,
    widths: options.widths,
    height: options.height,
    format: options.format,
  });

  return optimized.src;
}

/** URL CSS `url(...)` pour un fond optimisé. */
export async function getOptimizedBackgroundUrl(
  src: string | undefined,
  width = 1920
): Promise<string | undefined> {
  const optimized = await getOptimizedSrc(src, { width });
  return optimized ? `url(${optimized})` : undefined;
}

export async function resolveSeoImagePath(
  src: string | undefined
): Promise<string | undefined> {
  if (!src) return undefined;
  return getOptimizedSrc(src, { width: 1200 });
}
