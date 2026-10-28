// app/api/casillero/vehicles/[id]/obligations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_COBROS,
  noEncontradoSimulado,
  obligacionesSimuladas,
  sinSesionSimulada,
} from "@/lib/casillero/obligations.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /v1/vehicles/{id}/obligations: obligaciones pagables del vehículo (concepto, monto,
 * saldo, estado y vencimiento). Exige la sesión del usuario.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const listado = obligacionesSimuladas(id);
    return listado ? NextResponse.json(listado) : noEncontradoSimulado();
  }

  return proxyCasilleroRequest(req, {
    path: `/v1/vehicles/${encodeURIComponent(id)}/obligations`,
    forwardBody: false,
    requireAuth: true,
  });
}
