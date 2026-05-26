import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend/client";
import { apiErrorFromUnknown } from "@/lib/api/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tipoPlaca, placa, fechaRecibo, numeroRecibo } = body;

    const payload = {
      tipo_placa: tipoPlaca,
      numero_placa: placa,
      fecha_recibo: fechaRecibo,
      numero_recibo: numeroRecibo,
    };

    const data = await backendFetch("/solvencia/consultar-existencia-documento", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return NextResponse.json(data);
  } catch (error) {
    return apiErrorFromUnknown(error, "Error al validar solvencia");
  }
}
