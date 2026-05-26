import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend/client";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tipoPlaca, placa } = body;

    const payload = {
      tipo_placa: tipoPlaca,
      numero_placa: placa,
    };

    const response = await fetchBackend("/solvencia/consultar-placa-pago-tiempo", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return apiErrorResponse(
        "Error al consultar la placa en el servidor",
        response.status,
        "BACKEND_ERROR"
      );
    }

    const data = (await response.json()) as {
      valido?: boolean;
      mensaje?: string;
      recibo?: unknown;
    };

    return NextResponse.json(
      {
        success: data.valido,
        message: data.mensaje,
        recibo: data.recibo ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    return apiErrorFromUnknown(error, "Error interno del servidor");
  }
}
