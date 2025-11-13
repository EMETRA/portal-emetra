import { API_BASE_URL } from "@/lib/config";

const DEFAULT_ADMIN_KEY = "admin";

export interface PrediceParkingDto {
  id: number;
  descripcion?: string | null;
  direccion?: string | null;
  capacidad?: number | null;
  reservados?: number | null;
  observaciones?: string | null;
  ruta_foto?: string | null;
  longitud?: number | null;
  latitud?: number | null;
}

export interface PrediceEventExtendedProps {
  descripcion?: string | null;
  propietario?: string | null;
  lugar?: string | null;
  oficio?: string | null;
  chapa?: string | null;
  status?: string | null;
  tipo?: string | null;
  categoria?: string | null;
  foto?: string | null;
  longitud?: number | null;
  latitud?: number | null;
}

export interface PrediceEventDto {
  id: number;
  title: string;
  start?: string | null;
  end?: string | null;
  fechai?: string | null;
  fechaf?: string | null;
  horai?: string | null;
  horaf?: string | null;
  estimado?: number | null;
  parqueosDisponibles?: number | null;
  extendedProps?: PrediceEventExtendedProps | null;
  parqueos?: PrediceParkingDto[];
  muni?: number | null;
  telefono?: string | number | null;
  correo?: string | null;
  tasa_compensatoria?: string | null;
}

function buildPrediceUrl(path: string, admin: string | undefined) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (admin) {
    url.searchParams.set("admin", admin);
  }
  return url.toString();
}

export async function fetchPrediceEvents(
  admin: string = DEFAULT_ADMIN_KEY,
): Promise<PrediceEventDto[]> {
  try {
    const response = await fetch(
      buildPrediceUrl("/predice/eventos", admin),
      {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `No fue posible obtener la lista de eventos. Código: ${response.status}`,
      );
    }

    const data = (await response.json()) as PrediceEventDto[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al obtener los eventos de Predice:", error);
    return [];
  }
}

export async function fetchPrediceEventById(
  id: string,
  admin: string = DEFAULT_ADMIN_KEY,
): Promise<PrediceEventDto | null> {
  try {
    const response = await fetch(
      buildPrediceUrl(`/predice/eventos/${id}`, admin),
      {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      },
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `No fue posible obtener el evento ${id}. Código: ${response.status}`,
      );
    }

    return (await response.json()) as PrediceEventDto;
  } catch (error) {
    console.error(
      `Error al obtener el evento de Predice con id ${id}:`,
      error,
    );
    return null;
  }
}

export interface CreatePrediceEventPayload {
  nombre: string;
  descripcion: string;
  propietario: string;
  lugar: string;
  fecha_inicial: string;
  fecha_final: string;
  horai: string;
  horaf: string;
  tipo: string | number;
  categoria: string | number;
  estimado: number;
  muni: number;
  chapa?: string | null;
  oficio?: string | null;
  latitud: number;
  longitud: number;
  telefono: string;
  correo: string;
  tasa_compensatoria?: string | null;
  estado: number;
  parqueos: Array<{
    id?: number | null;
    descripcion: string;
    direccion: string;
    capacidad: number;
    reservados: number;
    observaciones?: string | null;
    lat: number;
    lng: number;
  }>;
}

export async function createPrediceEvent(
  payload: CreatePrediceEventPayload,
  admin: string = DEFAULT_ADMIN_KEY,
) {
  const response = await fetch(buildPrediceUrl("/predice/eventos", admin), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `No fue posible crear el evento. Código: ${response.status}`,
    );
  }

  return response.json();
}

