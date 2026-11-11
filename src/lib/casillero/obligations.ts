import { getCasilleroJson } from "./api";
import { montoACentavos } from "./montos";
import type { Fine } from "@/types/fines";
import type {
    CasilleroObligation,
    CasilleroObligationDetail,
    CasilleroObligationList,
    CasilleroUnavailableReason,
    CasilleroVehicle,
    CasilleroVehicleDetail,
    CasilleroVehicleList,
} from "./types";

/**
 * Error de Cobros con el código HTTP, para que la pantalla distinga una sesión vencida
 * (401: volver al login) de un vehículo o cobro que no existe o no es del usuario (404).
 */
export class CasilleroCobrosError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
        this.name = "CasilleroCobrosError";
    }
}

const SESION_VENCIDA = "Tu sesión venció. Vuelve a iniciar sesión";

export const isSesionVencidaCobros = (error: unknown): boolean =>
    error instanceof CasilleroCobrosError && error.status === 401;

/** true si la petición se canceló a propósito (la pantalla cambió de vehículo o se cerró). */
export const isPeticionCancelada = (error: unknown): boolean =>
    error instanceof DOMException && error.name === "AbortError";

/**
 * Placa como se muestra en pantalla. `plateNumber` ya trae el tipo ("P123ABC"); el
 * `plateTypeCode` es el nombre del tipo ("PARTICULAR") y no se antepone.
 */
export const placaCompleta = (vehiculo: Pick<CasilleroVehicle, "plateNumber">): string =>
    vehiculo.plateNumber.trim();

/** Código de la remisión para mostrar: serie + número ("N" + "456123" = "N456123"). */
export const codigoCobro = (obligacion: Pick<CasilleroObligation, "series" | "number">): string | undefined => {
    const serie = obligacion.series?.trim() ?? "";
    const numero = obligacion.number?.trim() ?? "";
    return serie || numero ? `${serie}${numero}` : undefined;
};

/** Texto para la persona según el motivo que manda la API cuando no se puede pagar. */
const MOTIVO_NO_PAGABLE: Record<CasilleroUnavailableReason, string> = {
    PAID: "Ya fue pagado",
    NO_AMOUNT_DUE: "No tiene saldo pendiente",
    NO_PROJECTION: "El monto no está disponible en este momento. Intenta más tarde",
    EXPIRED: "El monto consultado venció. Vuelve a consultar",
    TYPE_DISABLED: "Este tipo de cobro no se puede pagar en línea",
    SOURCE_NOT_PAYABLE: "Este cobro no se puede pagar en línea",
};

const MOTIVO_NO_PAGABLE_GENERICO = "No se puede pagar en este momento";

/** Motivo legible; un código desconocido o vacío da un texto genérico. */
export const motivoNoPagable = (codigo: string | null | undefined): string =>
    (codigo && MOTIVO_NO_PAGABLE[codigo as CasilleroUnavailableReason]) || MOTIVO_NO_PAGABLE_GENERICO;

/** Solo se puede seleccionar lo que la API marca como pagable y tiene monto. */
export const esCobroPagable = (fine: Pick<Fine, "payable" | "amount">): boolean =>
    fine.payable !== false && fine.amount > 0;

