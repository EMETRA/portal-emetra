import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend/client";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";

export async function POST(req: NextRequest) {
  try {
    const { plate } = await req.json();

    if (!plate || typeof plate !== "string") {
      return apiErrorResponse("La placa es requerida", 400, "VALIDATION_ERROR");
    }

    const [tplacaRaw, nplacaRaw] = plate.split("-");
    const tplaca = tplacaRaw?.trim().toUpperCase();
    const nplaca = nplacaRaw?.trim().toUpperCase();

    if (!tplaca || !nplaca) {
      return apiErrorResponse(
        "Formato de placa invalido",
        400,
        "VALIDATION_ERROR"
      );
    }

    const path = `/notificado/consulta/${encodeURIComponent(tplaca)}/${encodeURIComponent(nplaca)}`;
    const response = await fetchBackend(path, { method: "GET" });

    if (!response.ok) {
      console.error("Error al consultar backend:", response.status);
      return apiErrorResponse(
        "No se pudo consultar remisiones en el servidor",
        response.status,
        "BACKEND_ERROR"
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return apiErrorFromUnknown(error, "Error interno en la consulta");
  }
}
