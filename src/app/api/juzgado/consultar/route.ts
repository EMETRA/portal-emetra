import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend/client";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const numeroExpediente = searchParams.get("numero_expediente");
  const juzgado = searchParams.get("juzgado");

  if (!numeroExpediente || !juzgado) {
    return apiErrorResponse(
      "numero_expediente y juzgado son requeridos",
      400,
      "VALIDATION_ERROR"
    );
  }

  try {
    const path = `/juzgado/expediente?numero_expediente=${encodeURIComponent(numeroExpediente)}&juzgado=${encodeURIComponent(juzgado)}`;
    const response = await fetchBackend(path, { method: "GET" });

    if (!response.ok) {
      return apiErrorResponse(
        "Error al consultar expediente en el servidor",
        response.status,
        "BACKEND_ERROR"
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    return apiErrorFromUnknown(error, "Error al consultar el expediente");
  }
}
