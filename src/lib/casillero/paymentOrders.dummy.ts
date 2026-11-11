import { NextResponse } from "next/server";
import { obligacionSimulada } from "@/lib/casillero/obligations.dummy";
import { montoACentavos } from "@/lib/casillero/montos";
import { pdfSimulado } from "@/lib/casillero/notifications.dummy";
import type { CasilleroPaymentOrder, CasilleroPaymentOrderStatus } from "@/lib/casillero/types";

/*
  TODO [CASILLERO-BACKEND]: simulación de órdenes de pago. Se enciende con SIMULAR_COBROS
  (obligations.dummy.ts), que debe quedar en false en lo que se sube.

  Como el checkout (Neonet) todavía no existe, el estado de la orden depende de los cobros
  que lleve, para poder ver cada caso en pantalla:
  - con obl-1004 (convenio): se queda CREADA (falta pagar).
  - con obl-1003 (con descuento): se queda EN_PROCESO (para ver "volver a consultar").
  - con obl-1002 (con recargo): RECHAZADA.
  - cualquier otra: EN_PROCESO los primeros segundos y luego CONFIRMADA.
  Con un cobro no pagable (obl-1005, obl-1006) o inexistente: 409.
*/

const SEGUNDOS_EN_PROCESO = 6;
const MINUTOS_PARA_PAGAR = 30;

type OrdenSimulada = CasilleroPaymentOrder & { creadaEnMs: number };

// En desarrollo cada ruta puede cargar su propia copia del módulo; globalThis la comparte.
const memoria = globalThis as typeof globalThis & { __ordenesSimuladas?: Map<string, OrdenSimulada> };
const ordenes = (memoria.__ordenesSimuladas ??= new Map());

function estadoSimulado(orden: OrdenSimulada): CasilleroPaymentOrderStatus {
  const ids = orden.obligationIds;
  if (ids.includes("obl-1004")) return "CREADA";
  if (ids.includes("obl-1003")) return "EN_PROCESO";
  if (ids.includes("obl-1002")) return "RECHAZADA";
  const segundos = (Date.now() - orden.creadaEnMs) / 1000;
  return segundos < SEGUNDOS_EN_PROCESO ? "EN_PROCESO" : "CONFIRMADA";
}

function publica(orden: OrdenSimulada): CasilleroPaymentOrder {
  return {
    id: orden.id,
    status: estadoSimulado(orden),
    totalAmount: orden.totalAmount,
    obligationIds: orden.obligationIds,
    createdAt: orden.createdAt,
    expiresAt: orden.expiresAt,
  };
}

/** POST /v1/payment-orders simulado: 400 sin cobros, 409 si alguno no se puede pagar. */
export function crearOrdenSimulada(body: unknown): NextResponse {
  const ids = (body as { obligationIds?: unknown } | null)?.obligationIds;
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "Solicitud inválida", code: "BAD_REQUEST" }, { status: 400 });
  }

  const obligaciones = ids.map(obligacionSimulada);
  const pagables = obligaciones.every((o) => o?.payable);
  if (!pagables) {
    return NextResponse.json(
      { error: "Algún cobro ya no se puede pagar", code: "CONFLICT" },
      { status: 409 }
    );
  }

  const ahora = Date.now();
  const orden: OrdenSimulada = {
    id: `ord-${ahora.toString(36)}`,
    status: "CREADA",
    totalAmount:
      obligaciones.reduce((suma, o) => suma + (o ? montoACentavos(o.totalAmount) ?? 0 : 0), 0) / 100,
    obligationIds: ids,
    createdAt: new Date(ahora).toISOString(),
    expiresAt: new Date(ahora + MINUTOS_PARA_PAGAR * 60 * 1000).toISOString(),
    creadaEnMs: ahora,
  };
  ordenes.set(orden.id, orden);
  return NextResponse.json(publica(orden), { status: 201 });
}

export function ordenSimulada(id: string): CasilleroPaymentOrder | null {
  const orden = ordenes.get(id);
  return orden ? publica(orden) : null;
}

/**
 * GET /v1/payment-orders/{id}/receipt simulado: el PDF solo existe si el pago está
 * confirmado. "no_confirmada" = 409; null = la orden no existe (404).
 */
export function comprobanteSimulado(id: string): Uint8Array | "no_confirmada" | null {
  const orden = ordenSimulada(id);
  if (!orden) return null;
  if (orden.status !== "CONFIRMADA") return "no_confirmada";
  return pdfSimulado(`Comprobante simulado - ${orden.id} - Q${orden.totalAmount}`);
}
