import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend/client";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipoPlaca = searchParams.get("tipo_placa");
  const numeroPlaca = searchParams.get("numero_placa");

  if (!tipoPlaca || !numeroPlaca) {
    return apiErrorResponse(
      "tipo_placa y numero_placa son requeridos",
      400,
      "VALIDATION_ERROR"
    );
  }

  try {
    const path = `/juzgado/remisiones?tipo_placa=${encodeURIComponent(tipoPlaca)}&numero_placa=${encodeURIComponent(numeroPlaca)}`;
    const response = await fetchBackend(path, { method: "GET" });

    if (!response.ok) {
      return apiErrorResponse(
        "Error al consultar remisiones en el servidor",
        response.status,
        "BACKEND_ERROR"
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return apiErrorFromUnknown(error, "Error al consultar remisiones");
  }
}
