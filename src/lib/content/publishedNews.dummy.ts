import type {
  NewsSection,
  PublishedNews,
  PublishedNewsSummary,
} from "@/lib/content/publishedNews.types";

/*
 * TODO [COM04-BACKEND]: todo este archivo es dummy. El backend está en pausa
 * hasta que confirmen qué queries usar (el /api/news actual u otro servicio).
 * Los textos salen del Figma de COM-04. Al conectar, reemplazar las funciones
 * de abajo por las llamadas reales y borrar este archivo.
 */

/** Simula el estado del listado para revisar el diseño. Solo en código. */
export const SIMULAR_LISTADO: "ok" | "vacio" | "error" = "ok";

/** Simula el estado del detalle para revisar el diseño. Solo en código. */
export const SIMULAR_DETALLE: "ok" | "error" = "ok";

const DEMORA_MS = 600;

const AUTOR = "Comunicación EMETRA";

const SECCIONES_BASE: NewsSection[] = [
  {
    id: 1,
    orden: 1,
    encabezado: "Antes: cómo funcionaba",
    contenido:
      "El monto de la remisión solo se conocía hasta pagar en el portal institucional, y no existía un número de caso para dar seguimiento a la defensa presentada en línea.",
  },
  {
    id: 2,
    orden: 2,
    encabezado: "Ahora: qué encontrarás",
    contenido:
      "El monto base se muestra desde el resumen de tu denuncia, y tu defensa queda registrada con un número de caso que puedes seguir hasta la resolución del juzgado.",
  },
];

/**
 * Cuatro noticias, una por variante del Figma: completa, una imagen, un video
 * y sin recursos.
 */
const NOTICIAS: PublishedNews[] = [
  {
    id: 1,
    slug: "nuevo-horario-de-circulacion-en-zona-10",
    titulo: "Nuevo horario de circulación en zona 10",
    resumen:
      "A partir de octubre, algunas rutas de zona 10 tendrán un nuevo horario de circulación restringida para mejorar la movilidad.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-18",
    recursoPrincipal: {
      id: 101,
      tipo: "imagen",
      url: "/images/banner.jpg",
      textoAlternativo: "Tránsito en zona 10",
    },
    tiempoLecturaMin: 4,
    categorias: [{ id: 1, nombre: "Servicios" }],
    etiquetas: [{ id: 1, nombre: "movilidad" }],
    secciones: [
      SECCIONES_BASE[0],
      {
        ...SECCIONES_BASE[1],
        recurso: {
          id: 102,
          tipo: "imagen",
          url: "/images/MAIN_Background.jpg",
          textoAlternativo: "Imagen de esta sección",
        },
      },
    ],
    galeria: [
      {
        id: 103,
        tipo: "imagen",
        url: "/images/Evento.jpg",
        textoAlternativo: "Imagen de la galería",
      },
      {
        id: 104,
        tipo: "video",
        url: "https://www.youtube.com/watch?v=k7GpknPnk1A",
        nombre: "Video #1",
        pie: "Recorrido de referencia del nuevo flujo de aceptación y pago en el Portal.",
      },
    ],
  },
  {
    id: 2,
    slug: "campana-de-educacion-vial-escolar",
    titulo: "Campaña de educación vial escolar",
    resumen:
      "EMETRA visitará colegios de la ciudad con talleres sobre seguridad vial dirigidos a estudiantes de primaria.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-25",
    recursoPrincipal: {
      id: 201,
      tipo: "imagen",
      url: "/images/Evento.jpg",
      textoAlternativo: "Taller de educación vial",
    },
    tiempoLecturaMin: 4,
    categorias: [{ id: 1, nombre: "Servicios" }],
    etiquetas: [{ id: 2, nombre: "educación" }],
    secciones: SECCIONES_BASE,
    galeria: [],
  },
  {
    id: 3,
    slug: "actualizacion-del-sistema-de-remisiones",
    titulo: "Actualización del sistema de remisiones",
    resumen:
      "El proceso para aceptar y pagar remisiones desde el Portal tiene nuevas mejoras pensadas para agilizar tu trámite.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-14",
    recursoPrincipal: {
      id: 301,
      tipo: "video",
      url: "https://www.youtube.com/watch?v=QsxsN9JVB0A",
      nombre: "Video de la noticia",
    },
    tiempoLecturaMin: 4,
    categorias: [{ id: 1, nombre: "Servicios" }],
    etiquetas: [{ id: 3, nombre: "remisiones" }],
    secciones: SECCIONES_BASE,
    galeria: [],
  },
  {
    id: 4,
    slug: "jornada-de-renovacion-de-licencias",
    titulo: "Jornada de renovación de licencias",
    resumen:
      "Conoce los requisitos y las sedes habilitadas para renovar tu licencia de conducir durante este mes.",
    autor: AUTOR,
    fechaPublicacion: "2026-09-10",
    recursoPrincipal: null,
    tiempoLecturaMin: 3,
    categorias: [{ id: 1, nombre: "Servicios" }],
    etiquetas: [{ id: 4, nombre: "licencias" }],
    secciones: SECCIONES_BASE,
    galeria: [],
  },
];

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toSummary(noticia: PublishedNews): PublishedNewsSummary {
  const {
    id,
    slug,
    titulo,
    resumen,
    autor,
    fechaPublicacion,
    recursoPrincipal,
  } = noticia;
  return { id, slug, titulo, resumen, autor, fechaPublicacion, recursoPrincipal };
}

/**
 * Lista de noticias publicadas.
 * TODO [COM04-BACKEND]: llamada propuesta, pendiente de confirmar con backend:
 *   const data = await fetchBffJson<NewsListResponseDto>(
 *     "/api/news?estado=publicada&visibilidad=publica&idioma=es-GT&page=1&limit=10"
 *   );
 *   return data.items.map(mapNewsSummary);
 * También falta definir la paginación (el diseño no la tiene).
 */
export async function fetchPublishedNewsDummy(): Promise<PublishedNewsSummary[]> {
  await esperar(DEMORA_MS);
  if (SIMULAR_LISTADO === "error") {
    throw new Error("No se pudieron cargar las noticias.");
  }
  if (SIMULAR_LISTADO === "vacio") {
    return [];
  }
  return NOTICIAS.map(toSummary);
}

/**
 * Detalle de una noticia publicada por slug. Si no existe o ya no está
 * publicada, lanza un error con name "NotFoundError" (igual que
 * fetchNewsByIdClient), y la UI muestra "Esta noticia ya no está disponible".
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
  const noticia = NOTICIAS.find((item) => item.slug === slug);
  if (!noticia) {
    const error = new Error("Noticia no encontrada");
    error.name = "NotFoundError";
    throw error;
  }
  return noticia;
}
