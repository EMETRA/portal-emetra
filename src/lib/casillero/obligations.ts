import { getCasilleroJson } from "./api";
import type {
    CasilleroObligationDetail,
    CasilleroObligationList,
    CasilleroVehicle,
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

/** Placa como se muestra en pantalla: tipo + número, p. ej. "P" + "111BBB" = "P111BBB". */
export const placaCompleta = (vehiculo: CasilleroVehicle): string =>
    `${vehiculo.plateTypeCode}${vehiculo.plateNumber}`;

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

const LIMITE_VEHICULOS = 20;

/** Una página de vehículos. `cursor` es el `nextCursor` de la página anterior (opaco). */
export async function fetchVehicles(
    cursor?: string | null,
    filtros: FiltrosVehiculos = {}
): Promise<CasilleroVehicleList> {
    const query = new URLSearchParams({ limit: String(LIMITE_VEHICULOS) });
    if (cursor) query.set("cursor", cursor);
    if (filtros.plateCountry) query.set("plateCountry", filtros.plateCountry);
    if (filtros.plateTypeCode) query.set("plateTypeCode", filtros.plateTypeCode);
    return getCasilleroJson<CasilleroVehicleList>(
        `/api/casillero/vehicles?${query}`,
        errorFromVehiclesStatus
    );
}

/**
 * Todos los vehículos del usuario, recorriendo las páginas con `nextCursor`. Se detiene
 * si el backend repite un cursor, para no quedarse pidiendo páginas sin fin.
 */
export async function fetchAllVehicles(
    filtros: FiltrosVehiculos = {}
): Promise<CasilleroVehicle[]> {
    const vehiculos: CasilleroVehicle[] = [];
    const cursoresVistos = new Set<string>();
    let cursor: string | null = null;

    do {
        const pagina = await fetchVehicles(cursor, filtros);
        vehiculos.push(...pagina.items);
        cursor = pagina.nextCursor ?? null;
        if (cursor && cursoresVistos.has(cursor)) break;
        if (cursor) cursoresVistos.add(cursor);
    } while (cursor);

    return vehiculos;
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

/** Cobros pagables de un vehículo, usando su `vehicleReference`. */
export async function fetchObligations(
    vehicleReference: string
): Promise<CasilleroObligationList> {
    return getCasilleroJson<CasilleroObligationList>(
        `/api/casillero/vehicles/${encodeURIComponent(vehicleReference)}/obligations`,
        errorFromObligationsStatus
    );
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
    id: string
): Promise<CasilleroObligationDetail> {
    return getCasilleroJson<CasilleroObligationDetail>(
        `/api/casillero/obligations/${encodeURIComponent(id)}`,
        errorFromObligationDetailStatus
    );
}
