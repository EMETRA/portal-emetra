/**
 * DTO de noticias del sitio público (api-portal, REST, sin auth).
 * Fuente: README de backend "Noticias — consultas, mutaciones y bodies"
 * (versión actualizada del 2026-09-30, con ejemplos de listado y detalle).
 *   GET /public/news?q=&idioma=es-GT&page=1&limit=10
 *   GET /public/news/:slug/:idioma  (404 si no está publicada)
 * Solo devuelve noticias `publicada` + `publica` con fecha vacía o vencida.
 */

export type NewsEstadoDto = "borrador" | "programada" | "publicada" | "archivada";

export type NewsVisibilidadDto = "publica" | "privada";

export type NewsTipoRecursoDto = "imagen" | "video" | "archivo" | "externo";

/** Recurso (TB_RECURSO), según el ejemplo de backend. */
export interface PublicNewsResourceDto {
  id: number;
  tipo?: NewsTipoRecursoDto | null;
  /** URL absoluta, p. ej. "https://cdn.emetra.gob.gt/noticias/principal_banner.png". */
  url?: string | null;
  texto_alternativo?: string | null;
  pie_imagen?: string | null;
  creditos?: string | null;
}

/**
 * Autor visible: el primero con rol "autor"; si no hay, el de menor orden.
 * null si la noticia no tiene autores.
 */
export interface PublicNewsAuthorDto {
  id: number;
  nombre?: string | null;
}

/** Item del listado público, según el README. */
export interface PublicNewsItemDto {
  id: number;
  slug: string;
  titulo: string;
  resumen?: string | null;
  /** ISO 8601, p. ej. "2026-09-25T14:00:00.000Z". */
  fecha_publicacion?: string | null;
  idioma: string;
  tiempo_lectura?: number | null;
  recurso_principal?: PublicNewsResourceDto | null;
  autor?: PublicNewsAuthorDto | null;
  /**
   * La API pública solo devuelve publicadas y públicas. El README los incluye,
   * pero se dejan opcionales por si no llegan.
   */
  estado?: NewsEstadoDto | null;
  visibilidad?: NewsVisibilidadDto | null;
  meta_titulo?: string | null;
  meta_descripcion?: string | null;
  url_canonica?: string | null;
}

export interface PublicNewsSectionDto {
  id: number;
  orden: number;
  encabezado?: string | null;
  contenido_html?: string | null;
  recurso?: PublicNewsResourceDto | null;
}

export interface PublicNewsTaxonomyDto {
  id: number;
  nombre?: string | null;
  slug?: string | null;
}

/** Autor con su rol en la noticia (TB_NOTICIA_AUTOR). */
export interface PublicNewsAuthorRoleDto extends PublicNewsAuthorDto {
  rol?: "autor" | "editor" | "fotografo" | null;
  orden?: number | null;
}

/** Item de galería: solo recursos con rol "galeria", con su orden. */
export interface PublicNewsGalleryItemDto {
  orden: number;
  recurso?: PublicNewsResourceDto | null;
}

/**
 * Detalle público, según el ejemplo del README: el item más SEO, autores,
 * categorías, etiquetas, secciones y galería. Si no hay imagen, autor,
 * sección o galería, el campo va null o en arreglo vacío.
 */
export interface PublicNewsDetailDto extends PublicNewsItemDto {
  /** Todos los autores; para mostrar se usa `autor` (mismo criterio que la card). */
  autores?: PublicNewsAuthorRoleDto[] | null;
  categorias?: PublicNewsTaxonomyDto[] | null;
  etiquetas?: PublicNewsTaxonomyDto[] | null;
  secciones?: PublicNewsSectionDto[] | null;
  galeria?: PublicNewsGalleryItemDto[] | null;
}

export interface PublicNewsListDto {
  items: PublicNewsItemDto[];
  total: number;
  page: number;
  limit: number;
}
