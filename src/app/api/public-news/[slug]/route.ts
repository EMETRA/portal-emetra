import { NextRequest, NextResponse } from "next/server";
import { proxyBackendRequest } from "@/lib/backend/proxy";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

const IDIOMA_POR_DEFECTO = "es-GT";

// El README de backend: idioma de 2 a 5 caracteres (p. ej. "es", "es-GT").
// TODO [COM04-BACKEND]: confirmar si admite otros formatos dentro de esos 5 caracteres.
const IDIOMA_VALIDO = /^[A-Za-z]{2}(-[A-Za-z]{2})?$/;

// El slug lo escribe la persona en COM-03 y el formulario no valida su formato,
// así que solo se descartan vacíos o demasiado largos; el resto lo decide api-portal.
const SLUG_MAX = 200;

/**
 * Detalle público de una noticia (COM-04).
 * Reenvía a GET /public/news/:slug/:idioma de api-portal (sin auth).
 * api-portal responde 404 si no existe o no está publicada y pública.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const idioma = req.nextUrl.searchParams.get("idioma") || IDIOMA_POR_DEFECTO;

  // Un slug vacío o enorme no puede existir: 404 sin llamar al backend.
  if (!slug.trim() || slug.length > SLUG_MAX) {
    return NextResponse.json(
      { error: "NEWS_NOT_FOUND", message: ["Noticia no encontrada"] },
      { status: 404 }
    );
  }
  if (!IDIOMA_VALIDO.test(idioma)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: ["idioma inválido"] },
      { status: 400 }
    );
  }

  return proxyBackendRequest(req, {
    path: `/public/news/${encodeURIComponent(slug)}/${encodeURIComponent(idioma)}`,
    method: "GET",
    forwardBody: false,
  });
}
