// app/api/casillero/notifications/[id]/document/route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";
import {
  SIMULAR_BUZON,
  documentoSimulado,
  noEncontradaSimulada,
  sinSesionSimulada,
} from "@/lib/casillero/notifications.dummy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** El PDF se pide con la sesión cada vez: el navegador no debe guardarlo en caché. */
const SIN_CACHE = "private, no-store";

/**
 * GET /v1/notifications/{id}/document: el backend responde el PDF en el cuerpo
 * (Content-Type: application/pdf), no un enlace. 404 si no hay documento o la
 * notificación no es del usuario. El proxy reenvía el archivo sin guardarlo.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (SIMULAR_BUZON) {
    const sinSesion = sinSesionSimulada(req);
    if (sinSesion) return sinSesion;
    const pdf = documentoSimulado(id);
    if (!pdf) return noEncontradaSimulada();
    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="notificacion-${id}.pdf"`,
        "Cache-Control": SIN_CACHE,
      },
    });
  }

  const response = await proxyCasilleroRequest(req, {
    path: `/v1/notifications/${encodeURIComponent(id)}/document`,
    forwardBody: false,
    requireAuth: true,
  });
  response.headers.set("Cache-Control", SIN_CACHE);
  return response;
}
