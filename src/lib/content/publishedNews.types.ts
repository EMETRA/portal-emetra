/**
 * Tipos de vista de COM-04 (Noticia publicada).
 *
 * Siguen el esquema que envía el formulario de COM-03 (Sistema-tickets,
 * `api/graphql/COM03/types.ts`: NoticiaDetalle, RecursoNoticia, SeccionNoticia).
 * Solo difieren en categorías y etiquetas: COM-03 guarda ids y el Portal
 * necesita los nombres para los chips.
 *
 * TODO [COM04-BACKEND]: el backend está en pausa. Confirmar el contrato final
 * (el /api/news actual usa snake_case y otro servicio podría cambiarlo), y
 * mapear aquí desde lo que llegue.
 */

/** TB_RECURSO.tipo */
export type NewsResourceType = "imagen" | "video" | "archivo" | "externo";

/**
 * TB_NOTICIA.estado. En COM-03 va en mayúsculas (en la BD está en minúsculas).
 * TODO [COM04-BACKEND]: confirmar el formato que envía la API.
 */
export type NewsStatus = "PUBLICADA" | "PROGRAMADA" | "BORRADOR" | "ARCHIVADA";

/** TB_NOTICIA.visibilidad */
export type NewsVisibility = "publica" | "privada";

/** TB_RECURSO. No tiene nombre de archivo ni tamaño. */
export interface NewsResource {
  id: string;
  tipo: NewsResourceType;
  url: string;
  tipoMime: string | null;
  ancho: number | null;
  alto: number | null;
  duracionSegundos: number | null;
  textoAlternativo: string | null;
  pieImagen: string | null;
  creditos: string | null;
}

/** TB_SECCION_NOTICIA */
export interface NewsSection {
  id: string;
  orden: number;
  encabezado: string;
  /**
   * HTML generado por COM-03 con textToHtml: solo <p> y <br>, con el texto
   * escapado. El Portal no lo inyecta: lo convierte a párrafos
   * (helpers/newsHtml.ts).
   */
  contenidoHtml: string;
  /** Imagen de la sección (COM-03 solo acepta imagen aquí). */
  recurso: NewsResource | null;
}

/** Categoría, subcategoría o etiqueta con su nombre, para los chips. */
export interface NewsChip {
  id: string;
  nombre: string;
}

export interface PublishedNewsSummary {
  id: string;
  slug: string;
  estado: NewsStatus;
  visibilidad: NewsVisibility;
  titulo: string;
  resumen: string;
  /** Texto libre. */
  autor: string;
  /** "YYYY-MM-DD" */
  fechaPublicacion: string | null;
  recursoPrincipal: NewsResource | null;
}

/** Página del listado, con la forma de NewsListResponseDto. */
export interface PublishedNewsPage {
  items: PublishedNewsSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface PublishedNews extends PublishedNewsSummary {
  /** Por defecto es-GT. */
  idioma: string;
  /** Minutos de lectura. */
  tiempoLectura: number | null;
  /**
   * TODO [COM04-BACKEND]: COM-03 guarda categoriaId, subcategoriaId y
   * etiquetaIds. El Portal necesita los nombres: que la API los resuelva, o
   * pedir los catálogos.
   */
  categoria: NewsChip | null;
  subcategoria: NewsChip | null;
  etiquetas: NewsChip[];
  secciones: NewsSection[];
  /** Recursos con rol galeria (TB_NOTICIA_RECURSO), en orden. */
  galeria: NewsResource[];
  /** Recursos con rol adjunto. El formulario de COM-03 todavía no los envía. */
  adjuntos: NewsResource[];
}
