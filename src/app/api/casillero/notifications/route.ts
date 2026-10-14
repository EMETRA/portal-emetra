// app/api/casillero/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { casilleroPathWithRequestQuery, proxyCasilleroRequest } from "@/lib/casillero/proxy";
import { SIMULAR_BUZON, listadoSimulado, sinSesionSimulada } from "@/lib/casillero/notifications.dummy";

/**
 * GET /v1/notifications?limit&cursor: buzón del usuario autenticado, paginado por cursor
 * (items + nextCursor, sin total). Los parámetros se pasan tal cual al backend.
 */
export async function GET(req: NextRequest) {
  if (SIMULAR_BUZON) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const { searchParams } = req.nextUrl;
    const listado = listadoSimulado(searchParams.get("limit"), searchParams.get("cursor"));
    return listado
      ? NextResponse.json(listado)
      : NextResponse.json({ error: "Parámetros inválidos", code: "BAD_REQUEST" }, { status: 400 });
  }

  return proxyCasilleroRequest(req, {
    path: casilleroPathWithRequestQuery(req, "/v1/notifications"),
    forwardBody: false,
    requireAuth: true,
  });
}