/** Fecha en formato local (dd/mm/aaaa); vacío si la fecha no es válida. */
export function formatearFechaCobro(iso: string): string {
    const fecha = new Date(iso);
    return Number.isNaN(fecha.getTime())
        ? ""
        : fecha.toLocaleDateString("es-GT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/** Fecha y hora local ("18/11/2026, 11:37"); vacío si la fecha no es válida. */
export function formatearFechaHoraCobro(iso: string): string {
    const fecha = new Date(iso);
    return Number.isNaN(fecha.getTime())
        ? ""
        : fecha.toLocaleString("es-GT", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
          });
}

// ── VIGENCIA DEL MONTO (validUntil) ───────────────────────────────────────
/** Margen para no volver a consultar justo en el mismo segundo en que vence. */
const MARGEN_VENCIMIENTO_MS = 1000;
/** Máximo que acepta setTimeout (~24 días); más allá no se programa nada. */
const MAXIMO_TIMER_MS = 2_147_483_647;

/**
 * Milisegundos hasta que vence el monto (más un margen), para volver a consultar en ese
 * momento. null si no hay fecha, no es válida, ya venció o está demasiado lejos: en esos
 * casos no se programa nada, así un monto que sigue vencido tras consultar no provoca
 * consultas en bucle.
 */
export function msHastaVencerMonto(validUntil: string | null | undefined, ahora = Date.now()): number | null {
    if (!validUntil) return null;
    const vence = new Date(validUntil).getTime();
    if (Number.isNaN(vence)) return null;
    const ms = vence - ahora + MARGEN_VENCIMIENTO_MS;
    return ms > MARGEN_VENCIMIENTO_MS && ms <= MAXIMO_TIMER_MS ? ms : null;
}

/** El primer vencimiento entre varios cobros (ms), o null si ninguno tiene uno próximo. */
export function msHastaPrimerVencimiento(cobros: { validUntil?: string }[], ahora = Date.now()): number | null {
    let menor: number | null = null;
    for (const { validUntil } of cobros) {
        const ms = msHastaVencerMonto(validUntil, ahora);
        if (ms !== null && (menor === null || ms < menor)) menor = ms;
    }
    return menor;
}

/** Fecha larga ("30 de octubre de 2026"); vacío si la fecha no es válida. */
export function formatearFechaLargaCobro(iso: string): string {
    const fecha = new Date(iso);
    return Number.isNaN(fecha.getTime())
        ? ""
        : fecha.toLocaleDateString("es-GT", { day: "numeric", month: "long", year: "numeric" });
}

const aQuetzales = (texto: string): number | null => {
    const centavos = montoACentavos(texto);
    return centavos === null ? null : centavos / 100;
};

/**
 * Convierte una obligación de la API en la multa que muestran las tarjetas. Se paga el
 * `totalAmount`. Si el total no es un monto válido queda en 0 y no se puede pagar, para no
 * cobrar un monto equivocado.
 * TODO [CASILLERO-BACKEND]: `issuedAt` (emisión) se usa como la fecha de la multa.
 */
export function obligacionAMulta(obligacion: CasilleroObligation): Fine {
    const total = aQuetzales(obligacion.totalAmount);
    const recargo = aQuetzales(obligacion.surcharge) ?? 0;
    const descuento = aQuetzales(obligacion.discount) ?? 0;
    const base = aQuetzales(obligacion.baseAmount);
    const pagable = obligacion.payable && total !== null;

    return {
        id: obligacion.id,
        code: codigoCobro(obligacion),
        // Tipo de cobro tal cual (texto libre); etiqueta y color en lib/casillero/categorias.
        category: obligacion.chargeType?.trim() || undefined,
        amount: total ?? 0,
        currency: obligacion.currency,
        // El desglose solo aporta si hay recargo o descuento.
        breakdown:
            base !== null && (recargo > 0 || descuento > 0)
                ? { base, surcharge: recargo, discount: descuento }
                : undefined,
        description: obligacion.concept,
        date: formatearFechaCobro(obligacion.issuedAt) || undefined,
        payable: pagable,
        unavailableReason: pagable ? undefined : motivoNoPagable(obligacion.unavailableReason),
        validUntil: obligacion.validUntil ?? undefined,
    };
}

/**
 * Recorre una lista paginada por `nextCursor` hasta el final. Se detiene si el backend
 * repite un cursor o si pasa del máximo de páginas, para no quedarse pidiendo sin fin.
 */
async function recorrerPaginas<T>(
    pedirPagina: (cursor: string | null) => Promise<{ items: T[]; nextCursor?: string | null }>,
    maximoPaginas = 50
): Promise<T[]> {
    const todos: T[] = [];
    const cursoresVistos = new Set<string>();
    let cursor: string | null = null;
    let paginas = 0;

    do {
        const pagina = await pedirPagina(cursor);
        todos.push(...pagina.items);
        paginas += 1;
        cursor = pagina.nextCursor ?? null;
        if (cursor && cursoresVistos.has(cursor)) break;
        if (cursor) cursoresVistos.add(cursor);
    } while (cursor && paginas < maximoPaginas);

    return todos;
}

// ── VEHÍCULOS ─────────────────────────────────────────────────────────────
function errorFromVehiclesStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 429 ? "Demasiadas solicitudes. Intenta más tarde"
        : "No se pudieron cargar tus vehículos. Intenta más tarde";
    return new CasilleroCobrosError(message, status);
}

