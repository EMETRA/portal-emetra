import type {
  NewsResource,
  NewsSection,
  PublishedNews,
  PublishedNewsPage,
  PublishedNewsSummary,
} from "@/lib/content/publishedNews.types";
import { isNewsAvailable } from "@/helpers/isNewsAvailable";

/*
 * TODO [COM04-BACKEND]: todo este archivo es dummy. El backend está en pausa
 * hasta que confirmen qué queries usar (el /api/news actual u otro servicio).
 * La forma sigue el esquema del formulario de COM-03 y los textos salen del
 * Figma de COM-04. Al conectar, reemplazar las funciones de abajo por las
 * llamadas reales y borrar este archivo.
 */

/** Simula el estado del listado para revisar el diseño. Solo en código. */
export const SIMULAR_LISTADO: "ok" | "vacio" | "error" = "ok";

/** Simula el estado del detalle para revisar el diseño. Solo en código. */
export const SIMULAR_DETALLE: "ok" | "error" = "ok";

const DEMORA_MS = 600;

const AUTOR = "Comunicación EMETRA";

/** TB_RECURSO con los campos opcionales vacíos. */
function recurso(
  id: string,
  tipo: NewsResource["tipo"],
  url: string,
  extra: Partial<NewsResource> = {}
): NewsResource {
  return {
    id,
    tipo,
    url,
    tipoMime: null,
    ancho: null,
    alto: null,
    duracionSegundos: null,
    textoAlternativo: null,
    pieImagen: null,
    creditos: null,
    ...extra,
  };
}

// contenidoHtml tal como lo genera textToHtml en COM-03.
const SECCIONES_BASE: NewsSection[] = [
  {
    id: "seccion-1",
    orden: 1,
    encabezado: "Antes: cómo funcionaba",
    contenidoHtml:
      "<p>El monto de la remisión solo se conocía hasta pagar en el portal institucional, y no existía un número de caso para dar seguimiento a la defensa presentada en línea.</p>",
    recurso: null,
  },
  {
    id: "seccion-2",
    orden: 2,
    encabezado: "Ahora: qué encontrarás",
    contenidoHtml:
      "<p>El monto base se muestra desde el resumen de tu denuncia, y tu defensa queda registrada con un número de caso que puedes seguir hasta la resolución del juzgado.</p>",
    recurso: null,
  },
];

const SERVICIOS = { id: "1", nombre: "Servicios" };

/**
 * Cuatro noticias, una por variante del Figma: completa, una imagen, un video
 * y sin recursos.
 */
const NOTICIAS: PublishedNews[] = [
  {
    id: "1",
    slug: "nuevo-horario-de-circulacion-en-zona-10",
    estado: "PUBLICADA",
    visibilidad: "publica",
    titulo: "Nuevo horario de circulación en zona 10",
    resumen:
      "A partir de octubre, algunas rutas de zona 10 tendrán un nuevo horario de circulación restringida para mejorar la movilidad.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-18",
    idioma: "es-GT",
    tiempoLectura: 4,
    recursoPrincipal: recurso("101", "imagen", "/images/banner.jpg", {
      tipoMime: "image/jpeg",
      textoAlternativo: "Tránsito en zona 10",
    }),
    categoria: SERVICIOS,
    subcategoria: null,
    etiquetas: [{ id: "1", nombre: "movilidad" }],
    secciones: [
      SECCIONES_BASE[0],
      {
        ...SECCIONES_BASE[1],
        recurso: recurso("102", "imagen", "/images/MAIN_Background.jpg", {
          tipoMime: "image/jpeg",
          textoAlternativo: "Imagen de esta sección",
        }),
      },
    ],
    galeria: [
      recurso("103", "imagen", "/images/Evento.jpg", {
        tipoMime: "image/jpeg",
        textoAlternativo: "Imagen de la galería",
      }),
      recurso("104", "video", "https://www.youtube.com/watch?v=k7GpknPnk1A", {
        textoAlternativo: "Video #1",
        pieImagen:
          "Recorrido de referencia del nuevo flujo de aceptación y pago en el Portal.",
      }),
    ],
    adjuntos: [],
  },
  {
    id: "2",
    slug: "campana-de-educacion-vial-escolar",
    estado: "PUBLICADA",
    visibilidad: "publica",
    titulo: "Campaña de educación vial escolar",
    resumen:
      "EMETRA visitará colegios de la ciudad con talleres sobre seguridad vial dirigidos a estudiantes de primaria.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-25",
    idioma: "es-GT",
    tiempoLectura: 4,
    recursoPrincipal: recurso("201", "imagen", "/images/Evento.jpg", {
      tipoMime: "image/jpeg",
      textoAlternativo: "Taller de educación vial",
    }),
    categoria: SERVICIOS,
    subcategoria: null,
    etiquetas: [{ id: "2", nombre: "educación" }],
    secciones: SECCIONES_BASE,
    galeria: [],
    adjuntos: [],
  },
  {
    id: "3",
    slug: "actualizacion-del-sistema-de-remisiones",
    estado: "PUBLICADA",
    visibilidad: "publica",
    titulo: "Actualización del sistema de remisiones",
    resumen:
      "El proceso para aceptar y pagar remisiones desde el Portal tiene nuevas mejoras pensadas para agilizar tu trámite.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-14",
    idioma: "es-GT",
    tiempoLectura: 4,
    recursoPrincipal: recurso(
      "301",
      "video",
      "https://www.youtube.com/watch?v=QsxsN9JVB0A",
      { textoAlternativo: "Video de la noticia" }
    ),
    categoria: SERVICIOS,
    subcategoria: null,
    etiquetas: [{ id: "3", nombre: "remisiones" }],
    secciones: SECCIONES_BASE,
    galeria: [],
    adjuntos: [],
  },
  {
    id: "4",
    slug: "jornada-de-renovacion-de-licencias",
    estado: "PUBLICADA",
    visibilidad: "publica",
    titulo: "Jornada de renovación de licencias",
    resumen:
      "Conoce los requisitos y las sedes habilitadas para renovar tu licencia de conducir durante este mes.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-10",
    idioma: "es-GT",
    tiempoLectura: 3,
    recursoPrincipal: null,
    categoria: SERVICIOS,
    subcategoria: null,
    etiquetas: [{ id: "4", nombre: "licencias" }],
    secciones: SECCIONES_BASE,
    galeria: [],
    adjuntos: [],
  },
];

