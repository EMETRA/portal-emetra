import { fetchBffJson } from "@/lib/bff/client";
import type { PublicNewsDetailDto, PublicNewsListDto } from "@/lib/content/types";
import {
  toPublishedNews,
  toPublishedNewsSummary,
} from "@/lib/content/publishedNews.mappers";
import {
  fetchPublicNewsDetailDummy,
  fetchPublicNewsListDummy,
} from "@/lib/content/publishedNews.dummy";
import type {
  PublishedNews,
  PublishedNewsPage,
} from "@/lib/content/publishedNews.types";

/**
 * true = usa los datos de desarrollo de publishedNews.dummy.ts en lugar de
 * api-portal. Debe quedar en false en lo que se sube.
 */
const USAR_DUMMY = false;

/** Idioma del Portal. TODO [COM04-FLUJO]: si se agregan idiomas, tomarlo del sitio. */
export const NEWS_IDIOMA = "es-GT";

/**
 * Página de noticias publicadas (COM-04). Llama al BFF /api/public-news,
 * que reenvía a GET /public/news de api-portal.
 */
export async function fetchPublishedNews({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<PublishedNewsPage> {
  const params = new URLSearchParams({
    idioma: NEWS_IDIOMA,
    page: String(page),
    limit: String(limit),
  });
  const data = USAR_DUMMY
    ? await fetchPublicNewsListDummy(page, limit)
    : await fetchBffJson<PublicNewsListDto>(`/api/public-news?${params}`);

  return {
    items: data.items.map(toPublishedNewsSummary),
    total: data.total,
    page: data.page,
    limit: data.limit,
  };
}

/**
 * Detalle de una noticia publicada por slug. Si api-portal responde 404 (no
 * existe, o no está publicada y pública), lanza un error con name
 * "NotFoundError" y la UI muestra "Esta noticia ya no está disponible".
 */
export async function fetchPublishedNewsBySlug(
  slug: string
): Promise<PublishedNews> {
  try {
    const dto = USAR_DUMMY
      ? await fetchPublicNewsDetailDummy(slug)
      : await fetchBffJson<PublicNewsDetailDto>(
          `/api/public-news/${encodeURIComponent(slug)}?idioma=${NEWS_IDIOMA}`
        );
    return toPublishedNews(dto);
  } catch (error) {
    // BffError (y el error del dummy) traen el status HTTP.
    if ((error as { status?: unknown } | null)?.status === 404) {
      const notFound = new Error("Noticia no encontrada");
      notFound.name = "NotFoundError";
      throw notFound;
    }
    throw error;
  }
}
