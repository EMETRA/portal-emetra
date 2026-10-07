import { NextRequest, NextResponse } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

/** Parámetros que acepta GET /public/news de api-portal. */
const PARAMS_PERMITIDOS = ["q", "idioma", "page", "limit"] as const;

const ENTERO_POSITIVO = /^[1-9]\d{0,3}$/;

/**
 * Listado público de noticias (COM-04).
 * Reenvía a GET /public/news de api-portal (sin auth): solo devuelve noticias
 * publicadas y públicas. Respuesta: { items, total, page, limit }.
 */
export async function GET(req: NextRequest) {
  const entrada = req.nextUrl.searchParams;
  const salida = new URLSearchParams();

  for (const nombre of PARAMS_PERMITIDOS) {
    const valor = entrada.get(nombre);
    if (valor === null || valor === "") continue;
    if ((nombre === "page" || nombre === "limit") && !ENTERO_POSITIVO.test(valor)) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: [`${nombre} inválido`] },
        { status: 400 }
      );
    }
    salida.set(nombre, valor);
  }

  const query = salida.toString();
  return proxyBackendRequest(req, {
    path: `/public/news${query ? `?${query}` : ""}`,
    method: "GET",
    forwardBody: false,
  });
}
