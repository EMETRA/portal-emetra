import { NextRequest, NextResponse } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

/** Solo archivos de noticias: "noticias/2026/09/foto.jpg". */
const CARPETA_PERMITIDA = "noticias";
const SEGMENTO_VALIDO = /^[A-Za-z0-9._-]+$/;

/**
 * Imágenes de noticias (COM-04). api-portal las sirve como archivos estáticos
 * en /uploads/noticias/... (README "Noticias CMS", sección 4) y devuelve esa
 * ruta relativa en `url`. El navegador las pide aquí y este servidor las
 * reenvía a api-portal, igual que el resto de /api/* (el cliente nunca
 * contacta API_BASE_URL). Solo acepta rutas bajo /uploads/noticias/.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  const valida =
    path.length >= 2 &&
    path[0] === CARPETA_PERMITIDA &&
    path.every(
      (segmento) =>
        SEGMENTO_VALIDO.test(segmento) && segmento !== "." && segmento !== ".."
    );
  if (!valida) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: ["Ruta de archivo inválida"] },
      { status: 400 }
    );
  }

  return proxyBackendRequest(req, {
    path: `/uploads/${path.map(encodeURIComponent).join("/")}`,
    method: "GET",
    forwardBody: false,
  });
}