export type FiltrosVehiculos = {
    plateCountry?: string;
    plateTypeCode?: string;
};

const LIMITE_POR_PAGINA = 20;

/** Una página de vehículos. `cursor` es el `nextCursor` de la página anterior (opaco). */
export async function fetchVehicles(
    cursor?: string | null,
    filtros: FiltrosVehiculos = {},
    signal?: AbortSignal
): Promise<CasilleroVehicleList> {
    const query = new URLSearchParams({ limit: String(LIMITE_POR_PAGINA) });
    if (cursor) query.set("cursor", cursor);
    if (filtros.plateCountry) query.set("plateCountry", filtros.plateCountry);
    if (filtros.plateTypeCode) query.set("plateTypeCode", filtros.plateTypeCode);
    return getCasilleroJson<CasilleroVehicleList>(
        `/api/casillero/vehicles?${query}`,
        errorFromVehiclesStatus,
        signal
    );
}

/** Todos los vehículos del usuario, recorriendo las páginas con `nextCursor`. */
export async function fetchAllVehicles(
    filtros: FiltrosVehiculos = {},
    signal?: AbortSignal
): Promise<CasilleroVehicle[]> {
    return recorrerPaginas((cursor) => fetchVehicles(cursor, filtros, signal));
}

// ── DETALLE DE UN VEHÍCULO ────────────────────────────────────────────────
function errorFromVehicleDetailStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 404 ? "No se encontró el vehículo"
        : "No se pudieron cargar los datos del vehículo";
    return new CasilleroCobrosError(message, status);
}

/** Marca, modelo, color y año del vehículo, por su `vehicleReference`. */
export async function fetchVehicleDetail(
    vehicleReference: string,
    signal?: AbortSignal
): Promise<CasilleroVehicleDetail> {
    return getCasilleroJson<CasilleroVehicleDetail>(
        `/api/casillero/vehicles/${encodeURIComponent(vehicleReference)}`,
        errorFromVehicleDetailStatus,
        signal
    );
}

// ── OBLIGACIONES DE UN VEHÍCULO ───────────────────────────────────────────
function errorFromObligationsStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 404 ? "No se encontró el vehículo"
        : status === 429 ? "Demasiadas solicitudes. Intenta más tarde"
        : "No se pudieron cargar los cobros. Intenta más tarde";
    return new CasilleroCobrosError(message, status);
}

/** Una página de cobros del vehículo (también los no pagables), por su `vehicleReference`. */
export async function fetchObligations(
    vehicleReference: string,
    cursor?: string | null,
    signal?: AbortSignal
): Promise<CasilleroObligationList> {
    const query = new URLSearchParams({ limit: String(LIMITE_POR_PAGINA) });
    if (cursor) query.set("cursor", cursor);
    return getCasilleroJson<CasilleroObligationList>(
        `/api/casillero/vehicles/${encodeURIComponent(vehicleReference)}/obligations?${query}`,
        errorFromObligationsStatus,
        signal
    );
}

/**
 * Todos los cobros del vehículo. Hacen falta todos porque la tarjeta del vehículo muestra
 * el total pendiente y el desglose por categoría.
 */
export async function fetchAllObligations(
    vehicleReference: string,
    signal?: AbortSignal
): Promise<CasilleroObligation[]> {
    return recorrerPaginas((cursor) => fetchObligations(vehicleReference, cursor, signal));
}

// ── DETALLE DE UNA OBLIGACIÓN ─────────────────────────────────────────────
function errorFromObligationDetailStatus(status: number): Error {
    const message =
        status === 401 ? SESION_VENCIDA
        : status === 404 ? "No se encontró el cobro"
        : "No se pudo cargar el cobro. Intenta más tarde";
    return new CasilleroCobrosError(message, status);
}

export async function fetchObligationDetail(
    id: string,
    signal?: AbortSignal
): Promise<CasilleroObligationDetail> {
    return getCasilleroJson<CasilleroObligationDetail>(
        `/api/casillero/obligations/${encodeURIComponent(id)}`,
        errorFromObligationDetailStatus,
        signal
    );
}
