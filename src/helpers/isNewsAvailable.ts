import type { PublishedNewsSummary } from "@/lib/content/publishedNews.types";

/**
 * Una noticia se puede ver en el Portal solo si está publicada y es pública.
 * Si cambió a privada, se archivó, volvió a borrador o todavía está programada,
 * la UI muestra "Esta noticia ya no está disponible".
 * TODO [COM04-BACKEND]: el backend también debería responder 404 en esos casos;
 * esta revisión en el front es una defensa adicional.
 */
export function isNewsAvailable(
  noticia: Pick<PublishedNewsSummary, "estado" | "visibilidad">
): boolean {
  return noticia.estado === "PUBLICADA" && noticia.visibilidad === "publica";
}
