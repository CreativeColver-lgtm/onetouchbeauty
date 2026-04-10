/**
 * Cloudinary image optimization helpers
 * Transforms any image URL through Cloudinary's fetch API for:
 * - Auto-format (WebP/AVIF where supported)
 * - Auto-quality optimization
 * - Responsive sizing
 */

const CLOUD_NAME = "dx0c2nt6z";

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:low" | "auto:eco" | "auto:good" | "auto:best" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "fit" | "scale" | "thumb" | "crop";
  gravity?: "auto" | "face" | "center";
  blur?: number;
}

export function cloudinaryUrl(
  originalUrl: string,
  options: CloudinaryOptions = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) {
    transforms.push(`c_${crop}`);
    if (crop === "fill") transforms.push(`g_${gravity}`);
  }
  if (options.blur) transforms.push(`e_blur:${options.blur}`);

  const transformStr = transforms.join(",");

  // Only transform external URLs, not local ones
  if (originalUrl.startsWith("/")) return originalUrl;

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${transformStr}/${encodeURIComponent(originalUrl)}`;
}

/**
 * Next.js Image loader for Cloudinary
 * Use: <Image loader={cloudinaryLoader} src="https://..." ... />
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("/")) return src;
  return cloudinaryUrl(src, { width, quality: quality || "auto" });
}
