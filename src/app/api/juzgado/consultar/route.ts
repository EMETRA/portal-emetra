import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {searchParams} = new URL(req.url);

    const numeroExpediente = searchParams.get('numero_expediente');
    const juzgado = searchParams.get('juzgado');

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if(!numeroExpediente || !juzgado){
        return NextResponse.json(
            {message: 'numero_expediente y juzgado son requeridos'},
            {status: 400}
        );
    }

    const url = `${baseUrl}/juzgado/expediente?numero_expediente=${encodeURIComponent(numeroExpediente)}&juzgado=${encodeURIComponent(juzgado)}`;
    try{
        const res = await fetch (url,{
            method: 'GET',
        });
        if(!res.ok){
            const text = await res.text();
            return NextResponse.json(
                {message: 'Error al consultar expediente en backend', backendResponse: text},
                {status: res.status}
            );
        }
        const data = await res.json();

        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error al llamar al backend', error: error.message },
            { status: 500 }
        );
    }
}