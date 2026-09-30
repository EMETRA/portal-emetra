import type { PublishedNewsSummary } from "@/lib/content/publishedNews.types";

/**
 * Defensa adicional: /public/news ya filtra en backend (solo publicadas y
 * públicas; si no, 404) y normalmente no envía estado ni visibilidad. Si
 * llegaran y la noticia fuera privada, archivada, borrador o programada, la UI
 * muestra "Esta noticia ya no está disponible". Si no llegan, se confía en el
 * filtro del backend.
 */
export function isNewsAvailable(
  noticia: Pick<PublishedNewsSummary, "estado" | "visibilidad">
): boolean {
  const estadoOk = noticia.estado == null || noticia.estado === "publicada";
  const visibilidadOk =
    noticia.visibilidad == null || noticia.visibilidad === "publica";
  return estadoOk && visibilidadOk;
}
