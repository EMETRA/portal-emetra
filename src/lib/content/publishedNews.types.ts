/**
 * Tipos de vista de COM-04 (Noticia publicada).
 * Son del front: describen lo que pinta la UI, no el contrato del backend.
 * TODO [COM04-BACKEND]: mapear desde el DTO definitivo cuando backend confirme
 * si se usa /news (NewsSummaryDto/NewsDetailDto) u otro servicio.
 */

export type NewsResourceType = "imagen" | "video" | "archivo" | "externo";

export interface NewsResource {
  id: number;
  tipo: NewsResourceType;
  url: string;
  nombre?: string | null;
  textoAlternativo?: string | null;
  pie?: string | null;
}

export interface NewsSection {
  id: number;
  orden: number;
  encabezado: string;
  /**
   * Texto plano; los saltos de línea dobles separan párrafos.
   * TODO [COM04-BACKEND]: el CMS guarda contenido_html. Confirmar si llega
   * sanitizado antes de renderizarlo como HTML.
   */
  contenido: string;
  recurso?: NewsResource | null;
}

export interface NewsChip {
  id: number;
  nombre: string;
}

export interface PublishedNewsSummary {
  id: number;
  slug: string;
  titulo: string;
  resumen: string | null;
  autor: string | null;
  /** "YYYY-MM-DD" o ISO completo. */
  fechaPublicacion: string | null;
  recursoPrincipal: NewsResource | null;
}

export interface PublishedNews extends PublishedNewsSummary {
  tiempoLecturaMin: number | null;
  categorias: NewsChip[];
  etiquetas: NewsChip[];
  secciones: NewsSection[];
  /** Galería y adjuntos, en una sola lista como en el diseño. */
  galeria: NewsResource[];
}
