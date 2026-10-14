// app/api/casillero/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_BUZON,
  detalleSimulado,
  noEncontradaSimulada,
  sinSesionSimulada,
} from "@/lib/casillero/notifications.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /v1/notifications/{id}: detalle de una notificación. El backend registra la
 * apertura y responde 404 si no existe o no pertenece al contexto autorizado.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_BUZON) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const detalle = detalleSimulado(id);
    return detalle ? NextResponse.json(detalle) : noEncontradaSimulada();
  }

  return proxyCasilleroRequest(req, {
    path: `/v1/notifications/${encodeURIComponent(id)}`,
    forwardBody: false,
    requireAuth: true,
  });
}
