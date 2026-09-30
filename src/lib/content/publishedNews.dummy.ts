import type {
  PublicNewsDetailDto,
  PublicNewsItemDto,
  PublicNewsListDto,
  PublicNewsSectionDto,
} from "@/lib/content/types";

/*
 * Datos de desarrollo de COM-04 con la forma de /public/news (README de
 * backend). Solo se usan si USAR_DUMMY está activo en publishedNews.api.ts.
 * Los textos salen del Figma. Imitan al backend: el listado y el detalle solo
 * devuelven publicadas + públicas; lo demás responde 404.
 */

/** Simula el estado del listado. Solo en código. */
export const SIMULAR_LISTADO: "ok" | "vacio" | "error" = "ok";

/** Simula el estado del detalle. Solo en código. */
export const SIMULAR_DETALLE: "ok" | "error" = "ok";

const DEMORA_MS = 600;

// contenido_html tal como lo genera textToHtml en COM-03.
const SECCIONES_BASE: PublicNewsSectionDto[] = [
  {
    id: 1,
    orden: 1,
    encabezado: "Antes: cómo funcionaba",
    contenido_html:
      "<p>El monto de la remisión solo se conocía hasta pagar en el portal institucional, y no existía un número de caso para dar seguimiento a la defensa presentada en línea.</p>",
  },
  {
    id: 2,
    orden: 2,
    encabezado: "Ahora: qué encontrarás",
    contenido_html:
      "<p>El monto base se muestra desde el resumen de tu denuncia, y tu defensa queda registrada con un número de caso que puedes seguir hasta la resolución del juzgado.</p>",
  },
];

const BASE = {
  estado: "publicada",
  visibilidad: "publica",
  idioma: "es-GT",
  autor: { id: 1, nombre: "Comunicación EMETRA" },
  autores: [{ id: 1, nombre: "Comunicación EMETRA", rol: "autor", orden: 1 }],
  categorias: [{ id: 1, nombre: "Servicios", slug: "servicios" }],
} as const satisfies Partial<PublicNewsDetailDto>;

/** Una noticia por variante del Figma: completa, una imagen, un video y sin recursos. */
const NOTICIAS: PublicNewsDetailDto[] = [
  {
    ...BASE,
    id: 1,
    slug: "nuevo-horario-de-circulacion-en-zona-10",
    titulo: "Nuevo horario de circulación en zona 10",
    resumen:
      "A partir de octubre, algunas rutas de zona 10 tendrán un nuevo horario de circulación restringida para mejorar la movilidad.",
    fecha_publicacion: "2026-09-18T14:00:00.000Z",
    tiempo_lectura: 4,
    recurso_principal: {
      id: 101,
      tipo: "imagen",
      url: "/images/banner.jpg",
      texto_alternativo: "Tránsito en zona 10",
    },
    etiquetas: [{ id: 1, nombre: "movilidad" }],
    secciones: [
      {
        ...SECCIONES_BASE[0],
        // Sección con video (las secciones aceptan imagen o video de YouTube).
        recurso: {
          id: 105,
          tipo: "video",
          url: "https://youtu.be/QsxsN9JVB0A",
          texto_alternativo: "Explicación del proceso anterior",
        },
      },
      {
        ...SECCIONES_BASE[1],
        recurso: {
          id: 102,
          tipo: "imagen",
          url: "/images/MAIN_Background.jpg",
          texto_alternativo: "Imagen de esta sección",
        },
      },
    ],
    galeria: [
      {
        orden: 1,
        recurso: {
          id: 103,
          tipo: "imagen",
          url: "/images/Evento.jpg",
          texto_alternativo: "Imagen de la galería",
        },
      },
      {
        orden: 2,
        recurso: {
          id: 104,
          tipo: "video",
          url: "https://www.youtube.com/watch?v=k7GpknPnk1A",
          texto_alternativo: "Video #1",
          pie_imagen:
            "Recorrido de referencia del nuevo flujo de aceptación y pago en el Portal.",
        },
      },
    ],
  },
  {
    ...BASE,
    id: 2,
    slug: "campana-de-educacion-vial-escolar",
    titulo: "Campaña de educación vial escolar",
    resumen:
      "EMETRA visitará colegios de la ciudad con talleres sobre seguridad vial dirigidos a estudiantes de primaria.",
    fecha_publicacion: "2026-09-25T14:00:00.000Z",
    tiempo_lectura: 4,
    recurso_principal: {
      id: 201,
      tipo: "imagen",
      url: "/images/Evento.jpg",
      texto_alternativo: "Taller de educación vial",
    },
    etiquetas: [{ id: 2, nombre: "educación" }],
    secciones: SECCIONES_BASE,
  },
  {
    ...BASE,
    id: 3,
    slug: "actualizacion-del-sistema-de-remisiones",
    titulo: "Actualización del sistema de remisiones",
    resumen:
      "El proceso para aceptar y pagar remisiones desde el Portal tiene nuevas mejoras pensadas para agilizar tu trámite.",
    fecha_publicacion: "2026-09-14T14:00:00.000Z",
    tiempo_lectura: 4,
    recurso_principal: {
      id: 301,
      tipo: "video",
      url: "https://www.youtube.com/watch?v=QsxsN9JVB0A",
      texto_alternativo: "Video de la noticia",
    },
    etiquetas: [{ id: 3, nombre: "remisiones" }],
    secciones: SECCIONES_BASE,
  },
  {
    ...BASE,
    id: 4,
    slug: "jornada-de-renovacion-de-licencias",
    titulo: "Jornada de renovación de licencias",
    resumen:
      "Conoce los requisitos y las sedes habilitadas para renovar tu licencia de conducir durante este mes.",
    fecha_publicacion: "2026-09-10T14:00:00.000Z",
    tiempo_lectura: 3,
    recurso_principal: null,
    etiquetas: [{ id: 4, nombre: "licencias" }],
    secciones: SECCIONES_BASE,
  },
];