/**
 * Noticias que existen pero no se pueden ver en el Portal: una por cada motivo
 * de "Esta noticia ya no está disponible". No salen en el listado; sirven para
 * probar el detalle con /noticias/<slug>.
 */
const NO_DISPONIBLES: PublishedNews[] = (
  [
    ["noticia-privada", "PUBLICADA", "privada"],
    ["noticia-archivada", "ARCHIVADA", "publica"],
    ["noticia-en-borrador", "BORRADOR", "publica"],
    ["noticia-programada", "PROGRAMADA", "publica"],
  ] as const
).map(([slug, estado, visibilidad], index) => ({
  ...NOTICIAS[1],
  id: `9${index}`,
  slug,
  estado,
  visibilidad,
}));

const TODAS = [...NOTICIAS, ...NO_DISPONIBLES];

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toSummary(noticia: PublishedNews): PublishedNewsSummary {
  const {
    id,
    slug,
    estado,
    visibilidad,
    titulo,
    resumen,
    autor,
    fechaPublicacion,
    recursoPrincipal,
  } = noticia;
  return {
    id,
    slug,
    estado,
    visibilidad,
    titulo,
    resumen,
    autor,
    fechaPublicacion,
    recursoPrincipal,
  };
}

/**
 * Página de noticias publicadas, con la misma forma que NewsListResponseDto
 * ({ items, total, page, limit }). La página empieza en 1.
 * TODO [COM04-BACKEND]: llamada propuesta, pendiente de confirmar con backend:
 *   const data = await fetchBffJson<NewsListResponseDto>(
 *     `/api/news?estado=publicada&visibilidad=publica&idioma=es-GT&page=${page}&limit=${limit}`
 *   );
 *   return { ...data, items: data.items.map(mapNewsSummary) };
 */
export async function fetchPublishedNewsDummy({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<PublishedNewsPage> {
  await esperar(DEMORA_MS);
  if (SIMULAR_LISTADO === "error") {
    throw new Error("No se pudieron cargar las noticias.");
  }
  // El listado solo trae publicadas y públicas (como lo filtraría el backend).
  const todas = SIMULAR_LISTADO === "vacio" ? [] : TODAS.filter(isNewsAvailable);
  const inicio = (page - 1) * limit;
  return {
    items: todas.slice(inicio, inicio + limit).map(toSummary),
    total: todas.length,
    page,
    limit,
  };
}

/**
 * Detalle de una noticia por slug. Si el slug no existe, lanza un error con
 * name "NotFoundError" (igual que fetchNewsByIdClient). Si existe pero no es
 * pública, la devuelve tal cual para que la UI la rechace con isNewsAvailable.
 * En ambos casos se muestra "Esta noticia ya no está disponible".
 * TODO [COM04-BACKEND]: hoy el backend solo expone /news/:id. Proponer
 * GET /news/slug/:slug y un BFF /api/news/slug/[slug].
 */
export async function fetchPublishedNewsBySlugDummy(
  slug: string
): Promise<PublishedNews> {
  await esperar(DEMORA_MS);
  if (SIMULAR_DETALLE === "error") {
    throw new Error("No se pudo cargar la noticia.");
  }
  const noticia = TODAS.find((item) => item.slug === slug);
  if (!noticia) {
    const error = new Error("Noticia no encontrada");
    error.name = "NotFoundError";
    throw error;
  }
  return noticia;
}
