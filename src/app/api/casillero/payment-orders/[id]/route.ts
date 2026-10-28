// app/api/casillero/payment-orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_COBROS,
  noEncontradoSimulado,
  sinSesionSimulada,
} from "@/lib/casillero/obligations.dummy";
import { ordenSimulada } from "@/lib/casillero/paymentOrders.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** GET /v1/payment-orders/{id}: estado de una orden de pago. Exige la sesión del usuario. */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const orden = ordenSimulada(id);
    return orden ? NextResponse.json(orden) : noEncontradoSimulado();
  }

  return proxyCasilleroRequest(req, {
    path: `/v1/payment-orders/${encodeURIComponent(id)}`,
    forwardBody: false,
    requireAuth: true,
  });
}
