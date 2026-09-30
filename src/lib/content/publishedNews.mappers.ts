import type {
  PublicNewsDetailDto,
  PublicNewsGalleryItemDto,
  PublicNewsItemDto,
  PublicNewsResourceDto,
  PublicNewsTaxonomyDto,
} from "@/lib/content/types";
import type {
  NewsChip,
  NewsResource,
  NewsResourceType,
  PublishedNews,
  PublishedNewsSummary,
} from "@/lib/content/publishedNews.types";
import { parseYouTubeId, toYouTubeWatchUrl } from "@/helpers/youtube";

/**
 * El README siempre trae `tipo`; si faltara, un enlace de YouTube se toma como
 * video y lo demás como imagen.
 */
function resolverTipo(dto: PublicNewsResourceDto, url: string): NewsResourceType {
  if (dto.tipo) return dto.tipo;
  return parseYouTubeId(url) ? "video" : "imagen";
}

/**
 * Recurso sin URL = no se puede mostrar: se trata como ausente.
 * Los videos solo pueden ser videos normales de YouTube (no hay MP4): si la
 * URL no lo es, el recurso se descarta. La URL se normaliza a watch?v=ID.
 */
export function toNewsResource(
  dto?: PublicNewsResourceDto | null
): NewsResource | null {
  const urlOriginal = dto?.url?.trim();
  if (!dto || !urlOriginal) return null;

  const tipo = resolverTipo(dto, urlOriginal);
  let url = urlOriginal;
  if (tipo === "video") {
    const youtubeId = parseYouTubeId(urlOriginal);
    if (!youtubeId) return null;
    url = toYouTubeWatchUrl(youtubeId);
  }

  return {
    id: dto.id,
    tipo,
    url,
    textoAlternativo: dto.texto_alternativo ?? null,
    pieImagen: dto.pie_imagen ?? null,
    creditos: dto.creditos ?? null,
  };
}

function toChips(lista?: PublicNewsTaxonomyDto[] | null): NewsChip[] {
  return (lista ?? []).flatMap((item) =>
    item.nombre?.trim() ? [{ id: item.id, nombre: item.nombre.trim() }] : []
  );
}

/** Galería: items { orden, recurso } ordenados por orden; sin recurso válido se descartan. */
function toGallery(lista?: PublicNewsGalleryItemDto[] | null): NewsResource[] {
  return [...(lista ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .flatMap((item) => {
      const recurso = toNewsResource(item.recurso);
      return recurso ? [recurso] : [];
    });
}

export function toPublishedNewsSummary(
  dto: PublicNewsItemDto
): PublishedNewsSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    estado: dto.estado ?? null,
    visibilidad: dto.visibilidad ?? null,
    titulo: dto.titulo,
    resumen: dto.resumen?.trim() || null,
    // Backend ya elige el autor visible (rol "autor" o el de menor orden).
    autor: dto.autor?.nombre?.trim() || null,
    fechaPublicacion: dto.fecha_publicacion ?? null,
    recursoPrincipal: toNewsResource(dto.recurso_principal),
  };
}

export function toPublishedNews(dto: PublicNewsDetailDto): PublishedNews {
  return {
    ...toPublishedNewsSummary(dto),
    idioma: dto.idioma,
    tiempoLectura: dto.tiempo_lectura ?? null,
    categorias: toChips(dto.categorias),
    etiquetas: toChips(dto.etiquetas),
    secciones: [...(dto.secciones ?? [])]
      .sort((a, b) => a.orden - b.orden)
      .map((seccion) => ({
        id: seccion.id,
        orden: seccion.orden,
        encabezado: seccion.encabezado?.trim() ?? "",
        contenidoHtml: seccion.contenido_html ?? "",
        recurso: toNewsResource(seccion.recurso),
      })),
    galeria: toGallery(dto.galeria),
  };
}
