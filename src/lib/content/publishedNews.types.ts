/**
 * Tipos de vista de COM-04 (Noticia publicada): lo que pinta la UI.
 * Se llenan desde el DTO de api-portal (src/lib/content/types.ts) con
 * publishedNews.mappers.ts. Los valores de estado, visibilidad e ids siguen el
 * README de backend (2026-09-30): minúsculas e ids numéricos.
 */

import type {
  NewsEstadoDto,
  NewsVisibilidadDto,
} from "@/lib/content/types";

/** TB_RECURSO.tipo */
export type NewsResourceType = "imagen" | "video" | "archivo" | "externo";

export type NewsStatus = NewsEstadoDto;

export type NewsVisibility = NewsVisibilidadDto;

/**
 * TB_RECURSO. Un video siempre es un enlace normal de YouTube, normalizado a
 * https://www.youtube.com/watch?v=ID (ya no hay MP4).
 */
export interface NewsResource {
  id: number;
  tipo: NewsResourceType;
  url: string;
  textoAlternativo: string | null;
  pieImagen: string | null;
  creditos: string | null;
}

/** TB_SECCION_NOTICIA */
export interface NewsSection {
  id: number;
  orden: number;
  encabezado: string;
  /**
   * HTML de COM-03 (solo <p> y <br>, con texto escapado). El Portal no lo
   * inyecta: lo convierte a párrafos (helpers/newsHtml.ts).
   */
  contenidoHtml: string;
  recurso: NewsResource | null;
}

/** Categoría o etiqueta con su nombre, para los chips. */
export interface NewsChip {
  id: number;
  nombre: string;
}

export interface PublishedNewsSummary {
  id: number;
  slug: string;
  /** null si la API no lo envía (la pública ya filtra por publicada + pública). */
  estado: NewsStatus | null;
  visibilidad: NewsVisibility | null;
  titulo: string;
  resumen: string | null;
  /** Nombre del autor visible; null si no tiene. */
  autor: string | null;
  /** ISO 8601 o "YYYY-MM-DD". */
  fechaPublicacion: string | null;
  recursoPrincipal: NewsResource | null;
}

/** Página del listado ({ items, total, page, limit }). */
export interface PublishedNewsPage {
  items: PublishedNewsSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface PublishedNews extends PublishedNewsSummary {
  idioma: string;
  /** Minutos de lectura. */
  tiempoLectura: number | null;
  /** Categorías (incluye subcategorías) y etiquetas, en ese orden. */
  categorias: NewsChip[];
  etiquetas: NewsChip[];
  secciones: NewsSection[];
  /** Recursos con rol galeria, en orden. */
  galeria: NewsResource[];
}
