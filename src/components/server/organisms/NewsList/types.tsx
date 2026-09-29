import type { PublishedNewsSummary } from "@/lib/content/publishedNews.types";

type NewsListStatus = "loading" | "ready" | "empty" | "error";

/**
 * Props de NewsList.
 * @param {NewsListStatus} status - Estado del listado.
 * @param {PublishedNewsSummary[]} noticias - Noticias de la página actual.
 * @param {number} page - Página actual (empieza en 1).
 * @param {number} totalPages - Total de páginas.
 * @param {(page: number) => void} onPageChange - Cambia de página.
 * @param {() => void} onRetry - Reintenta la carga tras un error.
 * @param {(noticia: PublishedNewsSummary) => string} getHref - Ruta del detalle.
 * @param {number} [pageSize] - Cards de esqueleto mientras carga. Por defecto 3.
 */
interface NewsListProps {
  status: NewsListStatus;
  noticias: PublishedNewsSummary[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  getHref: (noticia: PublishedNewsSummary) => string;
  pageSize?: number;
  className?: string;
}

export type { NewsListProps, NewsListStatus };
