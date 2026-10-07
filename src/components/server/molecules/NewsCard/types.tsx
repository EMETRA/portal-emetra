import type { PublishedNewsSummary } from "@/lib/content/publishedNews.types";

/**
 * Props de NewsCard.
 * @param {PublishedNewsSummary} noticia - Noticia a mostrar.
 * @param {string} href - Ruta del detalle; toda la card es el enlace.
 */
interface NewsCardProps {
  noticia: PublishedNewsSummary;
  href: string;
  className?: string;
}

export type { NewsCardProps };
