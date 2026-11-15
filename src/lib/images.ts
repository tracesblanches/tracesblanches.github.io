import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// Widths and qualities of every responsive image of the site (Img.astro, the hero's preload).
export const DEFAULT_WIDTHS = [400, 640, 800, 1080, 1280, 1600, 2000, 2400];
export const QUALITY = { avif: 55, webp: 78, jpg: 80 } as const;

/**
 * A crop of a picture: width / height ratio and which part to keep (sharp's position:
 * 'right' keeps the right edge, 'centre', 'attention', ...). The hero uses it to make, from
 * the landscape picture, its version for screens held upright when there is no portrait file.
 */
export interface Crop { ratio: number; position: string }

/** Pixel size of the largest crop of `im` at `crop.ratio`. */
function cropBox(im: ImageMetadata, crop?: Crop) {
  if (!crop) return { width: im.width, height: im.height };
  return im.width / im.height > crop.ratio
    ? { width: Math.round(im.height * crop.ratio), height: im.height }
    : { width: im.width, height: Math.round(im.width / crop.ratio) };
}

/** Widths below the source's own width (after cropping), plus that width (capped at 2400). */
export function widthsFor(im: ImageMetadata, widths: number[] = DEFAULT_WIDTHS, crop?: Crop): number[] {
  const max = cropBox(im, crop).width;
  const w = widths.filter((x) => x < max);
  if (!w.length || w[w.length - 1] < Math.min(max, 2400)) w.push(Math.min(max, 2400));
  return w;
}

export async function srcset(im: ImageMetadata, widths: number[], format: 'avif' | 'webp', crop?: Crop): Promise<string> {
  const imgs = await Promise.all(widths.map((width) => getImage({
    src: im, width, format, quality: QUALITY[format],
    ...(crop ? { height: Math.round(width / crop.ratio), fit: 'cover' as const, position: crop.position } : {}),
  })));
  return imgs.map((x, i) => `${x.src} ${widths[i]}w`).join(', ');
}

/**
 * `sizes` of a picture that covers the home hero (object-fit: cover): the hero is the full
 * width and the first screen minus the header (--header-h in tokens.css: 5.875rem on a phone,
 * 3.625rem from 48rem). A picture of ratio R (width / height) is then drawn at
 * max(100vw, (100vh - header) * R) CSS pixels wide.
 */
export function coverSizes(ratio: number): string {
  const r = ratio.toFixed(3);
  return `(min-width: 48rem) max(100vw, calc((100vh - 3.625rem) * ${r})), max(100vw, calc((100vh - 5.875rem) * ${r}))`;
}

/** Ratio of the version for screens held upright that the hero cuts from a landscape picture. */
export const PORTRAIT_CROP: Crop = { ratio: 0.6, position: 'right' };

export interface Preload { srcset: string; sizes: string; type: string; media?: string }

/**
 * Preload of the hero picture (AVIF), one per orientation: the landscape picture, and for
 * screens held upright the portrait file when there is one, else a crop of the landscape one.
 */
export async function heroPreload(im: ImageMetadata, portrait?: ImageMetadata): Promise<Preload[]> {
  const pr = portrait ? portrait.width / portrait.height : PORTRAIT_CROP.ratio;
  return [
    { srcset: await srcset(im, widthsFor(im), 'avif'), sizes: coverSizes(im.width / im.height), type: 'image/avif', media: '(orientation: landscape)' },
    { srcset: portrait ? await srcset(portrait, widthsFor(portrait), 'avif') : await srcset(im, widthsFor(im, undefined, PORTRAIT_CROP), 'avif', PORTRAIT_CROP),
      sizes: coverSizes(pr), type: 'image/avif', media: '(orientation: portrait)' },
  ];
}
