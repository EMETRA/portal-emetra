import type { NewsResource } from "@/lib/content/publishedNews.types";

/**
 * Props de NewsGallery.
 * @param {NewsResource[]} recursos - Imágenes y videos (principal, secciones y galería).
 */
interface NewsGalleryProps {
  recursos: NewsResource[];
  className?: string;
}

export type { NewsGalleryProps };
