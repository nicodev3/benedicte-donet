import type { ImageMetadata } from "astro";

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  [
    "/src/assets/images/**/*.{jpeg,jpg,jpe,png,gif,webp,avif,svg}",
    "!/src/assets/images/cms-library/**/*",
  ],
  { eager: true }
);

export interface OptimizeImageOptions {
  width?: number;
  widths?: number[];
  height?: number;
  format?: "webp" | "avif" | "png" | "jpg" | "jpeg";
  quality?: number;
}

export interface OptimizedImageResult {
  src: string;
  srcset?: string;
  attributes: Record<string, string | number | undefined>;
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
 * Retourne l'image optimisée (src + srcset) pour un chemin local ou externe.
 */
export async function getOptimizedImage(
  src: string | undefined,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImageResult | undefined> {
  if (!src) return undefined;
  if (isExternalImage(src)) {
    return { src, attributes: {} };
  }

  const image = resolveImage(src);
  if (!image) {
    if (src.startsWith("/images/")) return { src, attributes: {} };
    console.warn(`[images] Asset introuvable pour optimisation : ${src}`);
    return undefined;
  }

  const { getImage } = await import("astro:assets");
  const optimized = await getImage({
    src: image,
    width: options.width,
    widths: options.widths,
    height: options.height,
    format: options.format ?? "webp",
    quality: options.quality ?? 75,
  });

  return {
    src: optimized.src,
    srcset: optimized.srcSet.attribute,
    attributes: optimized.attributes,
  };
}

/**
 * Retourne l'URL optimisée par astro:assets pour un chemin local ou externe.
 */
export async function getOptimizedSrc(
  src: string | undefined,
  options: OptimizeImageOptions = {}
): Promise<string | undefined> {
  const optimized = await getOptimizedImage(src, options);
  return optimized?.src;
}

/** URL CSS `url(...)` pour un fond optimisé. */
export async function getOptimizedBackgroundUrl(
  src: string | undefined,
  width = 1280
): Promise<string | undefined> {
  const optimized = await getOptimizedSrc(src, {
    width,
    format: "webp",
    quality: 70,
  });
  return optimized ? `url(${optimized})` : undefined;
}

export interface SeoImage {
  src: string;
  width: number;
  height: number;
}

export async function resolveSeoImage(
  src: string | undefined
): Promise<SeoImage | undefined> {
  if (!src) return undefined;
  if (isExternalImage(src)) {
    return { src, width: 1200, height: 630 };
  }

  const image = resolveImage(src);
  if (!image) {
    if (src.startsWith("/images/")) {
      return { src, width: 1200, height: 630 };
    }
    return undefined;
  }

  const { getImage } = await import("astro:assets");
  const optimized = await getImage({
    src: image,
    width: 1200,
    format: "jpg",
    quality: 80,
  });

  return {
    src: optimized.src,
    width: optimized.attributes.width
      ? Number(optimized.attributes.width)
      : 1200,
    height: optimized.attributes.height
      ? Number(optimized.attributes.height)
      : Math.round(1200 * (image.height / image.width)),
  };
}

export async function resolveSeoImagePath(
  src: string | undefined
): Promise<string | undefined> {
  const seoImage = await resolveSeoImage(src);
  return seoImage?.src;
}
