import { NextRequest } from "next/server";
import { fetchBackend } from "@/lib/backend/client";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { plate } = await req.json();

        if (!plate || typeof plate !== "string") {
            return apiErrorResponse("La placa es requerida", 400, "VALIDATION_ERROR");
        }

    const placaNormalizada = plate.replace(/\s+/g, "");
    const [tplacaRaw, nplacaRaw] = placaNormalizada.split("-");
    const tplaca = tplacaRaw?.trim().toUpperCase();
    const nplaca = nplacaRaw?.trim().toUpperCase();

    if (!tplaca || !nplaca) {
      return apiErrorResponse(
        "Formato de placa invalido",
        400,
        "VALIDATION_ERROR"
      );
    }

    const response = await fetchBackend("/notificado/generar", {
      method: "POST",
      body: JSON.stringify({ tplaca, nplaca }),
    });

    const contentType = response.headers.get("content-type") ?? "application/json";
    const rawBody = await response.text();

    return new Response(rawBody, {
      status: response.status,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
        return apiErrorFromUnknown(error, "Error interno al generar PDF");
    }
}
