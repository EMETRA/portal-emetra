import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend/client";
import { apiErrorFromUnknown, apiErrorResponse } from "@/lib/api/errors";

type Remision = {
  serie: string;
  remision: string;
  monto_impugnado: number;
};

type SolicitudBody = {
  juzgado: number | string;
  nombres: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  celular: string;
  correo: string;
  dpi: string;
  sexo: string;
  solicitante: string;
  tipo_placa: string;
  placa: string;
  observaciones: string;
  remisiones: Remision[];
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as SolicitudBody;

  const payload = {
    juzgado: Number(body.juzgado),
    nombres: body.nombres,
    apellidos: body.apellidos,
    direccion: body.direccion,
    telefono: body.telefono,
    celular: body.celular,
    correo: body.correo,
    dpi: body.dpi,
    sexo: body.sexo,
    solicitante: body.solicitante,
    tipo_placa: body.tipo_placa,
    placa: body.placa,
    observaciones: body.observaciones,
    remisiones: body.remisiones,
  };

  try {
    const response = await fetchBackend("/juzgado/expediente", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return apiErrorResponse(
        "Error al crear expediente en el servidor",
        response.status,
        "BACKEND_ERROR"
      );
    }

    return NextResponse.json(await response.json().catch(() => ({})));
  } catch (error) {
    return apiErrorFromUnknown(error, "Error al registrar el expediente");
  }
}
