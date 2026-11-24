import { getCasilleroJson } from "./api";
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

type PaymentOrderApi = {
    id: string; status: string; currency: string; subtotal: string; total: string;
    createdAt: string; expiresAt: string;
    items: Array<{ obligationId: string }>;
};

export type NeoPayCheckoutInput = {
    card: { number: string; expiration: string; cvv: string };
    billTo: {
        firstName: string; lastName: string; addressOne: string; addressTwo?: string;
        locality: string; administrativeArea: string; postalCode: string;
        country: string; email: string; phoneNumber: string;
    };
};

export type NeoPayCheckout = {
    orderId: string; attemptId: string; attemptNumber: number; status: string; provider: "NEONET";
    nextAction: { kind: "DEVICE_DATA" | "CHALLENGE"; url: string; accessToken: string } | null;
};

export type PaymentReceiptStatus = { orderId: string; status: "PENDIENTE" | "FALLIDA" | "COMPLETADA"; receiptNumber: string | null };

export type PaymentHistoryItem = {
    orderId: string;
    receiptNumber: string;
    issuedAt: string;
    totalAmount: string;
    currency: string;
};

export type PaymentHistory = { items: PaymentHistoryItem[] };

export const isSesionVencidaOrden = (error: unknown): boolean =>
    error instanceof CasilleroPaymentOrderError && error.status === 401;

function errorFromHistoryStatus(status: number): Error {
    const message = status === 401 ? SESION_VENCIDA : "No se pudo cargar el historial de pagos.";
    return new CasilleroPaymentOrderError(message, status);
}

export function fetchPaymentHistory(): Promise<PaymentHistory> {
    return getCasilleroJson<PaymentHistory>(
        "/api/casillero/payment-orders/history?limit=100",
        errorFromHistoryStatus,
    );
}

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

    return normalizeOrder(await response.json() as PaymentOrderApi);
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
    const order = await getCasilleroJson<PaymentOrderApi>(
        `/api/casillero/payment-orders/${encodeURIComponent(id)}`,
        errorFromOrderStatus
    );
    return normalizeOrder(order);
}

function normalizeOrder(order: PaymentOrderApi): CasilleroPaymentOrder {
    const status: CasilleroPaymentOrderStatus = order.status === "PENDIENTE" || order.status === "PENDIENTE_PASARELA"
        ? "EN_PROCESO"
        : order.status === "PROCESANDO" || order.status === "INCIDENTE" ? "EN_PROCESO"
        : order.status === "COMPLETADA" ? "CONFIRMADA"
        : order.status === "EXPIRADA" ? "VENCIDA"
        : order.status === "FALLIDA" ? "RECHAZADA"
        : order.status as CasilleroPaymentOrderStatus;
    return {
        id: order.id, status, totalAmount: Number(order.total),
        obligationIds: order.items.map((item) => item.obligationId),
        createdAt: order.createdAt, expiresAt: order.expiresAt,
    };
}

async function checkoutRequest(path: string, init?: RequestInit): Promise<NeoPayCheckout> {
    const response = await fetch(path, { ...init, cache: "no-store", headers: { Accept: "application/json", ...init?.headers } });
    if (!response.ok) {
        const body = await response.json().catch(() => null) as { message?: string; detail?: string } | null;
        throw new CasilleroPaymentOrderError(body?.detail || body?.message || "No se pudo procesar el pago.", response.status);
    }
    return response.json() as Promise<NeoPayCheckout>;
}

export function startNeoPayCheckout(orderId: string, input: NeoPayCheckoutInput, idempotencyKey: string): Promise<NeoPayCheckout> {
    return checkoutRequest(`/api/casillero/payment-orders/${encodeURIComponent(orderId)}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(input),
    });
}

export function fetchNeoPayCheckout(orderId: string, attemptId: string): Promise<NeoPayCheckout> {
    return checkoutRequest(`/api/casillero/payment-orders/${encodeURIComponent(orderId)}/checkout/${encodeURIComponent(attemptId)}`);
}

export function continueNeoPayCheckout(orderId: string, attemptId: string): Promise<NeoPayCheckout> {
    return checkoutRequest(`/api/casillero/payment-orders/${encodeURIComponent(orderId)}/checkout/${encodeURIComponent(attemptId)}`, { method: "POST" });
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

export async function fetchPaymentReceipt(id: string): Promise<PaymentReceiptStatus> {
    const response = await fetch(
        `/api/casillero/payment-orders/${encodeURIComponent(id)}/receipt`,
        { method: "GET", headers: { Accept: "application/json" }, cache: "no-store" }
    );

    if (!response.ok) {
        throw errorFromReceiptStatus(response.status);
    }

    return response.json() as Promise<PaymentReceiptStatus>;
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