/**
 * Existen pero el backend no las expone (404): privada, archivada, borrador y
 * programada. Sirven para probar "Esta noticia ya no está disponible".
 */
const NO_DISPONIBLES: PublicNewsDetailDto[] = (
  [
    ["noticia-privada", "publicada", "privada"],
    ["noticia-archivada", "archivada", "publica"],
    ["noticia-en-borrador", "borrador", "publica"],
    ["noticia-programada", "programada", "publica"],
  ] as const
).map(([slug, estado, visibilidad], index) => ({
  ...NOTICIAS[1],
  id: 90 + index,
  slug,
  estado,
  visibilidad,
}));

const esPublica = (dto: PublicNewsItemDto) =>
  dto.estado === "publicada" && dto.visibilidad === "publica";

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Error con status, como BffError, para que la API lo trate igual. */
function errorHttp(status: number, message: string) {
  return Object.assign(new Error(message), { name: "BffError", status });
}

/** Solo los campos del item del listado del README (sin autores, taxonomía, secciones ni galería). */
function toItem(dto: PublicNewsDetailDto): PublicNewsItemDto {
  return {
    id: dto.id,
    slug: dto.slug,
    titulo: dto.titulo,
    resumen: dto.resumen,
    estado: dto.estado,
    visibilidad: dto.visibilidad,
    fecha_publicacion: dto.fecha_publicacion,
    idioma: dto.idioma,
    tiempo_lectura: dto.tiempo_lectura,
    recurso_principal: dto.recurso_principal,
    autor: dto.autor,
  };
}

/** Como en el README: lo que no hay va en arreglo vacío. */
function toDetail(dto: PublicNewsDetailDto): PublicNewsDetailDto {
  return {
    ...toItem(dto),
    autores: dto.autores ?? [],
    categorias: dto.categorias ?? [],
    etiquetas: dto.etiquetas ?? [],
    secciones: dto.secciones ?? [],
    galeria: dto.galeria ?? [],
  };
}

/** Imita GET /public/news. */
export async function fetchPublicNewsListDummy(
  page: number,
  limit: number
): Promise<PublicNewsListDto> {
  await esperar(DEMORA_MS);
  if (SIMULAR_LISTADO === "error") throw errorHttp(502, "Bad Gateway");
  const publicas =
    SIMULAR_LISTADO === "vacio"
      ? []
      : [...NOTICIAS, ...NO_DISPONIBLES].filter(esPublica);
  const inicio = (page - 1) * limit;
  return {
    items: publicas.slice(inicio, inicio + limit).map(toItem),
    total: publicas.length,
    page,
    limit,
  };
}

/** Imita GET /public/news/:slug/:idioma: 404 si no existe o no es pública. */
export async function fetchPublicNewsDetailDummy(
  slug: string
): Promise<PublicNewsDetailDto> {
  await esperar(DEMORA_MS);
  if (SIMULAR_DETALLE === "error") throw errorHttp(502, "Bad Gateway");
  const noticia = [...NOTICIAS, ...NO_DISPONIBLES].find(
    (item) => item.slug === slug
  );
  if (!noticia || !esPublica(noticia)) {
    throw errorHttp(404, "Noticia aún no publicada");
  }
  return toDetail(noticia);
}
