// app/api/casillero/obligations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_COBROS,
  noEncontradoSimulado,
  obligacionSimulada,
  sinSesionSimulada,
} from "@/lib/casillero/obligations.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** GET /v1/obligations/{id}: detalle de una obligación. Exige la sesión del usuario. */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const obligacion = obligacionSimulada(id);
    return obligacion ? NextResponse.json(obligacion) : noEncontradoSimulado();
  }

  return proxyCasilleroRequest(req, {
    path: `/v1/obligations/${encodeURIComponent(id)}`,
    forwardBody: false,
    requireAuth: true,
  });
}
