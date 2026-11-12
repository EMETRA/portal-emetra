export type EvialEvent = {
  EVENTO: number;
  NOMBRE: string;
  TIPO: string;
  DESCRIPCION?: string;
  LUGAR?: string;
  IMAGEN?: string | null;
  ESTATUS?: string;
  FECHA_INICIO: string;
  FECHA_FINAL: string;
  PARTICIPANTES?: number;
  INSCRIPCION_ABIERTA?: number;
};
export type EvialDetail = {
  evento: EvialEvent;
  requisitos: { REQUISITO: number; DESCRIPCION: string }[];
  reglas: { REGLA: number; DESCRIPCION: string }[];
  beneficios: { BENEFICIO: number; NOMBRE: string; DESCRIPCION: string }[];
  actividades: { ACTIVIDAD: number; DESCRIPCION: string; FECHA: string }[];
  patrocinadores: {
    MARCA: number;
    NOMBRE: string;
    RUTA_IMAGEN: string | null;
  }[];
};
export type EvialConfiguration = {
  registroDisponible: boolean;
  evidenciaDisponible: boolean;
  correoDisponible: boolean;
  staffSiteKey: string;
};
export type EvialHome = {
  eventos: EvialEvent[];
  preguntas: { DESCRIPCION: string; RESPUESTA: string }[];
  videos: {
    ID: number;
    TITULO: string;
    DESCRIPCION: string;
    URL: string | null;
  }[];
};
export type CourseStatus = {
  aprobado: boolean;
  agotado: boolean;
  intentos: number;
  intentosRestantes: number;
  punteo: number | null;
  fase1: boolean;
  fase2: boolean;
  fase3: boolean;
  fase4: boolean;
};
export type EvialCourse = {
  evento: EvialEvent;
  inscripcion: {
    PERSONA: number;
    GRUPO: number;
    ASISTENCIA?: string;
    TEORICO?: string;
    PRACTICO?: string;
  };
  participante: { NOMBRES: string; APELLIDOS: string };
  estado: CourseStatus;
  contenidos: {
    CONTENIDO_ID: number;
    NOMBRE: string;
    MODULO: number;
    URL: string | null;
  }[];
};
export type ExamQuestion = {
  MODULO: number;
  PREGUNTA: number;
  DESCRIPCION: string;
  IMAGEN: string | null;
  opciones: { OPCION: number; DESCRIPCION: string }[];
};
export type EvialExam = {
  intento: number;
  intentoToken: string;
  duracionSegundos: number;
  preguntas: ExamQuestion[];
};
export type EvialPupil = {
  ALUMNO: number;
  NOMBRES: string;
  APELLIDOS: string;
  DPI: string;
  TELEFONO: string;
  CORREO: string;
  evaluado: boolean;
  accesoEvaluacion: string | null;
};
export type EvialCapabilities = {
  consultar: boolean;
  asistencia: boolean;
  administrar: boolean;
};
export type EvialStaff = {
  actor: { id: number; correo: string };
  capabilities: EvialCapabilities;
};
export type EvialParticipant = {
  EVIDENCIA_DISPONIBLE?: boolean;
  PERSONA: number;
  NOMBRES: string;
  APELLIDOS: string;
  DPI: string;
  TELEFONO: string;
  CORREO_ELECTRONICO: string;
  GRUPO: number;
  ASISTENCIA?: string;
  TEORICO?: string;
  PRACTICO?: string;
};
export class EvialError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly referencia?: string,
  ) {
    super(message);
  }
}
export async function evialRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch("/api/evial/" + path, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      ...(init.body && !(init.body instanceof FormData)
        ? { "content-type": "application/json" }
        : {}),
      ...init.headers,
    },
  });
  const body = await response
    .json()
    .catch(() => ({ message: "El servicio no devolvió una respuesta válida" }));
  if (!response.ok)
    throw new EvialError(
      body.message || "No se pudo completar la operación",
      response.status,
      body.referencia,
    );
  return body as T;
}
export const eventMode = (tipo: string) =>
  ["V", "F"].includes(tipo) ? "En línea" : "Presencial";
export function eventDate(value: string) {
  const date = new Date(value.slice(0, 10) + "T12:00:00-06:00");
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("es-GT", {
        timeZone: "America/Guatemala",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date)
    : "Fecha por confirmar";
}
