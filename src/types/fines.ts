/**
 * Tipo de cobro tal como lo manda la API (`chargeType`, texto libre sin catálogo). Las
 * etiquetas y colores salen de lib/casillero/categorias.ts.
 */
export type FineCategory = string;

/** Desglose del monto en quetzales: total = base + recargo − descuento. */
export interface FineBreakdown {
    base: number;
    surcharge: number;
    discount: number;
}

/**
 * Multa o cobro que muestran las tarjetas. Son opcionales los que la API de Cobros puede
 * mandar vacíos (código = serie + número, tipo, fecha), el que todavía no manda (lugar) y
 * los que solo aplican a veces (desglose, si se puede pagar y por qué no).
 */
export interface Fine {
    id: string;
    code?: string;
    category?: FineCategory;
    /** Lo que se paga, en quetzales (el `totalAmount` de la API). */
    amount: number;
    /** Moneda ISO; sin ella se asume GTQ. */
    currency?: string;
    breakdown?: FineBreakdown;
    description: string;
    location?: string;
    /** Fecha ya formateada para mostrar (dd/mm/aaaa). */
    date?: string;
    /** false = la API dice que no se puede pagar. Sin dato se considera pagable. */
    payable?: boolean;
    /** Motivo que da la API cuando no se puede pagar. */
    unavailableReason?: string;
    /**
     * Hasta cuándo vale el monto calculado (ISO 8601). No es la fecha límite legal para
     * pagar. Sin dato = sin vencimiento explícito.
     */
    validUntil?: string;
}
