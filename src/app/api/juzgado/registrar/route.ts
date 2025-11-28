import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
type Remision = {
  serie: string;
  remision: string;
  monto_impugnado: number;
};

type SolicitudBody = {
  juzgado: number;
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
        //constriur payload como en el api
    }

    const url = `${baseUrl}/juzgado/expediente`;

    try{
        const res =  await fetch (url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();

        return NextResponse.json(data);
    }catch(error:any){
        return NextResponse.json(
            {message: 'Error al llamar al backend', error: error.message},
            {status: 500}
        );
    }
}