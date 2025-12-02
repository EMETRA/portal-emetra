/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
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
    if (!baseUrl) {
        return NextResponse.json(
            { message: "Falta NEXT_PUBLIC_API_BASE_URL en las variables de entorno" },
            { status: 500 }
        );
    }

    const body = (await req.json()) as SolicitudBody;

    const {
        juzgado,
        nombres,
        apellidos,
        direccion,
        telefono,
        celular,
        correo,
        dpi,
        sexo,
        solicitante,
        tipo_placa,
        placa,
        observaciones,
        remisiones,
    } = body;

    const payload = {
        juzgado: Number(juzgado),
        nombres,
        apellidos,
        direccion,
        telefono,
        celular,
        correo,
        dpi,
        sexo,
        solicitante,
        tipo_placa,
        placa,
        observaciones,
        remisiones,
    };

    const url = `${baseUrl}/juzgado/expediente`;

    try{
        const res =  await fetch (url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            return NextResponse.json(
                {
                    message: "Error al crear expediente en backend",
                    backendResponse: text,
                },
                { status: res.status }
            );
        }
        const data = await res.json().catch(() => ({}));

        return NextResponse.json(data);
    }catch(error:any){
        return NextResponse.json(
            {message: 'Error al llamar al backend', error: error.message},
            {status: 500}
        );
    }
}