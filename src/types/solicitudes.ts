export type SolicitudType = "empresa" | "vehiculo" | "invitacion";
export type SolicitudStatus = "en_proceso" | "recibido" | "resuelto";

export interface Solicitud {
    id: string;
    code: string; // "SOL-ID-2101"
    reference: string;
    type: SolicitudType;
    detail: string;
    date: string;
    occurredAt: string;
    status: SolicitudStatus;
    statusLabel: string;
}
