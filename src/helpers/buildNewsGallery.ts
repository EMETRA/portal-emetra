import type {
  NewsResource,
  PublishedNews,
} from "@/lib/content/publishedNews.types";

/**
 * Reúne en "Galería y adjuntos" todos los recursos de imagen o video de la
 * noticia: principal, imágenes de sección, galería y adjuntos, en ese orden y
 * sin repetir id.
 * TODO [COM04-FLUJO]: los adjuntos de tipo archivo o externo (PDF, enlaces) no
 * entran; definir con diseño si se muestran y cómo.
 */
export function buildNewsGallery(
  news: Pick<
    PublishedNews,
    "recursoPrincipal" | "secciones" | "galeria" | "adjuntos"
  >
): NewsResource[] {
  const candidatos: (NewsResource | null)[] = [
    news.recursoPrincipal,
    ...[...news.secciones]
      .sort((a, b) => a.orden - b.orden)
      .map((seccion) => seccion.recurso),
    ...news.galeria,
    ...news.adjuntos,
  ];

  const vistos = new Set<string>();
  const recursos: NewsResource[] = [];
  for (const recurso of candidatos) {
    if (
      recurso &&
      (recurso.tipo === "imagen" || recurso.tipo === "video") &&
      !vistos.has(recurso.id)
    ) {
      vistos.add(recurso.id);
      recursos.push(recurso);
    }
  }
  return recursos;
}

/** La galería se muestra solo si hay más de un recurso en total. */
export function shouldShowNewsGallery(recursos: NewsResource[]): boolean {
  return recursos.length > 1;
}
