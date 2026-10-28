import type { CasilleroObligationStatus } from "@/lib/casillero/types";

export const FINE_CATEGORIES = [
    { value: "transito", label: "Tránsito" },
    { value: "administrativo", label: "Administrativo" },
    { value: "cepo", label: "Cepo" },
    { value: "convenio", label: "Convenio" },
    { value: "tasas", label: "Tasas" },
] as const;

export type FineCategory = (typeof FINE_CATEGORIES)[number]["value"];

/**
 * Multa o cobro que muestran las tarjetas. Los datos opcionales son los que la API de
 * Cobros todavía no manda (código, lugar, fecha, categoría) o los que solo manda ella
 * (saldo, estado, vencimiento).
 */
export interface Fine {
    id: string;
    code?: string;
    category?: FineCategory;
    /** Lo que se paga: con la API de Cobros es el saldo pendiente. */
    amount: number;
    /** Monto original, cuando es mayor que lo que falta por pagar (pago parcial). */
    originalAmount?: number;
    description: string;
    location?: string;
    date?: string;
    status?: CasilleroObligationStatus;
    /** Fecha límite de pago (ISO 8601). */
    dueDate?: string;
}
