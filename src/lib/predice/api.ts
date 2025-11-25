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
  const envUrl = typeof window !== "undefined" 
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.API_BASE_URL;
  
  const baseUrl = envUrl || API_BASE_URL;
  const fullBaseUrl = baseUrl.startsWith("http") 
    ? baseUrl 
    : `http://${baseUrl}`;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(cleanPath, `${fullBaseUrl}/`);
  if (admin) {
    url.searchParams.set("admin", admin);
  }
  return url.toString();
}

export interface FetchPrediceEventsDebugInfo {
  url: string;
  timestamp: string;
  status: number;
  ok: boolean;
  totalEvents: number;
  activeEvents: number;
  error?: string;
  sampleEvent?: PrediceEventDto;
}

export interface FetchPrediceEventsResult {
  events: PrediceEventDto[];
  debug: FetchPrediceEventsDebugInfo;
}

export async function fetchPrediceEvents(
  admin: string = DEFAULT_ADMIN_KEY,
): Promise<PrediceEventDto[]> {
  const result = await fetchPrediceEventsWithDebug(admin);
  return result.events;
}

export async function fetchPrediceEventsWithDebug(
  admin: string = DEFAULT_ADMIN_KEY,
): Promise<FetchPrediceEventsResult> {
  const url = buildPrediceUrl("/predice/eventos", admin);
  const timestamp = new Date().toISOString();
  
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: typeof window !== "undefined" ? "no-cache" : "no-store",
    });

    if (!response.ok) {
      const errorMessage = `No fue posible obtener la lista de eventos. Código: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = (await response.json()) as PrediceEventDto[];
    const events = Array.isArray(data) ? data : [];
    const activeEvents = events.filter(
      (event) => event.extendedProps?.status === "ACTIVO"
    ).length;
    const sampleEvent = events.length > 0 ? events[0] : undefined;

    return {
      events,
      debug: {
        url,
        timestamp,
        status: response.status,
        ok: response.ok,
        totalEvents: events.length,
        activeEvents,
        sampleEvent,
      },
    };
  } catch (error) {
    return {
      events: [],
      debug: {
        url,
        timestamp,
        status: 0,
        ok: false,
        totalEvents: 0,
        activeEvents: 0,
        error: error instanceof Error ? error.message : String(error),
      },
    };
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

