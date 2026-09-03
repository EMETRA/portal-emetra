export type SolicitudType = "asociacion" | "desasociacion";
export type SolicitudStatus = "en_proceso" | "recibido" | "resuelto";

export interface Solicitud {
    id: string;
    code: string; // "SOL-ID-2101"
    type: SolicitudType;
    plate: string;
    date: string;
    status: SolicitudStatus;
}