// app/api/casillero/vehicles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { casilleroPathWithRequestQuery, proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_COBROS,
  sinSesionSimulada,
  vehiculosDelUsuarioSimulados,
} from "@/lib/casillero/obligations.dummy";

/**
 * GET /v1/vehicles?cursor&limit&plateCountry&plateTypeCode: vehículos del contexto actual,
 * paginados por cursor; de aquí sale el `vehicleReference` para pedir sus obligaciones.
 * Los parámetros se pasan tal cual al backend.
 */
export async function GET(req: NextRequest) {
  if (SIMULAR_COBROS) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const listado = vehiculosDelUsuarioSimulados(req.nextUrl.searchParams);
    return listado
      ? NextResponse.json(listado)
      : NextResponse.json({ error: "Parámetros inválidos", code: "BAD_REQUEST" }, { status: 400 });
  }

  return proxyCasilleroRequest(req, {
    path: casilleroPathWithRequestQuery(req, "/v1/vehicles"),
    forwardBody: false,
    requireAuth: true,
  });
}
