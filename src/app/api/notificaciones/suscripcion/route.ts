import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend/client";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";

export async function POST(req: Request) {
  try {
    const dto = await req.json();
    const response = await fetchBackend("/suscripcion", {
      method: "POST",
      body: JSON.stringify(dto),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        (data as { message?: string; error?: string } | null)?.error ??
        (data as { message?: string } | null)?.message ??
        "Error en API de suscripcion";
      return apiErrorResponse(message, response.status, "BACKEND_ERROR");
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorFromUnknown(error, "Error interno en el servidor");
  }
}
