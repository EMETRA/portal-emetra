import { getCasilleroJson } from "./api";
import { fileNameFromContentDisposition } from "./notifications";
import type {
    CasilleroCreatePaymentOrderRequest,
    CasilleroPaymentOrder,
    CasilleroPaymentOrderStatus,
} from "./types";

/**
 * Error de órdenes de pago con el código HTTP, para que la pantalla distinga una sesión
 * vencida (401: volver al login) de una orden que no existe (404) o de cobros que ya no se
 * pueden pagar (409).
 */
export class CasilleroPaymentOrderError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
        this.name = "CasilleroPaymentOrderError";
    }
}

const SESION_VENCIDA = "Tu sesión venció. Vuelve a iniciar sesión";

export const isSesionVencidaOrden = (error: unknown): boolean =>
    error instanceof CasilleroPaymentOrderError && error.status === 401;

// ── CREAR ORDEN ───────────────────────────────────────────────────────────
function errorFromCreateStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 409 || status === 422
            ? "Alguno de los cobros ya no se puede pagar (ya se pagó o tiene un pago en proceso). Vuelve a consultar tus multas"
        : status === 429 ? "Demasiadas solicitudes. Intenta más tarde"
        : "No se pudo crear la orden de pago. Intenta más tarde";
    return new CasilleroPaymentOrderError(message, status);
}

/**
 * Crea la orden con los cobros elegidos. `idempotencyKey` debe ser la misma en los
 * reintentos de un mismo pago, para que el backend no cree dos órdenes.
 */
export async function createPaymentOrder(
    obligationIds: string[],
    idempotencyKey: string
): Promise<CasilleroPaymentOrder> {
    const body: CasilleroCreatePaymentOrderRequest = { obligationIds };
    const response = await fetch("/api/casillero/payment-orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    if (!response.ok) {
        throw errorFromCreateStatus(response.status);
    }

    return response.json() as Promise<CasilleroPaymentOrder>;
}

// ── CONSULTAR ORDEN ───────────────────────────────────────────────────────
function errorFromOrderStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 404 ? "No se encontró la orden de pago"
        : status === 429 ? "Demasiadas solicitudes. Intenta más tarde"
        : "No se pudo consultar la orden de pago. Intenta más tarde";
    return new CasilleroPaymentOrderError(message, status);
}

export async function fetchPaymentOrder(id: string): Promise<CasilleroPaymentOrder> {
    return getCasilleroJson<CasilleroPaymentOrder>(
        `/api/casillero/payment-orders/${encodeURIComponent(id)}`,
        errorFromOrderStatus
    );
}

// ── COMPROBANTE ───────────────────────────────────────────────────────────
function errorFromReceiptStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 404 ? "El comprobante no está disponible"
        : status === 409 ? "El comprobante estará disponible cuando se confirme el pago"
        : "No se pudo cargar el comprobante. Intenta más tarde";
    return new CasilleroPaymentOrderError(message, status);
}

export type CasilleroPaymentReceipt = {
    blob: Blob;
    fileName: string;
};

/**
 * Pide el PDF del comprobante al endpoint autenticado (cada vez; no hay URL pública).
 * Devuelve el Blob para mostrarlo o descargarlo desde el navegador.
 */
export async function fetchPaymentReceipt(id: string): Promise<CasilleroPaymentReceipt> {
    const response = await fetch(
        `/api/casillero/payment-orders/${encodeURIComponent(id)}/receipt`,
        { method: "GET", headers: { Accept: "application/pdf" }, cache: "no-store" }
    );

    if (!response.ok) {
        throw errorFromReceiptStatus(response.status);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/pdf")) {
        throw new CasilleroPaymentOrderError("El comprobante recibido no es un PDF válido", response.status);
    }

    return {
        blob: await response.blob(),
        fileName: fileNameFromContentDisposition(
            response.headers.get("content-disposition"),
            `comprobante-${id}.pdf`
        ),
    };
}

// ── CÓMO SE MUESTRA EL ESTADO ─────────────────────────────────────────────

/** TODO [CASILLERO-BACKEND]: cada cuánto y cuántas veces reconsultar; confirmar con backend. */
export const SEGUNDOS_ENTRE_CONSULTAS = 3;
export const CONSULTAS_AUTOMATICAS = 5;

/**
 * Estados que distingue la pantalla. "esperar" es un pago en proceso que no se confirmó
 * después de las consultas automáticas: se pide volver a consultar más tarde.
 */
export type EstadoVisualOrden =
    | "creada"
    | "en_proceso"
    | "esperar"
    | "confirmada"
    | "no_pagada";

/**
 * Solo CONFIRMADA es éxito: si Neonet autorizó pero la aplicación interna no terminó, la
 * orden sigue EN_PROCESO y la pantalla no muestra el pago como hecho.
 */
export function estadoVisualOrden(
    status: CasilleroPaymentOrderStatus,
    consultasHechas: number
): EstadoVisualOrden {
    switch (status) {
        case "CREADA":
            return "creada";
        case "EN_PROCESO":
            return consultasHechas >= CONSULTAS_AUTOMATICAS ? "esperar" : "en_proceso";
        case "CONFIRMADA":
            return "confirmada";
        case "RECHAZADA":
        case "VENCIDA":
            return "no_pagada";
        default:
            // Un estado nuevo que la pantalla no conoce nunca se toma como pago hecho.
            return "esperar";
    }
}
