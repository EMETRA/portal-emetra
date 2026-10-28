// app/api/casillero/payment-orders/route.ts
import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import { SIMULAR_COBROS, sinSesionSimulada } from "@/lib/casillero/obligations.dummy";
import { crearOrdenSimulada } from "@/lib/casillero/paymentOrders.dummy";

/**
 * POST /v1/payment-orders: crea la orden de pago con los cobros elegidos. Exige la sesión;
 * el cliente manda Idempotency-Key para que un doble envío no cree dos órdenes.
 */
export async function POST(req: NextRequest) {
  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    return crearOrdenSimulada(await req.json().catch(() => null));
  }

  return proxyCasilleroRequest(req, {
    path: "/v1/payment-orders",
    forwardBody: true,
    requireAuth: true,
  });
}
