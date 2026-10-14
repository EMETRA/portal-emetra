import { getCasilleroJson } from "./api";
import type {
    CasilleroNotificationDetail,
    CasilleroNotificationList,
} from "./types";

/**
 * Error del buzón con el código HTTP, para que la pantalla distinga una sesión vencida
 * (401: volver al login) de una notificación o documento no disponible (404).
 */
export class CasilleroNotificationError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
        this.name = "CasilleroNotificationError";
    }
}

const SESION_VENCIDA = "Tu sesión venció. Vuelve a iniciar sesión";

export const isSesionVencida = (error: unknown): boolean =>
    error instanceof CasilleroNotificationError && error.status === 401;

/** Fecha de emisión en formato local (dd/mm/aaaa); vacío si la fecha no es válida. */
export function formatearFechaNotificacion(iso: string): string {
    const fecha = new Date(iso);
    return Number.isNaN(fecha.getTime())
        ? ""
        : fecha.toLocaleDateString("es-GT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Hora de emisión en formato local; vacío si la fecha no es válida. */
export function formatearHoraNotificacion(iso: string): string {
    const fecha = new Date(iso);
    return Number.isNaN(fecha.getTime())
        ? ""
        : fecha.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
}

// ── LISTADO ───────────────────────────────────────────────────────────────
function errorFromListStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 429 ? "Demasiadas solicitudes. Intenta más tarde"
        : "No se pudo cargar el buzón. Intenta más tarde";
    return new CasilleroNotificationError(message, status);
}

/** Una página del buzón. `cursor` es el `nextCursor` de la página anterior (opaco). */
export async function fetchNotifications(
    limit: number,
    cursor?: string | null
): Promise<CasilleroNotificationList> {
    const query = new URLSearchParams({ limit: String(limit) });
    if (cursor) query.set("cursor", cursor);
    return getCasilleroJson<CasilleroNotificationList>(
        `/api/casillero/notifications?${query}`,
        errorFromListStatus
    );
}

// ── DETALLE ───────────────────────────────────────────────────────────────
function errorFromDetailStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 404 ? "No se encontró la notificación"
        : "No se pudo cargar la notificación. Intenta más tarde";
    return new CasilleroNotificationError(message, status);
}

/** Detalle de una notificación; el backend registra la apertura. */
export async function fetchNotificationDetail(
    id: string
): Promise<CasilleroNotificationDetail> {
    return getCasilleroJson<CasilleroNotificationDetail>(
        `/api/casillero/notifications/${encodeURIComponent(id)}`,
        errorFromDetailStatus
    );
}

// ── DOCUMENTO ─────────────────────────────────────────────────────────────
function errorFromDocumentStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 404 ? "El documento de esta notificación no está disponible"
        : "No se pudo cargar el documento. Intenta más tarde";
    return new CasilleroNotificationError(message, status);
}

export type CasilleroNotificationDocument = {
    blob: Blob;
    fileName: string;
};

/**
 * Nombre de archivo de un Content-Disposition (`filename*=UTF-8''…` o `filename="…"`);
 * si no viene, usa el de respaldo.
 */
export function fileNameFromContentDisposition(
    header: string | null,
    fallback: string
): string {
    if (!header) return fallback;
    const extendido = header.match(/filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/);
    if (extendido) {
        try {
            return decodeURIComponent(extendido[1].trim().replace(/^"|"$/g, ""));
        } catch {
            // Codificación inválida: se intenta con filename="…".
        }
    }
    const simple = header.match(/filename\s*=\s*("([^"]*)"|[^;]+)/);
    const nombre = (simple?.[2] ?? simple?.[1])?.trim();
    return nombre || fallback;
}

/**
 * Pide el PDF al endpoint autenticado (cada vez; no hay URL pública). Devuelve el Blob
 * para mostrarlo o descargarlo desde el navegador.
 */
export async function fetchNotificationDocument(
    id: string
): Promise<CasilleroNotificationDocument> {
    const response = await fetch(
        `/api/casillero/notifications/${encodeURIComponent(id)}/document`,
        { method: "GET", headers: { Accept: "application/pdf" }, cache: "no-store" }
    );

    if (!response.ok) {
        throw errorFromDocumentStatus(response.status);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/pdf")) {
        throw new CasilleroNotificationError(
            "El documento recibido no es un PDF válido",
            response.status
        );
    }

    return {
        blob: await response.blob(),
        fileName: fileNameFromContentDisposition(
            response.headers.get("content-disposition"),
            `notificacion-${id}.pdf`
        ),
    };
}
