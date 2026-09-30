import type { NewsResource } from "@/lib/content/publishedNews.types";

/**
 * - principal: recurso principal del detalle (video reproducible).
 * - seccion: imagen o video de una sección del detalle (video reproducible, en 16:9).
 * - tarjeta: portada de una card del listado (sin interacción; la card es el enlace).
 * - miniatura: miniatura de la galería (sin interacción; el botón es el padre).
 */
type NewsMediaVariant = "principal" | "seccion" | "tarjeta" | "miniatura";

/**
 * Props de NewsMedia.
 * @param {NewsResource | null} recurso - Imagen o video a mostrar; null si no hay.
 * @param {string} [emptyText] - Si no hay recurso y se indica, muestra el recuadro
 * punteado con ícono y este texto; si no, un recuadro gris vacío.
 */
interface NewsMediaProps {
  recurso: NewsResource | null;
  variant?: NewsMediaVariant;
  emptyText?: string;
  className?: string;
}

export type { NewsMediaProps, NewsMediaVariant };
