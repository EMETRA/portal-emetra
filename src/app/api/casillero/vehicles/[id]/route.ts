// app/api/casillero/vehicles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_COBROS,
  noEncontradoSimulado,
  sinSesionSimulada,
  vehiculoDetalleSimulado,
} from "@/lib/casillero/obligations.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /v1/vehicles/{reference}: detalle de un vehículo accesible (marca, modelo, color,
 * año). El id es el `vehicleReference`. Inexistente, ajeno o con relación vencida = 404.
 * Exige la sesión del usuario.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const detalle = vehiculoDetalleSimulado(id);
    return detalle ? NextResponse.json(detalle) : noEncontradoSimulado();
  }

  return proxyCasilleroRequest(req, {
    path: `/v1/vehicles/${encodeURIComponent(id)}`,
    forwardBody: false,
    requireAuth: true,
  });
}
