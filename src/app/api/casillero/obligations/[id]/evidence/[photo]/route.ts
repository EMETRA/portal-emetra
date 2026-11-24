import { NextRequest } from "next/server";
import { proxyCasilleroRequest } from "@/lib/casillero/proxy";

type RouteContext = { params: Promise<{ id: string; photo: string }> };

/** Proxy autenticado de la imagen; no expone al navegador el host de evidencia. */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id, photo } = await context.params;
  return proxyCasilleroRequest(req, {
    path: `/v1/obligations/${encodeURIComponent(id)}/evidence/${encodeURIComponent(photo)}`,
    forwardBody: false,
    requireAuth: true,
  });
}
