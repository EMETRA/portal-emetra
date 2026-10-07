import "server-only";

import { backendFetch } from "@/lib/backend/client";
import type { PublicNewsDetailDto } from "@/lib/content/types";
import { fetchPublicNewsDetailDummy } from "@/lib/content/publishedNews.dummy";
import { NEWS_IDIOMA, USAR_DUMMY } from "@/lib/content/publishedNews.api";

export interface PublishedNewsMetadata {
  /** meta_titulo si existe; si no, el título de la noticia. */
  titulo: string;
  /** meta_descripcion si existe; si no, el resumen. */
  descripcion: string | null;
}

/**
 * Título y descripción de una noticia publicada, para generateMetadata (la
 * pestaña del navegador y los buscadores). Se consulta desde el servidor a
 * GET /public/news/:slug/:idioma de api-portal (sin auth).
 * Devuelve null si no existe, no está publicada o el backend falla: la página
 * se muestra igual con el título por defecto del Portal.
 */
export async function fetchPublishedNewsMetadata(
  slug: string
): Promise<PublishedNewsMetadata | null> {
  try {
    const dto: PublicNewsDetailDto = USAR_DUMMY
      ? await fetchPublicNewsDetailDummy(slug)
      : await backendFetch<PublicNewsDetailDto>(
          `/public/news/${encodeURIComponent(slug)}/${NEWS_IDIOMA}`
        );
    const titulo = dto.meta_titulo?.trim() || dto.titulo?.trim();
    if (!titulo) return null;
    return {
      titulo,
      descripcion: dto.meta_descripcion?.trim() || dto.resumen?.trim() || null,
    };
  } catch {
    return null;
  }
}
