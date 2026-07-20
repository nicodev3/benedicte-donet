import { getOptimizedImage, isExternalImage } from "@/lib/images";

export interface OptimizeHtmlImagesOptions {
  /** Première image en eager (intro de page / LCP) */
  eagerFirst?: boolean;
  widths?: number[];
  quality?: number;
  sizes?: string;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getAttr(attrs: string, name: string): string | undefined {
  const match = attrs.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
  );
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

/**
 * Remplace les `<img src="/images/...">` du HTML markdown
 * par des versions WebP + srcset via astro:assets.
 */
export async function optimizeHtmlImages(
  html: string,
  options: OptimizeHtmlImagesOptions = {}
): Promise<string> {
  const {
    eagerFirst = true,
    widths = [320, 480, 768, 1024],
    quality = 70,
    sizes = "(max-width: 820px) 90vw, 480px",
  } = options;

  const imgTagRegex = /<img\b([^>]*)\/?>/gi;
  const matches = [...html.matchAll(imgTagRegex)];
  if (!matches.length) return html;

  let result = html;
  let imageIndex = 0;

  for (const match of matches) {
    const fullTag = match[0];
    const attrs = match[1] ?? "";
    const src = getAttr(attrs, "src");
    if (!src || isExternalImage(src)) continue;
    if (!src.startsWith("/images/")) continue;
    if (src.startsWith("/_astro/")) continue;
    if (/\.svg$/i.test(src)) continue;

    const optimized = await getOptimizedImage(src, {
      widths,
      format: "webp",
      quality,
    });

    // Pas d'asset résolu → on laisse le chemin public tel quel
    if (!optimized || optimized.src === src) {
      imageIndex += 1;
      continue;
    }

    const alt = getAttr(attrs, "alt") ?? "";
    const className = getAttr(attrs, "class");
    const isFirst = eagerFirst && imageIndex === 0;
    const loading = isFirst ? "eager" : "lazy";
    const fetchPriority = isFirst ? ' fetchpriority="high"' : "";
    const width = optimized.attributes.width
      ? ` width="${optimized.attributes.width}"`
      : "";
    const height = optimized.attributes.height
      ? ` height="${optimized.attributes.height}"`
      : "";
    const srcset = optimized.srcset ? ` srcset="${escapeAttr(optimized.srcset)}"` : "";
    const classAttr = className ? ` class="${escapeAttr(className)}"` : "";

    const newTag =
      `<img src="${escapeAttr(optimized.src)}"${srcset}` +
      ` sizes="${escapeAttr(sizes)}"${classAttr}` +
      ` alt="${escapeAttr(alt)}"` +
      ` loading="${loading}"${fetchPriority}${width}${height}` +
      ` decoding="async">`;

    result = result.replace(fullTag, newTag);
    imageIndex += 1;
  }

  return result;
}
