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
