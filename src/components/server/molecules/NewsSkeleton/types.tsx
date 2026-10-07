/**
 * - card: card del listado mientras carga.
 * - detail: detalle de la noticia mientras carga (dos columnas en desktop).
 */
type NewsSkeletonVariant = "card" | "detail";

interface NewsSkeletonProps {
  variant: NewsSkeletonVariant;
  className?: string;
}

export type { NewsSkeletonProps, NewsSkeletonVariant };
