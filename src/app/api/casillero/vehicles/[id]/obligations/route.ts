// app/api/casillero/vehicles/[id]/obligations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_COBROS,
  noEncontradoSimulado,
  obligacionesSimuladas,
  sinSesionSimulada,
  solicitudInvalidaSimulada,
} from "@/lib/casillero/obligations.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /v1/vehicles/{id}/obligations?limit&cursor: obligaciones del vehículo (también las
 * no pagables), paginadas por cursor. El id es el `vehicleReference`. El proxy reenvía la
 * query tal cual. Exige la sesión del usuario.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const listado = obligacionesSimuladas(id, req.nextUrl.searchParams);
    if (listado === "invalido") return solicitudInvalidaSimulada();
    return listado ? NextResponse.json(listado) : noEncontradoSimulado();
  }

  return proxyCasilleroRequest(req, {
    path: `/v1/vehicles/${encodeURIComponent(id)}/obligations`,
    forwardBody: false,
    requireAuth: true,
  });
}
